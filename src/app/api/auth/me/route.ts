import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Like from '@/models/Like';
import { AuthHelper } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await AuthHelper.getAuthPayload();
    if (!payload) {
      return ApiResponse.unauthorized('Not authenticated');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return ApiResponse.unauthorized('User not found');
    }

    if (user.status === 'blocked' || user.status === 'suspended') {
      return ApiResponse.error('Your account has been suspended by the admin.', 403);
    }

    const userLikes = await Like.find({ userId: user._id });
    const likedBlogs = userLikes.map(l => l.blogId.toString());

    const userSession = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      savedBlogs: [],
      likedBlogs,
    };

    return ApiResponse.success(userSession, 'User profile fetched successfully');
  } catch (err: any) {
    console.error('Fetch me profile error:', err);
    return ApiResponse.serverError(err.message || 'Failed to fetch user session');
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const payload = await AuthHelper.getAuthPayload();
    if (!payload) {
      return ApiResponse.unauthorized('Not authenticated');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return ApiResponse.unauthorized('User not found');
    }

    if (user.status === 'blocked' || user.status === 'suspended') {
      return ApiResponse.error('Your account has been suspended by the admin.', 403);
    }

    const body = await req.json().catch(() => ({}));
    const { name, avatar } = body;

    if (name !== undefined) {
      if (!name.trim()) {
        return ApiResponse.error('Name cannot be empty', 400);
      }
      user.name = name;
    }

    if (avatar !== undefined) {
      user.avatarUrl = avatar;
    }

    await user.save();

    const userLikes = await Like.find({ userId: user._id });
    const likedBlogs = userLikes.map(l => l.blogId.toString());

    const userSession = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      savedBlogs: [],
      likedBlogs,
    };

    return ApiResponse.success(userSession, 'Profile updated successfully');
  } catch (err: any) {
    console.error('Update me profile error:', err);
    return ApiResponse.serverError(err.message || 'Failed to update user profile');
  }
}
