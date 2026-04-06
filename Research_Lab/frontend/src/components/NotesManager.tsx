'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineSave, HiOutlineX } from 'react-icons/hi';
import { NotesSkeleton } from './PageSkeletons';

interface NotesManagerProps {
    projectId: string;
    paperId: string;
}

export default function NotesManager({ projectId, paperId }: NotesManagerProps) {
    const { data: notes, isLoading } = useNotes({ projectId, paperId });
    const createNote = useCreateNote();
    const updateNote = useUpdateNote();
    const deleteNote = useDeleteNote();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeNote, setActiveNote] = useState<any>(null);
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState({ idea: '', critique: '', literatureGap: '', futureExtension: '', quoteReferences: '' });

    const openCreateModal = () => {
        setActiveNote(null);
        setTitle('Untitled Note');
        setSections({ idea: '', critique: '', literatureGap: '', futureExtension: '', quoteReferences: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (note: any) => {
        setActiveNote(note);
        setTitle(note.title || 'Untitled Note');
        setSections(note.sections);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (activeNote) {
            // Update
            await updateNote.mutateAsync({ id: activeNote._id, title, sections });
        } else {
            // Create
            await createNote.mutateAsync({
                projectId,
                paperId,
                title,
                sections,
            } as any);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this note?')) {
            await deleteNote.mutateAsync(id);
        }
    };

    const sectionLabels: Record<string, string> = {
        idea: '💡 Idea',
        critique: '🔍 Critique',
        literatureGap: '📚 Literature Gap',
        futureExtension: '🔮 Future Extension',
        quoteReferences: '📖 Quote References',
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Research Notes</h2>
                <button className="btn btn-primary btn-sm" onClick={openCreateModal}>
                    <HiOutlinePlus /> Add Note
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {isLoading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : notes?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        <p>No notes yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notes?.map((note: any) => (
                            <div key={note._id}
                                style={{
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    background: 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s'
                                }}
                                className="note-item"

                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div onClick={() => openEditModal(note)} style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>{note.title || 'Untitled Note'}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            Last edited: {new Date(note.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEditModal(note); }}>
                                            <HiOutlinePencil />
                                        </button>
                                        <button className="btn btn-ghost btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}>
                                            <HiOutlineTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" style={{ width: '800px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Note Title"
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    background: 'transparent',
                                    width: '100%',
                                    outline: 'none',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}><HiOutlineX /></button>
                        </div>
                        <div className="modal-body" style={{ flex: 1, overflowY: 'auto' }}>
                            {Object.entries(sectionLabels).map(([key, label]) => (
                                <div key={key} className="form-group">
                                    <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</label>
                                    <textarea
                                        className="form-textarea"
                                        rows={4}
                                        value={(sections as any)[key] || ''}
                                        onChange={e => setSections({ ...sections, [key]: e.target.value })}
                                        placeholder={`Write your ${label.split(' ').slice(1).join(' ').toLowerCase()} here...`}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <HiOutlineSave /> Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
