'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        name: '',
        frequency: '',
        price: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                'https://smartwaste.infinityfree.io/api/v1/plans',
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.status === 'success') setPlans(data.data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditing(null);
        setForm({ name: '', frequency: '', price: '' });
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditing(item);
        setForm({
            name: item.name,
            frequency: item.frequency,
            price: item.price,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing
                ? `https://smartwaste.infinityfree.io/api/v1/plans/${editing.id}`
                : 'https://smartwaste.infinityfree.io/api/v1/plans';
            const method = editing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (data.status === 'success') {
                setShowModal(false);
                fetchPlans();
            }
        } catch (error) {
            console.error('Error saving plan:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(
                `https://smartwaste.infinityfree.io/api/v1/plans/${id}`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = await response.json();
            if (data.status === 'success') fetchPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
        }
    };

    const columns = ['Name', 'Frequency', 'Price', 'Actions'];

    if (loading) {
        return (
            <>
                <TopBar title="Plans & Pricing" />
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
            <TopBar title="Plans & Pricing" />
            <div style={{ padding: '32px' }}>

                {/* Action Row */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                }}>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                    }}>{plans.length} plans available</p>
                    <button
                        onClick={handleAdd}
                        style={{
                            height: '44px',
                            padding: '0 24px',
                            backgroundColor: 'var(--primary-dark)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}>
                        + Add Plan
                    </button>
                </div>

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={plans}
                    renderRow={(item) => [
                        <span key="name" style={{
                            fontWeight: '500',
                            color: 'var(--text-primary)'
                        }}>{item.name}</span>,
                        <span key="frequency" style={{
                            color: 'var(--text-secondary)',
                            fontSize: '13px'
                        }}>{item.frequency}</span>,
                        <span key="price" style={{
                            fontWeight: '600',
                            color: 'var(--primary-dark)'
                        }}>RWF {Number(item.price).toLocaleString()}</span>,
                        <div key="actions" style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleEdit(item)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#E8F5E9',
                                    color: '#2E7D32',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}>Edit</button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#FFEBEE',
                                    color: '#C62828',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}>Delete</button>
                        </div>
                    ]}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    title={editing ? 'Edit Plan' : 'Add Plan'}
                    onClose={() => setShowModal(false)}
                >
                    <FormField
                        label="Plan Name"
                        value={form.name}
                        onChange={(v) => setForm({ ...form, name: v })}
                        placeholder="e.g. Weekly Collection"
                    />
                    <FormField
                        label="Frequency"
                        type="select"
                        value={form.frequency}
                        onChange={(v) => setForm({ ...form, frequency: v })}
                        options={[
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'bi-weekly', label: 'Bi-Weekly' },
                            { value: 'on-demand', label: 'On-Demand' },
                        ]}
                    />
                    <FormField
                        label="Price (RWF)"
                        type="number"
                        value={form.price}
                        onChange={(v) => setForm({ ...form, price: v })}
                        placeholder="e.g. 5000"
                    />

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '24px',
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                flex: 1,
                                height: '52px',
                                backgroundColor: '#F3F4F6',
                                color: 'var(--text-primary)',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}>Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{
                                flex: 1,
                                height: '52px',
                                backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                            }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}