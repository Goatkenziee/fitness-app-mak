'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartProps {
  data: any[]
  type?: 'line' | 'bar'
  dataKey: string
  name: string
  color?: string
}

export default function Chart({
  data,
  type = 'line',
  dataKey,
  name,
  color = '#10b981',
}: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === 'bar' ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} />
          <Legend />
          <Bar dataKey={dataKey} fill={color} name={name} />
        </BarChart>
      ) : (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            name={name}
            dot={{ fill: color }}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}
