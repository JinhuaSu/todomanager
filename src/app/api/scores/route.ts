import { NextRequest, NextResponse } from 'next/server';
import { mockTaskDB, mockScoreDB } from '@/lib/mock-db';
import { calculateDailyScore, DEFAULT_SCORE_RULES } from '@/lib/score-calculator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const range = searchParams.get('range') || '7'; // 默认7天

    if (date) {
      // 获取指定日期的评分
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      const tasks = await mockTaskDB.findMany({
        startTime: {
          gte: startDate,
          lt: endDate,
        },
      });

      const dailyScore = calculateDailyScore(tasks, DEFAULT_SCORE_RULES);

      // 保存或更新每日评分
      await mockScoreDB.upsert(
        { date: startDate },
        {
          update: {
            totalScore: dailyScore.totalScore,
            taskCount: dailyScore.taskCount,
            level: dailyScore.level,
          },
          create: {
            date: startDate,
            totalScore: dailyScore.totalScore,
            taskCount: dailyScore.taskCount,
            level: dailyScore.level,
          },
        }
      );

      return NextResponse.json(dailyScore);
    } else {
      // 获取最近N天的评分
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(range));

      const dailyScores = await mockScoreDB.findMany({
        date: {
          gte: startDate,
          lte: endDate,
        },
      });

      return NextResponse.json(dailyScores);
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
} 