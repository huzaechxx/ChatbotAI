import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import {connectToDatabase} from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name ,email, password } = req.body;
    console.log(req.body);
    

    if (!name||!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name,email, password: hashedPassword });
    await newUser.save();
    res.setHeader('Location', '/login');
    res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
