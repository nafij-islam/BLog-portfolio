import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';
import { AuthHelper } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response';
import { Validators } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message } = body;

    const validationError = Validators.validateContactMessage(name, email, subject, message);
    if (validationError) {
      return ApiResponse.error(validationError, 400);
    }

    const newMessage = await ContactMessage.create({
      name,
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
    });

    const formatted = {
      id: newMessage._id.toString(),
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      message: newMessage.message,
      date: newMessage.createdAt.toISOString(),
      read: false,
    };

    return ApiResponse.success(formatted, 'Your message has been sent successfully!', 201);
  } catch (err: any) {
    console.error('Contact submit error:', err);
    return ApiResponse.serverError('Failed to send message. Please try again.');
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await AuthHelper.getAuthPayload();
    if (!payload || payload.role !== 'admin') {
      return ApiResponse.forbidden('Access forbidden. Admins only.');
    }

    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

    const formatted = messages.map(m => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      date: m.createdAt.toISOString(),
      read: m.status !== 'new',
    }));

    return ApiResponse.success(formatted, 'Contact messages fetched successfully');
  } catch (err: any) {
    console.error('Fetch contact messages error:', err);
    return ApiResponse.serverError('Failed to fetch messages');
  }
}
