'use client';
import { AlertCircle, CheckCircle, Clock, List } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';


const NavBar_Links = [
  {
    href: '?sort=all',
    label: 'All Tasks',
    icon: List,
  },
  {
    href: '?sort=completed',
    label: 'Completed Tasks',
    icon: CheckCircle,
  },
  {
    href: '?sort=inprogress',
    label: 'Pending Tasks',
    icon: Clock,
  },
  {
    href: '?sort=incomplete',
    label: 'Overdue Tasks',
    icon: AlertCircle,
  }
];

export default function TasksNavBar() {

    const ParamsId = useSearchParams().get('sort') || 'all';
    
    return (
        <main className="w-full border-b border-neutral-900 flex items-center justify-between">
            <ul>
                {NavBar_Links.map((link, index) => (
                    <li key={index} className="inline-block mr-4">
                        <Link
                            href={link.href}
                            className={`flex items-center 
                                transition-colors
                                py-1 px-2
                                ${ParamsId === link.href.split('=')[1] ? 'text-yellow-600 hover:text-yellow-700 border-b' : 'text-neutral-700 hover:text-neutral-600'}`}
                        >
                            <link.icon size={16}/>
                            <span className={`icon-${link.icon} mr-2`}></span>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}
