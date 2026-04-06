import React from 'react';
import Skeleton from './Skeleton';

export const DashboardSkeleton = () => (
    <div className="page-container">
        <div className="page-header">
            <div>
                <Skeleton width={200} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={300} height={16} />
            </div>
        </div>

        <div className="stats-grid">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="stat-card">
                    <Skeleton width={48} height={48} borderRadius={12} />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="40%" height={24} style={{ marginBottom: '4px' }} />
                        <Skeleton width="60%" height={14} />
                    </div>
                </div>
            ))}
        </div>

        <div className="charts-grid">
            {[1, 2, 3].map(i => (
                <div key={i} className="chart-card">
                    <Skeleton width={150} height={20} style={{ marginBottom: '16px' }} />
                    <Skeleton width="100%" height={300} />
                </div>
            ))}
        </div>

        <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
            <div className="chart-card">
                <Skeleton width={200} height={24} style={{ marginBottom: '16px' }} />
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <Skeleton width={200} height={16} style={{ marginBottom: '4px' }} />
                            <Skeleton width={120} height={12} />
                        </div>
                        <Skeleton width={50} height={24} borderRadius={12} />
                    </div>
                ))}
            </div>
            <div className="chart-card">
                <Skeleton width={200} height={24} style={{ marginBottom: '16px' }} />
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                        <div>
                            <Skeleton width={200} height={16} style={{ marginBottom: '4px' }} />
                            <Skeleton width={120} height={12} />
                        </div>
                        <Skeleton width={60} height={24} borderRadius={12} />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const ProjectListSkeleton = () => (
    <div className="page-container">
        <div className="page-header">
            <div>
                <Skeleton width={150} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={250} height={16} />
            </div>
            <Skeleton width={120} height={40} borderRadius={8} />
        </div>

        <div className="filter-bar">
            <Skeleton width={300} height={40} borderRadius={8} />
            <Skeleton width={150} height={40} borderRadius={8} />
        </div>

        <div className="card-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Skeleton width="60%" height={20} />
                        <Skeleton width={80} height={24} borderRadius={50} />
                    </div>
                    <Skeleton width="100%" height={14} style={{ marginBottom: '8px' }} />
                    <Skeleton width="80%" height={14} style={{ marginBottom: '1rem' }} />

                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Skeleton width={60} height={12} />
                            <Skeleton width={30} height={12} />
                        </div>
                        <Skeleton width="100%" height={6} borderRadius={3} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                        <Skeleton width={60} height={20} borderRadius={4} />
                        <Skeleton width={60} height={20} borderRadius={4} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <Skeleton width={100} height={12} />
                        <Skeleton width={24} height={24} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ProjectDetailSkeleton = () => (
    <div className="page-container">
        <div className="page-header">
            <div>
                <Skeleton width={300} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={100} height={24} borderRadius={50} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton width={80} height={40} borderRadius={8} />
                <Skeleton width={150} height={40} borderRadius={8} />
            </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} width={100} height={40} style={{ marginBottom: '-2px' }} />
            ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div>
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <Skeleton width={120} height={20} style={{ marginBottom: '1rem' }} />
                    <Skeleton width="100%" height={14} style={{ marginBottom: '8px' }} />
                    <Skeleton width="100%" height={14} style={{ marginBottom: '8px' }} />
                    <Skeleton width="60%" height={14} />
                </div>
                <div className="card">
                    <Skeleton width={120} height={20} style={{ marginBottom: '1rem' }} />
                    <Skeleton width="100%" height={14} style={{ marginBottom: '8px' }} />
                    <Skeleton width="80%" height={14} />
                </div>
            </div>
            <div>
                <div className="card">
                    <Skeleton width={100} height={20} style={{ marginBottom: '1rem' }} />
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <Skeleton width={80} height={40} style={{ margin: '0 auto' }} />
                    </div>
                    <Skeleton width="100%" height={8} borderRadius={4} style={{ marginBottom: '1.5rem' }} />
                    <Skeleton width={60} height={16} style={{ marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Skeleton width={50} height={20} />
                        <Skeleton width={50} height={20} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const PaperListSkeleton = () => (
    <div className="page-container">
        <div className="page-header">
            <div>
                <Skeleton width={150} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={250} height={16} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton width={120} height={40} borderRadius={8} />
                <Skeleton width={150} height={40} borderRadius={8} />
            </div>
        </div>

        <div className="filter-bar">
            <Skeleton width={300} height={40} borderRadius={8} />
            <Skeleton width={150} height={40} borderRadius={8} />
        </div>

        <div className="card-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card">
                    <Skeleton width="100%" height={24} style={{ marginBottom: '1rem' }} />
                    <Skeleton width="80%" height={14} style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                        <Skeleton width={50} height={20} />
                        <Skeleton width={50} height={20} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <Skeleton width={100} height={14} />
                        <Skeleton width={24} height={24} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const PaperDetailSkeleton = () => (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
        <div className="page-header">
            <div>
                <Skeleton width={400} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={200} height={16} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Skeleton width={120} height={40} borderRadius={8} />
            </div>
        </div>

        <div className="paper-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 450px', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card">
                    <Skeleton width={120} height={24} style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i}>
                                <Skeleton width={80} height={14} style={{ marginBottom: '4px' }} />
                                <Skeleton width="80%" height={16} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card">
                    <Skeleton width={100} height={24} style={{ marginBottom: '0.75rem' }} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} width={60} height={24} borderRadius={12} />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card" style={{ height: '500px' }}>
                    <Skeleton width={150} height={24} style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                <Skeleton width="60%" height={16} style={{ marginBottom: '8px' }} />
                                <Skeleton width="100%" height={12} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '1rem' }}>
                <Skeleton width={200} height={24} style={{ marginBottom: '0.25rem' }} />
                <Skeleton width={300} height={14} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <Skeleton width="80%" height={24} style={{ marginBottom: '0.75rem' }} />
                        <Skeleton width="60%" height={14} style={{ marginBottom: '0.5rem' }} />
                        <Skeleton width="40%" height={12} style={{ marginBottom: '1rem' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                            <Skeleton width={80} height={12} />
                            <Skeleton width={60} height={24} borderRadius={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const NotesSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Skeleton width="60%" height={16} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Skeleton width={24} height={24} borderRadius={4} />
                        <Skeleton width={24} height={24} borderRadius={4} />
                    </div>
                </div>
                <Skeleton width="40%" height={12} />
            </div>
        ))}
    </div>
);

