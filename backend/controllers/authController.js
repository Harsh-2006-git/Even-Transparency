import crypto from 'crypto';
import { Op } from 'sequelize';
import User from '../models/User.js';

// Helper to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Register User
export const register = async (req, res) => {
  const { username, email, password, phone, profilePhoto, userType } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  try {
    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
      userType: userType || 'Mobiliser'
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'A user with this username or email already exists.' });
    }
    res.status(500).json({ error: 'Failed to register user', message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username/email and password are required.' });
  }

  try {
    const hashedPassword = hashPassword(password);
    
    const userInstance = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!userInstance || userInstance.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid username, email, or password.' });
    }

    const userResponse = userInstance.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};
