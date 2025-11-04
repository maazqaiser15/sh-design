import { Card } from "common/components/Card";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';


export const ProjectStatusChart: React.FC<{ projects: any[] }> = ({ projects }) => {
    const orderedStatuses = ['D75', 'PV90', 'UB', 'WIP', 'QF', 'QC', 'Completed'];
    const countsByStatus = useMemo(() => {
        const counts = projects.reduce((acc: Record<string, number>, p: any) => {
            const key = p?.status || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        // demo fallback to give visible bars when no data
        if (!projects || projects.length === 0) {
            return { D75: 90, PV90: 40, UB: 92, WIP: 42, QF: 60, QC: 60, Completed: 60 } as Record<string, number>;
        }
        return counts;
    }, [projects]);

    const totalProjects = useMemo(
        () => orderedStatuses.reduce((sum, s) => sum + (countsByStatus[s] || 0), 0) || 1200,
        [countsByStatus]
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                display: false
            },
            tooltip: {
                backgroundColor: "#111827", // gray-900
                titleColor: "#fff",
                bodyColor: "#D1D5DB", // gray-300
                displayColors: false,
                padding: 10,
                callbacks: {
                    label: (ctx: any) => `${ctx.parsed.y} projects`,
                },
            },
            title: {
                display: false,
                text: 'Project Status Chart',
            },
        },
        scales: {
            x: {
              grid: {
                display: false,    // hide grid lines
                drawBorder: true, // keep x-axis baseline
                drawTicks: false,
                color: "transparent",
              },
              border: {
                display: true,
              },
              ticks: {
                color: "#6B7280",
                font: { size: 12, weight: 500 },
              },
            },
            y: {
              grid: {
                display: false,
                drawBorder: true, // show y-axis baseline
                drawTicks: true,
              },
              border: {
                display: true,
              },
              ticks: {
                display: true,
                color: '#6B7280',
              },
            },
        },
    };

    const labels = orderedStatuses;

    const data = {
        labels,
        datasets: [
            {
                label: 'Projects',
                data: labels.map((s) => countsByStatus[s] || 0),
                backgroundColor: labels.map((s) => (s === 'QC' ? '#FF891E' : '#60A5FA')),
                borderRadius: 10,
                barThickness: 32,
            },
        ],
    };

    return (
        <Card className="p-6 h-96 flex flex-col">
            <div className="text-sm font-normal text-[#4B5563] mb-2">
                Total Projects by Status
            </div>
            <h6 className="text-3xl text-[#101827] font-semibold mb-5">{totalProjects}</h6>
            <div className="relative flex-1 overflow-y-auto">
                <Bar options={options as any} data={data} />
                {/* Overlay avatars to match mock */}
            
            </div>
        </Card>
    );
};
