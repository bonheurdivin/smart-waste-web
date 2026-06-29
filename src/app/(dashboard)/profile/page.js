'use client';

import { useState, useEffect, useRef } from 'react';
import TopBar from '@/components/TopBar';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                'https://smartwaste.infinityfree.io/api/v1/auth/profile',
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setUser(data.data);
                localStorage.setItem('admin_user', JSON.stringify(data.data));
            }
        } catch (error) {
            const stored = localStorage.getItem('admin_user');
            if (stored) setUser(JSON.parse(stored));
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const formData = new FormData();
            formData.append('photo', file);

            const response = await fetch(
                'https://smartwaste.infinityfree.io/api/v1/auth/profile/picture',
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ type: 'success', text: 'Profile picture updated!' });
                fetchProfile();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload photo' });
        } finally {
            setUploading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        if (passwordForm.new_password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                'https://smartwaste.infinityfree.io/api/v1/auth/change-password',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        current_password: passwordForm.current_password,
                        new_password: passwordForm.new_password,
                    })
                }
            );
            const data = await response.json();
            if (data.status === 'success') {
                setShowPasswordModal(false);
                setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                setMessage({ type: 'success', text: 'Password changed successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'AD';

    return (
        <>
            <TopBar title="My Profile" />
            <div style={{ padding: '32px', maxWidth: '800px' }}>

                {/* Message */}
                {message && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                        color: message.type === 'success' ? '#2E7D32' : '#C62828',
                        fontSize: '14px',
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Profile Header */}
                <div style={{
                    backgroundColor: 'var(--primary-dark)',
                    borderRadius: '12px',
                    padding: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '24px',
                }}>
                    {/* Avatar with upload */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '28px',
                            fontWeight: '700',
                            overflow: 'hidden',
                            border: '3px solid rgba(255,255,255,0.3)',
                        }}>
                            {user?.photo_url ? (
                                <img
                                    src={user.photo_url}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : initials}
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                border: 'none',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}>
                            {uploading ? '⏳' : '📷'}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handlePhotoUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <div>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#FFFFFF',
                            marginBottom: '4px',
                        }}>{user?.name ?? 'Admin User'}</h2>
                        <p style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '8px',
                        }}>{user?.email ?? '-'}</p>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            backgroundColor: 'var(--primary-light)',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                        }}>{user?.role ?? 'admin'}</span>
                    </div>
                </div>

                {/* Personal Information */}
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '20px',
                    }}>Personal Information</h3>

                    {[
                        { label: 'Full Name', value: user?.name },
                        { label: 'Phone Number', value: user?.phone },
                        { label: 'Email Address', value: user?.email ?? '-' },
                        { label: 'Role', value: user?.role },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 0',
                            borderBottom: i < 3 ? '1px solid #E5E7EB' : 'none',
                        }}>
                            <span style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)',
                                fontWeight: '500',
                            }}>{item.label}</span>
                            <span style={{
                                fontSize: '14px',
                                color: 'var(--text-primary)',
                                fontWeight: '500',
                                textTransform: 'capitalize',
                            }}>{item.value ?? '-'}</span>
                        </div>
                    ))}
                </div>

                {/* Account Settings */}
                <div style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '20px',
                    }}>Account Settings</h3>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #E5E7EB',
                    }}>
                        <div>
                            <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                            }}>Password</p>
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                            }}>Update your account password</p>
                        </div>
                        <button
                            onClick={() => {
                                setMessage(null);
                                setShowPasswordModal(true);
                            }}
                            style={{
                                padding: '8px 20px',
                                backgroundColor: 'var(--primary-dark)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                            }}>
                            Change Password
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0',
                    }}>
                        <div>
                            <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'var(--text-primary)',
                            }}>Account ID</p>
                            <p style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                            }}>Your unique account identifier</p>
                        </div>
                        <span style={{
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace',
                        }}>#{user?.id ?? '-'}</span>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={() => {
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_user');
                        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                        window.location.href = '/login';
                    }}
                    style={{
                        width: '100%',
                        height: '52px',
                        backgroundColor: '#FFEBEE',
                        color: '#C62828',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}>
                    Logout
                </button>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <Modal
                    title="Change Password"
                    onClose={() => setShowPasswordModal(false)}
                >
                    {message && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                            color: message.type === 'success' ? '#2E7D32' : '#C62828',
                            fontSize: '14px',
                        }}>
                            {message.text}
                        </div>
                    )}
                    <FormField
                        label="Current Password"
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(v) => setPasswordForm({ ...passwordForm, current_password: v })}
                        placeholder="Enter current password"
                    />
                    <FormField
                        label="New Password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(v) => setPasswordForm({ ...passwordForm, new_password: v })}
                        placeholder="Enter new password"
                    />
                    <FormField
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(v) => setPasswordForm({ ...passwordForm, confirm_password: v })}
                        placeholder="Repeat new password"
                    />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            style={{
                                flex: 1, height: '52px',
                                backgroundColor: '#F3F4F6',
                                color: 'var(--text-primary)',
                                border: 'none', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            }}>Cancel</button>
                        <button
                            onClick={handleChangePassword}
                            disabled={saving}
                            style={{
                                flex: 1, height: '52px',
                                backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)',
                                color: '#FFFFFF', border: 'none', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                            }}>{saving ? 'Saving...' : 'Change Password'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}