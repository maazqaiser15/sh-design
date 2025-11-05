import { Card } from "common/components/Card";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const TotalTrailersChart: React.FC<{ projects: any[] }> = ({ projects }) => {
    // Demo counts; replace with real trailer data when available
    const availableCount = 8;
    const unavailableCount = 6;
    const total = availableCount + unavailableCount;
    const pct = (n: number) => Math.round((n / (total || 1)) * 100);

    const data = {
        labels: ['Available', 'Unavailable'],
        datasets: [
            {
                data: [availableCount, unavailableCount],
                backgroundColor: ['#60A5FA', '#0E73B7'],
                borderWidth: 0,
                hoverOffset: 2,
                borderRadius: 4, // rounded ends
                spacing: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                bodyColor: '#D1D5DB',
                displayColors: false,
                callbacks: {
                    label: (ctx: any) => `${ctx.label}: ${ctx.raw}`,
                },
            },
        },
        cutout: '82%',
        rotation: -90, // start at top
        circumference: 180, // half donut
        animation: { animateRotate: true },
    } as const;

    return (
        <Card className="p-6 h-96 flex flex-col">
            <div className="text-sm font-normal text-[#4B5563] mb-2">
                Total Trailers
            </div>
            <h6 className="text-lg text-[#101827] font-semibold mb-5">{total}</h6>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-xl">
                    <Doughnut data={data} options={options as any} />
                </div>
                <div className="mt-6 flex items-start justify-center gap-16">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-md inline-block" style={{ backgroundColor: '#60A5FA' }} />
                            <span className="text-lg font-semibold text-gray-900">Available</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{pct(availableCount)}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-md inline-block" style={{ backgroundColor: '#0E73B7' }} />
                            <span className="text-lg font-semibold text-gray-900">Unavailable</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{pct(unavailableCount)}%</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
