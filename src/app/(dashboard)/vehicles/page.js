'use client';

import { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DataTable from '@/components/DataTable';
import StatusChip from '@/components/StatusChip';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import TableFilters from '@/components/TableFilters';
import ViewModal from '@/components/ViewModal';

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ plate: '', capacity: '', status: 'available', assigned_driver_id: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchVehicles(); fetchWorkers(); }, []);

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://smart-waste-collector.up.railway.app/api/v1/vehicles', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setVehicles(data.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchWorkers = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://smart-waste-collector.up.railway.app/api/v1/workers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') setWorkers(data.data);
        } catch (error) { console.error(error); }
    };

    const handleAdd = () => { setEditing(null); setForm({ plate: '', capacity: '', status: 'available', assigned_driver_id: '' }); setShowModal(true); };
    const handleEdit = (item) => { setEditing(item); setForm({ plate: item.plate, capacity: item.capacity, status: item.status, assigned_driver_id: item.assigned_driver_id ?? '' }); setShowModal(true); };
    const handleView = (item) => setViewing(item);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('admin_token');
            const url = editing ? `https://smart-waste-collector.up.railway.app/api/v1/vehicles/${editing.id}` : 'https://smart-waste-collector.up.railway.app/api/v1/vehicles';
            const method = editing ? 'PUT' : 'POST';
            const response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await response.json();
            if (data.status === 'success') { setShowModal(false); fetchVehicles(); }
        } catch (error) { console.error(error); } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://smart-waste-collector.up.railway.app/api/v1/vehicles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            const data = await response.json();
            if (data.status === 'success') fetchVehicles();
        } catch (error) { console.error(error); }
    };

    const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

    const filtered = vehicles.filter(v => {
        const matchesSearch = v.plate?.toLowerCase().includes(search.toLowerCase()) || v.capacity?.toLowerCase().includes(search.toLowerCase()) || v.driver_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filters.status || v.status === filters.status;
        return matchesSearch && matchesStatus;
    });

    const columns = ['Plate', 'Capacity', 'Status', 'Assigned Driver', 'Actions'];

    if (loading) return (<><TopBar title="Vehicles & Fleet" /><div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div></>);

    return (
        <>
            <TopBar title="Vehicles & Fleet" />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <input type="text" placeholder="🔍 Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ height: '44px', padding: '0 16px', borderRadius: '100px', border: '1px solid #E5E7EB', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#F3F4F6' }} />
                    <button onClick={handleAdd} style={{ height: '44px', padding: '0 24px', backgroundColor: 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>+ Add Vehicle</button>
                </div>
                <TableFilters
                    filters={[
                        { key: 'status', type: 'select', placeholder: 'All Statuses', options: [{ value: 'available', label: 'Available' }, { value: 'in-use', label: 'In Use' }, { value: 'maintenance', label: 'Maintenance' }] },
                    ]}
                    values={filters}
                    onChange={handleFilterChange}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Showing {filtered.length} of {vehicles.length} vehicles</p>
                <DataTable
                    columns={columns}
                    data={filtered}
                    renderRow={(item) => [
                        <span key="plate" style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.plate}</span>,
                        <span key="capacity" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.capacity}</span>,
                        <StatusChip key="status" status={item.status} />,
                        <span key="driver" style={{ color: 'var(--text-primary)' }}>{item.driver_name ?? 'Unassigned'}</span>,
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
                    title="Vehicle Details"
                    onClose={() => setViewing(null)}
                    fields={[
                        { label: 'Plate', value: viewing.plate },
                        { label: 'Capacity', value: viewing.capacity },
                        { label: 'Status', value: viewing.status, isChip: true },
                        { label: 'Assigned Driver', value: viewing.driver_name ?? 'Unassigned' },
                    ]}
                />
            )}

            {showModal && (
                <Modal title={editing ? 'Edit Vehicle' : 'Add Vehicle'} onClose={() => setShowModal(false)}>
                    <FormField label="Plate Number" value={form.plate} onChange={(v) => setForm({ ...form, plate: v })} placeholder="e.g. RAC 001 A" />
                    <FormField label="Capacity" value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} placeholder="e.g. 5 Tons" />
                    <FormField label="Status" type="select" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={[{ value: 'available', label: 'Available' }, { value: 'in-use', label: 'In Use' }, { value: 'maintenance', label: 'Maintenance' }]} />
                    <FormField label="Assigned Driver" type="select" value={form.assigned_driver_id} onChange={(v) => setForm({ ...form, assigned_driver_id: v })} options={workers.map(w => ({ value: w.id, label: `${w.name} - ${w.zone}` }))} />
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button onClick={() => setShowModal(false)} style={{ flex: 1, height: '52px', backgroundColor: '#F3F4F6', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ flex: 1, height: '52px', backgroundColor: saving ? '#E0E0E0' : 'var(--primary-dark)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                    </div>
                </Modal>
            )}
        </>
    );
}