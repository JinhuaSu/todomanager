// AI智能分类器 - 使用大模型进行任务分类

interface TaskClassification {
  taskType: string;
  category: string;
  expGain: number;
  confidence: number;
  reasoning: string;
}

// 模拟AI分类函数（实际项目中可以接入OpenAI、Claude等API）
export async function classifyTaskWithAI(title: string): Promise<TaskClassification> {
  // 这里可以接入实际的AI API
  // 目前使用增强的关键词匹配作为模拟
  
  const lowerTitle = title.toLowerCase();
  
  // 增强的关键词映射
  const enhancedMapping = {
    // 知识类 - 学习和认知活动
    knowledge: {
      keywords: ['学习', '阅读', '研究', '分析', '翻译', '平台', 'crm', '系统', '视频翻译'],
      taskType: '学习',
      category: '知识',
      expGain: 15,
      reasoning: '涉及学习和认知提升的活动'
    },
    
    // 工作类 - 专业和技术工作
    work: {
      keywords: ['工作', '开发', '修复', '续费', '复购', '同步', '爬虫', '工具开发', '效率提升'],
      taskType: '工作',
      category: '勇气',
      expGain: 20,
      reasoning: '涉及专业技术和挑战性的工作'
    },
    
    // 休息类 - 放松和恢复
    rest: {
      keywords: ['休息', '吃饭', '洗澡', '看视频', '睡觉'],
      taskType: '休息',
      category: '体贴',
      expGain: 5,
      reasoning: '自我照顾和放松的活动'
    },
    
    // 社交类 - 人际交往
    social: {
      keywords: ['会议', '沟通', '交流', '讨论', '社交', '聊天'],
      taskType: '社交',
      category: '魅力',
      expGain: 12,
      reasoning: '涉及人际交往和沟通的活动'
    },
    
    // 手工类 - 技能和制作
    craft: {
      keywords: ['制作', '手工', '工具', '开发', '创建', '构建'],
      taskType: '手工',
      category: '灵巧',
      expGain: 18,
      reasoning: '涉及技能操作和制作的活动'
    },
    
    // 管理类 - 组织和规划
    management: {
      keywords: ['管理', '规划', '安排', '组织', '协调'],
      taskType: '管理',
      category: '知识',
      expGain: 14,
      reasoning: '涉及组织和规划的活动'
    }
  };

  // 计算匹配度
  let bestMatch = {
    taskType: '其他',
    category: '知识',
    expGain: 10,
    confidence: 0.3,
    reasoning: '未能明确分类的活动'
  };

  for (const [key, config] of Object.entries(enhancedMapping)) {
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
          reasoning: config.reasoning
        };
      }
    }
  }

  // 特殊规则处理
  if (lowerTitle.includes('crm') || lowerTitle.includes('客户关系')) {
    bestMatch = {
      taskType: '工作',
      category: '知识',
      expGain: 18,
      confidence: 0.85,
      reasoning: '客户关系管理涉及知识和技能'
    };
  }

  if (lowerTitle.includes('效率提升') || lowerTitle.includes('工具开发')) {
    bestMatch = {
      taskType: '手工',
      category: '灵巧',
      expGain: 22,
      confidence: 0.9,
      reasoning: '效率工具开发需要技术和创造力'
    };
  }

  return bestMatch;
}

// 批量分类函数
export async function classifyMultipleTasks(titles: string[]): Promise<TaskClassification[]> {
  const classifications = await Promise.all(
    titles.map(title => classifyTaskWithAI(title))
  );
  
  return classifications;
}

// 获取分类建议
export function getClassificationSuggestions(title: string): string[] {
  const suggestions = [];
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('学习') || lowerTitle.includes('研究')) {
    suggestions.push('建议分类为：学习类 - 知识能力');
  }
  
  if (lowerTitle.includes('开发') || lowerTitle.includes('修复')) {
    suggestions.push('建议分类为：工作类 - 勇气能力');
  }
  
  if (lowerTitle.includes('休息') || lowerTitle.includes('吃饭')) {
    suggestions.push('建议分类为：休息类 - 体贴能力');
  }
  
  if (lowerTitle.includes('工具') || lowerTitle.includes('制作')) {
    suggestions.push('建议分类为：手工类 - 灵巧能力');
  }
  
  return suggestions;
}
