import { NextRequest, NextResponse } from 'next/server';
import { classifyTaskWithQwen, classifyMultipleTasksWithQwen } from '@/lib/qwen-classifier';

// 单个任务分类
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: '任务标题不能为空' },
        { status: 400 }
      );
    }

    const classification = await classifyTaskWithQwen(title);

    return NextResponse.json({
      success: true,
      classification
    });

  } catch (error) {
    console.error('分类任务失败:', error);
    return NextResponse.json(
      { error: '分类任务失败' },
      { status: 500 }
    );
  }
}

// 批量任务分类
export async function PUT(request: NextRequest) {
  try {
    const { titles } = await request.json();

    if (!titles || !Array.isArray(titles)) {
      return NextResponse.json(
        { error: '任务标题列表不能为空' },
        { status: 400 }
      );
    }

    const classifications = await classifyMultipleTasksWithQwen(titles);

    return NextResponse.json({
      success: true,
      classifications
    });

  } catch (error) {
    console.error('批量分类任务失败:', error);
    return NextResponse.json(
      { error: '批量分类任务失败' },
      { status: 500 }
    );
  }
}
