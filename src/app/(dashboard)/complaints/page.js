'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ type: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ status: 'resolved' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/complaints', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setComplaints(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const handleView = (item) => setViewing(item);

    const handleResolve = (item) => { setSelected(item); setForm({ status: item.status }); setShowModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://smartwaste.infinityfree.io/api/v1/complaints/${selected.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchComplaints(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://smartwaste.infinityfree.io/api/v1/complaints/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchComplaints();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = complaints.filter(c => {
        const matchesSearch = c.owner_name?.toLowerCase().includes(search.toLowerCase()) || c.type?.toLowerCase().includes(search.toLowerCase());
        const matchesType = !filters.type || c.type === filters.type;
        const matchesStatus = !filters.status || c.status === filters.status;
        return matchesSearch && matchesType && matchesStatus;
    });

    const columns = ['Household', 'Type', 'Description', 'Status', 'Date', 'Actions'];

    if (loading) return (<><TopBar title="Complaints Management" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Complaints Management" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                </div>
                <TableFilters
                    filters={[
                        { key: 'type', type: 'select', placeholder: 'All Types', options: [{ value: 'missed-pickup', label: 'Missed Pickup' }, { value: 'worker-behaviour', label: 'Worker Behaviour' }, { value: 'damage', label: 'Damage' }] },
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'open', label: 'Open' }, { value: 'resolved', label: 'Resolved' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {complaints.length} complaints</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="household" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.owner_name}</span>,
                        <StatusChip key="type" status={item.type} />,
                        <span key="description" style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{item.description}</span>,
                        <StatusChip key="status" status={item.status} />,
                        <span key="date" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>,
                        <div key="actions" style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleView(item)} style={{ padding: '6px 12px', backgroundColor: '#E3F2FD', color: '#1565C0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>View</button>
                            <button onClick={() => handleResolve(item)} style={{ padding: '6px 12px', backgroundColor: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Resolve</button>
                            <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', backgroundColor: '#FFEBEE', color: '#C62828', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                        </div>
                    ]}
                />
            </div>

            {viewing && (
                <ViewModal
                    title="Complaint Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Household', value: viewing.owner_name },
                        { label: 'Phone', value: viewing.owner_phone },
                        { label: 'Type', value: viewing.type, isChip: true },
                        { label: 'Description', value: viewing.description },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Date', value: new Date(viewing.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                        { label: 'Resolved At', value: viewing.resolved_at ? new Date(viewing.resolved_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
                    ]}
                />
            )}

            {showModal && selected && (
                <Modal title="Update Complaint Status" onClose={() => setShowModal(false)}>
                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Household</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{selected.owner_name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Type</span>
                            <StatusChip status={selected.type} />
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500', display: 'block', marginBottom: '4px' }}>Description</span>
                            <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{selected.description}</p>
                        </div>
                    </div>
                    <FormField label="Update Status" type="select" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'open', label: 'Open' }, { value: 'resolved', label: 'Resolved' }]} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : 'Update Status'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}