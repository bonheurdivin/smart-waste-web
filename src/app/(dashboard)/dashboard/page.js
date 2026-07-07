'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import StatCard from '@/components/StatCard';
import StatusChip from '@/components/StatusChip';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [recentPickups, setRecentPickups] = useState([]);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const base = 'https://smart-waste-collector.up.railway.app/api/v1';

            const [statsRes, pickupsRes, complaintsRes] = await Promise.all([
                fetch(`${base}/reports/dashboard`, { headers }),
                fetch(`${base}/pickups`, { headers }),
                fetch(`${base}/complaints`, { headers }),
            ]);

            const [statsData, pickupsData, complaintsData] = await Promise.all([
                statsRes.json(),
                pickupsRes.json(),
                complaintsRes.json(),
            ]);

            if (statsData.status === 'success') setStats(statsData.data);
            if (pickupsData.status === 'success') setRecentPickups(pickupsData.data.slice(0, 5));
            if (complaintsData.status === 'success') setRecentComplaints(complaintsData.data.slice(0, 4));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <TopBar title="Dashboard" />
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
            <TopBar title="Dashboard" />
            <div style={{ padding: '32px' }}>

                {/* Stats Row */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginBottom: '32px',
                }}>
                    <StatCard
                        title="Total Households"
                        value={stats?.total_households ?? 0}
                        icon="game-icons:house"
                    />
                    <StatCard
                        title="Pickups Today"
                        value={stats?.pickups_today ?? 0}
                        icon="fluent:vehicle-truck-24-filled"
                    />
                    <StatCard
                        title="Active Workers"
                        value={stats?.active_workers ?? 0}
                        icon="healthicons:city-worker"
                    />
                    <StatCard
                        title="Revenue This Month"
                        value={`RWF ${Number(stats?.revenue_this_month ?? 0).toLocaleString()}`}
                        icon="fluent:payment-20-filled"
                    />
                </div>

                {/* Two Sections */}
                <div style={{
                    display: 'flex',
                    gap: '24px',
                }}>

                    {/* Left — Recent Pickups */}
                    <div style={{ flex: 1.5 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>Recent Pickups</h3>
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
                                {['Household', 'Worker', 'Date', 'Status'].map((col, i) => (
                                    <span key={i} style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase',
                                    }}>{col}</span>
                                ))}
                            </div>
                            {/* Rows */}
                            {recentPickups.length === 0 ? (
                                <div style={{
                                    padding: '48px',
                                    textAlign: 'center',
                                    color: 'var(--text-secondary)'
                                }}>No pickups found</div>
                            ) : (
                                recentPickups.map((item, i) => (
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
                                        }}>{item.owner_name}</span>
                                        <span style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '13px'
                                        }}>{item.worker_name ?? 'Unassigned'}</span>
                                        <span style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '13px'
                                        }}>{new Date(item.scheduled_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                        <StatusChip status={item.status} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right — Recent Complaints */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>Recent Complaints</h3>
                        <div style={{
                            backgroundColor: 'var(--surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            {recentComplaints.length === 0 ? (
                                <div style={{
                                    padding: '48px',
                                    textAlign: 'center',
                                    color: 'var(--text-secondary)'
                                }}>No complaints found</div>
                            ) : (
                                recentComplaints.map((item, i) => (
                                    <div key={i} style={{
                                        padding: '16px 24px',
                                        borderBottom: '1px solid #E5E7EB',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                    }}>
                                        <div>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: 'var(--text-primary)',
                                                marginBottom: '4px',
                                            }}>{item.owner_name}</p>
                                            <p style={{
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                            }}>{item.type}</p>
                                        </div>
                                        <StatusChip status={item.status} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}