'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '', method: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ household_id: '', amount: '', method: 'mobile-money', reference: '', status: 'unpaid', paid_at: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchPayments(); fetchHouseholds(); }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/payments', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setPayments(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchHouseholds = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/households', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setHouseholds(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ household_id: '', amount: '', method: 'mobile-money', reference: '', status: 'unpaid', paid_at: '' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ household_id: item.household_id, amount: item.amount, method: item.method, reference: item.reference ?? '', status: item.status, paid_at: item.paid_at?.slice(0, 16) ?? '' }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `http://smartwaste.infinityfree.io/api/v1/payments/${editing.id}` : 'http://smartwaste.infinityfree.io/api/v1/payments';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchPayments(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://smartwaste.infinityfree.io/api/v1/payments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchPayments();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = payments.filter(p => {
        const matchesSearch = p.owner_name?.toLowerCase().includes(search.toLowerCase()) || p.method?.toLowerCase().includes(search.toLowerCase()) || p.reference?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filters.status || p.status === filters.status;
        const matchesMethod = !filters.method || p.method === filters.method;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    const columns = ['Household', 'Amount', 'Method', 'Reference', 'Status', 'Paid At', 'Actions'];

    if (loading) return (<><TopBar title="Payments Tracking" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Payments Tracking" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Record Payment</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'paid', label: 'Paid' }, { value: 'unpaid', label: 'Unpaid' }, { value: 'pending', label: 'Pending' }] },
                        { key: 'method', type: 'select', placeholder: 'All Methods', options: [{ value: 'mobile-money', label: 'Mobile Money' }, { value: 'cash', label: 'Cash' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {payments.length} payments</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="household" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.owner_name}</span>,
                        <span key="amount" style={{ fontWeight: '600', color: 'var(--primary-dark)' }}>RWF {Number(item.amount).toLocaleString()}</span>,
                        <span key="method" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.method}</span>,
                        <span key="reference" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.reference ?? '-'}</span>,
                        <StatusChip key="status" status={item.status} />,
                        <span key="paid_at" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.paid_at ? new Date(item.paid_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>,
                        <div key="actions" style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleView(item)} style={{ padding: '6px 12px', backgroundColor: '#E3F2FD', color: '#1565C0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>View</button>
                            <button onClick={() => handleEdit(item)} style={{ padding: '6px 12px', backgroundColor: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                            <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', backgroundColor: '#FFEBEE', color: '#C62828', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                        </div>
                    ]}
                />
            </div>

            {viewing && (
                <ViewModal
                    title="Payment Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Household', value: viewing.owner_name },
                        { label: 'Phone', value: viewing.owner_phone },
                        { label: 'Amount', value: `RWF ${Number(viewing.amount).toLocaleString()}` },
                        { label: 'Method', value: viewing.method },
                        { label: 'Reference', value: viewing.reference ?? '-' },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Paid At', value: viewing.paid_at ? new Date(viewing.paid_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Payment' : 'Record Payment'} onClose={() => setShowModal(false)}>
                    <FormField label="Household" type="select" value={form.household_id} onChange={(v) => setForm({ ...form, household_id: v })} options={households.map(h => ({ value: h.id, label: `${h.owner_name} - ${h.address}` }))} />
                    <FormField label="Amount (RWF)" type="number" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="e.g. 5000" />
                    <FormField label="Payment Method" type="select" value={form.method} onChange={(v) => setForm({ ...form, method: v })} options={[{ value: 'mobile-money', label: 'Mobile Money' }, { value: 'cash', label: 'Cash' }]} />
                    <FormField label="Reference" value={form.reference} onChange={(v) => setForm({ ...form, reference: v })} placeholder="e.g. MM123456" />
                    <FormField label="Status" type="select" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'paid', label: 'Paid' }, { value: 'unpaid', label: 'Unpaid' }, { value: 'pending', label: 'Pending' }]} />
                    <FormField label="Paid At" type="datetime-local" value={form.paid_at} onChange={(v) => setForm({ ...form, paid_at: v })} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : editing ? 'Update' : 'Record'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}