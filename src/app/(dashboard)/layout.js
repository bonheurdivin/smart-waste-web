'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div
                className="main-content"
                style={{
                    marginLeft: '240px',
                    flex: 1,
                    minHeight: '100vh',
                    backgroundColor: 'var(--background)',
                    paddingTop: '64px',
                }}
            >
                <TopBar onMenuClick={() => setSidebarOpen(true)} />
                {children}
            </div>

            <style>{`
                @media (min-width: 769px) {
                    .main-content {
                        margin-left: 240px !important;
                    }
                }
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}