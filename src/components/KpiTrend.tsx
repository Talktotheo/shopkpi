import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function KpiTrend({ data }: { data: { d: string; amount: number }[] }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="font-semibold mb-2">Trend</div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="d" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
