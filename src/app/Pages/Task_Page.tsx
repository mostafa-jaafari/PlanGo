'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Ellipsis } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import TaskDropDownMenu from './TaskDropDownMenu';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/FireBase';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  currenttask: string;
  date?: string | { seconds: number; nanoseconds?: number };
  uuid?: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
}

export function formatDate(
  dateInput: string | { seconds: number; nanoseconds?: number } | undefined | null
): string {
  let dateObj: Date | null = null;

  if (typeof dateInput === 'object' && dateInput?.seconds) {
    dateObj = new Date(dateInput.seconds * 1000);
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
    if (isNaN(dateObj.getTime())) return dateInput;
  }

  if (!dateObj || isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

function TaskCard({ title, description, currenttask, date }: TaskCardProps) {
  const pathname = usePathname();
  const [PrevPath, setPrevPath] = useState(pathname);
  
  useEffect(() => {
    if (pathname !== PrevPath) {
      setPrevPath(pathname);
      // setIsLoadingPath(false);
    }
  }, [])
  const session = useSession();
  const [IsOptionsOpen, setIsOptionsOpen] = useState(false);
  const MenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const HandleHideMenu = (e: MouseEvent) => {
      if(MenuRef.current && !MenuRef.current.contains(e.target as Node)){
        setIsOptionsOpen(false);
      }
    }
      document.addEventListener('mousedown', HandleHideMenu);
      return () => {
        document.removeEventListener('mousedown', HandleHideMenu);
    }
  },[])
  return (
    <section
      className='w-full flex flex-col items-center space-y-2 p-4 bg-black rounded-lg 
        border border-neutral-900'
    >
      {/* -------- Top of Task Card -------- */}
      <div className='flex items-start justify-between'>
        {/* -------- Title & Description -------- */}
        <div className='flex flex-col space-y-2'>
            {/* -------- Title -------- */}
          <span>
            {title}
          </span>
            {/* -------- Description -------- */}
          <span className='text-sm text-neutral-600 pl-2'>
            {description}
          </span>
        </div>
      </div>
      <div>
        <TaskDropDownMenu
          CurrentStatus={
            ['incomplete', 'inprogress', 'completed'].includes(currenttask)
              ? (currenttask as 'incomplete' | 'inprogress' | 'completed')
              : 'incomplete'
          }
        />
      </div>
      {/* -------- Bottom Card -------- */}
          <hr className='border-neutral-900/50 w-full'/>
        <div className='w-full flex justify-between items-center pt-2'>
          <div className='flex items-center space-x-2'>
            <div className='relative w-9 h-9 border rounded-full overflow-hidden'>
              <Image
                src={session?.data?.user?.image as string}
                alt=''
                fill
                className='object-cover'
              />
            </div>
            <div className='flex flex-col items-center text-xs text-neutral-700'>
              <span>
                {session?.data?.user?.name || '...'}
              </span>
              <span>
                {formatDate(date)}
              </span>
            </div>
          </div>
          {/* -------- Options Icon -------- */}
          <div
            className='relative grow flex justify-end'
          >
            <span 
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsOpen(!IsOptionsOpen);
              }}
              className='flex w-max border border-neutral-900 
              rounded-full p-1 cursor-pointer hover:bg-neutral-900/40'>
              <Ellipsis size={16} />
            </span>
            {IsOptionsOpen && (
              <div 
                ref={MenuRef}
                className='absolute right-0 top-full
                bg-black border border-neutral-900 rounded-lg p-2
                flex flex-col space-y-1'>
                    {[{label: 'Edit'}, {label: 'Delete'}].map((option, index) => (
                      <button
                      key={index}
                      className={`text-sm px-4 rounded cursor-pointer py-1
                        ${option.label.toLowerCase() === "delete" ? "bg-red-600 border-red-300 hover:bg-red-700" : "hover:bg-neutral-900/50"}`}>
                          {option.label}
                        </button>
                      ))}
              </div>
            )}
          </div>
        </div>
    </section>
  );
}

export interface Task {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  uuid: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
  description?: string;
  status: string; // 'active', 'completed', 'pending', 'archived',
}

export default function Task_Page() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (!session?.data?.user?.email) return;

    const userDocRef = doc(db, "users", session?.data?.user?.email);

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const data = snapshot.data();
      const tasks: Task[] = data?.tasks || [];
      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session?.data?.user?.email]);

  if (loading) {
    return (
      <div className="w-full py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {Array(5).fill(0).map((_, index) => (
          <section
        key={index}
        className="flex flex-col items-center space-y-2 p-4 bg-black rounded-lg border border-neutral-900 animate-pulse"
          >
        {/* Top of Task Card */}
        <div className="flex items-start justify-between w-full">
          {/* Title & Description */}
          <div className="flex flex-col space-y-2 w-3/4">
            {/* Title */}
            <span className="h-4 w-2/3 bg-neutral-800 rounded" />
            {/* Description */}
            <span className="h-3 w-1/2 bg-neutral-900 rounded ml-2" />
          </div>
        </div>
        <div className="w-16 h-6 bg-neutral-900 rounded mt-2" />
        {/* Bottom Card */}
        <hr className="border-neutral-900/50 w-full" />
        <div className="w-full flex justify-between items-center pt-2">
          <div className="flex items-center space-x-2">
            <div className="relative w-9 h-9 border rounded-full overflow-hidden bg-neutral-900" />
            <div className="flex flex-col items-center text-xs text-neutral-700">
          <span className="h-3 w-12 bg-neutral-900 rounded mb-1" />
          <span className="h-2 w-10 bg-neutral-900 rounded" />
            </div>
          </div>
          {/* Options Icon */}
          <div className="relative grow flex justify-end">
            <span className="flex w-max border border-neutral-900 rounded-full p-1">
          <span className="h-4 w-4 bg-neutral-900 rounded-full" />
            </span>
          </div>
        </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 py-8 md:grid-cols-3 lg:grid-cols-3 pt-8 gap-4">
      {Tasks.map((task, index) => {
        return (
          <TaskCard
            key={task.uuid || index}
            title={task.title}
            description={task.description || ""}
            status={task.status}
            date={task.date}
            lastupdate={task?.lastupdate}
            currenttask={task.status || "incomplete"}
          />
        );
      })}
    </div>
  );
}
