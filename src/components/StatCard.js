import { Icon } from '@iconify/react';

export default function StatCard({ title, value, icon }) {
    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            padding: '24px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
            <div>
                <p style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    marginBottom: '8px',
                }}>{title}</p>
                <p style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--primary-dark)',
                }}>{value}</p>
            </div>
            <Icon
                icon={icon}
                style={{
                    width: '48px',
                    height: '48px',
                    color: '#1A1A1A',
                }}
            />
        </div>
    );
}