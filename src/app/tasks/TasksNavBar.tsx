'use client';
import { AlertCircle, CheckCircle, Clock, List, PlusIcon } from 'lucide-react';
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
    href: '?sort=pending',
    label: 'Pending Tasks',
    icon: Clock,
  },
  {
    href: '?sort=overdue',
    label: 'Overdue Tasks',
    icon: AlertCircle,
  }
];

export default function TasksNavBar() {
    const ParamsId = useSearchParams().get('sort') || 'all';
    return (
        <section className="w-full border-b border-neutral-900 flex items-center justify-between">
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
            <Link href="/tasks/new">
                <button
                    className='group w-13 hover:w-max fixed right-8 bottom-8 bg-yellow-600 text-white px-4 py-2 
                        rounded-md hover:bg-yellow-700 cursor-pointer
                        flex items-center gap-8 hover:gap-2 
                        overflow-hidden transition-all duration-300'>
                    <PlusIcon className='flex-shrink-0'/> <span className='text-nowrap pr-'>New Task</span>
                </button>
            </Link>
        </section>
    )
}
