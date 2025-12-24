import { cn, formatCurrency } from '@/lib/utils';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export function ChartCard({
    title,
    subtitle,
    children,
    className,
}: ChartCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-neutral-900',
                className,
            )}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                {subtitle && (
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}

interface TrendAreaChartProps {
    data: Array<{
        month: string;
        income: number;
        expense: number;
        balance: number;
    }>;
    userCurrency: string;
}

export function TrendAreaChart({ data, userCurrency }: TrendAreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient
                        id="incomeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient
                        id="expenseGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    className="text-neutral-600 dark:text-neutral-400"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    className="text-neutral-600 dark:text-neutral-400"
                />
                <Tooltip
                    formatter={(value: number) =>
                        formatCurrency(value, userCurrency)
                    }
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#incomeGradient)"
                    name="Income"
                />
                <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#expenseGradient)"
                    name="Expenses"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

interface BalanceLineChartProps {
    data: Array<{
        month: string;
        balance: number;
    }>;
    userCurrency: string;
}

export function BalanceLineChart({
    data,
    userCurrency,
}: BalanceLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    className="text-neutral-600 dark:text-neutral-400"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="currentColor"
                    className="text-neutral-600 dark:text-neutral-400"
                />
                <Tooltip
                    formatter={(value: number) =>
                        formatCurrency(value, userCurrency)
                    }
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#3b82f6' }}
                    activeDot={{ r: 7 }}
                    name="Balance"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

interface GoalProgressChartProps {
    goals: Array<{
        id: number;
        title: string;
        progress_percentage: number;
    }>;
}

export function GoalProgressChart({ goals }: GoalProgressChartProps) {
    const chartData = goals.map((goal) => ({
        name:
            goal.title.length > 20
                ? goal.title.substring(0, 20) + '...'
                : goal.title,
        value: goal.progress_percentage,
        fill:
            goal.progress_percentage >= 75
                ? '#22c55e'
                : goal.progress_percentage >= 50
                  ? '#3b82f6'
                  : '#f59e0b',
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                barSize={15}
                data={chartData}
            >
                <RadialBar
                    minAngle={15}
                    label={{
                        position: 'insideStart',
                        fill: '#fff',
                        fontSize: 12,
                    }}
                    background
                    clockWise
                    dataKey="value"
                />
                <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '12px' }}
                />
                <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
            </RadialBarChart>
        </ResponsiveContainer>
    );
}

interface CategoryPieChartProps {
    data: Array<{
        category_id: number;
        total: number;
        category: {
            id: number;
            name: string;
            color: string;
        };
    }>;
    userCurrency: string;
}

export function CategoryPieChart({
    data,
    userCurrency,
}: CategoryPieChartProps) {
    const chartData = data.map((item) => ({
        name: item.category.name,
        value: parseFloat(item.total.toString()),
        color: item.category.color,
    }));

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                    }) => {
                        const radius =
                            innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x =
                            cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                        const y =
                            cy + radius * Math.sin((-midAngle * Math.PI) / 180);

                        return (
                            <text
                                x={x}
                                y={y}
                                fill="white"
                                textAnchor={x > cx ? 'start' : 'end'}
                                dominantBaseline="central"
                                fontSize={12}
                                fontWeight="bold"
                            >
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        );
                    }}
                    outerRadius={110}
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number) =>
                        formatCurrency(value, userCurrency)
                    }
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
                <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: '12px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
