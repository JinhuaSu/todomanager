// 基于Python代码的评分系统
export interface ScoreRule {
  taskType: string;
  baseScore: number;
  timeFactor?: number;
  priority?: number;
}

// 默认评分规则，基于Python代码中的score_map
export const DEFAULT_SCORE_RULES: ScoreRule[] = [
  { taskType: "整理", baseScore: 1 },
  { taskType: "矩阵模拟开发", baseScore: 3 },
  { taskType: "卫生", baseScore: 1 },
  { taskType: "课外阅读", baseScore: 1 },
  { taskType: "刷手机", baseScore: -2 },
  { taskType: "锻炼", baseScore: 1 },
  { taskType: "开发", baseScore: 2 },
  { taskType: "调研", baseScore: 1 },
  { taskType: "沟通", baseScore: 2 },
];

export interface Task {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number; // 分钟
  taskType: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completion: number; // 0-100
  notes?: string;
}

export function calculateTaskScore(task: Task, rules: ScoreRule[] = DEFAULT_SCORE_RULES): number {
  const rule = rules.find(r => r.taskType === task.taskType);
  if (!rule) return 0;

  // 基础分数计算
  let baseScore = (task.duration / 60) * rule.baseScore;

  // 完成度因子
  const completionFactor = task.completion / 100;

  // 时间因子（基于Python代码中的逻辑）
  const timeFactor = getTimeFactor(task.duration, task.duration); // 简化版本

  // 类型因子
  const typeFactor = getTypeFactor(task.title);

  return baseScore * completionFactor * timeFactor * typeFactor;
}

function getTimeFactor(expected: number, actual: number): number {
  if (expected >= actual) return 1;
  if (expected >= actual * 1.2) return 0.5;
  if (expected >= actual * 1.5) return 0.2;
  return -1;
}

function getTypeFactor(title: string): number {
  let factor = 1;
  
  if (title.includes("ddl当日")) factor *= 1.2;
  if (title.includes("赚钱")) factor *= 1.2;
  if (title.includes("当日突发")) factor *= 0.8;
  if (title.includes("人情")) factor *= 1.2;
  if (title.includes("不紧急但重要")) factor *= 1.4;
  
  return factor;
}

export function calculateDailyScore(tasks: Task[], rules: ScoreRule[] = DEFAULT_SCORE_RULES): {
  totalScore: number;
  taskCount: number;
  level: number;
} {
  const totalScore = tasks.reduce((sum, task) => sum + calculateTaskScore(task, rules), 0);
  const taskCount = tasks.length;
  
  // 等级计算（基于Python代码中的逻辑）
  let level = 0;
  tasks.forEach(task => {
    const score = calculateTaskScore(task, rules);
    if (score > 0) level += 1;
    else if (score < 0) level -= 1;
  });

  return { totalScore, taskCount, level };
} 