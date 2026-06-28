import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardChartsProps {
  dailySpend: { date: string; amount: number }[];
  categorySpend: { name: string; amount: number }[];
}

export function DashboardCharts({ dailySpend, categorySpend }: DashboardChartsProps) {
  // Format daily spend for the AreaChart
  const formattedDaily = dailySpend.map(d => {
    const day = new Date(d.date).getDate();
    return { day: day.toString(), amount: d.amount };
  });

  const categoryColors = ['var(--ink)', 'var(--ink-60)', 'var(--ink-30)', 'var(--gold)', 'var(--crimson)'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Daily Spend Trend */}
      <div className="lg:col-span-2 bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
        <div className="p-4 border-b-2 border-[var(--ink)]">
          <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
            DAILY EXPENSE TREND
          </h3>
        </div>
        <div className="p-4 h-[300px]">
          {formattedDaily.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedDaily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--crimson)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--crimson)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--ink-60)', fontFamily: 'monospace' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--ink-60)', fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 0, boxShadow: '4px 4px 0 var(--ink)' }}
                  itemStyle={{ color: 'var(--ink)', fontWeight: 'bold', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="amount" stroke="var(--crimson)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-[var(--ink-60)]">
              No daily data available.
            </div>
          )}
        </div>
      </div>

      {/* Category Spend Bar */}
      <div className="lg:col-span-1 bg-[var(--bone)] border-2 border-[var(--ink)] shadow-[4px_4px_0_var(--ink)]">
        <div className="p-4 border-b-2 border-[var(--ink)]">
          <h3 className="font-display text-[13px] font-semibold tracking-[0.12em] uppercase text-[var(--ink)]">
            SPEND BY CATEGORY
          </h3>
        </div>
        <div className="p-4 h-[300px]">
          {categorySpend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fontSize: 11, fill: 'var(--ink)', fontFamily: 'monospace' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(26, 17, 8, 0.04)' }}
                  contentStyle={{ backgroundColor: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 0, boxShadow: '4px 4px 0 var(--ink)' }}
                  itemStyle={{ color: 'var(--ink)', fontWeight: 'bold', fontFamily: 'monospace' }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {categorySpend.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center font-mono text-[var(--ink-60)]">
              No category data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
