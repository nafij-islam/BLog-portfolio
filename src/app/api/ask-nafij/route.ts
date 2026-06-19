import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import AskNafijQuestion from '@/models/AskNafijQuestion';
import { AuthHelper } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    // Base query: only published answers
    const query: any = { status: 'published' };
    if (featuredOnly) {
      query.isFeatured = true;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const qas = await AskNafijQuestion.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    const formatted = qas.map((qa) => ({
      id: qa._id.toString(),
      name: qa.name,
      question: qa.question,
      answer: qa.answer,
      category: qa.category,
      tags: qa.tags || [],
      isFeatured: qa.isFeatured,
      publishedAt: qa.publishedAt ? qa.publishedAt.toISOString() : null,
    }));

    // Suggest related answers if a search term is specified
    let suggestions: any[] = [];
    if (search && formatted.length > 0) {
      const firstResultCategory = formatted[0].category;
      const firstResultId = formatted[0].id;

      const related = await AskNafijQuestion.find({
        status: 'published',
        category: firstResultCategory,
        _id: { $ne: firstResultId },
      })
        .limit(3)
        .lean();

      suggestions = related.map((r) => ({
        id: r._id.toString(),
        question: r.question,
        category: r.category,
      }));
    }

    return ApiResponse.success(
      {
        qas: formatted,
        suggestions,
      },
      'Published Q&As fetched successfully'
    );
  } catch (err: any) {
    console.error('Error fetching public Q&As:', err);
    return ApiResponse.serverError(err.message || 'Failed to fetch Q&As');
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { question, category, tags } = body;

    if (!question) {
      return ApiResponse.error('Question is required', 400);
    }

    const payload = await AuthHelper.getAuthPayload();
    let name = body.name;
    let email = body.email;
    let userId = null;

    if (payload) {
      // Use logged in user details,
      name = payload.email.split('@')[0]; // Fallback in case name isn't supplied
      email = payload.email;
      userId = payload.userId;

      // Try to find full name from database
      const User = (await import('@/models/User')).default;
      const userObj = await User.findById(payload.userId).lean();
      if (userObj) {
        name = userObj.name;
      }
    } else {
      if (!name || !email) {
        return ApiResponse.error('Name and email are required for guests', 400);
      }
    }

    const newQA = await AskNafijQuestion.create({
      name,
      email,
      userId,
      question,
      category: category || 'General',
      tags: tags || [],
      status: 'pending',
      isFeatured: false,
    });

    return ApiResponse.success(newQA, 'Question submitted successfully. Waiting for response.', 201);
  } catch (err: any) {
    console.error('Error submitting question:', err);
    return ApiResponse.serverError(err.message || 'Failed to submit question');
  }
}
