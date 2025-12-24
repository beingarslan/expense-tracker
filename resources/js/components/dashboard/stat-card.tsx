import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive?: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
    valueClassName?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    trend,
    icon,
    className,
    valueClassName,
}: StatCardProps) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-neutral-900 dark:to-neutral-900/80',
                className,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {title}
                    </p>
                    <p
                        className={cn(
                            'mt-2 text-3xl font-bold',
                            valueClassName,
                        )}
                    >
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className="mt-3 flex items-center gap-1">
                            {trend.value !== 0 && (
                                <>
                                    {trend.isPositive !== undefined ? (
                                        trend.isPositive ? (
                                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        )
                                    ) : trend.value > 0 ? (
                                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    )}
                                </>
                            )}
                            <span
                                className={cn(
                                    'text-sm font-medium',
                                    trend.value === 0
                                        ? 'text-neutral-600 dark:text-neutral-400'
                                        : trend.isPositive !== undefined
                                          ? trend.isPositive
                                              ? 'text-green-600 dark:text-green-400'
                                              : 'text-red-600 dark:text-red-400'
                                          : trend.value > 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400',
                                )}
                            >
                                {trend.value > 0 ? '+' : ''}
                                {Math.abs(trend.value).toFixed(1)}%
                            </span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
