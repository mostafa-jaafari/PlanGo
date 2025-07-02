'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Ellipsis } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import TaskToggleButton from './TaskToggleButton';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/FireBase';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
}

function formatDate(
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

function TaskCard({ title, description }: TaskCardProps) {
  const pathname = usePathname();
  const [PrevPath, setPrevPath] = useState(pathname);
  // const [IsLoadingPath, setIsLoadingPath] = useState(false);
  // const HandleClickedTaskCard = () => {
  //   setIsLoadingPath(true);
  // }
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
    const HandleHideMenu = (e) => {
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
            <TaskToggleButton />
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
                Mai 31, 2025
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

interface Task {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  uuid: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
}

export default function Task_Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
//   const tasks = [
//     {
//   id: "task-001",
//   title: "Design new landing page",
//   description: "Create a modern and responsive landing page for the product website.",
//   status: "active", // قيم ممكنة: 'active', 'completed', 'pending', 'archived', إلخ
//   priority: "high", // قيم ممكنة: 'low', 'medium', 'high'
//   dueDate: "2025-07-10T18:00:00Z", // صيغة ISO للتاريخ والوقت
//   createdAt: "2025-06-20T10:00:00Z",
//   assignedTo: {
//     id: "user-123",
//     name: "Mostafa Jaafari",
//     email: "mostafa@example.com",
//   },
//   tags: ["design", "frontend", "UI"],
//   commentsCount: 5,
//   subtasks: [
//     { id: "subtask-001", title: "Create wireframes", completed: true },
//     { id: "subtask-002", title: "Design mockups", completed: false },
//     { id: "subtask-003", title: "Implement responsive CSS", completed: false },
//   ],
// },
//   ];

  const [loading, setLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!session) return;
    const userEmail = session?.data?.user?.email;
    if (!userEmail) return;

    const unsubscribe = onSnapshot(doc(db, 'users', userEmail), (snapshot) => {
      const userTasks = snapshot.data()?.tasks || [];
      setTasks(userTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [status, session]);

  if (loading) {
    return (
      <div className='w-full grid grid-cols-5 gap-4'>
        {Array(5).fill(0).map((_, index) => (
          <section
            key={index}
            className="animate-pulse w-45 h-45 bg-gradient-to-b 
              from-neutral-900 to-neutral-800 rounded-xl border 
              border-neutral-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 pt-8 gap-4">
      {tasks.map((task, index) => {
        return (
          <TaskCard
            key={task.uuid || index}
            title={task.title}
            description={task.description || ""}
            status={task.status}
          />
        );
      })}
    </div>
  );
}
