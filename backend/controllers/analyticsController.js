import { Op, fn, col } from 'sequelize';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Question from '../models/Question.js';

// ── Tiny retry helper (Neon serverless can drop a connection on cold start) ───
const withRetry = async (fn, retries = 2, delayMs = 800) => {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isTransient =
        err.code === 'ECONNRESET' ||
        err.name === 'SequelizeConnectionError' ||
        err.name === 'SequelizeConnectionRefusedError' ||
        err.name === 'SequelizeHostNotFoundError';

      if (isTransient && attempt < retries) {
        console.warn(`[Analytics] Transient DB error on attempt ${attempt + 1}, retrying in ${delayMs}ms…`);
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    // ── 1. Run all DB queries sequentially to respect Neon's connection limits ──

    const totalCandidates = await withRetry(() => Candidate.count());

    const totalUsers = await withRetry(() =>
      User.count({ where: { userType: 'Mobiliser' } })
    );

    const totalQuestions = await withRetry(() => Question.count());

    // ── 2. Fetch all candidates in a single pass ─────────────────────────────
    const allCandidates = await withRetry(() =>
      Candidate.findAll({
        attributes: [
          'id', 'status', 'outcome', 'score', 'gender',
          'city', 'state', 'mobiliserId', 'recruiterName',
          'wcpAnswers', 'created_at'
        ],
        raw: true
      })
    );

    // ── 3. In-memory aggregation (zero extra DB round-trips) ─────────────────
    const statusBreakdown = { pending: 0, converted: 0, 'training started': 0, dropped: 0 };
    const outcomeBreakdown = { Suitable: 0, 'Requires Training': 0, Unsuitable: 0, Pending: 0 };
    const genderBreakdown = {};
    const cityBreakdown = {};
    const stateBreakdown = {};
    const scoreDistribution = { '0-25': 0, '26-50': 0, '51-75': 0, '76-100': 0 };
    const mobiliserStats = {};
    const questionYesCounts = {};
    let totalScoredCandidates = 0;
    let sumOfScores = 0;

    for (const c of allCandidates) {
      // --- Status ---
      const status = (c.status || 'pending').toLowerCase();
      if (Object.prototype.hasOwnProperty.call(statusBreakdown, status)) {
        statusBreakdown[status]++;
      } else {
        statusBreakdown['pending']++;
      }

      // --- Outcome ---
      const outcome = c.outcome || 'Pending';
      if (Object.prototype.hasOwnProperty.call(outcomeBreakdown, outcome)) {
        outcomeBreakdown[outcome]++;
      } else {
        outcomeBreakdown['Pending']++;
      }

      // --- Score distribution ---
      if (c.score !== null && c.score !== undefined) {
        const s = Number(c.score);
        totalScoredCandidates++;
        sumOfScores += s;
        if (s <= 25) scoreDistribution['0-25']++;
        else if (s <= 50) scoreDistribution['26-50']++;
        else if (s <= 75) scoreDistribution['51-75']++;
        else scoreDistribution['76-100']++;
      }

      // --- Gender ---
      const gender = c.gender || 'Unknown';
      genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;

      // --- City / State ---
      if (c.city) {
        const cityKey = c.city.trim();
        cityBreakdown[cityKey] = (cityBreakdown[cityKey] || 0) + 1;
      }
      if (c.state) {
        const stateKey = c.state.trim();
        stateBreakdown[stateKey] = (stateBreakdown[stateKey] || 0) + 1;
      }

      // --- Mobiliser performance ---
      if (c.mobiliserId && c.recruiterName) {
        const mid = c.mobiliserId;
        if (!mobiliserStats[mid]) {
          mobiliserStats[mid] = {
            id: mid,
            name: c.recruiterName,
            total: 0,
            converted: 0,
            trainingStarted: 0,
            dropped: 0,
            scoreSum: 0,
            scoredCount: 0
          };
        }
        mobiliserStats[mid].total++;
        if (status === 'converted') mobiliserStats[mid].converted++;
        if (status === 'training started') mobiliserStats[mid].trainingStarted++;
        if (status === 'dropped') mobiliserStats[mid].dropped++;
        if (c.score !== null && c.score !== undefined) {
          mobiliserStats[mid].scoreSum += Number(c.score);
          mobiliserStats[mid].scoredCount++;
        }
      }

      // --- WCP question response rates ---
      if (c.wcpAnswers && typeof c.wcpAnswers === 'object') {
        for (const [qKey, answer] of Object.entries(c.wcpAnswers)) {
          if (!questionYesCounts[qKey]) questionYesCounts[qKey] = { yes: 0, total: 0 };
          questionYesCounts[qKey].total++;
          if (answer === true || answer === 1 || answer === 'yes' || answer === 'Yes') {
            questionYesCounts[qKey].yes++;
          }
        }
      }
    }

    // ── 4. Monthly registration trend (last 12 months) ────────────────────────
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Build monthly map from the already-fetched allCandidates (no extra query)
    const monthlyMap = {};
    for (const c of allCandidates) {
      const d = new Date(c.created_at);
      if (d >= twelveMonthsAgo) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      }
    }

    const monthlyTrend = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyTrend.push({ month: label, count: monthlyMap[key] || 0 });
    }

    // ── 5. Question domain info (single sequential query) ────────────────────
    const questions = await withRetry(() =>
      Question.findAll({
        attributes: ['domain', 'domainName', 'domainWeight'],
        raw: true
      })
    );

    const domainMap = {};
    for (const q of questions) {
      if (!domainMap[q.domain]) {
        domainMap[q.domain] = {
          domain: q.domain,
          domainName: q.domainName,
          weight: q.domainWeight,
          count: 0
        };
      }
      domainMap[q.domain].count++;
    }

    // ── 6. Derived metrics ────────────────────────────────────────────────────
    const mobiliserLeaderboard = Object.values(mobiliserStats)
      .map(m => ({
        ...m,
        conversionRate: m.total > 0 ? Math.round((m.converted / m.total) * 100) : 0,
        avgScore: m.scoredCount > 0 ? Math.round(m.scoreSum / m.scoredCount) : 0
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);

    const topCities = Object.entries(cityBreakdown)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topStates = Object.entries(stateBreakdown)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const questionResponseRates = Object.entries(questionYesCounts)
      .map(([qKey, data]) => ({
        question: qKey,
        yesRate: data.total > 0 ? Math.round((data.yes / data.total) * 100) : 0,
        totalResponses: data.total
      }))
      .sort((a, b) => b.yesRate - a.yesRate)
      .slice(0, 15);

    const avgScore = totalScoredCandidates > 0
      ? Math.round(sumOfScores / totalScoredCandidates)
      : 0;

    const suitableRate = totalCandidates > 0
      ? Math.round((outcomeBreakdown['Suitable'] / totalCandidates) * 100)
      : 0;

    const conversionRate = totalCandidates > 0
      ? Math.round((statusBreakdown['converted'] / totalCandidates) * 100)
      : 0;

    const conversionFunnel = [
      { stage: 'Registered', count: totalCandidates },
      { stage: 'Assessed', count: totalScoredCandidates },
      { stage: 'Suitable', count: outcomeBreakdown['Suitable'] },
      { stage: 'Converted', count: statusBreakdown['converted'] }
    ];

    // ── 7. Respond ────────────────────────────────────────────────────────────
    res.json({
      overview: {
        totalCandidates,
        totalMobilisers: totalUsers,
        totalQuestions,
        avgScore,
        suitableRate,
        conversionRate,
        totalScoredCandidates
      },
      statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({ status, count })),
      outcomeBreakdown: Object.entries(outcomeBreakdown).map(([outcome, count]) => ({ outcome, count })),
      scoreDistribution: Object.entries(scoreDistribution).map(([range, count]) => ({ range, count })),
      genderBreakdown: Object.entries(genderBreakdown).map(([gender, count]) => ({ gender, count })),
      topCities,
      topStates,
      monthlyTrend,
      mobiliserLeaderboard,
      domainBreakdown: Object.values(domainMap),
      questionResponseRates,
      conversionFunnel
    });
  } catch (error) {
    console.error('[Analytics] Error generating analytics summary:', error.message);
    res.status(500).json({
      error: 'Failed to generate analytics summary.',
      message: error.message
    });
  }
};
