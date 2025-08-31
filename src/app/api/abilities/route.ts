import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 获取所有能力
export async function GET() {
  try {
    const abilities = await prisma.ability.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(abilities);
  } catch (error) {
    console.error('Error fetching abilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abilities' },
      { status: 500 }
    );
  }
}

// 更新能力经验值
export async function PUT(request: NextRequest) {
  try {
    const { abilityId, expGain } = await request.json();

    const ability = await prisma.ability.findUnique({
      where: { id: abilityId }
    });

    if (!ability) {
      return NextResponse.json(
        { error: 'Ability not found' },
        { status: 404 }
      );
    }

    // 计算新的经验值和等级
    const newExp = ability.currentExp + expGain;
    const expPerLevel = 100; // 每级需要的经验值
    const newLevel = Math.min(
      Math.floor(newExp / expPerLevel) + 1,
      ability.maxLevel
    );

    const updatedAbility = await prisma.ability.update({
      where: { id: abilityId },
      data: {
        currentExp: newExp,
        level: newLevel
      }
    });

    return NextResponse.json({
      ability: updatedAbility,
      leveledUp: newLevel > ability.level,
      oldLevel: ability.level,
      newLevel: newLevel,
      expGained: expGain
    });
  } catch (error) {
    console.error('Error updating ability:', error);
    return NextResponse.json(
      { error: 'Failed to update ability' },
      { status: 500 }
    );
  }
}

// 初始化能力数据
export async function POST() {
  try {
    const defaultAbilities = [
      {
        name: 'knowledge',
        displayName: '知识',
        description: '通过学习和阅读提升的知识水平',
        color: '#3b82f6',
        icon: '📚'
      },
      {
        name: 'charm',
        displayName: '魅力',
        description: '社交能力和个人魅力的体现',
        color: '#ec4899',
        icon: '💫'
      },
      {
        name: 'courage',
        displayName: '勇气',
        description: '面对挑战时的勇气和决心',
        color: '#ef4444',
        icon: '⚔️'
      },
      {
        name: 'kindness',
        displayName: '体贴',
        description: '关心他人和帮助他人的能力',
        color: '#10b981',
        icon: '🤝'
      },
      {
        name: 'dexterity',
        displayName: '灵巧',
        description: '手工艺和技能操作的熟练度',
        color: '#f59e0b',
        icon: '🔧'
      }
    ];

    const createdAbilities = [];
    
    for (const abilityData of defaultAbilities) {
      const existingAbility = await prisma.ability.findUnique({
        where: { name: abilityData.name }
      });

      if (!existingAbility) {
        const ability = await prisma.ability.create({
          data: {
            ...abilityData,
            currentExp: 0,
            level: 1,
            maxLevel: 10
          }
        });
        createdAbilities.push(ability);
      }
    }

    return NextResponse.json({
      message: 'Abilities initialized',
      created: createdAbilities
    });
  } catch (error) {
    console.error('Error initializing abilities:', error);
    return NextResponse.json(
      { error: 'Failed to initialize abilities' },
      { status: 500 }
    );
  }
}
