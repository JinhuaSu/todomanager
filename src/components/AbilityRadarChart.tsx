'use client';

import { useEffect, useRef } from 'react';

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

interface AbilityRadarChartProps {
  abilities: Ability[];
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

export default function AbilityRadarChart({ 
  abilities, 
  size = 300, 
  showLabels = true, 
  showValues = true 
}: AbilityRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !abilities || abilities.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.35);

    // 清除画布
    ctx.clearRect(0, 0, size, size);

    // 绘制背景网格
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
      const currentRadius = (radius * i) / 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // 绘制从中心到顶点的线
    const angleStep = (2 * Math.PI) / abilities.length;
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;

    for (let i = 0; i < abilities.length; i++) {
      const angle = i * angleStep - Math.PI / 2; // 从顶部开始
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 绘制能力雷达图
    if (abilities && abilities.length > 0) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;

      abilities.forEach((ability, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const normalizedLevel = ability.level / ability.maxLevel;
        const currentRadius = radius * normalizedLevel;
        const x = centerX + currentRadius * Math.cos(angle);
        const y = centerY + currentRadius * Math.sin(angle);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 绘制能力点
      abilities.forEach((ability, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const normalizedLevel = ability.level / ability.maxLevel;
        const currentRadius = radius * normalizedLevel;
        const x = centerX + currentRadius * Math.cos(angle);
        const y = centerY + currentRadius * Math.sin(angle);

        // 绘制能力点
        ctx.fillStyle = ability.color || '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // 绘制白色边框
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制标签
        if (showLabels) {
          const labelRadius = radius + 20;
          const labelX = centerX + labelRadius * Math.cos(angle);
          const labelY = centerY + labelRadius * Math.sin(angle);

          ctx.fillStyle = '#374151';
          ctx.font = '14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(ability.displayName, labelX, labelY);
        }

        // 绘制数值
        if (showValues) {
          const valueRadius = radius * 0.8;
          const valueX = centerX + valueRadius * Math.cos(angle);
          const valueY = centerY + valueRadius * Math.sin(angle);

          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(ability.level.toString(), valueX, valueY);
        }
      });
    }
  }, [abilities, size, showLabels, showValues]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg bg-white"
        style={{ width: size, height: size }}
      />
      
      {/* 能力说明 */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-md">
        {abilities?.map((ability) => (
          <div
            key={ability.id}
            className="flex flex-col items-center p-2 rounded-lg bg-gray-50"
          >
            <div 
              className="w-3 h-3 rounded-full mb-1"
              style={{ backgroundColor: ability.color }}
            ></div>
            <span className="text-xs text-gray-600 text-center">
              {ability.displayName}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Lv.{ability.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
