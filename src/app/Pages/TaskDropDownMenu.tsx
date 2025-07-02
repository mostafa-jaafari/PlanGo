'use client';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/FireBase';
import { Task } from './Task_Page';
import { toast, Toaster } from 'sonner';

const STATUS_OPTIONS = [
  { label: 'Task Incomplete', value: 'incomplete' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Task Completed', value: 'completed' },
];

type TaskDropDownMenuProps = {
  CurrentStatus: 'incomplete' | 'inprogress' | 'completed';
};

export default function TaskDropDownMenu({ CurrentStatus }: TaskDropDownMenuProps) {
  const session = useSession();
  const [status, setStatus] = useState<'incomplete' | 'inprogress' | 'completed'>(CurrentStatus);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const currentStatus = STATUS_OPTIONS.find(opt => opt.value === status);

const HandleChooseStatus = async (newStatus: 'incomplete' | 'inprogress' | 'completed') => {
  setStatus(newStatus);
  setMenuOpen(false);

  try {
    const email = session?.data?.user?.email;
    if (!email) {
      toast.info("No email found");
      return;
    }

    const userRef = doc(db, "users", email);

    // 🧠 Get the user document first
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      toast.info("User document not found!");
      return;
    }

    const userData = userSnap.data();
    const oldTasks = userData.tasks || [];

    // 🛠 Update task status (you can customize how to identify the task)
    const updatedTasks = oldTasks.map((task : Task) => {
      if (task.status === status) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    // ✅ Save updated tasks
    await updateDoc(userRef, {
      tasks: updatedTasks,
    });

    toast.success("✅ Status updated!");
  } catch (error) {
    toast.error(error as string);
  }
};

  return (
    <div className="relative flex items-center gap-4" ref={menuRef}>
      <Toaster
        position='top-center'
      />
      {/* Button */}
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className={`w-max h-10 rounded-full flex 
          items-center justify-start px-4 gap-1
          transition-colors duration-300 border ${
          status === 'completed'
            ? 'text-green-500 border-green-500/30'
            : status === 'inprogress'
            ? 'text-yellow-400 border-yellow-400/30'
            : 'text-red-500 border-red-900/50'
        }`}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
      >
        <span className="text-sm font-medium">{currentStatus?.label}</span>
        <svg className="ml-auto w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Status Menu */}
      {menuOpen && (
        <div 
          className="absolute left-0 top-12 z-10 w-full bg-black 
            border border-neutral-900 rounded-lg shadow-md overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`w-full flex items-center gap-2 text-left text-sm px-4 py-2
              ${opt.value === 'completed' ? 'text-green-500' : opt.value === 'inprogress' ? 'text-yellow-400' : 'text-red-500'}
              ${status === opt.value 
                ? opt.value === 'completed' ? "bg-green-500/20" : opt.value === 'inprogress' ? "bg-yellow-400/20" : "bg-red-500/20"
                : 'hover:opacity-70 hover:bg-neutral-900/10 cursor-pointer'}
              `}
              onClick={() => HandleChooseStatus(opt.value as typeof status)}
            >
              <span className="w-2 h-2 rounded-full border flex"/>{opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
