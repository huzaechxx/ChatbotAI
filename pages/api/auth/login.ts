import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {connectToDatabase} from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    function extractUsername(email: string): string | null {
        // Define the allowed domains
        const validDomains = ["gmail.com", "yahoo.com", "hotmail.com"];
        
        // Use a regular expression to match the email and extract the username
        const emailRegex = /^([a-zA-Z0-9._%+-]+)@(gmail\.com|yahoo\.com|hotmail\.com)$/;
      
        const match = email.match(emailRegex);
      
        // If the email matches and the domain is valid, return the username
        return match ? match[1] : null;
    }

    if (req.method === 'POST') {
    const { email, password } = req.body;
    const currentuser = extractUsername(email);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(200).json({ token,currentuser });
    res.setHeader('Location', '/chat');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
