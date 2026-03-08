// src/components/admin/BookingStatusChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const BookingStatusChart = ({ data }) => {
  const chartData = [
    { name: 'Completed', value: data.completed || 0, color: '#10B981' },
    { name: 'In Progress', value: data.inProgress || 0, color: '#3B82F6' },
    { name: 'Pending', value: data.pending || 0, color: '#F59E0B' },
    { name: 'Approved', value: data.approved || 0, color: '#8B5CF6' },
    { name: 'Cancelled', value: data.cancelled || 0, color: '#EF4444' },
    { name: 'Rejected', value: data.rejected || 0, color: '#6B7280' }
  ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-white/10">
          <p className="text-white text-sm">{payload[0].name}</p>
          <p className="text-gray-400 text-xs">
            {payload[0].value} bookings ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">No booking data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BookingStatusChart;