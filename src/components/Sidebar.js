'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
    { label: 'Households', href: '/households', icon: 'game-icons:house' },
    { label: 'Plans', href: '/plans', icon: 'icon-park-solid:plan' },
    { label: 'Workers', href: '/workers', icon: 'healthicons:city-worker' },
    { label: 'Vehicles', href: '/vehicles', icon: 'fluent:vehicle-truck-24-filled' },
    { label: 'Schedules', href: '/schedules', icon: 'mdi:invoice-text-scheduled' },
    { label: 'Pickups', href: '/pickups', icon: 'ic:round-takeout-dining' },
    { label: 'Payments', href: '/payments', icon: 'fluent:payment-20-filled' },
    { label: 'Reports', href: '/reports', icon: 'mdi:report-box' },
    { label: 'Complaints', href: '/complaints', icon: 'icon-park-solid:caution' },
    { label: 'Notifications', href: '/notifications', icon: 'iconamoon:notification-fill' },
];

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    return (
        <>
            {/* Dark overlay for mobile */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 98,
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                className="sidebar"
                style={{
                    width: '240px',
                    minHeight: '100vh',
                    backgroundColor: 'var(--primary-dark)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 99,
                    transition: 'transform 0.3s ease',
                    transform: isOpen ? 'translateX(0)' : undefined,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '24px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <span style={{ fontSize: '24px' }}>♻️</span>
                        <div>
                            <p style={{
                                color: '#FFFFFF',
                                fontWeight: '700',
                                fontSize: '14px',
                            }}>Smart Waste</p>
                            <p style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '12px',
                            }}>Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="close-btn"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '20px',
                            display: 'none',
                        }}>✕</button>
                </div>

                {/* Nav Items */}
                <nav style={{ padding: '12px 0', flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: isActive ? '600' : '400',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {item.icon ? (
                                    <Icon
                                        icon={item.icon}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            color: '#FFFFFF',
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                                )}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '12px',
                    }}>Smart Waste v1.0</p>
                </div>
            </aside>

            <style>{`
                @media (min-width: 769px) {
                    .sidebar {
                        transform: translateX(0) !important;
                    }
                    .close-btn {
                        display: none !important;
                    }
                }
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                    }
                    .close-btn {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}