'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface PieChartProps {
  title?: string;
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const COLORS = ['#2563eb', '#64748b', '#22c55e', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899'];

const PieChart = ({
  title,
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = '80%',
}: PieChartProps) => {
  return (
    <Card variant="bordered">
      {title && (
        <CardHeader>
          <h2 className="text-lg font-semibold text-secondary-900">{title}</h2>
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number, name: string) => [`${value} ${name}`, '']}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry) => `${value}: ${entry.payload.value}`}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

PieChart.displayName = 'PieChart';

export { PieChart };
