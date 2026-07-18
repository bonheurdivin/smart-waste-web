export default function DataTable({ columns, data, renderRow }) {
    return (
        <div style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
            {/* Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                backgroundColor: 'var(--table-header)',
                padding: '12px 24px',
                borderBottom: '1px solid var(--border)',
            }}>
                {columns.map((col, i) => (
                    <span key={i} style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                    }}>{col}</span>
                ))}
            </div>

            {/* Rows */}
            {data.length === 0 ? (
                <div style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                }}>
                    No data found
                </div>
            ) : (
                data.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
                            padding: '16px 24px',
                            borderBottom: '1px solid var(--border)',
                            alignItems: 'center',
                            textAlign: 'center',
                            justifyItems: 'center',
                        }}
                    >
                        {renderRow(item)}
                    </div>
                ))
            )}
        </div>
    );
}