import { useSyncExternalStore } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCategory, formatCurrency } from './format';

// Mirrors the tokens in index.css (SVG attributes can't read CSS variables reliably).
const BAR_COLOR = '#2B5A60';
const INK_MUTED = '#56666C';
const RULE = '#D3DDD8';

const formatAxis = (value) => `$${value.toLocaleString()}`;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const narrowQuery = window.matchMedia('(max-width: 560px)');
const subscribeNarrow = (onChange) => {
  narrowQuery.addEventListener('change', onChange);
  return () => narrowQuery.removeEventListener('change', onChange);
};
const getNarrow = () => narrowQuery.matches;

function SpendingChart({ transactions }) {
  // On phones the category names don't fit side by side, so angle them.
  const isNarrow = useSyncExternalStore(subscribeNarrow, getNarrow);

  const totals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(totals)
    .map(([category, amount]) => ({ category: formatCategory(category), amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <section className="spending" aria-labelledby="spending-heading">
      <h2 id="spending-heading">Spending by category</h2>
      {data.length === 0 ? (
        <p className="empty-note">Expenses you add will show up here by category.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke={RULE} />
            <XAxis
              dataKey="category"
              tick={{ fill: INK_MUTED, fontSize: isNarrow ? 12 : 13 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={isNarrow ? -35 : 0}
              textAnchor={isNarrow ? 'end' : 'middle'}
              height={isNarrow ? 64 : 30}
            />
            <YAxis
              tickFormatter={formatAxis}
              tick={{ fill: INK_MUTED, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              cursor={{ fill: 'rgba(14, 107, 94, 0.06)' }}
              formatter={(value) => [formatCurrency(value), 'Spent']}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${RULE}`,
                boxShadow: 'none',
                fontSize: 13,
              }}
            />
            <Bar
              dataKey="amount"
              fill={BAR_COLOR}
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
              isAnimationActive={!prefersReducedMotion}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default SpendingChart
