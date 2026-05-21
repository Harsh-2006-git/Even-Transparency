/**
 * Helper to calculate the Women Conversion Predictor (WCP) score.
 * 
 * @param {Object} responses - Key-value map of question numbers and answers (e.g. { Q1: "Under 8,000₹", Q10: 0.25, ... })
 * @param {Array} questions - Array of questions from the database containing options and weights.
 * @returns {Object} - Object containing scores, breakdown by domain, bonuses applied, band, and action.
 */
export const calculateWCPScore = (responses = {}, questions = []) => {
  const domainWeights = {
    A: 0.22,
    B: 0.20,
    C: 0.16,
    D: 0.18,
    E: 0.10,
    F: 0.10,
    G: 0.04
  };

  const domainNames = {
    A: 'Economic Pressure & Financial Urgency',
    B: 'Mobility & Logistics Readiness',
    C: 'Family Structure & Household Dynamics',
    D: 'Social Capital & Role Model Exposure',
    E: 'Prior Work Experience & Aspiration',
    F: 'Psychological Readiness & Agency',
    G: 'Structural Marginalisation Proxies'
  };

  // Group questions by domain
  const domainQuestions = { A: [], B: [], C: [], D: [], E: [], F: [], G: [] };
  questions.forEach(q => {
    if (domainQuestions[q.domain]) {
      domainQuestions[q.domain].push(q);
    }
  });

  const domainDetails = {};
  let weightedCompositeScore = 0;

  // Calculate scores for each domain
  Object.keys(domainQuestions).forEach(domain => {
    const qList = domainQuestions[domain];
    let domainWeightedSum = 0;
    let domainWeightSum = 0;
    let questionsAnsweredCount = 0;

    qList.forEach(q => {
      const qNum = q.qNumber;
      const answer = responses[qNum];

      if (answer !== undefined && answer !== null && answer !== '') {
        let subScore = 0;
        let isAnswerValid = false;

        if (qNum === 'Q10') {
          // Special handling for ratio input (number type)
          if (typeof answer === 'number') {
            isAnswerValid = true;
            if (answer >= 0.5) {
              subScore = 3;
            } else if (answer >= 0.3) {
              subScore = 6;
            } else {
              subScore = 10;
            }
          } else {
            // If passed as string, match string option
            const matchingOption = q.options.find(opt => opt.text.trim() === String(answer).trim());
            if (matchingOption) {
              subScore = matchingOption.score;
              isAnswerValid = true;
            }
          }
        } else if (q.inputType === 'Text') {
          // Free text (like Q25): if filled, default to 5, else ignore
          if (String(answer).trim().length > 0) {
            subScore = 5;
            isAnswerValid = true;
          }
        } else {
          // Match option
          const matchingOption = q.options && q.options.find(opt => opt.text.trim() === String(answer).trim());
          if (matchingOption) {
            subScore = matchingOption.score;
            isAnswerValid = true;
          }
        }

        if (isAnswerValid) {
          domainWeightedSum += subScore * q.questionWeight;
          domainWeightSum += q.questionWeight;
          questionsAnsweredCount++;
        }
      }
    });

    // Domain Score is between 0 and 10
    const domainScore = domainWeightSum > 0 ? (domainWeightedSum / domainWeightSum) : 0;
    
    // Domain Contribution to total 100 points
    const weight = domainWeights[domain];
    const contribution = domainScore * 10 * weight;

    domainDetails[domain] = {
      name: domainNames[domain],
      score: parseFloat(domainScore.toFixed(2)),
      contribution: parseFloat(contribution.toFixed(2)),
      questionsAnswered: questionsAnsweredCount,
      totalQuestions: qList.length
    };

    weightedCompositeScore += contribution;
  });

  // Calculate Interaction Bonuses
  let bonusPoints = 0;
  const bonusesApplied = [];

  // Bonus Condition A: Q6 = 'Owns' or 'Regular family access'
  const q6Answer = responses['Q6'];
  if (q6Answer === 'Owns' || q6Answer === 'Regular family access') {
    bonusPoints += 5;
    bonusesApplied.push({ condition: 'Condition A (Q6 = Owns/Family access)', points: 5 });
  }

  // Bonus Condition B: Q15 = 'Yes, non-traditional work'
  const q15Answer = responses['Q15'];
  if (q15Answer === 'Yes, non-traditional work') {
    bonusPoints += 5;
    bonusesApplied.push({ condition: 'Condition B (Q15 = Non-traditional work)', points: 5 });
  }

  let finalScore = weightedCompositeScore + bonusPoints;
  // Cap at 100
  if (finalScore > 100) {
    finalScore = 100;
  }

  finalScore = Math.round(finalScore);

  // Probability Band and Mobiliser Action mapping
  let band = '';
  let action = '';

  if (finalScore >= 75) {
    band = 'HIGH';
    action = 'Fast-track enrolment.';
  } else if (finalScore >= 50) {
    band = 'MODERATE';
    action = 'Identify 1–2 lowest-scoring domains.';
  } else if (finalScore >= 30) {
    band = 'LOW';
    action = 'Do not push for immediate enrollment.';
  } else {
    band = 'VERY LOW';
    action = 'Redirect mobiliser effort. Retain profile only.';
  }

  return {
    weightedCompositeScore: parseFloat(weightedCompositeScore.toFixed(2)),
    bonusPoints,
    bonusesApplied,
    finalScore,
    band,
    action,
    domains: domainDetails
  };
};
