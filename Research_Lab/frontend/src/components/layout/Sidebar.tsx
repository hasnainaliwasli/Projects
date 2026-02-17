'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineFolder, HiOutlineDocumentText, HiOutlineBeaker, HiOutlineClipboardList, HiOutlinePencilAlt, HiOutlineChip } from 'react-icons/hi';
import { FaBrain } from "react-icons/fa6";

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
    { href: '/projects', label: 'Projects', icon: HiOutlineFolder },
    { href: '/papers', label: 'Papers', icon: HiOutlineDocumentText },
    { href: '/notes', label: 'Notes', icon: HiOutlinePencilAlt },
    { href: '/experiments', label: 'Experiments', icon: HiOutlineBeaker },
    { href: '/tasks', label: 'Task Board', icon: HiOutlineClipboardList },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />
            )}
            <aside className={`sidebar ${open ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <FaBrain size={24} color="var(--primary-color)" />
                    </div>
                    <h1>Research Lab</h1>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-section">Main Menu</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>© 2026 ResearchHub</p>
                </div>
            </aside>
        </>
    );
}
