const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeAbilitySystem() {
  try {
    console.log('开始初始化能力系统...');

    // 创建默认能力
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
        console.log(`创建能力: ${ability.displayName}`);
      } else {
        console.log(`能力已存在: ${abilityData.displayName}`);
      }
    }

    // 创建默认奖励
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

    for (const rewardData of defaultRewards) {
      const existingReward = await prisma.reward.findUnique({
        where: { name: rewardData.name }
      });

      if (!existingReward) {
        const reward = await prisma.reward.create({
          data: rewardData
        });
        console.log(`创建奖励: ${reward.name}`);
      } else {
        console.log(`奖励已存在: ${rewardData.name}`);
      }
    }

    // 创建默认成就
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

    for (const achievementData of defaultAchievements) {
      const existingAchievement = await prisma.achievement.findUnique({
        where: { name: achievementData.name }
      });

      if (!existingAchievement) {
        const achievement = await prisma.achievement.create({
          data: achievementData
        });
        console.log(`创建成就: ${achievement.name}`);
      } else {
        console.log(`成就已存在: ${achievementData.name}`);
      }
    }

    console.log('能力系统初始化完成！');
  } catch (error) {
    console.error('初始化失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeAbilitySystem();
