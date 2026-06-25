export default function StatusChip({ status }) {
    const styles = {
        scheduled: { background: '#E3F2FD', color: '#1565C0' },
        'en-route': { background: '#FFF8E1', color: '#F57F17' },
        completed: { background: '#E8F5E9', color: '#2E7D32' },
        missed: { background: '#FFEBEE', color: '#C62828' },
        paid: { background: '#E8F5E9', color: '#2E7D32' },
        unpaid: { background: '#FFEBEE', color: '#C62828' },
        pending: { background: '#FFF8E1', color: '#F57F17' },
        open: { background: '#FFF8E1', color: '#F57F17' },
        resolved: { background: '#E8F5E9', color: '#2E7D32' },
        active: { background: '#E8F5E9', color: '#2E7D32' },
        inactive: { background: '#FFEBEE', color: '#C62828' },
        available: { background: '#E8F5E9', color: '#2E7D32' },
        'in-use': { background: '#FFF8E1', color: '#F57F17' },
        maintenance: { background: '#FFEBEE', color: '#C62828' },
    };

    const style = styles[status?.toLowerCase()] || {
        background: '#F3F4F6',
        color: '#6B7280'
    };

    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: style.background,
            color: style.color,
            whiteSpace: 'nowrap',
            width: 'fit-content',
            margin: '0 auto',
        }}>
            {status}
        </span>
    );
}