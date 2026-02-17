'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { useProjects } from '@/hooks/useProjects';
import { usePapers } from '@/hooks/usePapers';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSave } from 'react-icons/hi';

export default function NotesPage() {
    const [selectedNote, setSelectedNote] = useState<string | null>(null);
    const [projectFilter, setProjectFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({ projectId: '', paperId: '' });
    const [sections, setSections] = useState({ idea: '', critique: '', literatureGap: '', futureExtension: '', quoteReferences: '' });

    const { data: notes, isLoading } = useNotes({ projectId: projectFilter || undefined });
    const { data: projects } = useProjects();
    const { data: papers } = usePapers({ projectId: createForm.projectId || undefined, limit: 100 });
    const createNote = useCreateNote();
    const updateNote = useUpdateNote();
    const deleteNote = useDeleteNote();

    const activeNote = notes?.find((n: any) => n._id === selectedNote);

    useEffect(() => {
        if (activeNote) {
            setSections(activeNote.sections);
        }
    }, [activeNote]);

    // Auto-save with debounce
    const autoSave = useCallback(() => {
        if (selectedNote && activeNote) {
            const changed = JSON.stringify(sections) !== JSON.stringify(activeNote.sections);
            if (changed) {
                updateNote.mutate({ id: selectedNote, sections });
            }
        }
    }, [selectedNote, sections, activeNote, updateNote]);

    useEffect(() => {
        const timer = setTimeout(autoSave, 2000);
        return () => clearTimeout(timer);
    }, [sections, autoSave]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const note = await createNote.mutateAsync({
            projectId: createForm.projectId,
            paperId: createForm.paperId,
            sections: { idea: '', critique: '', literatureGap: '', futureExtension: '', quoteReferences: '' },
        } as any);
        setShowCreate(false);
        setSelectedNote(note._id);
        setCreateForm({ projectId: '', paperId: '' });
    };

    const sectionLabels: Record<string, string> = {
        idea: '💡 Idea',
        critique: '🔍 Critique',
        literatureGap: '📚 Literature Gap',
        futureExtension: '🔮 Future Extension',
        quoteReferences: '📖 Quote References',
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Research Notes</h1>
                        <p>Structured research notes linked to papers</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        <HiOutlinePlus /> New Note
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', minHeight: '60vh' }}>
                    {/* Notes list */}
                    <div>
                        <div className="form-group">
                            <select className="form-select" value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                                <option value="">All Projects</option>
                                {projects?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {isLoading ? (
                                <div className="loading-spinner"><div className="spinner" /></div>
                            ) : notes?.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No notes yet</div>
                            ) : (
                                notes?.map((note: any) => (
                                    <div
                                        key={note._id}
                                        onClick={() => setSelectedNote(note._id)}
                                        className="card"
                                        style={{
                                            cursor: 'pointer',
                                            padding: '0.8rem',
                                            borderColor: selectedNote === note._id ? 'var(--accent)' : 'var(--border-color)',
                                            background: selectedNote === note._id ? 'var(--accent-light)' : 'var(--bg-secondary)',
                                        }}
                                    >
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{note.paperId?.title || 'Unknown Paper'}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {note.projectId?.title || ''} • {note.versionHistory?.length || 0} versions
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Note editor */}
                    <div>
                        {selectedNote && activeNote ? (
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                        Note: {typeof activeNote.paperId === 'object' && activeNote.paperId?.title ? activeNote.paperId.title : 'Unknown'}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => updateNote.mutate({ id: selectedNote, sections })}>
                                            <HiOutlineSave /> Save
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => {
                                            if (confirm('Delete this note?')) {
                                                deleteNote.mutate(selectedNote);
                                                setSelectedNote(null);
                                            }
                                        }}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                                {Object.entries(sectionLabels).map(([key, label]) => (
                                    <div key={key} className="form-group">
                                        <label className="form-label">{label}</label>
                                        <textarea
                                            className="form-textarea"
                                            rows={4}
                                            value={(sections as any)[key] || ''}
                                            onChange={e => setSections({ ...sections, [key]: e.target.value })}
                                            placeholder={`Write your ${label.split(' ').slice(1).join(' ').toLowerCase()} here...`}
                                        />
                                    </div>
                                ))}
                                {activeNote.versionHistory?.length > 0 && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Version History ({activeNote.versionHistory.length})</h4>
                                        {activeNote.versionHistory.slice(-5).reverse().map((v: any, i: number) => (
                                            <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.25rem 0' }}>
                                                Version from {new Date(v.updatedAt).toLocaleString()}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📝</div>
                                <h3>Select a note</h3>
                                <p>Choose a note from the list or create a new one</p>
                            </div>
                        )}
                    </div>
                </div>

                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>New Note</h2>
                                <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>✕</button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Project *</label>
                                        <select className="form-select" value={createForm.projectId} onChange={e => setCreateForm({ ...createForm, projectId: e.target.value })} required>
                                            <option value="">Select project</option>
                                            {projects?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Paper *</label>
                                        <select className="form-select" value={createForm.paperId} onChange={e => setCreateForm({ ...createForm, paperId: e.target.value })} required>
                                            <option value="">Select paper</option>
                                            {papers?.data?.map((p: any) => <option key={p._id} value={p._id}>{p.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={createNote.isPending}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
