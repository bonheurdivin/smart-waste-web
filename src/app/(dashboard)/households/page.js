'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function HouseholdsPage() {
    const [households, setHouseholds] = useState([]);
    const [plans, setPlans] = useState([]);
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ zone: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({
        owner_user_id: '', address: '', zone: '', plan_id: '', occupants: '', status: 'active',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchHouseholds(); fetchPlans(); fetchResidents(); }, []);

    const fetchHouseholds = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost/smart-waste-api/api/v1/households', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setHouseholds(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchPlans = async () => {
        try {
            const response = await fetch('http://localhost/smart-waste-api/api/v1/plans');
            const data = await response.json();
            if (data.status === 'success') setPlans(data.data);
        } catch (error) { console.error(error); }
    };

    const fetchResidents = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://localhost/smart-waste-api/api/v1/users/residents', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setResidents(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ owner_user_id: '', address: '', zone: '', plan_id: '', occupants: '', status: 'active' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ owner_user_id: item.owner_user_id, address: item.address, zone: item.zone, plan_id: item.plan_id ?? '', occupants: item.occupants, status: item.status }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `http://localhost/smart-waste-api/api/v1/households/${editing.id}` : 'http://localhost/smart-waste-api/api/v1/households';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchHouseholds(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://localhost/smart-waste-api/api/v1/households/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchHouseholds();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = households.filter(h => {
        const matchesSearch = h.owner_name?.toLowerCase().includes(search.toLowerCase()) || h.address?.toLowerCase().includes(search.toLowerCase()) || h.zone?.toLowerCase().includes(search.toLowerCase());
        const matchesZone = !filters.zone || h.zone === filters.zone;
        const matchesStatus = !filters.status || h.status === filters.status;
        return matchesSearch && matchesZone && matchesStatus;
    });

    const columns = ['Name', 'Address', 'Zone', 'Plan', 'Status', 'Actions'];

    if (loading) return (<><TopBar title="Households" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Households" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search households..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Add Household</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'zone', type: 'select', placeholder: 'All Zones', options: [{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }] },
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {households.length} households</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="name" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.owner_name}</span>,
                        <span key="address" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.address}</span>,
                        <span key="zone" style={{ color: 'var(--text-primary)' }}>{item.zone}</span>,
                        <span key="plan" style={{ color: 'var(--text-secondary)' }}>{item.plan_name ?? 'No Plan'}</span>,
                        <StatusChip key="status" status={item.status} />,
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
                    title="Household Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Owner Name', value: viewing.owner_name },
                        { label: 'Phone', value: viewing.owner_phone },
                        { label: 'Email', value: viewing.owner_email },
                        { label: 'Address', value: viewing.address },
                        { label: 'Zone', value: viewing.zone },
                        { label: 'Plan', value: viewing.plan_name ?? 'No Plan' },
                        { label: 'Occupants', value: String(viewing.occupants) },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Created At', value: new Date(viewing.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Household' : 'Add Household'} onClose={() => setShowModal(false)}>
                    <FormField label="Owner (Resident)" type="select" value={form.owner_user_id} onChange={(v) => setForm({ ...form, owner_user_id: v })} options={residents.map(r => ({ value: r.id, label: `${r.name} - ${r.phone}` }))} />
                    <FormField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="e.g. KG 123 St, Kigali" />
                    <FormField label="Zone" type="select" value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} options={[{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }]} />
                    <FormField label="Plan" type="select" value={form.plan_id} onChange={(v) => setForm({ ...form, plan_id: v })} options={plans.map(p => ({ value: p.id, label: `${p.name} - RWF ${Number(p.price).toLocaleString()}` }))} />
                    <FormField label="Number of Occupants" type="number" value={form.occupants} onChange={(v) => setForm({ ...form, occupants: v })} placeholder="e.g. 4" />
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