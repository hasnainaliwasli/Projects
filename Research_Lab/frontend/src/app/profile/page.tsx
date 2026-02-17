'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/auth';
import { HiOutlineUser, HiOutlineMail, HiOutlineSave } from 'react-icons/hi';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile({ name, email });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AppLayout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1>Profile Settings</h1>
                        <p>Manage your account information</p>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="card-body" style={{ padding: '2rem' }}>
                                {message.text && (
                                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: '1.5rem' }}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <HiOutlineUser />
                                        </div>
                                        <input
                                            id="name"
                                            className="form-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                            <HiOutlineMail />
                                        </div>
                                        <input
                                            id="email"
                                            className="form-input"
                                            style={{ paddingLeft: '2.5rem' }}
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <input
                                        className="form-input"
                                        type="text"
                                        value={user?.role || 'User'}
                                        disabled
                                        style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                        Account roles can only be changed by an administrator.
                                    </p>
                                </div>
                            </div>

                            <div className="card-footer" style={{ justifyContent: 'flex-end', padding: '1.25rem 2rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSaving}
                                    style={{ minWidth: '120px' }}
                                >
                                    {isSaving ? (
                                        <>Updating...</>
                                    ) : (
                                        <>
                                            <HiOutlineSave /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
