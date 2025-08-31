'use client';

import { useState, useEffect } from 'react';
import AbilityRadarChart from '@/components/AbilityRadarChart';
import AbilityUpgradeModal from '@/components/AbilityUpgradeModal';
import RewardSystem from '@/components/RewardSystem';

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

export default function DemoPage() {
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAbilityUpgrade, setShowAbilityUpgrade] = useState(false);
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

  // 模拟数据
  const mockAbilities: Ability[] = [
    {
      id: '1',
      name: 'knowledge',
      displayName: '知识',
      description: '通过学习和阅读提升的知识水平',
      currentExp: 150,
      level: 3,
      maxLevel: 10,
      icon: '📚',
      color: '#3b82f6'
    },
    {
      id: '2',
      name: 'charm',
      displayName: '魅力',
      description: '社交能力和个人魅力的体现',
      currentExp: 80,
      level: 2,
      maxLevel: 10,
      icon: '💫',
      color: '#ec4899'
    },
    {
      id: '3',
      name: 'courage',
      displayName: '勇气',
      description: '面对挑战时的勇气和决心',
      currentExp: 200,
      level: 4,
      maxLevel: 10,
      icon: '⚔️',
      color: '#ef4444'
    },
    {
      id: '4',
      name: 'kindness',
      displayName: '体贴',
      description: '关心他人和帮助他人的能力',
      currentExp: 120,
      level: 3,
      maxLevel: 10,
      icon: '🤝',
      color: '#10b981'
    },
    {
      id: '5',
      name: 'dexterity',
      displayName: '灵巧',
      description: '手工艺和技能操作的熟练度',
      currentExp: 60,
      level: 2,
      maxLevel: 10,
      icon: '🔧',
      color: '#f59e0b'
    }
  ];

  const mockRewards: Reward[] = [
    {
      id: '1',
      name: '经验加成',
      description: '完成任务时获得额外经验值',
      type: 'EXP_BOOST',
      value: 20,
      isUnlocked: true,
      unlockCondition: '完成第一个任务'
    },
    {
      id: '2',
      name: '分数加成',
      description: '任务评分获得额外加成',
      type: 'SCORE_BOOST',
      value: 15,
      isUnlocked: false,
      unlockCondition: '知识等级达到3级'
    },
    {
      id: '3',
      name: '时间加成',
      description: '专注时间获得额外奖励',
      type: 'TIME_BOOST',
      value: 10,
      isUnlocked: false,
      unlockCondition: '连续完成7天任务'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: '初出茅庐',
      description: '完成第一个任务',
      isUnlocked: true,
      unlockCondition: '完成1个任务'
    },
    {
      id: '2',
      name: '坚持不懈',
      description: '连续完成7天任务',
      isUnlocked: false,
      unlockCondition: '连续完成7天任务'
    },
    {
      id: '3',
      name: '知识达人',
      description: '知识等级达到5级',
      isUnlocked: false,
      unlockCondition: '知识等级达到5级'
    }
  ];

  useEffect(() => {
    setAbilities(mockAbilities);
    setRewards(mockRewards);
    setAchievements(mockAchievements);
  }, []);

  const handleTestUpgrade = () => {
    setUpgradeData({
      ability: mockAbilities[0], // 知识能力
      oldLevel: 3,
      newLevel: 4,
      expGained: 50
    });
    setShowAbilityUpgrade(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            P5R风格能力成长系统演示
          </h1>
          <p className="text-lg text-gray-600">
            体验类似Persona 5 Royal的五维雷达图能力成长系统
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 能力雷达图 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">能力雷达图</h2>
              <AbilityRadarChart abilities={abilities} size={300} />
            </div>
          </div>

          {/* 奖励系统 */}
          <div className="lg:col-span-1">
            <RewardSystem rewards={rewards} achievements={achievements} />
          </div>

          {/* 演示控制 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">演示控制</h2>
              <div className="space-y-4">
                <button
                  onClick={handleTestUpgrade}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  测试能力升级动画
                </button>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">当前能力状态</h3>
                  <div className="space-y-2">
                    {abilities.map((ability) => (
                      <div key={ability.id} className="flex justify-between items-center">
                        <span className="text-sm">{ability.displayName}</span>
                        <span className="text-sm font-semibold">
                          Lv.{ability.level} ({ability.currentExp}/100)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 系统说明 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">系统说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">能力系统</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 五维能力：知识、魅力、勇气、体贴、灵巧</li>
                <li>• 完成任务获得对应能力经验值</li>
                <li>• 每100经验值提升1级</li>
                <li>• 最高等级为10级</li>
                <li>• 雷达图实时显示能力成长</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">奖励系统</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 完成特定条件解锁奖励</li>
                <li>• 奖励类型：经验加成、分数加成、时间加成</li>
                <li>• 成就系统记录重要里程碑</li>
                <li>• 能力升级时显示庆祝动画</li>
                <li>• 类似P5R的成长反馈机制</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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