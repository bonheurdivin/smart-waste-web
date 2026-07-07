'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import StatCard from '@/components/StatCard';

export default function ReportsPage() {
    const [dashboard, setDashboard] = useState(null);
    const [dailyPickups, setDailyPickups] = useState([]);
    const [workerProductivity, setWorkerProductivity] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const base = 'https://smart-waste-collector.up.railway.app/api/v1/reports';

            const [dashRes, dailyRes, workerRes, zoneRes] = await Promise.all([
                fetch(`${base}/dashboard`, { headers }),
                fetch(`${base}/daily-pickups`, { headers }),
                fetch(`${base}/worker-productivity`, { headers }),
                fetch(`${base}/high-volume-zones`, { headers }),
            ]);

            const [dashData, dailyData, workerData, zoneData] = await Promise.all([
                dashRes.json(),
                dailyRes.json(),
                workerRes.json(),
                zoneRes.json(),
            ]);

            if (dashData.status === 'success') setDashboard(dashData.data);
            if (dailyData.status === 'success') setDailyPickups(dailyData.data);
            if (workerData.status === 'success') setWorkerProductivity(workerData.data);
            if (zoneData.status === 'success') setZones(zoneData.data);

        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <TopBar title="Reports & Export" />
                <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>Loading...</div>
            </>
        );
    }

    return (
        <>
            <TopBar title="Reports & Export" />
            <div style={{ padding: '32px' }}>

                {/* Stats Row */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '32px',
                }}>
                    <StatCard
                        title="Total Households"
                        value={dashboard?.total_households ?? 0}
                        icon="game-icons:house"
                    />
                    <StatCard
                        title="Active Workers"
                        value={dashboard?.active_workers ?? 0}
                        icon="healthicons:city-worker"
                    />
                    <StatCard
                        title="Pickups Today"
                        value={dashboard?.pickups_today ?? 0}
                        icon="fluent:vehicle-truck-24-filled"
                    />
                    <StatCard
                        title="Revenue This Month"
                        value={`RWF ${Number(dashboard?.revenue_this_month ?? 0).toLocaleString()}`}
                        icon="fluent:payment-20-filled"
                    />
                </div>

                {/* Two Sections */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '32px',
                }}>
                    {/* Worker Productivity */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>Worker Productivity</h3>
                        <div style={{
                            backgroundColor: 'var(--surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            {/* Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                padding: '12px 24px',
                                backgroundColor: '#F3F4F6',
                                borderBottom: '1px solid #E5E7EB',
                            }}>
                                {['Worker', 'Total', 'Completed', 'Missed'].map((col, i) => (
                                    <span key={i} style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                    }}>{col}</span>
                                ))}
                            </div>
                            {/* Rows */}
                            {workerProductivity.map((item, i) => (
                                <div key={i} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                    padding: '16px 24px',
                                    borderBottom: '1px solid #E5E7EB',
                                    alignItems: 'center',
                                }}>
                                    <span style={{
                                        fontWeight: '500',
                                        color: 'var(--text-primary)'
                                    }}>{item.worker_name}</span>
                                    <span style={{
                                        color: 'var(--text-primary)'
                                    }}>{item.total_pickups}</span>
                                    <span style={{
                                        color: '#2E7D32',
                                        fontWeight: '600'
                                    }}>{item.completed}</span>
                                    <span style={{
                                        color: '#C62828',
                                        fontWeight: '600'
                                    }}>{item.missed}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Zone Analytics */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>High Volume Zones</h3>
                        <div style={{
                            backgroundColor: 'var(--surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            {/* Header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                padding: '12px 24px',
                                backgroundColor: '#F3F4F6',
                                borderBottom: '1px solid #E5E7EB',
                            }}>
                                {['Zone', 'Households', 'Pickups', 'Missed'].map((col, i) => (
                                    <span key={i} style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                    }}>{col}</span>
                                ))}
                            </div>
                            {/* Rows */}
                            {zones.map((item, i) => (
                                <div key={i} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                                    padding: '16px 24px',
                                    borderBottom: '1px solid #E5E7EB',
                                    alignItems: 'center',
                                }}>
                                    <span style={{
                                        fontWeight: '500',
                                        color: 'var(--text-primary)'
                                    }}>{item.zone}</span>
                                    <span style={{
                                        color: 'var(--text-primary)'
                                    }}>{item.total_households}</span>
                                    <span style={{
                                        color: '#2E7D32',
                                        fontWeight: '600'
                                    }}>{item.total_pickups}</span>
                                    <span style={{
                                        color: '#C62828',
                                        fontWeight: '600'
                                    }}>{item.missed_pickups}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Pickups */}
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                }}>Daily Pickups</h3>
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        padding: '12px 24px',
                        backgroundColor: '#F3F4F6',
                        borderBottom: '1px solid #E5E7EB',
                    }}>
                        {['Date', 'Total', 'Completed', 'Missed', 'Scheduled'].map((col, i) => (
                            <span key={i} style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'var(--text-secondary)',
                                textTransform: 'uppercase',
                            }}>{col}</span>
                        ))}
                    </div>
                    {/* Rows */}
                    {dailyPickups.length === 0 ? (
                        <div style={{
                            padding: '48px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>No pickup data found</div>
                    ) : (
                        dailyPickups.map((item, i) => (
                            <div key={i} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                                padding: '16px 24px',
                                borderBottom: '1px solid #E5E7EB',
                                alignItems: 'center',
                            }}>
                                <span style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: '500'
                                }}>{new Date(item.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{item.total_pickups}</span>
                                <span style={{ color: '#2E7D32', fontWeight: '600' }}>{item.completed}</span>
                                <span style={{ color: '#C62828', fontWeight: '600' }}>{item.missed}</span>
                                <span style={{ color: '#1565C0', fontWeight: '600' }}>{item.scheduled}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}