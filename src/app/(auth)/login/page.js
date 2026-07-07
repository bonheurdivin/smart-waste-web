'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetPhone, setResetPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'https://smart-waste-collector.up.railway.app/api/v1/auth/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (data.status === 'success') {
                localStorage.setItem('admin_token', data.data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.data.user));
                document.cookie = `admin_token=${data.data.token}; path=/`;
                router.push('/dashboard');
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 16px',
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            color: '#1A1A1A',
                        }}>Reset Password</h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            marginBottom: '24px',
                        }}>Enter your phone number to receive a reset code</p>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#6B7280',
                                marginBottom: '6px',
                                fontWeight: '500',
                            }}>Phone Number</label>
                            <input
                                type="text"
                                placeholder="+250 7XX XXX XXX"
                                value={resetPhone}
                                onChange={(e) => setResetPhone(e.target.value)}
                                style={{
                                    width: '100%',
                                    height: '52px',
                                    padding: '0 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                style={{
                                    flex: 1,
                                    height: '52px',
                                    backgroundColor: '#F3F4F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#1A1A1A',
                                }}>Cancel</button>
                            <button
                                onClick={() => {
                                    alert('Reset code sent to ' + resetPhone);
                                    setShowForgotPassword(false);
                                }}
                                style={{
                                    flex: 1,
                                    height: '52px',
                                    backgroundColor: '#1B5E20',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                }}>Send Code</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Side */}
            <div style={{
                flex: 1,
                backgroundColor: 'var(--primary-dark)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '48px',
            }}
            className="login-left"
            >
                <span style={{ fontSize: '80px' }}>♻️</span>
                <h1 style={{
                    color: '#FFFFFF',
                    fontSize: '28px',
                    fontWeight: '700',
                    textAlign: 'center',
                }}>Smart Waste Collection</h1>
                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '16px',
                    textAlign: 'center',
                }}>Managing waste, the smart way</p>
            </div>

            {/* Right Side */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
                backgroundColor: 'var(--background)',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                    }}>Welcome Back</h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        marginBottom: '32px',
                    }}>Login to your admin account</p>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            backgroundColor: '#FFEBEE',
                            color: '#C62828',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            marginBottom: '16px',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Phone Input */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            marginBottom: '6px',
                            fontWeight: '500',
                        }}>Phone Number</label>
                        <input
                            type="text"
                            placeholder="+250 7XX XXX XXX"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            style={{
                                width: '100%',
                                height: '52px',
                                padding: '0 16px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#FFFFFF',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '8px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            marginBottom: '6px',
                            fontWeight: '500',
                        }}>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            style={{
                                width: '100%',
                                height: '52px',
                                padding: '0 48px 0 16px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#FFFFFF',
                                boxSizing: 'border-box',
                            }}
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '34px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                color: '#9CA3AF',
                            }}>
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <span
                            onClick={() => setShowForgotPassword(true)}
                            style={{
                                fontSize: '12px',
                                color: 'var(--primary-dark)',
                                cursor: 'pointer',
                                fontWeight: '500',
                            }}>Forgot Password?</span>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: '100%',
                            height: '52px',
                            backgroundColor: loading ? '#E0E0E0' : 'var(--primary-dark)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Note */}
                    <p style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginTop: '24px',
                    }}>
                        Access is restricted to authorized facility staff only
                    </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .login-left {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}