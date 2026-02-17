'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useProject, useUpdateProject } from '@/hooks/useProjects';
import { usePapers, useUploadPaper, useDeletePaper } from '@/hooks/usePapers';
import { useTasks } from '@/hooks/useTasks';
import { useExperiments } from '@/hooks/useExperiments';
import { useNotes } from '@/hooks/useNotes';
import { HiOutlineUpload, HiOutlineTrash, HiOutlineExternalLink, HiOutlineDocumentText, HiOutlineBeaker, HiOutlineClipboardList, HiOutlinePencilAlt } from 'react-icons/hi';
import Link from 'next/link';

export default function ProjectDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: project, isLoading } = useProject(id);
    const { data: papersData } = usePapers({ projectId: id });
    const { data: tasks } = useTasks({ projectId: id });
    const { data: experiments } = useExperiments({ projectId: id });
    const { data: notes } = useNotes({ projectId: id });
    const uploadPaper = useUploadPaper();
    const deletePaper = useDeletePaper();
    const updateProject = useUpdateProject();

    const [activeTab, setActiveTab] = useState('overview');
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ title: '', authors: '', year: '', journal: '', doi: '' });
    const [file, setFile] = useState<File | null>(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '', status: '', objectives: '', researchQuestion: '' });

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('projectId', id);
        formData.append('title', uploadForm.title);
        formData.append('authors', uploadForm.authors);
        formData.append('year', uploadForm.year);
        formData.append('journal', uploadForm.journal);
        formData.append('doi', uploadForm.doi);
        if (file) formData.append('file', file);

        await uploadPaper.mutateAsync(formData);
        setShowUpload(false);
        setUploadForm({ title: '', authors: '', year: '', journal: '', doi: '' });
        setFile(null);
    };

    const startEditing = () => {
        if (project) {
            setEditForm({
                title: project.title,
                description: project.description,
                status: project.status,
                objectives: project.objectives || '',
                researchQuestion: project.researchQuestion || '',
            });
            setEditing(true);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProject.mutateAsync({ id, ...editForm } as any);
        setEditing(false);
    };

    if (isLoading) return <AppLayout><div className="loading-spinner"><div className="spinner" /></div></AppLayout>;
    if (!project) return <AppLayout><div className="page-container"><h2>Project not found</h2></div></AppLayout>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: HiOutlineDocumentText },
        { id: 'papers', label: `Papers (${papersData?.data?.length || 0})`, icon: HiOutlineDocumentText },
        { id: 'experiments', label: `Experiments (${experiments?.length || 0})`, icon: HiOutlineBeaker },
        { id: 'notes', label: `Notes (${notes?.length || 0})`, icon: HiOutlinePencilAlt },
        { id: 'tasks', label: `Tasks (${tasks?.length || 0})`, icon: HiOutlineClipboardList },
    ];

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>{project.title}</h1>
                        <p>Status: <span className="badge badge-primary">{project.status}</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={startEditing}>Edit</button>
                        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                            <HiOutlineUpload /> Upload Paper
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                marginBottom: '-2px',
                            }}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Description</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{project.description}</p>
                            </div>
                            {project.objectives && (
                                <div className="card" style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Objectives</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{project.objectives}</p>
                                </div>
                            )}
                            {project.researchQuestion && (
                                <div className="card">
                                    <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Research Question</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{project.researchQuestion}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="card">
                                <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Progress</h3>
                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{project.progressPercentage}%</div>
                                </div>
                                <div className="progress-bar" style={{ height: '8px' }}>
                                    <div className="progress-fill" style={{ width: `${project.progressPercentage}%` }} />
                                </div>
                                {project.tags?.length > 0 && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tags</h4>
                                        <div className="tags-container">
                                            {project.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'papers' && (
                    <div>
                        {papersData?.data?.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📄</div>
                                <h3>No papers yet</h3>
                                <p>Upload your first research paper</p>
                                <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                                    <HiOutlineUpload /> Upload Paper
                                </button>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Authors</th>
                                            <th>Year</th>
                                            <th>Keywords</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {papersData?.data?.map((paper) => (
                                            <tr key={paper._id}>
                                                <td>
                                                    <Link href={`/papers/${paper._id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                                                        {paper.title}
                                                    </Link>
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{paper.authors?.join(', ')}</td>
                                                <td>{paper.year}</td>
                                                <td>
                                                    <div className="tags-container">
                                                        {paper.keywords?.slice(0, 3).map((k, i) => <span key={i} className="tag">{k}</span>)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                        {paper.fileUrl && (
                                                            <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                                                                <HiOutlineExternalLink />
                                                            </a>
                                                        )}
                                                        <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('Delete?')) deletePaper.mutate(paper._id); }}>
                                                            <HiOutlineTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'experiments' && (
                    <div>
                        {experiments?.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🧪</div>
                                <h3>No experiments yet</h3>
                                <p>Create experiments from the Experiments page</p>
                                <Link href="/experiments" className="btn btn-primary">Go to Experiments</Link>
                            </div>
                        ) : (
                            <div className="card-grid">
                                {experiments?.map((exp: any) => (
                                    <Link href={`/experiments/${exp._id}`} key={exp._id} style={{ textDecoration: 'none' }}>
                                        <div className="card">
                                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{exp.model}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dataset: {exp.dataset}</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{exp.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        {notes?.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📝</div>
                                <h3>No notes yet</h3>
                                <p>Create notes from the Notes page</p>
                                <Link href="/notes" className="btn btn-primary">Go to Notes</Link>
                            </div>
                        ) : (
                            <div className="card-grid">
                                {notes?.map((note: any) => (
                                    <Link href={`/notes/${note._id}`} key={note._id} style={{ textDecoration: 'none' }}>
                                        <div className="card">
                                            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Note for: {note.paperId?.title || 'Unknown'}</h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {note.sections?.idea?.substring(0, 100) || 'No content'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div>
                        {tasks?.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">✅</div>
                                <h3>No tasks yet</h3>
                                <p>Create tasks from the Task Board</p>
                                <Link href="/tasks" className="btn btn-primary">Go to Task Board</Link>
                            </div>
                        ) : (
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr><th>Task</th><th>Status</th><th>Deadline</th><th>Assigned To</th></tr>
                                    </thead>
                                    <tbody>
                                        {tasks?.map((task: any) => (
                                            <tr key={task._id}>
                                                <td style={{ fontWeight: 600 }}>{task.title}</td>
                                                <td><span className={`badge ${task.status === 'Done' ? 'badge-success' : task.status === 'In Progress' ? 'badge-warning' : 'badge-info'}`}>{task.status}</span></td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}</td>
                                                <td style={{ color: 'var(--text-secondary)' }}>{task.assignedTo?.name || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Paper Modal */}
                {showUpload && (
                    <div className="modal-overlay" onClick={() => setShowUpload(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Upload Paper</h2>
                                <button className="btn btn-ghost" onClick={() => setShowUpload(false)}>✕</button>
                            </div>
                            <form onSubmit={handleUpload}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">PDF File</label>
                                        <input type="file" accept=".pdf" className="form-input" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Title *</label>
                                        <input className="form-input" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Authors (comma separated)</label>
                                        <input className="form-input" value={uploadForm.authors} onChange={(e) => setUploadForm({ ...uploadForm, authors: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Year</label>
                                            <input type="number" className="form-input" value={uploadForm.year} onChange={(e) => setUploadForm({ ...uploadForm, year: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">DOI</label>
                                            <input className="form-input" value={uploadForm.doi} onChange={(e) => setUploadForm({ ...uploadForm, doi: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Journal</label>
                                        <input className="form-input" value={uploadForm.journal} onChange={(e) => setUploadForm({ ...uploadForm, journal: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={uploadPaper.isPending}>
                                        {uploadPaper.isPending ? 'Uploading...' : 'Upload Paper'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Project Modal */}
                {editing && (
                    <div className="modal-overlay" onClick={() => setEditing(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Edit Project</h2>
                                <button className="btn btn-ghost" onClick={() => setEditing(false)}>✕</button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input className="form-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select className="form-select" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                                            <option value="Proposal">Proposal</option>
                                            <option value="Data Collection">Data Collection</option>
                                            <option value="Writing">Writing</option>
                                            <option value="Submitted">Submitted</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Objectives</label>
                                        <textarea className="form-textarea" value={editForm.objectives} onChange={(e) => setEditForm({ ...editForm, objectives: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Research Question</label>
                                        <input className="form-input" value={editForm.researchQuestion} onChange={(e) => setEditForm({ ...editForm, researchQuestion: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={updateProject.isPending}>
                                        {updateProject.isPending ? 'Saving...' : 'Save Changes'}
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
