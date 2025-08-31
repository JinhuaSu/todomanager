'use client';

import { useState } from 'react';
import EnhancedCalendarImport from '@/components/EnhancedCalendarImport';

export default function CalendarDemoPage() {
  const [importedEvents, setImportedEvents] = useState<any[]>([]);

  const handleImport = (events: any[]) => {
    setImportedEvents(events);
    console.log('导入的事件:', events);
  };

  const sampleCalendarText = `滁州CRM
已安排：2025年8月31日 09:00 - 11:15 (GMT+8)

休息看视频
已安排：2025年8月31日 11:15 - 13:00 (GMT+8)

云服务续费复购
已安排：2025年8月31日 13:00 - 13:30 (GMT+8)

同步系统爬虫修复
已安排：2025年8月31日 13:30 - 14:15 (GMT+8)

洗澡
已安排：2025年8月31日 14:15 - 14:45 (GMT+8)

视频翻译平台
已安排：2025年8月31日 14:45 - 16:00 (GMT+8)

吃饭休息
已安排：2025年8月31日 16:00 - 17:00 (GMT+8)

个人效率提升工具开发
已安排：2025年8月31日 17:00 - 18:00 (GMT+8)`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            增强日历导入演示
          </h1>
          <p className="text-lg text-gray-600">
            集成Qwen大模型的智能日历解析，自动分类任务并分配能力经验值
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 日历导入组件 */}
          <div>
            <EnhancedCalendarImport onImport={handleImport} />
          </div>

          {/* 示例和说明 */}
          <div className="space-y-6">
            {/* 示例数据 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">示例日历数据</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">点击复制示例数据：</p>
                <button
                  onClick={() => navigator.clipboard.writeText(sampleCalendarText)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  复制示例
                </button>
              </div>
              <div className="mt-4">
                <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded overflow-auto max-h-40">
{`滁州CRM
已安排：2025年8月31日 09:00 - 11:15 (GMT+8)

休息看视频
已安排：2025年8月31日 11:15 - 13:00 (GMT+8)

云服务续费复购
已安排：2025年8月31日 13:00 - 13:30 (GMT+8)

同步系统爬虫修复
已安排：2025年8月31日 13:30 - 14:15 (GMT+8)

洗澡
已安排：2025年8月31日 14:15 - 14:45 (GMT+8)

视频翻译平台
已安排：2025年8月31日 14:45 - 16:00 (GMT+8)

吃饭休息
已安排：2025年8月31日 16:00 - 17:00 (GMT+8)

个人效率提升工具开发
已安排：2025年8月31日 17:00 - 18:00 (GMT+8)`}
                </pre>
              </div>
            </div>

                         {/* 功能说明 */}
             <div className="bg-white rounded-lg shadow-sm p-6">
               <h2 className="text-lg font-semibold mb-4">功能说明</h2>
               <div className="space-y-4 text-sm">
                 <div>
                   <h3 className="font-medium text-gray-900 mb-2">1. 字符串解析</h3>
                   <p className="text-gray-600">
                     自动解析日历文本中的时间信息和事件标题，支持多种时间格式。
                   </p>
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-900 mb-2">2. Qwen大模型分类</h3>
                   <p className="text-gray-600">
                     使用阿里云通义千问进行智能分类，提供更准确的任务分类和推理。
                   </p>
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-900 mb-2">3. 本地分类器后备</h3>
                   <p className="text-gray-600">
                     当Qwen API不可用时，自动使用本地关键词匹配分类器作为后备。
                   </p>
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-900 mb-2">4. 实时反馈</h3>
                   <p className="text-gray-600">
                     显示处理进度、分类结果、置信度和AI模型信息。
                   </p>
                 </div>
                 <div>
                   <h3 className="font-medium text-gray-900 mb-2">5. 能力成长</h3>
                   <p className="text-gray-600">
                     根据任务类型自动分配五维能力经验值，支持能力升级和奖励系统。
                   </p>
                 </div>
               </div>
             </div>

            {/* 分类规则 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">分类规则</h2>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="font-medium">知识类：</span>
                  <span className="text-gray-600">学习、阅读、研究、翻译、平台、CRM、系统</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="font-medium">工作类：</span>
                  <span className="text-gray-600">工作、开发、修复、续费、复购、同步、爬虫</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="font-medium">休息类：</span>
                  <span className="text-gray-600">休息、吃饭、洗澡、看视频、睡觉</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span className="font-medium">手工类：</span>
                  <span className="text-gray-600">制作、手工、工具、开发、创建、构建</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="font-medium">社交类：</span>
                  <span className="text-gray-600">会议、沟通、交流、讨论、社交、聊天</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 导入结果展示 */}
        {importedEvents.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">导入结果</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importedEvents.map((event, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">时间：</span>
                        <span>{new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">类型：</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{event.taskType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">能力：</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{event.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">经验：</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">+{event.expGain}</span>
                      </div>
                                             <div className="flex justify-between">
                         <span className="text-gray-500">置信度：</span>
                         <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{(event.confidence * 100).toFixed(0)}%</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-500">AI模型：</span>
                         <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">{event.aiModel || 'Local'}</span>
                       </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {event.reasoning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
