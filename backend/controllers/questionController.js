import Question from '../models/Question.js';

// Get all evaluation questions ordered by Q-number
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [
        [Question.sequelize.cast(Question.sequelize.fn('REPLACE', Question.sequelize.col('q_number'), 'Q', ''), 'INTEGER'), 'ASC']
      ]
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve WCP evaluation questions.', message: error.message });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const { qNumber, domain, domainName, domainWeight, questionText, questionWeight, inputType, options } = req.body;
    if (!qNumber || !domain || !domainName || !domainWeight || !questionText || !questionWeight || !inputType) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }
    const question = await Question.create({
      qNumber, domain, domainName, domainWeight, questionText, questionWeight, inputType,
      options: options || []
    });
    res.status(201).json(question);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: `Question number "${req.body.qNumber}" already exists.` });
    }
    res.status(500).json({ error: 'Failed to create question.', message: error.message });
  }
};

// Update an existing question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ error: 'Question not found.' });

    await question.update(req.body);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question.', message: error.message });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ error: 'Question not found.' });

    await question.destroy();
    res.json({ message: `Question ${question.qNumber} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question.', message: error.message });
  }
};
