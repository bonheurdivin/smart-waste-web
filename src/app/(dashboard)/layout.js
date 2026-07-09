'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
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
                    position: 'relative',
                    width: '100%',
                }}
            >
                {/* Wrapped TopBar in a high z-index container to force click priority */}
                <div style={{ position: 'relative', zIndex: 98 }}>
                    <TopBar onMenuClick={() => setSidebarOpen(true)} />
                </div>

                <main style={{ padding: '24px' }}>
                    {children}
                </main>
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