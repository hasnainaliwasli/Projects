'use client';

import AppLayout from '@/components/layout/AppLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiOutlineDocumentText, HiOutlineBeaker, HiOutlineFolder, HiOutlineChartBar, HiOutlineClock } from 'react-icons/hi';
import { format } from 'date-fns';
import Link from 'next/link';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function DashboardPage() {
    const { data: stats, isLoading } = useDashboard();

    if (isLoading) {
        return (
            <AppLayout>
                <div className="loading-spinner"><div className="spinner" /></div>
            </AppLayout>
        );
    }

    const taskStatusData = stats?.charts?.tasksByStatus
        ? Object.entries(stats.charts.tasksByStatus).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back to your research workspace</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
                            <HiOutlineDocumentText size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalPapers || 0}</h3>
                            <p>Total Papers</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            <HiOutlineBeaker size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.totalExperiments || 0}</h3>
                            <p>Total Experiments</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                            <HiOutlineFolder size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.activeProjects || 0}</h3>
                            <p>Active Projects</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                            <HiOutlineChartBar size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.researchProgress || 0}%</h3>
                            <p>Research Progress</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>Papers per Project</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.charts?.papersPerProject || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                <Bar dataKey="papers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Task Completion</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {taskStatusData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Experiment Runs per Project</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.charts?.experimentRunsPerProject || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                                <Bar dataKey="runs" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent papers and deadlines */}
                <div className="charts-grid" style={{ marginTop: '1.5rem' }}>
                    <div className="chart-card">
                        <h3>Recently Added Papers</h3>
                        {stats?.recentPapers?.length ? (
                            <div>
                                {stats.recentPapers.map((paper: any) => (
                                    <div key={paper._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{paper.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {paper.projectId?.title || 'Unknown project'}
                                            </div>
                                        </div>
                                        <span className="badge badge-primary">{paper.year || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No papers yet</p>
                        )}
                    </div>

                    <div className="chart-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HiOutlineClock /> Upcoming Deadlines
                        </h3>
                        {stats?.upcomingDeadlines?.length ? (
                            <div>
                                {stats.upcomingDeadlines.map((task: any) => (
                                    <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{task.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.projectId?.title}</div>
                                        </div>
                                        <span className="badge badge-warning">
                                            {task.deadline ? format(new Date(task.deadline), 'MMM dd') : 'No date'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>No upcoming deadlines</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
