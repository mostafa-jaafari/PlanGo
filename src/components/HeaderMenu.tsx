'use client';
import { useRef, useState, useEffect } from 'react';
import LogOutButton from './LogOutButton';
import Image from 'next/image';

export interface HeaderMenuProps {
    user?: {
        image?: string | null;
        name?: string | null;
        email?: string | null;
    };
}

export default function HeaderMenu({ user }: HeaderMenuProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Use props if provided, fallback to defaults
    const userData = {
        image: user?.image ?? '',
        name: user?.name ?? '',
        email: user?.email ?? '',
    };

    return (
        <section ref={menuRef} className='relative w-max flex items-center gap-2'>
            <div
                className='flex items-center gap-2 cursor-pointer'
                onClick={() => setOpen((prev) => !prev)}
            >
                <div
                    className='relative w-10 h-10 rounded-full 
                    bg-neutral-900 overflow-hidden'
                >
                    <Image
                        src={userData.image || "/default-avatar.png"}
                        alt="User Avatar"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-lg font-semibold">
                        {userData.name || "Guest"}
                    </h1>
                    <p className="text-xs text-neutral-400 font-normal">
                        {userData.email || "Not signed in"}
                    </p>
                </div>
            </div>
            <div
                className={`absolute right-0 w-64 rounded-xl p-2
                    top-full mt-4 bg-neutral-900 border border-neutral-800/50
                    transition-all duration-300
                    ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}`}
            >
                <LogOutButton />
            </div>
        </section>
    );
}