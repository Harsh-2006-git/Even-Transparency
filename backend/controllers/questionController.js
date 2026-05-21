import Question from '../models/Question.js';

// Get all evaluation questions ordered by Q-number
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [
        // Cast q_number to sort numerically since it is in format 'Q1', 'Q2', etc.
        [Question.sequelize.cast(Question.sequelize.fn('REPLACE', Question.sequelize.col('q_number'), 'Q', ''), 'INTEGER'), 'ASC']
      ]
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve WCP evaluation questions.', message: error.message });
  }
};
