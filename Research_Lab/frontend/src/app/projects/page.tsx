'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useProjects';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineTrash } from 'react-icons/hi';
import Link from 'next/link';

const statusColors: Record<string, string> = {
    'Proposal': 'badge-info',
    'Data Collection': 'badge-warning',
    'Writing': 'badge-primary',
    'Submitted': 'badge-success',
};

export default function ProjectsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', objectives: '', researchQuestion: '', tags: '' });

    const { data, isLoading } = useProjects({ search: search || undefined, status: statusFilter || undefined });
    const createProject = useCreateProject();
    const deleteProject = useDeleteProject();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createProject.mutateAsync({
            ...form,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        } as any);
        setShowModal(false);
        setForm({ title: '', description: '', objectives: '', researchQuestion: '', tags: '' });
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Projects</h1>
                        <p>Manage your research projects</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <HiOutlinePlus /> New Project
                    </button>
                </div>

                <div className="filter-bar">
                    <div className="topbar-search">
                        <HiOutlineSearch />
                        <input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Data Collection">Data Collection</option>
                        <option value="Writing">Writing</option>
                        <option value="Submitted">Submitted</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : data?.data?.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📁</div>
                        <h3>No projects yet</h3>
                        <p>Create your first research project to get started</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <HiOutlinePlus /> Create Project
                        </button>
                    </div>
                ) : (
                    <div className="card-grid">
                        {data?.data?.map((project) => (
                            <Link href={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, flex: 1 }}>{project.title}</h3>
                                        <span className={`badge ${statusColors[project.status]}`}>{project.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {project.description}
                                    </p>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Progress</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{project.progressPercentage}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${project.progressPercentage}%` }} />
                                        </div>
                                    </div>
                                    {project.tags?.length > 0 && (
                                        <div className="tags-container">
                                            {project.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="tag">{tag}</span>
                                            ))}
                                            {project.tags.length > 3 && <span className="tag">+{project.tags.length - 3}</span>}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            by {typeof project.owner === 'object' ? project.owner.name : 'Unknown'}
                                        </span>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (confirm('Delete this project?')) deleteProject.mutate(project._id);
                                            }}
                                        >
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>New Project</h2>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Title *</label>
                                        <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description *</label>
                                        <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Objectives</label>
                                        <textarea className="form-textarea" value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Research Question</label>
                                        <input className="form-input" value={form.researchQuestion} onChange={(e) => setForm({ ...form, researchQuestion: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tags (comma separated)</label>
                                        <input className="form-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="machine learning, NLP, classification" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={createProject.isPending}>
                                        {createProject.isPending ? 'Creating...' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
