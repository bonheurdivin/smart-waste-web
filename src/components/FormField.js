export default function FormField({ label, type = 'text', value, onChange, placeholder, options }) {
    const inputStyle = {
        width: '100%',
        height: '52px',
        padding: '0 16px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontWeight: '500',
            }}>{label}</label>

            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select...</option>
                    {options?.map((opt, i) => (
                        <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    style={{
                        ...inputStyle,
                        height: 'auto',
                        padding: '12px 16px',
                        resize: 'none',
                    }}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={inputStyle}
                />
            )}
        </div>
    );
}