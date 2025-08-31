import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取所有奖励和成就
export async function GET() {
  try {
    const [rewards, achievements] = await Promise.all([
      prisma.reward.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.achievement.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      rewards,
      achievements
    });
  } catch (error) {
    console.error('Error fetching rewards and achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards and achievements' },
      { status: 500 }
    );
  }
}

// 初始化奖励和成就数据
export async function POST() {
  try {
    const defaultRewards = [
      {
        name: '经验加成',
        description: '完成任务时获得额外经验值',
        type: 'EXP_BOOST',
        value: 20,
        isUnlocked: true,
        unlockCondition: '完成第一个任务'
      },
      {
        name: '分数加成',
        description: '任务评分获得额外加成',
        type: 'SCORE_BOOST',
        value: 15,
        isUnlocked: false,
        unlockCondition: '知识等级达到3级'
      },
      {
        name: '时间加成',
        description: '专注时间获得额外奖励',
        type: 'TIME_BOOST',
        value: 10,
        isUnlocked: false,
        unlockCondition: '连续完成7天任务'
      },
      {
        name: '特殊物品',
        description: '解锁特殊功能和界面',
        type: 'SPECIAL_ITEM',
        value: 1,
        isUnlocked: false,
        unlockCondition: '所有能力等级达到5级'
      }
    ];

    const defaultAchievements = [
      {
        name: '初出茅庐',
        description: '完成第一个任务',
        isUnlocked: false,
        unlockCondition: '完成1个任务'
      },
      {
        name: '坚持不懈',
        description: '连续完成7天任务',
        isUnlocked: false,
        unlockCondition: '连续完成7天任务'
      },
      {
        name: '知识达人',
        description: '知识等级达到5级',
        isUnlocked: false,
        unlockCondition: '知识等级达到5级'
      },
      {
        name: '全能选手',
        description: '所有能力等级达到3级',
        isUnlocked: false,
        unlockCondition: '所有能力等级达到3级'
      },
      {
        name: '任务大师',
        description: '完成100个任务',
        isUnlocked: false,
        unlockCondition: '完成100个任务'
      }
    ];

    const createdRewards = [];
    const createdAchievements = [];

    // 创建奖励
    for (const rewardData of defaultRewards) {
      const existingReward = await prisma.reward.findUnique({
        where: { name: rewardData.name }
      });

      if (!existingReward) {
        const reward = await prisma.reward.create({
          data: {
            ...rewardData,
            type: rewardData.type as any
          }
        });
        createdRewards.push(reward);
      }
    }

    // 创建成就
    for (const achievementData of defaultAchievements) {
      const existingAchievement = await prisma.achievement.findUnique({
        where: { name: achievementData.name }
      });

      if (!existingAchievement) {
        const achievement = await prisma.achievement.create({
          data: achievementData
        });
        createdAchievements.push(achievement);
      }
    }

    return NextResponse.json({
      message: 'Rewards and achievements initialized',
      created: {
        rewards: createdRewards,
        achievements: createdAchievements
      }
    });
  } catch (error) {
    console.error('Error initializing rewards and achievements:', error);
    return NextResponse.json(
      { error: 'Failed to initialize rewards and achievements' },
      { status: 500 }
    );
  }
}

// 解锁奖励或成就
export async function PUT(request: NextRequest) {
  try {
    const { type, id } = await request.json();

    if (type === 'reward') {
      const reward = await prisma.reward.update({
        where: { id },
        data: { isUnlocked: true }
      });
      return NextResponse.json({ reward });
    } else if (type === 'achievement') {
      const achievement = await prisma.achievement.update({
        where: { id },
        data: { isUnlocked: true }
      });
      return NextResponse.json({ achievement });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error unlocking reward/achievement:', error);
    return NextResponse.json(
      { error: 'Failed to unlock reward/achievement' },
      { status: 500 }
    );
  }
}
