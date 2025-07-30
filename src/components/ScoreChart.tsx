'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

interface ScoreData {
  date: string;
  totalScore: number;
  taskCount: number;
  level: number;
}

interface ScoreChartProps {
  data: ScoreData[];
  type?: 'line' | 'bar';
}

export default function ScoreChart({ data, type = 'line' }: ScoreChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MM-dd'),
    score: item.totalScore,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`日期: ${label}`}</p>
          <p className="text-blue-600">{`总分: ${payload[0].value.toFixed(1)}`}</p>
          <p className="text-green-600">{`任务数: ${payload[0].payload.taskCount}`}</p>
          <p className="text-purple-600">{`等级: ${payload[0].payload.level}`}</p>
        </div>
      );
    }
    return null;
  };

  if (type === 'bar') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">每日评分统计</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">评分趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 