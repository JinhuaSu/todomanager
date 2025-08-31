// Qwen大模型智能分类器

interface TaskClassification {
  taskType: string;
  category: string;
  expGain: number;
  confidence: number;
  reasoning: string;
}

interface QwenResponse {
  taskType: string;
  category: string;
  expGain: number;
  confidence: number;
  reasoning: string;
}

// DashScope API配置
const DASHSCOPE_CONFIG = {
  // 这里需要配置你的DashScope API密钥和端点
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  endpoint: process.env.DASHSCOPE_ENDPOINT || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  model: 'qwen-turbo' // 或其他可用的模型
};

// 构建Qwen提示词
function buildPrompt(title: string): string {
  return `请分析以下任务标题，并按照P5R风格的五维能力系统进行分类。

任务标题：${title}

请从以下分类中选择最合适的：
1. 知识类 - 学习、阅读、研究、分析、翻译等活动
2. 魅力类 - 社交、沟通、交流、讨论等活动  
3. 勇气类 - 工作、开发、修复、挑战性任务等
4. 体贴类 - 休息、照顾、帮助他人等活动
5. 灵巧类 - 手工、制作、工具开发、技能操作等

请以JSON格式返回结果，包含以下字段：
- taskType: 任务类型（学习、工作、休息、社交、手工、管理、其他）
- category: 对应能力（知识、魅力、勇气、体贴、灵巧）
- expGain: 经验值（5-25之间）
- confidence: 置信度（0.1-1.0之间）
- reasoning: 分类理由（中文）

示例输出：
{
  "taskType": "工作",
  "category": "勇气", 
  "expGain": 20,
  "confidence": 0.85,
  "reasoning": "这是一个技术开发任务，需要面对挑战和解决问题"
}`;
}

// 调用DashScope API
async function callDashScopeAPI(prompt: string): Promise<QwenResponse | null> {
  try {
    if (!DASHSCOPE_CONFIG.apiKey) {
      console.warn('DashScope API密钥未配置，使用本地分类器');
      return null;
    }

    const response = await fetch(DASHSCOPE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'enable'
      },
      body: JSON.stringify({
        model: DASHSCOPE_CONFIG.model,
        input: {
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        parameters: {
          temperature: 0.3,
          max_tokens: 500,
          top_p: 0.8
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qwen API错误响应:', errorText);
      throw new Error(`Qwen API请求失败: ${response.status} - ${errorText}`);
    }

    // 先读取原始响应内容
    const responseText = await response.text();
    console.log('Qwen API原始响应:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Qwen API响应不是有效JSON:', parseError);
      console.log('原始响应内容:', responseText);
      return null;
    }

    const content = data.output?.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('Qwen API响应结构:', {
        hasOutput: !!data.output,
        hasChoices: !!data.output?.choices,
        choicesLength: data.output?.choices?.length,
        hasMessage: !!data.output?.choices?.[0]?.message,
        hasContent: !!data.output?.choices?.[0]?.message?.content
      });
      throw new Error('Qwen API返回内容为空');
    }

    // 解析JSON响应
    try {
      const result = JSON.parse(content);
      return {
        taskType: result.taskType || '其他',
        category: result.category || '知识',
        expGain: parseInt(result.expGain) || 10,
        confidence: parseFloat(result.confidence) || 0.5,
        reasoning: result.reasoning || 'AI分类结果'
      };
    } catch (parseError) {
      console.error('解析Qwen响应失败:', parseError);
      return null;
    }

  } catch (error) {
    console.error('调用Qwen API失败:', error);
    return null;
  }
}

// 混合分类器 - 结合DashScope和本地规则
export async function classifyTaskWithQwen(title: string): Promise<TaskClassification> {
  // 首先尝试使用DashScope API
  const qwenResult = await callDashScopeAPI(buildPrompt(title));
  
  if (qwenResult) {
    return {
      taskType: qwenResult.taskType,
      category: qwenResult.category,
      expGain: qwenResult.expGain,
      confidence: qwenResult.confidence,
      reasoning: qwenResult.reasoning
    };
  }

  // 如果Qwen API不可用，使用本地分类器作为后备
  return await fallbackLocalClassifier(title);
}

// 本地分类器作为后备
async function fallbackLocalClassifier(title: string): Promise<TaskClassification> {
  const lowerTitle = title.toLowerCase();
  
  // 增强的关键词映射
  const enhancedMapping = {
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

  return bestMatch;
}

// 批量分类函数
export async function classifyMultipleTasksWithQwen(titles: string[]): Promise<TaskClassification[]> {
  const classifications = await Promise.all(
    titles.map(title => classifyTaskWithQwen(title))
  );
  
  return classifications;
}

// 获取分类建议（使用Qwen）
export async function getQwenClassificationSuggestions(title: string): Promise<string[]> {
  const prompt = `请为以下任务标题提供分类建议：

任务标题：${title}

请提供2-3个可能的分类选项，并说明理由。格式：
1. 建议分类：XXX - 理由：XXX
2. 建议分类：XXX - 理由：XXX

请用中文回答。`;

  try {
    const response = await callDashScopeAPI(prompt);
    if (response && response.reasoning) {
      return response.reasoning.split('\n').filter((line: string) => line.trim());
    }
  } catch (error) {
    console.error('获取Qwen建议失败:', error);
  }

  return ['建议使用本地分类器进行手动分类'];
}
