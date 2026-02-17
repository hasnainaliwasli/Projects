'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useTasks, useCreateTask, useUpdateTaskStatus, useDeleteTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineClock } from 'react-icons/hi';
import { format, isPast } from 'date-fns';

const columns = [
    { id: 'To Do', label: 'To Do', color: '#6366f1' },
    { id: 'In Progress', label: 'In Progress', color: '#f59e0b' },
    { id: 'Review', label: 'Review', color: '#8b5cf6' },
    { id: 'Done', label: 'Done', color: '#10b981' },
];

export default function TasksPage() {
    const [projectFilter, setProjectFilter] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ projectId: '', title: '', description: '', deadline: '', priority: 'Medium' });
    const [draggedTask, setDraggedTask] = useState<string | null>(null);

    const { data: tasks, isLoading } = useTasks({ projectId: projectFilter || undefined });
    const { data: projects } = useProjects();
    const createTask = useCreateTask();
    const updateStatus = useUpdateTaskStatus();
    const deleteTask = useDeleteTask();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createTask.mutateAsync(form as any);
        setShowCreate(false);
        setForm({ projectId: '', title: '', description: '', deadline: '', priority: 'Medium' });
    };

    const handleDragStart = (taskId: string) => setDraggedTask(taskId);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (status: string) => {
        if (draggedTask) {
            updateStatus.mutate({ id: draggedTask, status });
            setDraggedTask(null);
        }
    };

    const getColumnTasks = (status: string) => tasks?.filter((t: any) => t.status === status) || [];

    const priorityColors: Record<string, string> = {
        Low: 'badge-info',
        Medium: 'badge-warning',
        High: 'badge-danger',
        Critical: 'badge-danger',
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Task Board</h1>
                        <p>Manage research tasks with drag-and-drop Kanban</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                        <HiOutlinePlus /> New Task
                    </button>
                </div>

                <div className="filter-bar">
                    <select className="form-select" style={{ width: 'auto' }} value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                        <option value="">All Projects</option>
                        {projects?.data?.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {tasks?.length || 0} tasks total
                    </span>
                </div>

                {isLoading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : (
                    <div className="kanban-board">
                        {columns.map(col => (
                            <div
                                key={col.id}
                                className="kanban-column"
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(col.id)}
                            >
                                <div className="kanban-column-header">
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                                        {col.label}
                                    </h3>
                                    <span className="kanban-column-count">{getColumnTasks(col.id).length}</span>
                                </div>
                                {getColumnTasks(col.id).map((task: any) => (
                                    <div
                                        key={task._id}
                                        className={`kanban-card ${draggedTask === task._id ? 'dragging' : ''}`}
                                        draggable
                                        onDragStart={() => handleDragStart(task._id)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <h4>{task.title}</h4>
                                            <button className="btn btn-ghost" style={{ padding: '2px' }} onClick={() => { if (confirm('Delete?')) deleteTask.mutate(task._id); }}>
                                                <HiOutlineTrash size={14} />
                                            </button>
                                        </div>
                                        {task.description && <p>{task.description?.substring(0, 80)}</p>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                            <span className={`badge ${priorityColors[task.priority] || 'badge-info'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                                                {task.priority || 'Medium'}
                                            </span>
                                            {task.deadline && (
                                                <div className={`deadline ${isPast(new Date(task.deadline)) && task.status !== 'Done' ? 'overdue' : ''}`}>
                                                    <HiOutlineClock size={12} />
                                                    {format(new Date(task.deadline), 'MMM dd')}
                                                </div>
                                            )}
                                        </div>
                                        {task.projectId?.title && (
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                                {task.projectId.title}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {getColumnTasks(col.id).length === 0 && (
                                    <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: '8px' }}>
                                        Drop tasks here
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {showCreate && (
                    <div className="modal-overlay" onClick={() => setShowCreate(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>New Task</h2>
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
                                        <label className="form-label">Title *</label>
                                        <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label className="form-label">Deadline</label>
                                            <input type="date" className="form-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Priority</label>
                                            <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={createTask.isPending}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
