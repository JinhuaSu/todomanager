'use client';

import { useState, useEffect } from 'react';

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

interface AbilityUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgradedAbility: Ability | null;
  oldLevel: number;
  newLevel: number;
  expGained: number;
}

export default function AbilityUpgradeModal({
  isOpen,
  onClose,
  upgradedAbility,
  oldLevel,
  newLevel,
  expGained
}: AbilityUpgradeModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (isOpen && upgradedAbility) {
      setShowAnimation(true);
      setTimeout(() => {
        setShowReward(true);
      }, 1000);
    } else {
      setShowAnimation(false);
      setShowReward(false);
    }
  }, [isOpen, upgradedAbility]);

  if (!isOpen || !upgradedAbility) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        
        {/* 升级动画 */}
        {showAnimation && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping w-32 h-32 bg-blue-400 rounded-full opacity-20"></div>
            <div className="absolute animate-pulse w-24 h-24 bg-blue-500 rounded-full opacity-40"></div>
            <div className="absolute w-16 h-16 bg-blue-600 rounded-full opacity-60"></div>
          </div>
        )}

        <div className="relative z-10">
          {/* 能力图标 */}
          <div className="mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
              style={{ backgroundColor: upgradedAbility.color }}
            >
              {upgradedAbility.icon || upgradedAbility.displayName.charAt(0)}
            </div>
          </div>

          {/* 升级标题 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            能力提升！
          </h2>

          {/* 能力名称 */}
          <h3 className="text-xl font-semibold mb-4" style={{ color: upgradedAbility.color }}>
            {upgradedAbility.displayName}
          </h3>

          {/* 等级变化 */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-3xl font-bold text-gray-400">Lv.{oldLevel}</span>
              <div className="text-2xl text-gray-400">→</div>
              <span className="text-3xl font-bold" style={{ color: upgradedAbility.color }}>
                Lv.{newLevel}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              获得 {expGained} 点经验值
            </p>
          </div>

          {/* 能力描述 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              {upgradedAbility.description}
            </p>
          </div>

          {/* 奖励信息 */}
          {showReward && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-yellow-600">🎉</span>
                <span className="font-semibold text-yellow-800">获得奖励</span>
                <span className="text-yellow-600">🎉</span>
              </div>
              <p className="text-sm text-yellow-700">
                恭喜！你的{upgradedAbility.displayName}能力提升了！
              </p>
            </div>
          )}

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            继续
          </button>
        </div>
      </div>
    </div>
  );
}
