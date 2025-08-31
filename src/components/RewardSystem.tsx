'use client';

import { useState, useEffect } from 'react';

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

interface RewardSystemProps {
  rewards: Reward[];
  achievements: Achievement[];
}

export default function RewardSystem({ rewards, achievements }: RewardSystemProps) {
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements'>('rewards');

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'EXP_BOOST':
        return '⚡';
      case 'SCORE_BOOST':
        return '⭐';
      case 'TIME_BOOST':
        return '⏰';
      case 'SPECIAL_ITEM':
        return '🎁';
      default:
        return '🏆';
    }
  };

  const getRewardColor = (type: string) => {
    switch (type) {
      case 'EXP_BOOST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SCORE_BOOST':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'TIME_BOOST':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SPECIAL_ITEM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unlockedRewards = rewards.filter(reward => reward.isUnlocked);
  const lockedRewards = rewards.filter(reward => !reward.isUnlocked);
  const unlockedAchievements = achievements.filter(achievement => achievement.isUnlocked);
  const lockedAchievements = achievements.filter(achievement => !achievement.isUnlocked);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">奖励与成就</h2>
      
      {/* 标签页 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'rewards'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          奖励 ({unlockedRewards.length}/{rewards.length})
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'achievements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          成就 ({unlockedAchievements.length}/{achievements.length})
        </button>
      </div>

      {/* 奖励标签页 */}
      {activeTab === 'rewards' && (
        <div>
          {/* 已解锁的奖励 */}
          {unlockedRewards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-900 mb-3">已解锁</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className={`p-4 rounded-lg border-2 ${getRewardColor(reward.type)}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getRewardIcon(reward.type)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{reward.name}</h4>
                        <p className="text-sm opacity-80">{reward.description}</p>
                        <p className="text-xs mt-1">+{reward.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 未解锁的奖励 */}
          {lockedRewards.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">未解锁</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedRewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl text-gray-400">🔒</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-600">{reward.name}</h4>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                        {reward.unlockCondition && (
                          <p className="text-xs mt-1 text-gray-400">
                            解锁条件: {reward.unlockCondition}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 成就标签页 */}
      {activeTab === 'achievements' && (
        <div>
          {/* 已解锁的成就 */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-900 mb-3">已获得</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏆</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800">{achievement.name}</h4>
                        <p className="text-sm text-yellow-700">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 未解锁的成就 */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-3">未获得</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl text-gray-400">🔒</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-600">{achievement.name}</h4>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        {achievement.unlockCondition && (
                          <p className="text-xs mt-1 text-gray-400">
                            解锁条件: {achievement.unlockCondition}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
