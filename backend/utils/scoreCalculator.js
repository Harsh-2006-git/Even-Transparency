/**
 * Helper to calculate the Women Conversion Predictor (WCP) score.
 * 
 * @param {Object} responses - Key-value map of question numbers and answers (e.g. { Q1: "Under 8,000₹", Q10: 0.25, ... })
 * @param {Array} questions - Array of questions from the database containing options and weights.
 * @returns {Object} - Object containing scores, breakdown by domain, bonuses applied, band, and action.
 */
export const calculateWCPScore = (responses = {}, questions = []) => {
  // Group questions by domain dynamically
  const domainQuestions = {};
  questions.forEach(q => {
    const domainCode = q.domain || 'UNKNOWN';
    if (!domainQuestions[domainCode]) {
      domainQuestions[domainCode] = [];
    }
    domainQuestions[domainCode].push(q);
  });

  const domainDetails = {};
  let weightedCompositeScore = 0;

  // Track overall question stats
  const totalQuestionsCount = questions.length;
  let answeredQuestionsCount = 0;
  
  questions.forEach(q => {
    const answer = responses[q.qNumber];
    if (answer !== undefined && answer !== null && answer !== '') {
      if (q.inputType === 'Text') {
        if (String(answer).trim().length > 0) {
          answeredQuestionsCount++;
        }
      } else {
        answeredQuestionsCount++;
      }
    }
  });

  const isCompleted = totalQuestionsCount > 0 && answeredQuestionsCount === totalQuestionsCount;

  // Calculate scores for each domain dynamically
  Object.keys(domainQuestions).forEach(domain => {
    const qList = domainQuestions[domain];
    let domainWeightedSum = 0;
    let questionsAnsweredInDomain = 0;

    // Get domain metadata from the first question in the group
    const firstQ = qList[0];
    const domainName = firstQ ? firstQ.domainName : `Domain ${domain}`;
    const domainWeight = firstQ ? parseFloat(firstQ.domainWeight) : 0;

    // Sum of ALL question weights in this domain
    const totalPossibleWeight = qList.reduce((sum, q) => sum + (q.questionWeight || 0), 0);

    qList.forEach(q => {
      const qNum = q.qNumber;
      const answer = responses[qNum];

      let subScore = 0;
      let isAnswerValid = false;

      if (answer !== undefined && answer !== null && answer !== '') {
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
            const matchingOption = q.options && q.options.find(opt => opt.text.trim() === String(answer).trim());
            if (matchingOption) {
              subScore = matchingOption.score;
              isAnswerValid = true;
            }
          }
        } else if (q.inputType === 'Text') {
          // Free text: if filled, default to 5, else ignore
          if (String(answer).trim().length > 0) {
            subScore = 5;
            isAnswerValid = true;
          }
        } else if (q.inputType === 'MultiSelect') {
          // Array of selections: if at least one selected, default to 5
          if (Array.isArray(answer) && answer.length > 0) {
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
      }

      if (isAnswerValid) {
        domainWeightedSum += subScore * q.questionWeight;
        questionsAnsweredInDomain++;
      } else {
        // Unanswered questions MUST temporarily count as 0
        domainWeightedSum += 0 * q.questionWeight;
      }
    });

    // Domain Score is between 0 and 10
    const domainScore = totalPossibleWeight > 0 ? (domainWeightedSum / totalPossibleWeight) : 0;
    
    // Domain Contribution to total 100 points
    // Normalize weight: if stored as decimal (0.22), convert to percentage (22)
    const weightPct = domainWeight <= 1.0 ? domainWeight * 100 : domainWeight;
    const contribution = (domainScore / 10) * weightPct;

    domainDetails[domain] = {
      name: domainName,
      score: parseFloat(domainScore.toFixed(2)),
      contribution: parseFloat(contribution.toFixed(2)),
      questionsAnswered: questionsAnsweredInDomain,
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
    if (isCompleted) {
      bonusPoints += 5;
    }
    bonusesApplied.push({ condition: 'Condition A (Q6 = Owns/Family access)', points: 5, applied: isCompleted });
  }

  // Bonus Condition B: Q15 = 'Yes, non-traditional work'
  const q15Answer = responses['Q15'];
  if (q15Answer === 'Yes, non-traditional work') {
    if (isCompleted) {
      bonusPoints += 5;
    }
    bonusesApplied.push({ condition: 'Condition B (Q15 = Non-traditional work)', points: 5, applied: isCompleted });
  }

  let finalScore = weightedCompositeScore + bonusPoints;
  // Cap at 100
  if (finalScore > 100) {
    finalScore = 100;
  }

  finalScore = Math.round(finalScore);

  // Probability Band and Mobiliser Action mapping (only when complete)
  let band = '';
  let action = '';

  if (isCompleted) {
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
  }

  return {
    weightedCompositeScore: parseFloat(weightedCompositeScore.toFixed(2)),
    bonusPoints,
    bonusesApplied,
    finalScore,
    band,
    action,
    domains: domainDetails,
    isCompleted,
    answeredCount: answeredQuestionsCount,
    totalQuestions: totalQuestionsCount
  };
};
