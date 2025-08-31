'use client';

import { useState } from 'react';
import { classifyTaskWithQwen } from '@/lib/qwen-classifier';

interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  taskType: string;
  category: string;
  expGain: number;
  confidence: number;
  reasoning: string;
}

interface CalendarImportProps {
  onImport: (events: CalendarEvent[]) => void;
}

export default function CalendarImport({ onImport }: CalendarImportProps) {
  const [calendarText, setCalendarText] = useState('');
  const [processedEvents, setProcessedEvents] = useState<CalendarEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 字符串处理函数 - 解析日历文本
  const parseCalendarText = (text: string): Partial<CalendarEvent>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const events: Partial<CalendarEvent>[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 跳过空行
      if (!line) continue;
      
      // 查找时间信息
      const timeMatch = line.match(/已安排：(\d{4}年\d{1,2}月\d{1,2}日)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      
      if (timeMatch) {
        const [_, date, startTime, endTime] = timeMatch;
        
        // 获取标题（前一行）
        const title = i > 0 ? lines[i - 1].trim() : '';
        
        if (title && date && startTime && endTime) {
          // 格式化日期字符串，确保兼容性
          const formattedDate = date.replace(/年|月|日/g, '/').replace(/\/$/, '');
          
          // 计算持续时间
          const start = new Date(`${formattedDate} ${startTime}`);
          const end = new Date(`${formattedDate} ${endTime}`);
          
          // 检查日期是否有效
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn(`Invalid date format for event: ${title}`);
            continue;
          }
          
          const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // 分钟
          
          events.push({
            title,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            duration
          });
        }
      }
    }
    
    return events;
  };

  // 智能分类函数 - 使用Qwen分类器
  const classifyTask = async (title: string) => {
    return await classifyTaskWithQwen(title);
  };

  // 处理日历文本
  const handleProcessCalendar = async () => {
    if (!calendarText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // 1. 字符串处理 - 解析日历文本
      const parsedEvents = parseCalendarText(calendarText);
      
      // 2. 智能分类 - 为每个事件分配类型和奖励
      const classifiedEvents: CalendarEvent[] = [];
      
      for (const event of parsedEvents) {
        if (!event.title) continue;
        
        const classification = await classifyTask(event.title);
        
        classifiedEvents.push({
          ...event,
          taskType: classification.taskType,
          category: classification.category,
          expGain: classification.expGain,
          confidence: classification.confidence,
          reasoning: classification.reasoning
        } as CalendarEvent);
      }
      
      setProcessedEvents(classifiedEvents);
      
    } catch (error) {
      console.error('处理日历文本时出错:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 导入到任务系统
  const handleImport = () => {
    onImport(processedEvents);
    setCalendarText('');
    setProcessedEvents([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">日历导入</h2>
      
      {/* 输入区域 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          粘贴日历内容
        </label>
        <textarea
          value={calendarText}
          onChange={(e) => setCalendarText(e.target.value)}
          placeholder="粘贴你的日历内容..."
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 处理按钮 */}
      <div className="mb-6">
        <button
          onClick={handleProcessCalendar}
          disabled={!calendarText.trim() || isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? '处理中...' : '智能分类'}
        </button>
      </div>

      {/* 处理结果 */}
      {processedEvents.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-3">分类结果</h3>
          <div className="space-y-3">
            {processedEvents.map((event, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {event.taskType}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    {event.category}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    +{event.expGain} 经验
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    {(event.confidence * 100).toFixed(0)}% 置信度
                  </span>
                  <span className="text-gray-500">
                    {event.duration} 分钟
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {event.reasoning}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleImport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              导入到任务系统
            </button>
          </div>
        </div>
      )}

      {/* 分类说明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">分类规则</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-600">知识类</h5>
            <p className="text-gray-600">学习、阅读、研究、翻译、平台、CRM、系统</p>
          </div>
          <div>
            <h5 className="font-medium text-red-600">工作类</h5>
            <p className="text-gray-600">工作、开发、修复、续费、复购、同步、爬虫</p>
          </div>
          <div>
            <h5 className="font-medium text-green-600">休息类</h5>
            <p className="text-gray-600">休息、吃饭、洗澡、看视频</p>
          </div>
          <div>
            <h5 className="font-medium text-purple-600">手工类</h5>
            <p className="text-gray-600">制作、手工、工具、开发</p>
          </div>
        </div>
      </div>
    </div>
  );
}
