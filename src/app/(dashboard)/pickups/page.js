'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function PickupsPage() {
    const [pickups, setPickups] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ household_id: '', worker_id: '', vehicle_id: '', scheduled_at: '', status: 'scheduled', notes: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchPickups(); fetchHouseholds(); fetchWorkers(); fetchVehicles(); }, []);

    const fetchPickups = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/pickups', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setPickups(data.data);
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

    const fetchWorkers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/workers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setWorkers(data.data);
        } catch (error) { console.error(error); }
    };

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('http://smartwaste.infinityfree.io/api/v1/vehicles', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setVehicles(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ household_id: '', worker_id: '', vehicle_id: '', scheduled_at: '', status: 'scheduled', notes: '' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ household_id: item.household_id, worker_id: item.worker_id ?? '', vehicle_id: item.vehicle_id ?? '', scheduled_at: item.scheduled_at?.slice(0, 16), status: item.status, notes: item.notes ?? '' }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `http://smartwaste.infinityfree.io/api/v1/pickups/${editing.id}` : 'http://smartwaste.infinityfree.io/api/v1/pickups';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchPickups(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = pickups.filter(p => {
        const matchesSearch = p.owner_name?.toLowerCase().includes(search.toLowerCase()) || p.worker_name?.toLowerCase().includes(search.toLowerCase()) || p.zone?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filters.status || p.status === filters.status;
        return matchesSearch && matchesStatus;
    });

    const columns = ['Household', 'Worker', 'Vehicle', 'Scheduled At', 'Status', 'Rating', 'Actions'];

    if (loading) return (<><TopBar title="Pickups" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Pickups" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search pickups..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Create Pickup</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'scheduled', label: 'Scheduled' }, { value: 'en-route', label: 'En Route' }, { value: 'completed', label: 'Completed' }, { value: 'missed', label: 'Missed' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {pickups.length} pickups</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="household" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.owner_name}</span>,
                        <span key="worker" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.worker_name ?? 'Unassigned'}</span>,
                        <span key="vehicle" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.vehicle_plate ?? 'Unassigned'}</span>,
                        <span key="scheduled" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(item.scheduled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>,
                        <StatusChip key="status" status={item.status} />,
                        <span key="rating" style={{ color: 'var(--text-primary)' }}>{item.rating ? '⭐'.repeat(item.rating) : 'Not rated'}</span>,
                        <div key="actions" style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleView(item)} style={{ padding: '6px 12px', backgroundColor: '#E3F2FD', color: '#1565C0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>View</button>
                            <button onClick={() => handleEdit(item)} style={{ padding: '6px 12px', backgroundColor: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>Edit</button>
                        </div>
                    ]}
                />
            </div>

            {viewing && (
                <ViewModal
                    title="Pickup Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Household', value: viewing.owner_name },
                        { label: 'Address', value: viewing.address },
                        { label: 'Zone', value: viewing.zone },
                        { label: 'Worker', value: viewing.worker_name ?? 'Unassigned' },
                        { label: 'Vehicle', value: viewing.vehicle_plate ?? 'Unassigned' },
                        { label: 'Scheduled At', value: new Date(viewing.scheduled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                        { label: 'Completed At', value: viewing.completed_at ? new Date(viewing.completed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-' },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Rating', value: viewing.rating ? '⭐'.repeat(viewing.rating) : 'Not rated' },
                        { label: 'Notes', value: viewing.notes ?? '-' },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Pickup' : 'Create Pickup'} onClose={() => setShowModal(false)}>
                    <FormField label="Household" type="select" value={form.household_id} onChange={(v) => setForm({ ...form, household_id: v })} options={households.map(h => ({ value: h.id, label: `${h.owner_name} - ${h.address}` }))} />
                    <FormField label="Assign Worker" type="select" value={form.worker_id} onChange={(v) => setForm({ ...form, worker_id: v })} options={workers.map(w => ({ value: w.id, label: `${w.name} - ${w.zone}` }))} />
                    <FormField label="Assign Vehicle" type="select" value={form.vehicle_id} onChange={(v) => setForm({ ...form, vehicle_id: v })} options={vehicles.map(v => ({ value: v.id, label: `${v.plate} - ${v.capacity}` }))} />
                    <FormField label="Scheduled Date & Time" type="datetime-local" value={form.scheduled_at} onChange={(v) => setForm({ ...form, scheduled_at: v })} />
                    <FormField label="Status" type="select" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'scheduled', label: 'Scheduled' }, { value: 'en-route', label: 'En Route' }, { value: 'completed', label: 'Completed' }, { value: 'missed', label: 'Missed' }]} />
                    <FormField label="Notes" type="textarea" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} placeholder="Any special instructions..." />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}