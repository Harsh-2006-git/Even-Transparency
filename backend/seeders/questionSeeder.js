import Question from '../models/Question.js';

export const seedQuestions = async () => {
  try {
    const questionCount = await Question.count();
    if (questionCount > 0) {
      return;
    }
    const questionsData = [
      // Domain A: Economic Pressure & Financial Urgency (22%)
      {
        qNumber: 'Q1',
        domain: 'A',
        domainName: 'Economic Pressure & Financial Urgency',
        domainWeight: 0.22,
        questionText: 'Monthly household income from all sources',
        questionWeight: 7,
        inputType: 'Radio',
        options: [
          { text: 'Under 8,000₹', score: 5 },
          { text: '8,000–15,000₹', score: 10 },
          { text: '15,000–25,000₹', score: 7 },
          { text: '25,000–40,000₹', score: 3 },
          { text: 'Above 40,000₹', score: 1 }
        ]
      },
      {
        qNumber: 'Q2',
        domain: 'A',
        domainName: 'Economic Pressure & Financial Urgency',
        domainWeight: 0.22,
        questionText: 'Does any household member have an outstanding debt/loan?',
        questionWeight: 6,
        inputType: 'Radio',
        options: [
          { text: 'Yes – formal (bank/MFI)', score: 8 },
          { text: 'Yes – informal (moneylender/family)', score: 10 },
          { text: 'No', score: 2 }
        ]
      },
      {
        qNumber: 'Q3',
        domain: 'A',
        domainName: 'Economic Pressure & Financial Urgency',
        domainWeight: 0.22,
        questionText: 'Has anyone in the household taken a vehicle loan?',
        questionWeight: 5,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 10 },
          { text: 'No', score: 3 },
          { text: 'Currently repaying', score: 7 }
        ]
      },
      {
        qNumber: 'Q4',
        domain: 'A',
        domainName: 'Economic Pressure & Financial Urgency',
        domainWeight: 0.22,
        questionText: 'Does the household own or rent their home?',
        questionWeight: 4,
        inputType: 'Radio',
        options: [
          { text: 'Own', score: 4 },
          { text: 'Rent', score: 8 },
          { text: 'Shared/family property', score: 5 }
        ]
      },

      // Domain B: Mobility & Logistics Readiness (20%)
      {
        qNumber: 'Q5',
        domain: 'B',
        domainName: 'Mobility & Logistics Readiness',
        domainWeight: 0.20,
        questionText: 'Distance from home to nearest Even Cargo branch/hub',
        questionWeight: 6,
        inputType: 'Radio',
        options: [
          { text: 'Under 3 km', score: 10 },
          { text: '3–7 km', score: 7 },
          { text: '7–15 km', score: 4 },
          { text: 'Above 15 km', score: 1 }
        ]
      },
      {
        qNumber: 'Q6',
        domain: 'B',
        domainName: 'Mobility & Logistics Readiness',
        domainWeight: 0.20,
        questionText: 'Does she own or have regular access to a two-wheeler?',
        questionWeight: 6,
        inputType: 'Radio',
        options: [
          { text: 'Owns', score: 10 },
          { text: 'Regular family access', score: 8 },
          { text: 'Can rent easily', score: 5 },
          { text: 'No access', score: 1 }
        ]
      },
      {
        qNumber: 'Q7',
        domain: 'B',
        domainName: 'Mobility & Logistics Readiness',
        domainWeight: 0.20,
        questionText: 'Does she currently travel independently within the city?',
        questionWeight: 5,
        inputType: 'Radio',
        options: [
          { text: 'Yes, regularly', score: 10 },
          { text: 'Sometimes', score: 6 },
          { text: 'Rarely', score: 3 },
          { text: 'No', score: 1 }
        ]
      },
      {
        qNumber: 'Q8',
        domain: 'B',
        domainName: 'Mobility & Logistics Readiness',
        domainWeight: 0.20,
        questionText: 'Does she have a smartphone and use it for navigation/apps?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes, daily use', score: 10 },
          { text: 'Yes, basic use', score: 6 },
          { text: 'Shared phone', score: 3 },
          { text: 'No smartphone', score: 1 }
        ]
      },

      // Domain C: Family Structure & Household Dynamics (16%)
      {
        qNumber: 'Q9',
        domain: 'C',
        domainName: 'Family Structure & Household Dynamics',
        domainWeight: 0.16,
        questionText: 'Is she the eldest daughter or daughter-in-law?',
        questionWeight: 4,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 10 },
          { text: 'No', score: 4 }
        ]
      },
      {
        qNumber: 'Q10',
        domain: 'C',
        domainName: 'Family Structure & Household Dynamics',
        domainWeight: 0.16,
        questionText: 'Number of earning members vs. total household members (ratio)',
        questionWeight: 3,
        inputType: 'Number',
        options: [
          { text: 'Ratio ≥ 0.5 (more earners)', score: 3 },
          { text: 'Ratio 0.3–0.49', score: 6 },
          { text: 'Ratio < 0.3 (high dependency)', score: 10 }
        ]
      },
      {
        qNumber: 'Q11',
        domain: 'C',
        domainName: 'Family Structure & Household Dynamics',
        domainWeight: 0.16,
        questionText: 'Are there more adult males than adult females in the household?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 1 },
          { text: 'No', score: 10 },
          { text: 'Equal', score: 5 }
        ]
      },
      {
        qNumber: 'Q12',
        domain: 'C',
        domainName: 'Family Structure & Household Dynamics',
        domainWeight: 0.16,
        questionText: 'Is the primary male authority figure employed?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes, stable', score: 3 },
          { text: 'Yes, irregular', score: 7 },
          { text: 'Unemployed', score: 10 },
          { text: 'Not applicable', score: 6 }
        ]
      },
      {
        qNumber: 'Q13',
        domain: 'C',
        domainName: 'Family Structure & Household Dynamics',
        domainWeight: 0.16,
        questionText: 'Does she have children under age 6?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes, no childcare', score: 2 },
          { text: 'Yes, childcare available', score: 7 },
          { text: 'No young children', score: 10 }
        ]
      },

      // Domain D: Social Capital & Role Model Exposure (18%)
      {
        qNumber: 'Q14',
        domain: 'D',
        domainName: 'Social Capital & Role Model Exposure',
        domainWeight: 0.18,
        questionText: 'Does she personally know a woman in delivery, driving, or non-traditional work?',
        questionWeight: 6,
        inputType: 'Radio',
        options: [
          { text: 'Yes, close contact (family/friend)', score: 10 },
          { text: 'Yes, knows of someone', score: 5 },
          { text: 'No', score: 1 }
        ]
      },
      {
        qNumber: 'Q15',
        domain: 'D',
        domainName: 'Social Capital & Role Model Exposure',
        domainWeight: 0.18,
        questionText: 'Is there a woman in her household or neighborhood doing non-traditional or traditional work?',
        questionWeight: 5,
        inputType: 'Radio',
        options: [
          { text: 'Yes, non-traditional work', score: 10 },
          { text: 'Yes, traditional work', score: 6 },
          { text: 'No', score: 2 }
        ]
      },
      {
        qNumber: 'Q16',
        domain: 'D',
        domainName: 'Social Capital & Role Model Exposure',
        domainWeight: 0.18,
        questionText: 'Has she ever attended an SHG, NGO programme, or community training?',
        questionWeight: 4,
        inputType: 'Radio',
        options: [
          { text: 'Currently active', score: 10 },
          { text: 'Past member', score: 6 },
          { text: 'Never', score: 2 }
        ]
      },
      {
        qNumber: 'Q17',
        domain: 'D',
        domainName: 'Social Capital & Role Model Exposure',
        domainWeight: 0.18,
        questionText: 'How did she hear about Even Cargo?',
        questionWeight: 3,
        inputType: 'Dropdown',
        options: [
          { text: 'Peer referral', score: 10 },
          { text: 'Training attendee referral', score: 8 },
          { text: 'NGO/mobiliser', score: 6 },
          { text: 'Social media', score: 4 },
          { text: 'Other', score: 2 }
        ]
      },

      // Domain E: Prior Work Experience & Aspiration (10%)
      {
        qNumber: 'Q18',
        domain: 'E',
        domainName: 'Prior Work Experience & Aspiration',
        domainWeight: 0.10,
        questionText: 'Has she ever worked for income outside the home?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes, formal', score: 10 },
          { text: 'Yes, informal/casual', score: 7 },
          { text: 'Yes, home-based only', score: 4 },
          { text: 'Never', score: 1 }
        ]
      },
      {
        qNumber: 'Q19',
        domain: 'E',
        domainName: 'Prior Work Experience & Aspiration',
        domainWeight: 0.10,
        questionText: 'What is her primary stated reason for wanting this job?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Income necessity', score: 10 },
          { text: 'Independence', score: 8 },
          { text: 'Influence of known person', score: 6 },
          { text: 'Family pressure', score: 3 },
          { text: 'Curiosity only', score: 2 }
        ]
      },
      {
        qNumber: 'Q20',
        domain: 'E',
        domainName: 'Prior Work Experience & Aspiration',
        domainWeight: 0.10,
        questionText: 'Does she express a specific income target or goal?',
        questionWeight: 2,
        inputType: 'Radio',
        options: [
          { text: 'Yes, specific and articulated', score: 10 },
          { text: 'Yes, vague', score: 5 },
          { text: 'No specific goal', score: 2 }
        ]
      },
      {
        qNumber: 'Q21',
        domain: 'E',
        domainName: 'Prior Work Experience & Aspiration',
        domainWeight: 0.10,
        questionText: 'Education level',
        questionWeight: 2,
        inputType: 'Radio',
        options: [
          { text: 'Graduate and above', score: 6 },
          { text: 'Class 10–12', score: 8 },
          { text: 'Class 8–10', score: 7 },
          { text: 'Below Class 8', score: 5 }
        ]
      },

      // Domain F: Psychological Readiness & Agency (10%)
      {
        qNumber: 'Q22',
        domain: 'F',
        domainName: 'Psychological Readiness & Agency',
        domainWeight: 0.10,
        questionText: 'If her family initially objects to joining, what will she do?',
        questionWeight: 4,
        inputType: 'Radio',
        options: [
          { text: 'Would join anyway', score: 10 },
          { text: 'Would try to persuade them', score: 7 },
          { text: 'Has not thought about it', score: 3 },
          { text: 'Would not join', score: 1 }
        ]
      },
      {
        qNumber: 'Q23',
        domain: 'F',
        domainName: 'Psychological Readiness & Agency',
        domainWeight: 0.10,
        questionText: 'Has she made an independent financial decision before?',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 10 },
          { text: 'No', score: 3 },
          { text: 'Does not know', score: 2 }
        ]
      },
      {
        qNumber: 'Q24',
        domain: 'F',
        domainName: 'Psychological Readiness & Agency',
        domainWeight: 0.10,
        questionText: 'How does she respond to: "If you hit a roadblock/accident while driving, what will you do?"',
        questionWeight: 3,
        inputType: 'Radio',
        options: [
          { text: '3 – Problem-solving orientation', score: 10 },
          { text: '2 – Neutral', score: 5 },
          { text: '1 – Withdrawal orientation', score: 1 }
        ]
      },

      // Domain G: Structural Marginalisation Proxies (4%)
      {
        qNumber: 'Q25',
        domain: 'G',
        domainName: 'Structural Marginalisation Proxies',
        domainWeight: 0.04,
        questionText: 'Primary language(s) spoken at home [Optional]',
        questionWeight: 1,
        inputType: 'MultiSelect',
        options: [
          { text: 'Hindi', score: 5 },
          { text: 'English', score: 5 },
          { text: 'Marathi', score: 5 },
          { text: 'Bengali', score: 5 },
          { text: 'Telugu', score: 5 },
          { text: 'Tamil', score: 5 },
          { text: 'Urdu', score: 5 },
          { text: 'Other', score: 5 }
        ]
      },
      {
        qNumber: 'Q26',
        domain: 'G',
        domainName: 'Structural Marginalisation Proxies',
        domainWeight: 0.04,
        questionText: 'Does the household celebrate festivals not on the main national calendar?',
        questionWeight: 1,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 8 },
          { text: 'No', score: 4 },
          { text: 'Prefer not to say', score: 0 }
        ]
      },
      {
        qNumber: 'G27',
        qNumber: 'Q27', // Fix mapping
        domain: 'G',
        domainName: 'Structural Marginalisation Proxies',
        domainWeight: 0.04,
        questionText: 'Is the household a beneficiary of any government welfare schemes?',
        questionWeight: 1,
        inputType: 'Radio',
        options: [
          { text: 'Yes', score: 10 },
          { text: 'No', score: 4 },
          { text: 'Does not know', score: 5 }
        ]
      },
      {
        qNumber: 'Q28',
        domain: 'G',
        domainName: 'Structural Marginalisation Proxies',
        domainWeight: 0.04,
        questionText: 'Neighbourhood/colony composition',
        questionWeight: 1,
        inputType: 'Dropdown',
        options: [
          { text: 'High density low-income', score: 10 },
          { text: 'Medium density middle-income', score: 5 },
          { text: 'Low density high-income', score: 2 }
        ]
      }
    ];

    await Question.bulkCreate(questionsData);
  } catch (err) {
    console.error('[Seeder] Failed to seed WCP questions:', err.message);
  }
};
