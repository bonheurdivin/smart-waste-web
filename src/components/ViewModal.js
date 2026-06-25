import Modal from './Modal';
import StatusChip from './StatusChip';

export default function ViewModal({ title, onClose, fields }) {
    return (
        <Modal title={title} onClose={onClose}>
            <div style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                padding: '16px',
            }}>
                {fields.map((field, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: i < fields.length - 1 ? '1px solid #E5E7EB' : 'none',
                    }}>
                        <span style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            fontWeight: '500',
                        }}>{field.label}</span>
                        {field.isChip ? (
                            <StatusChip status={field.value} />
                        ) : (
                            <span style={{
                                fontSize: '13px',
                                color: 'var(--text-primary)',
                                fontWeight: '500',
                                textAlign: 'right',
                                maxWidth: '60%',
                            }}>{field.value ?? '-'}</span>
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    );
}