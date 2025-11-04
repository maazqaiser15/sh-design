import { Card } from "common/components/Card";

export const TotalUsersChart: React.FC<{ projects: any[] }> = ({ projects }) => {
    // Demo data to match the mock. Replace with real counts when available
    const total = 1400;
    const assignedPct = 60;
    const availablePct = 20;
    const timeOffPct = 20;

    const rows = [
        { label: 'Assigned', percent: assignedPct, color: '#60A5FA' },
        { label: 'Available', percent: availablePct, color: '#0E73B7' },
        { label: 'Time- off', percent: timeOffPct, color: '#34D399' },
    ];

    return (
        <Card className="p-6 h-96 flex flex-col">
            <div className="text-sm font-normal text-[#4B5563] mb-2">
                Total Users
            </div>
            <h6 className="text-3xl text-[#101827] font-semibold mb-5">{total}</h6>
            <div className="flex-1 flex flex-col justify-center">
                <div className="border-l border-gray-200 pl-6 space-y-8">
                    {rows.map((r) => (
                        <div key={r.label} className="grid grid-cols-[120px_1fr_60px] items-center gap-4">
                            <div className="text-base text-gray-700">{r.label}</div>
                            <div className="h-5 rounded-full bg-gray-200/70 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${r.percent}%`, backgroundColor: r.color }}
                                />
                            </div>
                            <div className="text-base text-gray-700 text-right">{r.percent}%</div>
                        </div>
                    ))}
                    <div className="pt-6 border-t border-gray-200" />
                </div>
            </div>
        </Card>
    );
};
