'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 99,
                        display: 'none',
                    }}
                    className="mobile-overlay"
                />
            )}

            {/* Sidebar */}
            <div style={{
                transform: sidebarOpen ? 'translateX(0)' : undefined,
            }}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div style={{
                marginLeft: '240px',
                flex: 1,
                minHeight: '100vh',
                backgroundColor: 'var(--background)',
                paddingTop: '64px',
            }}
            className="main-content"
            >
                <TopBar
                    title=""
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />
                {children}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0 !important;
                    }
                    .mobile-overlay {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
}