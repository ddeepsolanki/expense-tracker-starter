import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const BAR_COLOR = '#2a78d6';
const TEXT_SECONDARY = '#52514e';
const GRID_COLOR = '#e8e8e6';

const formatCurrency = (value) => `$${value.toLocaleString()}`;

function SpendingChart({ transactions }) {
  const totals = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const data = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="spending-chart">
      <h2>Spending by Category</h2>
      {data.length === 0 ? (
        <p className="empty-chart">No expenses yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke={GRID_COLOR} />
            <XAxis
              dataKey="category"
              tick={{ fill: TEXT_SECONDARY, fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: TEXT_SECONDARY, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
              formatter={(value) => [formatCurrency(value), 'Spent']}
            />
            <Bar dataKey="amount" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SpendingChart
