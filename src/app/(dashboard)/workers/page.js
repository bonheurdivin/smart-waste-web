'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function WorkersPage() {
    const [workers, setWorkers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ zone: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', zone: '', status: 'active', });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchWorkers(); fetchUsers(); }, []);

    const fetchWorkers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost/smart-waste-api/api/v1/workers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setWorkers(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost/smart-waste-api/api/v1/users/workers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setUsers(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ name: '', phone: '', email: '', password: '', zone: '', status: 'active' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ name: item.name, phone: item.phone, email: item.email, password: item.password, zone: item.zone, status: item.status }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `http://localhost/smart-waste-api/api/v1/workers/${editing.id}` : 'http://localhost/smart-waste-api/api/v1/workers';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchWorkers(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost/smart-waste-api/api/v1/workers/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchWorkers();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = workers.filter(w => {
        const matchesSearch = w.name?.toLowerCase().includes(search.toLowerCase()) || w.zone?.toLowerCase().includes(search.toLowerCase()) || w.phone?.toLowerCase().includes(search.toLowerCase());
        const matchesZone = !filters.zone || w.zone === filters.zone;
        const matchesStatus = !filters.status || w.status === filters.status;
        return matchesSearch && matchesZone && matchesStatus;
    });

    const columns = ['Name', 'Phone', 'Zone', 'Status', 'Rating', 'Actions'];

    if (loading) return (<><TopBar title="Workers" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Workers" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search workers..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Add Worker</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'zone', type: 'select', placeholder: 'All Zones', options: [{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }] },
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {workers.length} workers</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="name" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.name}</span>,
                        <span key="phone" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.phone}</span>,
                        <span key="zone" style={{ color: 'var(--text-primary)' }}>{item.zone}</span>,
                        <StatusChip key="status" status={item.status} />,
                        <span key="rating" style={{ color: 'var(--text-primary)' }}>{item.rating_avg > 0 ? `${'⭐'.repeat(Math.round(item.rating_avg))} ${item.rating_avg}` : 'No ratings yet'}</span>,
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
                    title="Worker Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Name', value: viewing.name },
                        { label: 'Phone', value: viewing.phone },
                        { label: 'Email', value: viewing.email },
                        { label: 'Zone', value: viewing.zone },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Rating', value: viewing.rating_avg > 0 ? `${'⭐'.repeat(Math.round(viewing.rating_avg))} ${viewing.rating_avg}` : 'No ratings yet' },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Worker' : 'Add Worker'} onClose={() => setShowModal(false)}>
                {!editing && (
            <>
                <FormField label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. John Doe" />
                <FormField label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="e.g. +250788111111" />
                <FormField label="Email (Optional)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="e.g. john@example.com" />
                <FormField label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="Enter password" />
            </>
        )}
                    <FormField label="Zone" type="select" value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} options={[{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }]} />
                    <FormField label="Status" type="select" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}