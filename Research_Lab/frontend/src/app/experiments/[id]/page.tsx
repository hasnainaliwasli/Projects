'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { useExperiment, useCreateExperimentRun } from '@/hooks/useExperiments';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HiOutlinePlus } from 'react-icons/hi';

export default function ExperimentDetailPage() {
    const { id } = useParams() as { id: string };
    const { data, isLoading } = useExperiment(id);
    const createRun = useCreateExperimentRun();
    const [showAddRun, setShowAddRun] = useState(false);
    const [runForm, setRunForm] = useState({ parameters: '', metrics: '', resultSummary: '' });
    const [graphFile, setGraphFile] = useState<File | null>(null);

    if (isLoading) return <AppLayout><div className="loading-spinner"><div className="spinner" /></div></AppLayout>;
    if (!data) return <AppLayout><div className="page-container"><h2>Experiment not found</h2></div></AppLayout>;

    const { experiment, runs } = data;

    const handleAddRun = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('experimentId', id);
        formData.append('parameters', runForm.parameters || '{}');
        formData.append('metrics', runForm.metrics || '{}');
        formData.append('resultSummary', runForm.resultSummary);
        if (graphFile) formData.append('resultGraph', graphFile);
        await createRun.mutateAsync(formData);
        setShowAddRun(false);
        setRunForm({ parameters: '', metrics: '', resultSummary: '' });
        setGraphFile(null);
    };

    // Prepare chart data from runs
    const chartData = runs?.map((run: any, i: number) => ({
        run: `Run ${i + 1}`,
        ...run.metrics,
    })) || [];

    const metricKeys = runs?.length > 0
        ? Object.keys(runs[0].metrics || {}).filter(k => typeof runs[0].metrics[k] === 'number')
        : [];

    const metricColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>{experiment.modelName}</h1>
                        <p>Dataset: {experiment.dataset} • {experiment.description}</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddRun(true)}>
                        <HiOutlinePlus /> Add Run
                    </button>
                </div>

                {/* Metrics Chart */}
                {chartData.length > 0 && metricKeys.length > 0 && (
                    <div className="chart-card" style={{ marginBottom: '2rem' }}>
                        <h3>Metrics Over Runs</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="run" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                <Legend />
                                {metricKeys.map((key, i) => (
                                    <Line key={key} type="monotone" dataKey={key} stroke={metricColors[i % metricColors.length]} strokeWidth={2} dot={{ r: 4 }} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Runs Table */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Experiment Runs ({runs?.length || 0})</h3>
                    {runs?.length === 0 ? (
                        <div className="empty-state" style={{ padding: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No runs recorded yet. Click &quot;Add Run&quot; to record results.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Parameters</th>
                                        <th>Metrics</th>
                                        <th>Summary</th>
                                        <th>Graph</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {runs?.map((run: any, i: number) => (
                                        <tr key={run._id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <code style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                                    {JSON.stringify(run.parameters).substring(0, 60)}
                                                </code>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                    {Object.entries(run.metrics || {}).map(([k, v]) => (
                                                        <span key={k} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                                                            {k}: {typeof v === 'number' ? (v as number).toFixed(3) : String(v)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {run.resultSummary || '-'}
                                            </td>
                                            <td>
                                                {run.resultGraphUrl ? (
                                                    <a href={run.resultGraphUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">View</a>
                                                ) : '-'}
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {new Date(run.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add Run Modal */}
                {showAddRun && (
                    <div className="modal-overlay" onClick={() => setShowAddRun(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Record Experiment Run</h2>
                                <button className="btn btn-ghost" onClick={() => setShowAddRun(false)}>✕</button>
                            </div>
                            <form onSubmit={handleAddRun}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Parameters (JSON)</label>
                                        <textarea
                                            className="form-textarea"
                                            value={runForm.parameters}
                                            onChange={e => setRunForm({ ...runForm, parameters: e.target.value })}
                                            placeholder='{"learning_rate": 0.001, "epochs": 50, "batch_size": 32}'
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Metrics (JSON)</label>
                                        <textarea
                                            className="form-textarea"
                                            value={runForm.metrics}
                                            onChange={e => setRunForm({ ...runForm, metrics: e.target.value })}
                                            placeholder='{"accuracy": 0.95, "f1": 0.93, "precision": 0.94, "recall": 0.92}'
                                            rows={3}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Result Summary</label>
                                        <textarea className="form-textarea" value={runForm.resultSummary} onChange={e => setRunForm({ ...runForm, resultSummary: e.target.value })} rows={2} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Result Graph (image)</label>
                                        <input type="file" accept="image/*" className="form-input" onChange={e => setGraphFile(e.target.files?.[0] || null)} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddRun(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={createRun.isPending}>
                                        {createRun.isPending ? 'Saving...' : 'Record Run'}
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
