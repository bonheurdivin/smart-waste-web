'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/households': 'Households',
    '/plans': 'Plans & Pricing',
    '/workers': 'Workers',
    '/vehicles': 'Vehicles & Fleet',
    '/schedules': 'Schedules & Routes',
    '/pickups': 'Pickups',
    '/payments': 'Payments Tracking',
    '/reports': 'Reports & Export',
    '/complaints': 'Complaints Management',
    '/notifications': 'Notifications Composer',
    '/profile': 'My Profile',
};

export default function TopBar({ onMenuClick }) {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('admin_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const initials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'AD';

    const title = pageTitles[pathname] ?? 'Smart Waste';

    return (
        <header style={{
            height: '64px',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'fixed',
            top: 0,
            zIndex: 97,
            right: 0,
            left: '240px',
        }}
        className="topbar"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Hamburger Menu */}
                <button
                    onClick={onMenuClick}
                    className="menu-btn"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                        display: 'none',
                        color: 'var(--text-primary)',
                        padding: '8px',
                        borderRadius: '8px',
                    }}>☰</button>

                {/* Page Title */}
                <h1 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                }}>{title}</h1>
            </div>

            {/* Admin Info */}
            <Link href="/profile" style={{ textDecoration: 'none' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: '600',
                        fontSize: '14px',
                        overflow: 'hidden',
                    }}>
                        {user?.photo_url ? (
                            <img
                                src={user.photo_url}
                                alt="Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : initials}
                    </div>
                    <span
                        className="admin-name"
                        style={{
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                        }}>{user?.name ?? 'Admin'}</span>
                    <span style={{
                        fontSize: '12px',
                        color: '#6B7280',
                    }}></span>
                </div>
            </Link>

            <style>{`
                @media (min-width: 769px) {
                    .topbar {
                        left: 240px !important;
                    }
                    .menu-btn {
                        display: none !important;
                    }
                    .admin-name {
                        display: block !important;
                    }
                }
                @media (max-width: 768px) {
                    .topbar {
                        left: 0 !important;
                    }
                    .menu-btn {
                        display: block !important;
                    }
                    .admin-name {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
}