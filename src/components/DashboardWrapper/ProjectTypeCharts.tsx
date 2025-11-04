import { Card } from "common/components/Card";
import { useMemo } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ProjectTypeChart: React.FC<{ projects: any[] }> = ({ projects }) => {
    // Derive totals if projects contain a "type"; otherwise fall back to demo values
    const totals = useMemo(() => {
        const base = { New: 400, Rework: 400, Warranty: 200 };
        const counts: Record<string, number> = { New: 0, Rework: 0, Warranty: 0 };
        if (!Array.isArray(projects) || projects.length === 0) return base;
        for (const p of projects as any[]) {
            const t = (p?.type as string) || '';
            if (t && counts[t] !== undefined) counts[t] += 1;
        }
        const sum = Object.values(counts).reduce((s, n) => s + n, 0);
        return sum === 0 ? base : counts;
    }, [projects]);

    const totalProjects = useMemo(
        () => Object.values(totals).reduce((s, n) => s + n, 0) || 1000,
        [totals]
    );

    const percentages = useMemo(() => {
        const t = totalProjects || 1;
        return {
            New: Math.round((totals.New / t) * 100),
            Rework: Math.round((totals.Rework / t) * 100),
            Warranty: Math.round((totals.Warranty / t) * 100),
        };
    }, [totals, totalProjects]);

    const data = useMemo(() => ({
        labels: ['New', 'Rework', 'Warranty'],
        datasets: [
            {
                data: [totals.New, totals.Rework, totals.Warranty],
                backgroundColor: ['#0E73B7', '#60A5FA', '#34D399'],
                hoverOffset: 4,
                borderWidth: 0,
                borderRadius: 12,
                spacing: 8

            },
        ],
    }), [totals]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                bodyColor: '#D1D5DB',
                displayColors: false,
            },
        },
    }), []);

    return (
        <Card className="p-6 h-96 flex flex-col">
            <div className="text-sm font-normal text-[#4B5563] mb-2">
                Total Projects by Type
            </div>
            <h6 className="text-3xl text-[#101827] font-semibold mb-5">{totalProjects}</h6>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left legend */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md inline-block" style={{ backgroundColor: '#0E73B7' }} />
                        <div>
                            <div className="text-lg font-semibold text-gray-900">New</div>
                            <div className="text-sm text-gray-500">{percentages.New}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md inline-block" style={{ backgroundColor: '#60A5FA' }} />
                        <div>
                            <div className="text-lg font-semibold text-gray-900">Rework</div>
                            <div className="text-sm text-gray-500">{percentages.Rework}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-md inline-block" style={{ backgroundColor: '#34D399' }} />
                        <div>
                            <div className="text-lg font-semibold text-gray-900">Warranty</div>
                            <div className="text-sm text-gray-500">{percentages.Warranty}%</div>
                        </div>
                    </div>
                </div>

                {/* Right donut */}
                <div className="relative h-64">
                    <Doughnut data={data} options={options as any} />
                    {/* Radial labels positioned like the mock */}

                </div>
            </div>
        </Card>
    );
};
