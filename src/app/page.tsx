'use client';

import { useState, useEffect } from 'react';
import SimpleTaskForm from '@/components/SimpleTaskForm';
import SimpleTaskList from '@/components/SimpleTaskList';
import AbilityRadarChart from '@/components/AbilityRadarChart';
import AbilityUpgradeModal from '@/components/AbilityUpgradeModal';
import RewardSystem from '@/components/RewardSystem';
import EnhancedCalendarImport from '@/components/EnhancedCalendarImport';

interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  taskType: string;
  status: string;
  completion: number;
  score: number;
  notes?: string;
}

interface ScoreData {
  date: string;
  totalScore: number;
  taskCount: number;
  level: number;
}

interface Ability {
  id: string;
  name: string;
  displayName: string;
  description: string;
  currentExp: number;
  level: number;
  maxLevel: number;
  icon?: string;
  color: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'EXP_BOOST' | 'SCORE_BOOST' | 'TIME_BOOST' | 'SPECIAL_ITEM';
  value: number;
  icon?: string;
  isUnlocked: boolean;
  unlockCondition?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isUnlocked: boolean;
  unlockCondition?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showAbilityUpgrade, setShowAbilityUpgrade] = useState(false);
  const [showCalendarImport, setShowCalendarImport] = useState(false);
  const [upgradeData, setUpgradeData] = useState<{
    ability: Ability | null;
    oldLevel: number;
    newLevel: number;
    expGained: number;
  }>({
    ability: null,
    oldLevel: 0,
    newLevel: 0,
    expGained: 0
  });

  // 获取任务列表
  const fetchTasks = async (date?: string) => {
    try {
      const url = date ? `/api/tasks?date=${date}` : '/api/tasks';
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // 获取评分数据
  const fetchScores = async () => {
    try {
      const response = await fetch('/api/scores?range=7');
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  // 获取能力数据
  const fetchAbilities = async () => {
    try {
      const response = await fetch('/api/abilities');
      const data = await response.json();
      setAbilities(data);
    } catch (error) {
      console.error('Error fetching abilities:', error);
    }
  };

  // 获取奖励和成就数据
  const fetchRewardsAndAchievements = async () => {
    try {
      const response = await fetch('/api/rewards');
      const data = await response.json();
      setRewards(data.rewards);
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Error fetching rewards and achievements:', error);
    }
  };

  // 初始化数据
  const initializeData = async () => {
    try {
      await Promise.all([
        fetch('/api/abilities', { method: 'POST' }),
        fetch('/api/rewards', { method: 'POST' })
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await initializeData();
      await Promise.all([
        fetchTasks(selectedDate),
        fetchScores(),
        fetchAbilities(),
        fetchRewardsAndAchievements()
      ]);
      setLoading(false);
    };
    loadData();
  }, [selectedDate]);

  // 添加任务
  const handleAddTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchTasks(selectedDate);
        fetchScores();
        
        // 根据任务类型给予能力经验值
        await grantAbilityExp(taskData.taskType, 10);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // 编辑任务
  const handleEditTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        setEditingTask(null);
        fetchTasks(selectedDate);
        fetchScores();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // 删除任务
  const handleDeleteTask = async (id: string) => {
    if (!confirm('确定要删除这个任务吗？')) return;
    
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchTasks(selectedDate);
        fetchScores();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // 更新任务状态
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      
      if (response.ok) {
        fetchTasks(selectedDate);
        fetchScores();
        
        // 如果任务完成，给予能力经验值
        if (status === 'COMPLETED') {
          const task = tasks.find(t => t.id === id);
          if (task) {
            await grantAbilityExp(task.taskType, 20);
          }
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // 更新完成度
  const handleUpdateCompletion = async (id: string, completion: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completion }),
      });
      
      if (response.ok) {
        fetchTasks(selectedDate);
        fetchScores();
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  // 给予能力经验值
  const grantAbilityExp = async (taskType: string, expGain: number) => {
    try {
      // 根据任务类型映射到能力
      const abilityMapping: { [key: string]: string } = {
        '学习': 'knowledge',
        '阅读': 'knowledge',
        '社交': 'charm',
        '运动': 'courage',
        '帮助': 'kindness',
        '手工': 'dexterity',
        '工作': 'courage',
        '管理': 'knowledge',
        '休息': 'kindness',
        '其他': 'knowledge'
      };

      const abilityName = abilityMapping[taskType] || 'knowledge';
      const ability = abilities.find(a => a.name === abilityName);
      
      if (ability) {
        const response = await fetch('/api/abilities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            abilityId: ability.id,
            expGain: expGain
          }),
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.leveledUp) {
            setUpgradeData({
              ability: result.ability,
              oldLevel: result.oldLevel,
              newLevel: result.newLevel,
              expGained: result.expGained
            });
            setShowAbilityUpgrade(true);
          }
          
          fetchAbilities();
        }
      }
    } catch (error) {
      console.error('Error granting ability exp:', error);
    }
  };

  // 处理日历导入
  const handleCalendarImport = async (events: any[]) => {
    try {
      for (const event of events) {
        // 创建任务
        const taskData = {
          title: event.title,
          startTime: event.startTime,
          endTime: event.endTime,
          duration: event.duration,
          taskType: event.taskType,
          status: 'PENDING',
          completion: 0,
          score: event.expGain
        };

        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });

        if (response.ok) {
          // 给予能力经验值
          await grantAbilityExp(event.taskType, event.expGain);
        }
      }

      // 刷新数据
      fetchTasks(selectedDate);
      fetchScores();
      setShowCalendarImport(false);
    } catch (error) {
      console.error('Error importing calendar events:', error);
    }
  };

  // 计算今日统计
  const todayStats = {
    totalScore: tasks.reduce((sum, task) => sum + task.score, 0),
    taskCount: tasks.length,
    completedCount: tasks.filter(task => task.status === 'COMPLETED').length,
    averageCompletion: tasks.length > 0 
      ? tasks.reduce((sum, task) => sum + task.completion, 0) / tasks.length 
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">任务管理器</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowCalendarImport(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                智能导入日历
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                添加任务
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">今日总分</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayStats.totalScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">任务总数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayStats.taskCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已完成</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayStats.completedCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">平均完成度</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todayStats.averageCompletion.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 能力雷达图 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">能力成长</h2>
              <AbilityRadarChart abilities={abilities} size={280} />
            </div>
          </div>

          {/* 奖励系统 */}
          <div className="lg:col-span-1">
            <RewardSystem rewards={rewards} achievements={achievements} />
          </div>

          {/* 任务列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">今日任务</h2>
              <SimpleTaskList
                tasks={tasks}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onUpdateStatus={handleUpdateStatus}
                onUpdateCompletion={handleUpdateCompletion}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 任务表单模态框 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SimpleTaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <SimpleTaskForm
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
            initialData={editingTask}
          />
        </div>
      )}

      {/* 日历导入模态框 */}
      {showCalendarImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <EnhancedCalendarImport onImport={handleCalendarImport} />
          <div className="p-4 border-t">
            <button
              onClick={() => setShowCalendarImport(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              关闭
            </button>
          </div>
        </div>
        </div>
      )}

      {/* 能力提升模态框 */}
      <AbilityUpgradeModal
        isOpen={showAbilityUpgrade}
        onClose={() => setShowAbilityUpgrade(false)}
        upgradedAbility={upgradeData.ability}
        oldLevel={upgradeData.oldLevel}
        newLevel={upgradeData.newLevel}
        expGained={upgradeData.expGained}
      />
    </div>
  );
}