export const TaskSkeleton = () => (
    <div className="page-container">
        <div className="page-header">
            <div>
                <Skeleton width={200} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={300} height={16} />
            </div>
            <Skeleton width={120} height={40} borderRadius={8} />
        </div>

        <div className="filter-bar">
            <select className="form-select" style={{ width: 'auto', visibility: 'hidden' }}>
                <option>All Projects</option>
            </select>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Skeleton width={100} height={16} />
            </span>
        </div>

        <div className="kanban-board">
            {[1, 2, 3, 4].map(col => (
                <div key={col} className="kanban-column">
                    <div className="kanban-column-header">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Skeleton width={8} height={8} borderRadius={50} style={{ display: 'inline-block' }} />
                            <Skeleton width={60} height={16} />
                        </h3>
                        <span className="kanban-column-count">
                            <Skeleton width={12} height={16} />
                        </span>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="kanban-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h4><Skeleton width={120} height={18} /></h4>
                                <div style={{ padding: '2px' }}>
                                    <Skeleton width={14} height={14} />
                                </div>
                            </div>
                            <div style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                                <Skeleton width="100%" height={12} style={{ marginBottom: '4px' }} />
                                <Skeleton width="80%" height={12} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                                    <Skeleton width={40} height={12} />
                                </span>
                                <div className="deadline">
                                    <Skeleton width={12} height={12} style={{ display: 'inline-block', marginRight: '4px' }} />
                                    <Skeleton width={40} height={12} style={{ display: 'inline-block' }} />
                                </div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                                <Skeleton width={100} height={12} />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export const ExperimentSkeleton = () => (
    <div className="card-grid">
        {[1, 2, 3, 4].map(i => (
            <div key={i} className="card">
                <Skeleton width="60%" height={20} style={{ marginBottom: '12px' }} />
                <Skeleton width="40%" height={14} style={{ marginBottom: '8px' }} />
                <Skeleton width="100%" height={40} style={{ marginTop: '12px' }} />
            </div>
        ))}
    </div>
);

export const GlobalLayoutSkeleton = () => (
    <div className="app-layout">
        <div className="sidebar" style={{ width: '260px', borderRight: '1px solid var(--border-color)', height: '100vh', padding: '1.5rem' }}>
            <Skeleton width={120} height={32} style={{ marginBottom: '2rem' }} />
            {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} width="100%" height={40} borderRadius={8} style={{ marginBottom: '0.5rem' }} />
            ))}
        </div>
        <main className="main-content" style={{ flex: 1 }}>
            <div className="topbar" style={{ height: '64px', borderBottom: '1px solid var(--border-color)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Skeleton width={40} height={40} borderRadius={20} />
            </div>
            <div className="page-container">
                <Skeleton width={200} height={32} style={{ marginBottom: '1rem' }} />
                <Skeleton width="100%" height={200} borderRadius={12} />
            </div>
        </main>
    </div>
);

export const ExperimentDetailSkeleton = () => (
    <>
        <div className="page-header">
            <div>
                <Skeleton width={300} height={32} style={{ marginBottom: '8px' }} />
                <Skeleton width={400} height={16} />
            </div>
            <Skeleton width={120} height={40} borderRadius={8} />
        </div>

        <div className="chart-card" style={{ marginBottom: '2rem' }}>
            <Skeleton width={200} height={24} style={{ marginBottom: '1rem' }} />
            <Skeleton width="100%" height={350} />
        </div>

        <div className="card">
            <Skeleton width={250} height={24} style={{ marginBottom: '1rem' }} />
            <div className="table-wrapper">
                <Skeleton width="100%" height={40} style={{ marginBottom: '0.5rem' }} />
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} width="100%" height={60} style={{ marginBottom: '4px' }} />
                ))}
            </div>
        </div>
    </>
);
