'use client';
import Link from 'next/link';



const NavBar_Links = [
    {
        href: '?sort=all',
        label: 'All Tasks',
        icon: 'FileText',
    },{
        href: '?sort=active',
        label: 'Active Tasks',
        icon: 'FileText',
    }, {
        href: '?sort=completed',
        label: 'Completed Tasks',
        icon: 'FileText',
    }, {
        href: '?sort=archived',
        label: 'Archived Tasks',
        icon: 'FileText',
    }
];
export default function TasksNavBar() {
    const PaaramsId = new URLSearchParams(window.location.search).get('sort') || 'all';
    return (
        <section className="border-b w-full">
            <ul>
                {NavBar_Links.map((link, index) => (
                    <li key={index} className="inline-block mr-4">
                        <Link
                            href={link.href}
                            className="flex items-center text-neutral-400 hover:text-white transition-colors"
                        >
                            <span className={`icon-${link.icon} mr-2`}></span>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}
