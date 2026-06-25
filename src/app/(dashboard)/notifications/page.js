'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import StatusChip from '@/components/StatusChip';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        recipient_user_id: '',
        channel: 'push',
        payload: ''
    });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                'http://localhost/smart-waste-api/api/v1/notifications',
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!form.recipient_user_id || !form.payload) return;
        setSending(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                'http://localhost/smart-waste-api/api/v1/notifications/send',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setSuccess('Notification sent successfully!');
                setForm({ recipient_user_id: '', channel: 'push', payload: '' });
                fetchNotifications();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <>
                <TopBar title="Notifications Composer" />
                <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>Loading...</div>
            </>
        );
    }

    return (
        <>
            <TopBar title="Notifications Composer" />
            <div style={{ padding: '32px' }}>
                <div style={{
                    display: 'flex',
                    gap: '24px',
                }}>

                    {/* Left — Compose */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>Compose Message</h3>
                        <div style={{
                            backgroundColor: 'var(--surface)',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            {/* Success Message */}
                            {success && (
                                <div style={{
                                    backgroundColor: '#E8F5E9',
                                    color: '#2E7D32',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                }}>{success}</div>
                            )}

                            {/* Recipient */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                    fontWeight: '500',
                                }}>Recipient User ID</label>
                                <input
                                    type="number"
                                    placeholder="Enter user ID"
                                    value={form.recipient_user_id}
                                    onChange={(e) => setForm({ ...form, recipient_user_id: e.target.value })}
                                    style={{
                                        width: '100%',
                                        height: '52px',
                                        padding: '0 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '14px',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            {/* Channel */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                    fontWeight: '500',
                                }}>Channel</label>
                                <select
                                    value={form.channel}
                                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                                    style={{
                                        width: '100%',
                                        height: '52px',
                                        padding: '0 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <option value="push">Push Notification</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '6px',
                                    fontWeight: '500',
                                }}>Message</label>
                                <textarea
                                    placeholder="Write your message here..."
                                    value={form.payload}
                                    onChange={(e) => setForm({ ...form, payload: e.target.value })}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '14px',
                                        outline: 'none',
                                        resize: 'none',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                />
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                style={{
                                    height: '52px',
                                    backgroundColor: sending ? '#E0E0E0' : 'var(--primary-dark)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: sending ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {sending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    </div>

                    {/* Right — Recent */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '16px',
                        }}>Recently Sent</h3>
                        <div style={{
                            backgroundColor: 'var(--surface)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            {notifications.length === 0 ? (
                                <div style={{
                                    padding: '48px',
                                    textAlign: 'center',
                                    color: 'var(--text-secondary)'
                                }}>No notifications sent yet</div>
                            ) : (
                                notifications.map((item, i) => (
                                    <div key={i} style={{
                                        padding: '16px 24px',
                                        borderBottom: '1px solid #E5E7EB',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                fontSize: '14px',
                                                color: 'var(--text-primary)',
                                                fontWeight: '500',
                                                marginBottom: '4px',
                                            }}>{item.recipient_name}</p>
                                            <p style={{
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                marginBottom: '4px',
                                            }}>{item.payload}</p>
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#9CA3AF',
                                            }}>{new Date(item.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}</p>
                                        </div>
                                        <StatusChip status={item.channel} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}