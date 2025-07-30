'use client';

import { useState, useEffect } from 'react';
import SimpleTaskForm from '@/components/SimpleTaskForm';
import SimpleTaskList from '@/components/SimpleTaskList';

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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTasks(selectedDate);
    fetchScores();
    setLoading(false);
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
          {/* 任务列表 */}
          <div className="lg:col-span-3">
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
    </div>
  );
}
