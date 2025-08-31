'use client';

import { useState } from 'react';

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
  aiModel: string;
}

interface EnhancedCalendarImportProps {
  onImport: (events: CalendarEvent[]) => void;
}

export default function EnhancedCalendarImport({ onImport }: EnhancedCalendarImportProps) {
  const [calendarText, setCalendarText] = useState('');
  const [processedEvents, setProcessedEvents] = useState<CalendarEvent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useQwen, setUseQwen] = useState(true);
  const [processingStatus, setProcessingStatus] = useState('');

  // 字符串处理函数 - 解析日历文本
  const parseCalendarText = (text: string): Partial<CalendarEvent>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const events: Partial<CalendarEvent>[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      // 查找时间信息
      const timeMatch = line.match(/已安排：(\d{4}年\d{1,2}月\d{1,2}日)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
      
      if (timeMatch) {
        const [_, date, startTime, endTime] = timeMatch;
        const title = i > 0 ? lines[i - 1].trim() : '';
        
        if (title && date && startTime && endTime) {
          const formattedDate = date.replace(/年|月|日/g, '/').replace(/\/$/, '');
          const start = new Date(`${formattedDate} ${startTime}`);
          const end = new Date(`${formattedDate} ${endTime}`);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.warn(`Invalid date format for event: ${title}`);
            continue;
          }
          
          const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
          
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

  // 使用Qwen API进行分类
  const classifyWithQwen = async (title: string): Promise<{
    taskType: string;
    category: string;
    expGain: number;
    confidence: number;
    reasoning: string;
    aiModel: string;
  }> => {
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          taskType: data.classification.taskType,
          category: data.classification.category,
          expGain: data.classification.expGain,
          confidence: data.classification.confidence,
          reasoning: data.classification.reasoning,
          aiModel: 'Qwen'
        };
      }
    } catch (error) {
      console.error('Qwen API调用失败:', error);
    }

    // 回退到本地分类器
    return classifyWithLocal(title);
  };

  // 本地分类器
  const classifyWithLocal = (title: string): {
    taskType: string;
    category: string;
    expGain: number;
    confidence: number;
    reasoning: string;
    aiModel: string;
  } => {
    const lowerTitle = title.toLowerCase();
    
    const mapping = {
      knowledge: {
        keywords: ['学习', '阅读', '研究', '分析', '翻译', '平台', 'crm', '系统', '视频翻译'],
        taskType: '学习',
        category: '知识',
        expGain: 15,
        reasoning: '涉及学习和认知提升的活动'
      },
      work: {
        keywords: ['工作', '开发', '修复', '续费', '复购', '同步', '爬虫', '工具开发', '效率提升'],
        taskType: '工作',
        category: '勇气',
        expGain: 20,
        reasoning: '涉及专业技术和挑战性的工作'
      },
      rest: {
        keywords: ['休息', '吃饭', '洗澡', '看视频', '睡觉'],
        taskType: '休息',
        category: '体贴',
        expGain: 5,
        reasoning: '自我照顾和放松的活动'
      },
      social: {
        keywords: ['会议', '沟通', '交流', '讨论', '社交', '聊天'],
        taskType: '社交',
        category: '魅力',
        expGain: 12,
        reasoning: '涉及人际交往和沟通的活动'
      },
      craft: {
        keywords: ['制作', '手工', '工具', '开发', '创建', '构建'],
        taskType: '手工',
        category: '灵巧',
        expGain: 18,
        reasoning: '涉及技能操作和制作的活动'
      }
    };

    let bestMatch = {
      taskType: '其他',
      category: '知识',
      expGain: 10,
      confidence: 0.3,
      reasoning: '未能明确分类的活动',
      aiModel: 'Local'
    };

    for (const [key, config] of Object.entries(mapping)) {
      const matchedKeywords = config.keywords.filter(keyword => 
        lowerTitle.includes(keyword)
      );
      
      if (matchedKeywords.length > 0) {
        const confidence = Math.min(0.9, 0.3 + (matchedKeywords.length * 0.2));
        
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            taskType: config.taskType,
            category: config.category,
            expGain: config.expGain,
            confidence,
            reasoning: config.reasoning,
            aiModel: 'Local'
          };
        }
      }
    }

    return bestMatch;
  };

  // 处理日历文本
  const handleProcessCalendar = async () => {
    if (!calendarText.trim()) return;
    
    setIsProcessing(true);
    setProcessingStatus('正在解析日历文本...');
    
    try {
      // 1. 字符串处理 - 解析日历文本
      const parsedEvents = parseCalendarText(calendarText);
      setProcessingStatus(`解析完成，共找到 ${parsedEvents.length} 个事件`);
      
      // 2. 智能分类
      const classifiedEvents: CalendarEvent[] = [];
      
      for (let i = 0; i < parsedEvents.length; i++) {
        const event = parsedEvents[i];
        if (!event.title) continue;
        
        setProcessingStatus(`正在分类第 ${i + 1}/${parsedEvents.length} 个事件: ${event.title}`);
        
        let classification;
        if (useQwen) {
          classification = await classifyWithQwen(event.title);
        } else {
          classification = classifyWithLocal(event.title);
        }
        
        if (event.title && event.startTime && event.endTime && event.duration !== undefined) {
          classifiedEvents.push({
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            duration: event.duration,
            taskType: classification.taskType,
            category: classification.category,
            expGain: classification.expGain,
            confidence: classification.confidence,
            reasoning: classification.reasoning,
            aiModel: classification.aiModel
          });
        }
      }
      
      setProcessedEvents(classifiedEvents);
      setProcessingStatus('分类完成！');
      
    } catch (error) {
      console.error('处理日历文本时出错:', error);
      setProcessingStatus('处理失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  // 导入到任务系统
  const handleImport = () => {
    onImport(processedEvents);
    setCalendarText('');
    setProcessedEvents([]);
    setProcessingStatus('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">增强日历导入</h2>
      
      {/* AI模型选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择AI分类器
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={useQwen}
              onChange={() => setUseQwen(true)}
              className="mr-2"
            />
            <span className="text-sm">Qwen大模型 (推荐)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!useQwen}
              onChange={() => setUseQwen(false)}
              className="mr-2"
            />
            <span className="text-sm">本地分类器</span>
          </label>
        </div>
        {useQwen && (
          <p className="text-xs text-gray-500 mt-1">
            需要配置QWEN_API_KEY环境变量
          </p>
        )}
      </div>
      
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

      {/* 处理状态 */}
      {processingStatus && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{processingStatus}</p>
        </div>
      )}

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
                <div className="flex items-center gap-4 text-sm mb-2">
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                    {event.aiModel}
                  </span>
                  <span className="text-gray-500">
                    {event.duration} 分钟
                  </span>
                </div>
                <div className="text-xs text-gray-600">
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

      {/* 功能说明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">功能特性</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-600">Qwen大模型</h5>
            <p className="text-gray-600">使用阿里云通义千问进行智能分类，准确度更高</p>
          </div>
          <div>
            <h5 className="font-medium text-green-600">本地分类器</h5>
            <p className="text-gray-600">基于关键词匹配的本地分类，无需API密钥</p>
          </div>
          <div>
            <h5 className="font-medium text-purple-600">实时反馈</h5>
            <p className="text-gray-600">显示处理进度和分类结果</p>
          </div>
          <div>
            <h5 className="font-medium text-orange-600">置信度评估</h5>
            <p className="text-gray-600">为每个分类结果提供置信度评分</p>
          </div>
        </div>
      </div>
    </div>
  );
}
