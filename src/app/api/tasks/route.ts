import { NextRequest, NextResponse } from 'next/server';
import { mockTaskDB } from '@/lib/mock-db';
import { calculateTaskScore, DEFAULT_SCORE_RULES } from '@/lib/score-calculator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let whereClause = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause = {
        startTime: {
          gte: startDate,
          lt: endDate,
        },
      };
    }

    const tasks = await mockTaskDB.findMany(whereClause);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, duration, taskType, notes } = body;

    // 计算评分
    const taskData = {
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      taskType,
      status: 'PENDING' as const,
      completion: 0,
      notes,
    };

    const score = calculateTaskScore(taskData as any, DEFAULT_SCORE_RULES);

    const newTask = await mockTaskDB.create({
      ...taskData,
      score,
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // 如果更新了影响评分的字段，重新计算评分
    if (updateData.title || updateData.duration || updateData.taskType || updateData.completion) {
      const existingTask = await mockTaskDB.findUnique({ id });
      if (existingTask) {
        const updatedTask = { ...existingTask, ...updateData };
        const score = calculateTaskScore(updatedTask, DEFAULT_SCORE_RULES);
        updateData.score = score;
      }
    }

    const updatedTask = await mockTaskDB.update({ id }, updateData);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await mockTaskDB.delete({ id });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 