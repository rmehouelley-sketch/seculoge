'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface BarChartProps {
  title?: string;
  data: any[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  height?: number;
}

const BarChart = ({
  title,
  data,
  xKey,
  yKeys,
  colors = ['#2563eb', '#64748b', '#22c55e', '#f59e0b'],
  height = 300,
}: BarChartProps) => {
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
            <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={xKey}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Intl.NumberFormat('fr-FR').format(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                formatter={(value: number) => new Intl.NumberFormat('fr-FR').format(value)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {yKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

BarChart.displayName = 'BarChart';

export { BarChart };
