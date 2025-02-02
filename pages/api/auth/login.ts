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

    // Send a quick response so the client doesn't wait too long
    res.status(202).json({ message: 'Processing login...', status: 'pending' });

    // Perform login processing in the background
    setTimeout(async () => {
      await connectToDatabase();
      const user = await User.findOne({ email }).select('password');
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("Invalid credentials");
        return;
      }

      const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      console.log("Token generated: ", token);
    }, 500); // Background task

  } catch (error) {
    console.error("Login error:", error);
  }
}
export const config = {
  runtime: "edge",
};
