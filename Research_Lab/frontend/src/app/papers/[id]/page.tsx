'use client';

import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { usePaper, useSimilarPapers } from '@/hooks/usePapers';
import { HiOutlineDocumentDownload } from 'react-icons/hi';
import Link from 'next/link';
import NotesManager from '@/components/NotesManager';
import { PaperDetailSkeleton } from '@/components/PageSkeletons';

export default function PaperDetailPage() {
    const { id } = useParams() as { id: string };
    const { data: paper, isLoading } = usePaper(id as string);
    const { data: similar } = useSimilarPapers(id);

    if (isLoading) {
        return (
            <AppLayout>
                <PaperDetailSkeleton />
            </AppLayout>
        );
    }
    if (!paper) return <AppLayout><div className="page-container"><h2>Paper not found</h2></div></AppLayout>;

    const projectId = paper.projectId ? (typeof paper.projectId === 'string' ? paper.projectId : (paper.projectId as any)._id) : '';

    return (
        <AppLayout>
            <div className="page-container" style={{ maxWidth: '1400px' }}>
                <div className="page-header">
                    <div>
                        <h1>{paper.title}</h1>
                                                <p>{paper.authors?.join(', ')} {paper.year ? `(${paper.year})` : ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {paper.fileUrl && (
                            <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                <HiOutlineDocumentDownload /> View PDF
                            </a>
                        )}
                    </div>
                </div>

                <div className="paper-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 450px', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Left Column: Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Metadata */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Paper Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {paper.journal && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Journal</strong><p>{paper.journal}</p></div>}
                                {paper.doi && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>DOI</strong><p>{paper.doi}</p></div>}
                                {paper.year && <div><strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Year</strong><p>{paper.year}</p></div>}
                                <div>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Project</strong>
                                    <p>
                                        {paper.projectId && typeof paper.projectId === 'object' ? (
                                            <Link href={`/projects/${(paper.projectId as any)._id}`} style={{ color: 'var(--accent)' }}>{(paper.projectId as any).title}</Link>
                                        ) : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Keywords */}
                        {paper.keywords?.length > 0 && (
                            <div className="card">
                                <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Keywords</h3>
                                <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {paper.keywords.map((k: string, i: number) => <span key={i} className="tag">{k}</span>)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Notes Manager */}
                    <div style={{ position: 'sticky', top: '2rem', maxHeight: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
                        <NotesManager projectId={projectId} paperId={id} />
                    </div>
                </div>

                {/* Bottom Section: Similar Papers */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', paddingBottom: '1rem' }}>
                        <h3 style={{ fontWeight: 600 }}>Similar Research Papers</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Discover papers with similar themes and focus</p>
                    </div>

                    {similar && similar.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {similar.map((s: any, i: number) => (
                                <div key={i} className="similar-paper-card" style={{
                                    padding: '1.25rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    background: 'var(--bg-secondary)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                }}>
                                    <div>
                                        <Link href={`/papers/${s.paper._id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem', display: 'block', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                            {s.paper.title}
                                        </Link>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {s.paper.authors?.slice(0, 3).join(', ')}{s.paper.authors?.length > 3 ? ' et al.' : ''} {s.paper.year ? `(${s.paper.year})` : ''}
                                        </p>
                                        {s.paper.journal && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{s.paper.journal}</p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Similarity Score</span>
                                        <span className="badge badge-primary" style={{ fontWeight: 700, fontSize: '0.9rem', padding: '0.35rem 0.75rem', borderRadius: '20px' }}>
                                            {(s.similarity * 100).toFixed(0)}% Match
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No similar papers found</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We couldn't find any papers related to this one in your project yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
