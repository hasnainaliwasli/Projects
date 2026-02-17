'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useExperiments, useCreateExperiment, useDeleteExperiment } from '@/hooks/useExperiments';
import { useProjects } from '@/hooks/useProjects';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import Link from 'next/link';

export default function ExperimentsPage() {
    const [projectFilter, setProjectFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ projectId: '', dataset: '', modelName: '', description: '' });

    const { data: experiments, isLoading } = useExperiments({ projectId: projectFilter || undefined });
    const { data: projects } = useProjects();
    const createExperiment = useCreateExperiment();
    const deleteExperiment = useDeleteExperiment();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createExperiment.mutateAsync(form as any);
        setShowCreate(false);
        setForm({ projectId: '', dataset: '', modelName: '', description: '' });
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Experiments</h1>
                        <p>Track and compare research experiments</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        <HiOutlinePlus /> New Experiment
                    </button>
                </div>

                <div className="filter-bar">
                    <select className="form-select" style={{ width: 'auto' }} value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                        <option value="">All Projects</option>
                        {projects?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                </div>

                {isLoading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : experiments?.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🧪</div>
                        <h3>No experiments yet</h3>
                        <p>Create your first experiment to start tracking</p>
                    </div>
                ) : (
                    <div className="card-grid">
                        {experiments?.map((exp: any) => (
                            <div key={exp._id} className="card">
                                <Link href={`/experiments/${exp._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--accent)' }}>{exp.modelName}</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dataset</span>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{exp.dataset}</p>
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project</span>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{exp.projectId?.title || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </Link>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('Delete?')) deleteExperiment.mutate(exp._id); }}>
                                        <HiOutlineTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>New Experiment</h2>
                                <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>✕</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Project *</label>
                                        <select className="form-select" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required>
                                            <option value="">Select project</option>
                                            {projects?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Model *</label>
                                        <input className="form-input" value={form.modelName} onChange={e => setForm({ ...form, modelName: e.target.value })} placeholder="e.g. BERT, GPT-4, Random Forest" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Dataset *</label>
                                        <input className="form-input" value={form.dataset} onChange={e => setForm({ ...form, dataset: e.target.value })} placeholder="e.g. MNIST, CIFAR-10, Custom" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={createExperiment.isPending}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
