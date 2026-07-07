'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function SchedulesPage() {
    const [schedules, setSchedules] = useState([]);
    const [households, setHouseholds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ zone: '', recurrence: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ household_id: '', zone: '', recurrence: '', next_pickup_at: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSchedules(); fetchHouseholds(); }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://smart-waste-collector.up.railway.app/api/v1/schedules', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setSchedules(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchHouseholds = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://smart-waste-collector.up.railway.app/api/v1/households', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setHouseholds(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ household_id: '', zone: '', recurrence: '', next_pickup_at: '' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ household_id: item.household_id, zone: item.zone, recurrence: item.recurrence, next_pickup_at: item.next_pickup_at?.slice(0, 16) }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `https://smart-waste-collector.up.railway.app/api/v1/schedules/${editing.id}` : 'https://smart-waste-collector.up.railway.app/api/v1/schedules';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchSchedules(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://smart-waste-collector.up.railway.app/api/v1/schedules/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchSchedules();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = schedules.filter(s => {
        const matchesSearch = s.owner_name?.toLowerCase().includes(search.toLowerCase()) || s.zone?.toLowerCase().includes(search.toLowerCase());
        const matchesZone = !filters.zone || s.zone === filters.zone;
        const matchesRecurrence = !filters.recurrence || s.recurrence === filters.recurrence;
        return matchesSearch && matchesZone && matchesRecurrence;
    });

    const columns = ['Household', 'Zone', 'Recurrence', 'Next Pickup', 'Actions'];

    if (loading) return (<><TopBar title="Schedules & Routes" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Schedules & Routes" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search schedules..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Create Schedule</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'zone', type: 'select', placeholder: 'All Zones', options: [{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }] },
                        { key: 'recurrence', type: 'select', placeholder: 'All Recurrences', options: [{ value: 'weekly', label: 'Weekly' }, { value: 'bi-weekly', label: 'Bi-Weekly' }, { value: 'on-demand', label: 'On-Demand' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {schedules.length} schedules</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="household" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.owner_name}</span>,
                        <span key="zone" style={{ color: 'var(--text-primary)' }}>{item.zone}</span>,
                        <StatusChip key="recurrence" status={item.recurrence} />,
                        <span key="next" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(item.next_pickup_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>,
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
                    title="Schedule Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Household', value: viewing.owner_name },
                        { label: 'Address', value: viewing.address },
                        { label: 'Zone', value: viewing.zone },
                        { label: 'Recurrence', value: viewing.recurrence, isChip: true },
                        { label: 'Next Pickup', value: new Date(viewing.next_pickup_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Schedule' : 'Create Schedule'} onClose={() => setShowModal(false)}>
                    <FormField label="Household" type="select" value={form.household_id} onChange={(v) => setForm({ ...form, household_id: v })} options={households.map(h => ({ value: h.id, label: `${h.owner_name} - ${h.address}` }))} />
                    <FormField label="Zone" type="select" value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} options={[{ value: 'Zone A', label: 'Zone A' }, { value: 'Zone B', label: 'Zone B' }, { value: 'Zone C', label: 'Zone C' }]} />
                    <FormField label="Recurrence" type="select" value={form.recurrence} onChange={(v) => setForm({ ...form, recurrence: v })} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'bi-weekly', label: 'Bi-Weekly' }, { value: 'on-demand', label: 'On-Demand' }]} />
                    <FormField label="Next Pickup Date & Time" type="datetime-local" value={form.next_pickup_at} onChange={(v) => setForm({ ...form, next_pickup_at: v })} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}