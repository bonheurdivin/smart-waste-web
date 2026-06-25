'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TopBar({ onMenuClick }) {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('admin_user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
    };

    const initials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'AD';

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
            left: '240px',
            right: 0,
            zIndex: 97,
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
                    }}>☰</button>

                {/* Logo for mobile */}
                <span
                    className="mobile-logo"
                    style={{
                        display: 'none',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--primary-dark)',
                    }}>♻️ Smart Waste</span>
            </div>

            {/* Admin Info */}
            <div style={{ position: 'relative' }}>
                <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
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
                    }}>{initials}</div>
                    <span
                        className="admin-name"
                        style={{
                            fontSize: '14px',
                            color: 'var(--text-primary)',
                            fontWeight: '500',
                        }}>{user?.name ?? 'Admin'}</span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>▼</span>
                </div>

                {/* Dropdown */}
                {showDropdown && (
                    <div style={{
                        position: 'absolute',
                        top: '48px',
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        minWidth: '160px',
                        zIndex: 200,
                        overflow: 'hidden',
                    }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                textAlign: 'left',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#D32F2F',
                                fontWeight: '500',
                            }}>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @media (min-width: 769px) {
                    .topbar {
                        left: 240px !important;
                    }
                    .menu-btn {
                        display: none !important;
                    }
                    .mobile-logo {
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
                    .mobile-logo {
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