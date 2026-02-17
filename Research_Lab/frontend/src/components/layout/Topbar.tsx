'use client';

import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-toggle" onClick={onToggleSidebar}>
                    <HiOutlineMenu />
                </button>
            </div>
            <div className="topbar-right">
                <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                    {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
                </button>
                <div className="dropdown">
                    <button
                        className="user-avatar"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        title={user?.name}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                            </div>
                            <button className="dropdown-item" onClick={() => { router.push('/profile'); setDropdownOpen(false); }}>
                                <HiOutlineUser /> Profile
                            </button>
                            <button
                                className="dropdown-item danger"
                                onClick={() => { logout(); setDropdownOpen(false); }}
                            >
                                <HiOutlineLogout /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
