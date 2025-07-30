'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, CheckCircle, Clock, Target } from 'lucide-react';

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

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateCompletion: (id: string, completion: number) => void;
}

export default function TaskList({ 
  tasks, 
  onEdit, 
  onDelete, 
  onUpdateStatus, 
  onUpdateCompletion 
}: TaskListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '已完成';
      case 'IN_PROGRESS': return '进行中';
      case 'CANCELLED': return '已取消';
      default: return '待开始';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600';
    if (score < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无任务，开始添加你的第一个任务吧！</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {format(new Date(task.startTime), 'MM-dd HH:mm')} - {format(new Date(task.endTime), 'HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={14} />
                    {task.duration}分钟
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${getScoreColor(task.score)}`}>
                  {task.score > 0 ? '+' : ''}{task.score.toFixed(1)}分
                </span>
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  类型: <span className="font-medium">{task.taskType}</span>
                </span>
                <span className="text-sm text-gray-600">
                  完成度: <span className="font-medium">{task.completion}%</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                  className={`px-2 py-1 text-xs rounded ${
                    task.status === 'IN_PROGRESS' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  开始
                </button>
                <button
                  onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                  className={`px-2 py-1 text-xs rounded ${
                    task.status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                  }`}
                >
                  完成
                </button>
              </div>
            </div>

            {task.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">{task.notes}</p>
              </div>
            )}

            {/* 完成度滑块 */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>完成度调整</span>
                <span>{task.completion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.completion}
                onChange={(e) => onUpdateCompletion(task.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
} 