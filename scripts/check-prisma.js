const { PrismaClient } = require('@prisma/client');

async function checkPrisma() {
  try {
    console.log('检查 Prisma 客户端...');
    
    const prisma = new PrismaClient();
    
    // 检查模型是否存在
    console.log('检查 Ability 模型...');
    const abilities = await prisma.ability.findMany();
    console.log(`找到 ${abilities.length} 个能力`);
    
    console.log('检查 Reward 模型...');
    const rewards = await prisma.reward.findMany();
    console.log(`找到 ${rewards.length} 个奖励`);
    
    console.log('检查 Achievement 模型...');
    const achievements = await prisma.achievement.findMany();
    console.log(`找到 ${achievements.length} 个成就`);
    
    await prisma.$disconnect();
    console.log('✅ Prisma 客户端检查完成');
    
  } catch (error) {
    console.error('❌ Prisma 客户端检查失败:', error);
    process.exit(1);
  }
}

checkPrisma();
