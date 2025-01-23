import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the Chat schema
interface IChat extends Document {
  question: string;
  answer: string;
}

const ChatSchema = new Schema<IChat>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Use `mongoose.models` to avoid overwriting the model
const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
