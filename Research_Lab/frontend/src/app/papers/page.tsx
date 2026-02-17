'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { usePapers, useUploadPaper, useDeletePaper, useBulkDeletePapers } from '@/hooks/usePapers';
import { useProjects } from '@/hooks/useProjects';
import { HiOutlineSearch, HiOutlineUpload, HiOutlineTrash, HiOutlineExternalLink } from 'react-icons/hi';
import Link from 'next/link';

export default function PapersPage() {
    const [search, setSearch] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ projectId: '', title: '', authors: '', year: '', journal: '', doi: '' });
    const [file, setFile] = useState<File | null>(null);

    const { data: papersData, isLoading } = usePapers({ search: search || undefined, projectId: projectFilter || undefined, page, limit: 12 });
    const { data: projectsData } = useProjects();
    const uploadPaper = useUploadPaper();
    const deletePaper = useDeletePaper();
    const bulkDelete = useBulkDeletePapers();

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v));
        if (file) formData.append('file', file);
        await uploadPaper.mutateAsync(formData);
        setShowUpload(false);
        setUploadForm({ projectId: '', title: '', authors: '', year: '', journal: '', doi: '' });
        setFile(null);
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Papers</h1>
                        <p>Browse and manage research papers</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {selected.length > 0 && (
                            <button className="btn btn-danger" onClick={() => { bulkDelete.mutate(selected); setSelected([]); }}>
                                <HiOutlineTrash /> Delete ({selected.length})
                            </button>
                        )}
                        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
                            <HiOutlineUpload /> Upload Paper
                        </button>
                    </div>
                </div>

                <div className="filter-bar">
                    <div className="topbar-search">
                        <HiOutlineSearch />
                        <input placeholder="Search papers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                    </div>
                    <select className="form-select" style={{ width: 'auto' }} value={projectFilter} onChange={(e) => { setProjectFilter(e.target.value); setPage(1); }}>
                        <option value="">All Projects</option>
                        {projectsData?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                </div>

                {isLoading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : papersData?.data?.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h3>No papers found</h3>
                        <p>Upload your first research paper</p>
                    </div>
                ) : (
                    <>
                        <div className="card-grid">
                            {papersData?.data?.map(paper => (
                                <div key={paper._id} className="card" style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                        <input type="checkbox" checked={selected.includes(paper._id)} onChange={() => toggleSelect(paper._id)} />
                                    </div>
                                    <Link href={`/papers/${paper._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', paddingRight: '2rem' }}>{paper.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {paper.authors?.join(', ')} {paper.year ? `(${paper.year})` : ''}
                                        </p>
                                        {paper.journal && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{paper.journal}</p>}
                                        {paper.summaryShort && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {paper.summaryShort}
                                            </p>
                                        )}
                                        {paper.keywords?.length > 0 && (
                                            <div className="tags-container" style={{ marginTop: '0.75rem' }}>
                                                {paper.keywords.slice(0, 4).map((k, i) => <span key={i} className="tag">{k}</span>)}
                                            </div>
                                        )}
                                    </Link>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {typeof paper.projectId === 'object' ? paper.projectId.title : ''}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {paper.fileUrl && (
                                                <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><HiOutlineExternalLink /></a>
                                            )}
                                            <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('Delete?')) deletePaper.mutate(paper._id); }}><HiOutlineTrash /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {papersData?.pagination && papersData.pagination.pages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                                {Array.from({ length: papersData.pagination.pages }, (_, i) => (
                                    <button key={i} className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setPage(i + 1)}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {showUpload && (
                    <div className="modal-overlay" onClick={() => setShowUpload(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Upload Paper</h2>
                                <button className="btn btn-ghost" onClick={() => setShowUpload(false)}>✕</button>
                            </div>
                            <form onSubmit={handleUpload}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Project *</label>
                                        <select className="form-select" value={uploadForm.projectId} onChange={e => setUploadForm({ ...uploadForm, projectId: e.target.value })} required>
                                            <option value="">Select project</option>
                                            {projectsData?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">PDF File</label>
                                        <input type="file" accept=".pdf" className="form-input" onChange={e => setFile(e.target.files?.[0] || null)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Title *</label>
                                        <input className="form-input" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Authors (comma separated)</label>
                                        <input className="form-input" value={uploadForm.authors} onChange={e => setUploadForm({ ...uploadForm, authors: e.target.value })} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Year</label>
                                            <input type="number" className="form-input" value={uploadForm.year} onChange={e => setUploadForm({ ...uploadForm, year: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">DOI</label>
                                            <input className="form-input" value={uploadForm.doi} onChange={e => setUploadForm({ ...uploadForm, doi: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Journal</label>
                                        <input className="form-input" value={uploadForm.journal} onChange={e => setUploadForm({ ...uploadForm, journal: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={uploadPaper.isPending}>
                                        {uploadPaper.isPending ? 'Uploading...' : 'Upload'}
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
