'use client'
import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface RadarChartProps {
  data: { subject: string; value: number; fullMark: number }[]
}

export function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#DDE0D8" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#6B7069', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
        />
        <Radar
          name="You"
          dataKey="value"
          stroke="#546342"
          fill="#546342"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
