import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = new User({ name, email, password, phone, address });
    const saved = await user.save();

    const token = jwt.sign(
      { userId: saved._id, role: saved.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        status: saved.status
      }
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password +lockUntil');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isLocked) {
      return res.status(423).json({
        message: 'Account is temporarily locked due to too many failed login attempts',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    await user.resetLoginAttempts();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Optionally update last login
    user.lastLogin = new Date();
    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
