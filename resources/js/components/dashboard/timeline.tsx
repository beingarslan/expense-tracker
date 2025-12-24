import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Target } from 'lucide-react';

interface TimelineEvent {
    id: number;
    type: 'transaction' | 'goal';
    subtype?: string;
    title: string;
    amount: number;
    currency: string;
    date: string;
    category?: {
        name: string;
        color: string;
    };
    progress?: number;
}

interface TimelineProps {
    events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 left-6 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent dark:from-blue-400 dark:via-purple-400" />

            {/* Timeline events */}
            <div className="space-y-6">
                {events.map((event) => (
                    <div
                        key={`${event.type}-${event.id}`}
                        className="relative flex gap-4"
                    >
                        {/* Timeline dot */}
                        <div
                            className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-4 border-white shadow-md dark:border-neutral-900 ${
                                event.type === 'goal'
                                    ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                                    : event.subtype === 'income'
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                      : 'bg-gradient-to-br from-red-500 to-rose-500'
                            }`}
                        >
                            {event.type === 'goal' ? (
                                <Target className="h-5 w-5 text-white" />
                            ) : event.subtype === 'income' ? (
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            ) : (
                                <ArrowDownRight className="h-5 w-5 text-white" />
                            )}
                        </div>

                        {/* Event content */}
                        <div className="min-w-0 flex-1 rounded-xl border border-sidebar-border/70 bg-white p-4 shadow-sm dark:border-sidebar-border dark:bg-neutral-900">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="truncate font-semibold">
                                            {event.title}
                                        </h4>
                                        {event.category && (
                                            <span className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            event.category
                                                                .color,
                                                    }}
                                                />
                                                {event.category.name}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        {formatDate(event.date)}
                                    </p>
                                    {event.type === 'goal' &&
                                        event.progress !== undefined && (
                                            <div className="mt-2">
                                                <div className="mb-1 flex items-center justify-between text-xs">
                                                    <span className="text-neutral-600 dark:text-neutral-400">
                                                        Progress
                                                    </span>
                                                    <span className="font-medium">
                                                        {event.progress.toFixed(
                                                            1,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                        style={{
                                                            width: `${Math.min(event.progress, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className="flex-shrink-0 text-right">
                                    <p
                                        className={`text-lg font-bold ${
                                            event.type === 'goal'
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : event.subtype === 'income'
                                                  ? 'text-green-600 dark:text-green-400'
                                                  : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {event.subtype === 'income' ? '+' : ''}
                                        {formatCurrency(
                                            event.amount,
                                            event.currency,
                                        )}
                                    </p>
                                    {event.type === 'goal' && (
                                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                                            Target
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
