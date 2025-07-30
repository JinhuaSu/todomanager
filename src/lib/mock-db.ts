import { calculateTaskScore, DEFAULT_SCORE_RULES } from './score-calculator';

// 模拟数据库存储
let tasks: any[] = [];
let scores: any[] = [];

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 任务相关操作
export const mockTaskDB = {
  // 获取任务列表
  async findMany(where?: any) {
    if (where?.startTime) {
      const startDate = new Date(where.startTime.gte);
      const endDate = new Date(where.startTime.lt);
      return tasks.filter(task => {
        const taskDate = new Date(task.startTime);
        return taskDate >= startDate && taskDate < endDate;
      });
    }
    return tasks;
  },

  // 创建任务
  async create(data: any) {
    const newTask = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    return newTask;
  },

  // 更新任务
  async update(where: any, data: any) {
    const index = tasks.findIndex(task => task.id === where.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data, updatedAt: new Date() };
      return tasks[index];
    }
    throw new Error('Task not found');
  },

  // 删除任务
  async delete(where: any) {
    const index = tasks.findIndex(task => task.id === where.id);
    if (index !== -1) {
      tasks.splice(index, 1);
      return { success: true };
    }
    throw new Error('Task not found');
  },

  // 查找单个任务
  async findUnique(where: any) {
    return tasks.find(task => task.id === where.id);
  },
};

// 评分相关操作
export const mockScoreDB = {
  // 获取评分数据
  async findMany(where?: any) {
    if (where?.date) {
      return scores.filter(score => {
        const scoreDate = new Date(score.date);
        const startDate = new Date(where.date.gte);
        const endDate = new Date(where.date.lte);
        return scoreDate >= startDate && scoreDate <= endDate;
      });
    }
    return scores;
  },

  // 创建或更新评分
  async upsert(where: any, data: any) {
    const index = scores.findIndex(score => score.date === where.date);
    if (index !== -1) {
      scores[index] = { ...scores[index], ...data.update, updatedAt: new Date() };
      return scores[index];
    } else {
      const newScore = {
        id: generateId(),
        ...data.create,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      scores.push(newScore);
      return newScore;
    }
  },
};

// 初始化示例数据
export const initMockData = () => {
  if (tasks.length === 0) {
    const sampleTasks = [
      {
        id: generateId(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    tasks.push(...sampleTasks);
  }
};

// 初始化数据
initMockData(); 