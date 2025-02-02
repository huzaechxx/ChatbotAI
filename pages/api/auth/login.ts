import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Extract username
    const extractUsername = (email: string) => {
      const match = email.match(/^([a-zA-Z0-9._%+-]+)@(gmail\.com|yahoo\.com|hotmail\.com)$/);
      return match ? match[1] : null;
    };
    const currentuser = extractUsername(email);

    // Connect to the database
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Database connected ✅");

    // Fetch user with password
    const user = await User.findOne({ email }).select('password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("User authenticated ✅");

    // Generate JWT
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    console.log("Token generated ✅");

    // Return response
    return res.status(200).json({ token, currentuser });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
