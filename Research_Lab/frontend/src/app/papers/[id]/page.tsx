'use client';

import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { usePaper, useSimilarPapers, useRegenerateSummary } from '@/hooks/usePapers';
import { HiOutlineRefresh, HiOutlineExternalLink, HiOutlineDocumentDownload } from 'react-icons/hi';
import Link from 'next/link';

export default function PaperDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: paper, isLoading } = usePaper(id);
    const { data: similar } = useSimilarPapers(id);
    const regenerate = useRegenerateSummary();

    if (isLoading) return <AppLayout><div className="loading-spinner"><div className="spinner" /></div></AppLayout>;
    if (!paper) return <AppLayout><div className="page-container"><h2>Paper not found</h2></div></AppLayout>;

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>{paper.title}</h1>
                        <p>{paper.authors?.join(', ')} {paper.year ? `(${paper.year})` : ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => regenerate.mutate(id)} disabled={regenerate.isPending}>
                            <HiOutlineRefresh /> {regenerate.isPending ? 'Generating...' : 'Regenerate AI Summary'}
                        </button>
                        {paper.fileUrl && (
                            <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <HiOutlineDocumentDownload /> View PDF
                            </a>
                        )}
                    </div>
                </div>

                <div className="paper-detail">
                    <div>
                        {/* Metadata */}
                        <div className="card" style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {paper.journal && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Journal</strong><p>{paper.journal}</p></div>}
                                {paper.doi && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DOI</strong><p>{paper.doi}</p></div>}
                                {paper.year && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Year</strong><p>{paper.year}</p></div>}
                                <div>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Project</strong>
                                    <p>
                                        {typeof paper.projectId === 'object' ? (
                                            <Link href={`/projects/${paper.projectId._id}`} style={{ color: 'var(--accent)' }}>{paper.projectId.title}</Link>
                                        ) : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Summaries */}
                        {paper.summaryShort && (
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <div className="paper-summary-section">
                                    <h3>Short Summary</h3>
                                    <p>{paper.summaryShort}</p>
                                </div>
                                {paper.summaryMethodology && (
                                    <div className="paper-summary-section">
                                        <h3>Methodology</h3>
                                        <p>{paper.summaryMethodology}</p>
                                    </div>
                                )}
                                {paper.keyFindings && (
                                    <div className="paper-summary-section">
                                        <h3>Key Findings</h3>
                                        <p>{paper.keyFindings}</p>
                                    </div>
                                )}
                                {paper.limitations && (
                                    <div className="paper-summary-section">
                                        <h3>Limitations</h3>
                                        <p>{paper.limitations}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Keywords */}
                        {paper.keywords?.length > 0 && (
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Keywords</h3>
                                <div className="tags-container">
                                    {paper.keywords.map((k, i) => <span key={i} className="tag">{k}</span>)}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        {/* Similar Papers */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Similar Papers</h3>
                            {similar && similar.length > 0 ? (
                                <div>
                                    {similar.map((s, i) => (
                                        <div key={i} style={{ padding: '0.75rem 0', borderBottom: i < similar.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                            <Link href={`/papers/${s.paper._id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                                                {s.paper.title}
                                            </Link>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                {s.paper.authors?.join(', ')} {s.paper.year ? `(${s.paper.year})` : ''}
                                            </p>
                                            <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                                                {(s.similarity * 100).toFixed(0)}% similar
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No similar papers found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
