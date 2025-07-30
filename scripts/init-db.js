const { PrismaClient } = require('@prisma/client');
const { DEFAULT_SCORE_RULES } = require('../src/lib/score-calculator');

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建默认评分规则
  console.log('创建默认评分规则...');
  for (const rule of DEFAULT_SCORE_RULES) {
    await prisma.scoreRule.upsert({
      where: { taskType: rule.taskType },
      update: {
        baseScore: rule.baseScore,
        timeFactor: rule.timeFactor || 1.0,
        priority: rule.priority || 1,
      },
      create: {
        taskType: rule.taskType,
        baseScore: rule.baseScore,
        timeFactor: rule.timeFactor || 1.0,
        priority: rule.priority || 1,
      },
    });
  }

  // 创建示例任务
  console.log('创建示例任务...');
  const sampleTasks = [
    {
      title: '项目开发',
      description: '开发新功能模块',
      startTime: new Date('2024-01-15T09:00:00Z'),
      endTime: new Date('2024-01-15T11:00:00Z'),
      duration: 120,
      taskType: '开发',
      status: 'COMPLETED',
      completion: 100,
      notes: '完成了核心功能开发，代码质量良好',
      score: 4.0,
    },
    {
      title: '阅读技术文档',
      description: '学习新技术框架',
      startTime: new Date('2024-01-15T14:00:00Z'),
      endTime: new Date('2024-01-15T15:30:00Z'),
      duration: 90,
      taskType: '课外阅读',
      status: 'COMPLETED',
      completion: 80,
      notes: '了解了新框架的基本概念，需要进一步实践',
      score: 1.2,
    },
    {
      title: '团队会议',
      description: '讨论项目进度',
      startTime: new Date('2024-01-15T16:00:00Z'),
      endTime: new Date('2024-01-15T17:00:00Z'),
      duration: 60,
      taskType: '沟通',
      status: 'IN_PROGRESS',
      completion: 50,
      notes: '讨论了项目难点，明确了下一步计划',
      score: 1.0,
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('数据库初始化完成！');
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 