export default function TableFilters({ filters, values, onChange }) {
    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px',
        }}>
            {filters.map((filter, i) => (
                <div key={i}>
                    {filter.type === 'select' ? (
                        <select
                            value={values[filter.key] || ''}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            style={{
                                height: '40px',
                                padding: '0 12px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '13px',
                                backgroundColor: '#FFFFFF',
                                color: values[filter.key] ? '#1A1A1A' : '#9CA3AF',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">{filter.placeholder}</option>
                            {filter.options.map((opt, j) => (
                                <option key={j} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={filter.type || 'text'}
                            placeholder={filter.placeholder}
                            value={values[filter.key] || ''}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            style={{
                                height: '40px',
                                padding: '0 12px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '13px',
                                outline: 'none',
                            }}
                        />
                    )}
                </div>
            ))}

            {/* Clear Filters */}
            {Object.values(values).some(v => v) && (
                <button
                    onClick={() => {
                        const cleared = {};
                        Object.keys(values).forEach(k => cleared[k] = '');
                        Object.keys(values).forEach(k => onChange(k, ''));
                    }}
                    style={{
                        height: '40px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '13px',
                        backgroundColor: '#FFEBEE',
                        color: '#C62828',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}>
                    ✕ Clear Filters
                </button>
            )}
        </div>
    );
}