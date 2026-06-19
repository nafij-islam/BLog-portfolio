import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectBrief from '@/models/ProjectBrief';
import { ApiResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      whatsapp,
      businessUrl,
      projectType,
      projectSize,
      selectedFeatures,
      designStyle,
      timeline,
      budgetRange,
      complexityScore,
      estimatedPackage,
      estimatedTimeline,
      generatedSummary,
      extraMessage,
    } = body;

    if (!name || !email || !whatsapp || !projectType || !projectSize || !designStyle || !timeline || !budgetRange) {
      return ApiResponse.error('Missing required fields', 400);
    }

    const newBrief = await ProjectBrief.create({
      name,
      email,
      whatsapp,
      businessUrl: businessUrl || '',
      projectType,
      projectSize,
      selectedFeatures: selectedFeatures || [],
      designStyle,
      timeline,
      budgetRange,
      complexityScore: Number(complexityScore) || 0,
      estimatedPackage,
      estimatedTimeline,
      generatedSummary,
      extraMessage: extraMessage || '',
      status: 'new',
    });

    return ApiResponse.success(newBrief, 'Project brief submitted successfully', 201);
  } catch (err: any) {
    console.error('Error submitting project brief:', err);
    return ApiResponse.serverError(err.message || 'Failed to submit project brief');
  }
}
