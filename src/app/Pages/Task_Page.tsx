'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Ellipsis, GripHorizontal, OctagonAlert, PlusIcon, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/FireBase';
import { toast } from 'sonner';
import { updateDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  currenttask: string;
  date?: string | { seconds: number; nanoseconds?: number };
  uuid?: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
  onEdit?: () => void;
  setIsOpenMenu?: boolean;
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

// Updated TaskDropDownMenu component
interface TaskDropDownMenuProps {
  CurrentStatus: 'incomplete' | 'inprogress' | 'completed';
  onStatusChange: (newStatus: string) => void;
}

function TaskDropDownMenu({ CurrentStatus, onStatusChange }: TaskDropDownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: 'incomplete', label: 'Incomplete', color: 'bg-red-500' },
    { value: 'inprogress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'completed', label: 'Completed', color: 'bg-green-500' }
  ];

  const currentOption = statusOptions.find(option => option.value === CurrentStatus) || statusOptions[0];

  const handleStatusSelect = (newStatus: string) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs text-white ${currentOption.color} hover:opacity-80 transition-opacity`}
      >
        <span className="w-2 h-2 rounded-full bg-white/30"></span>
        {currentOption.label}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-black border border-neutral-700 rounded-lg py-1 z-50 min-w-max">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              className={`w-full text-left px-3 py-2 hover:bg-neutral-800 text-xs flex items-center gap-2 ${
                option.value === CurrentStatus ? 'bg-neutral-800' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${option.color}`}></span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskCard({ title, description, currenttask, date, uuid, onEdit }: TaskCardProps) {
  const pathname = usePathname();
  const [PrevPath, setPrevPath] = useState(pathname);
  
  useEffect(() => {
    if (pathname !== PrevPath) {
      setPrevPath(pathname);
    }
  }, [pathname, PrevPath]);

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
  }, []);

  // Add this function to handle status updates
  const handleStatusChange = async (newStatus: string) => {
    if (!uuid || !session?.data?.user?.email) return;

    try {
      const userDocRef = doc(db, "users", session.data.user.email);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) return;
      
      const data = docSnap.data();
      const tasks = (data.tasks || []).map((task: Task) => 
        task.uuid === uuid 
          ? { ...task, status: newStatus, lastupdate: new Date() }
          : task
      );
      
      await updateDoc(userDocRef, { tasks });
      toast.success("Task status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task status");
    }
  };

  const HandleOptionsFunction = (option: 'edit' | 'delete') => {
    if (option === 'edit') {
      if (onEdit) onEdit();
      setIsOptionsOpen(false);
    } else if (option === 'delete') {
      if (!uuid || !session?.data?.user?.email) return;
      const userDocRef = doc(db, "users", session.data.user.email);
      getDoc(userDocRef).then((docSnap) => {
        if (!docSnap.exists()) return;
        const data = docSnap.data();
        const tasks = (data.tasks || []).filter((task: Task) => task.uuid !== uuid);
        updateDoc(userDocRef, { tasks })
          .then(() => toast.success("Task deleted"))
          .catch(() => toast.error("Failed to delete task"));
      });
    }
    setIsOptionsOpen(false);
  }

  return (
    <section
      className='relative w-full flex flex-col items-center space-y-2 p-4 bg-black rounded-lg 
        border border-neutral-900'
    >
      <div 
        className='absolute top-0 left-0
          w-full py-2 flex justify-center items-center'>
        <span 
          className='cursor-move text-neutral-500 
            hover:text-neutral-300'>
          <GripHorizontal size={20} />
        </span>
      </div>
      
      {/* -------- Top of Task Card -------- */}
      <div className='flex items-start justify-between pt-4'>
        <div className='flex flex-col space-y-2'>
          <span>{title}</span>
          <span className='text-sm text-neutral-600 pl-2'>{description}</span>
        </div>
      </div>
      
      <div>
        <TaskDropDownMenu
          CurrentStatus={
            ['incomplete', 'inprogress', 'completed'].includes(currenttask)
              ? (currenttask as 'incomplete' | 'inprogress' | 'completed')
              : 'incomplete'
          }
          onStatusChange={handleStatusChange}
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
            <span>{session?.data?.user?.name || '...'}</span>
            <span>{formatDate(date)}</span>
          </div>
        </div>
        
        {/* -------- Options Icon -------- */}
        <div className='relative grow flex justify-end'>
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
              className='absolute z-40 right-0 top-full
              bg-black border border-neutral-900 
              rounded-lg p-2 flex flex-col space-y-1'>
                  {[{label: 'Edit'}, {label: 'Delete'}].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => HandleOptionsFunction(option.label.toLowerCase() as 'edit' | 'delete')}
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
  status: string;
}

// Updated HandleEditTask function to also handle status updates
export default function Task_Page() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [Inputs, setInputs] = useState({
    title: '',
    description: '',
    status: 'incomplete',
  });

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

  const [IsOpenMenu, setIsOpenMenu] = useState(false);
  const MenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (MenuRef.current && !MenuRef.current.contains(event.target as Node)) {
        setIsOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const HandleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsOpenMenu(true);
    setInputs({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
  }

  const [IsEditButton, setIsEditButton] = useState(false);
  useEffect(() => {
    if(Inputs.title === selectedTask?.title && 
       Inputs.description === selectedTask?.description && 
       Inputs.status === selectedTask?.status){
      setIsEditButton(true);
    } else {
      setIsEditButton(false);
    }
  }, [Inputs, selectedTask]);

  // Updated HandleAddNewTask to also handle editing
  const HandleAddNewTask = async () => {
    try {
      const email = session?.data?.user?.email;
      if (!email) throw new Error('User not logged in');

      if (Inputs.title.length < 3 || Inputs.title.length > 100) {
        toast.error('Title must be between 3 and 100 characters');
        return;
      }

      const DocRef = doc(db, 'users', email);
      const docSnap = await getDoc(DocRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      const oldTasks = existingData.tasks || [];

      let updatedTasks;

      if (selectedTask) {
        // Edit existing task
        updatedTasks = oldTasks.map((task: Task) => 
          task.uuid === selectedTask.uuid 
            ? { 
                ...task, 
                title: Inputs.title,
                description: Inputs.description,
                status: Inputs.status,
                lastupdate: new Date()
              }
            : task
        );
        toast.success('Task updated successfully');
      } else {
        // Add new task
        const newTask = {
          title: Inputs.title,
          description: Inputs.description,
          status: Inputs.status,
          date: new Date(),
          uuid: uuidv4(),
        };
        updatedTasks = [...oldTasks, newTask];
        toast.success('Task added successfully');
      }

      await setDoc(DocRef, { tasks: updatedTasks }, { merge: true });

      setInputs({
        title: '',
        description: '',
        status: 'incomplete',
      });
      setIsOpenMenu(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("🔥 Error with task:", err);
      toast.error('Failed to save task');
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {Array(5).fill(0).map((_, index) => (
          <section
        key={index}
        className="flex flex-col items-center space-y-2 p-4 bg-black rounded-lg border border-neutral-900 animate-pulse"
          >
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col space-y-2 w-3/4">
            <span className="h-4 w-2/3 bg-neutral-800 rounded" />
            <span className="h-3 w-1/2 bg-neutral-900 rounded ml-2" />
          </div>
        </div>
        <div className="w-16 h-6 bg-neutral-900 rounded mt-2" />
        <hr className="border-neutral-900/50 w-full" />
        <div className="w-full flex justify-between items-center pt-2">
          <div className="flex items-center space-x-2">
            <div className="relative w-9 h-9 border rounded-full overflow-hidden bg-neutral-900" />
            <div className="flex flex-col items-center text-xs text-neutral-700">
          <span className="h-3 w-12 bg-neutral-900 rounded mb-1" />
          <span className="h-2 w-10 bg-neutral-900 rounded" />
            </div>
          </div>
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
    <div className="w-full grid grid-cols-2 py-8 md:grid-cols-3 lg:grid-cols-3 pt-8 gap-4">
      {Tasks?.length > 0 ? Tasks.map((task, index) => {
        return (
          <TaskCard
            key={task.uuid || index}
            title={task.title}
            description={task.description || ""}
            status={task.status}
            date={task.date}
            lastupdate={task?.lastupdate}
            currenttask={task.status || "incomplete"}
            uuid={task.uuid}
            onEdit={() => HandleEditTask(task)}
          />
        );
      }) : (
        <div className="flex flex-col space-y-4 text-neutral-500 items-center justify-center col-span-full py-20">
          <OctagonAlert size={30} />
          <h2 className="text-center">
            No tasks available. Please add a task.
          </h2>
        </div>
      )}
      
      <button
        onClick={() => setIsOpenMenu(!IsOpenMenu)}
        className='w-13 hover:w-max fixed right-8 bottom-8 
            bg-yellow-600 text-white px-4 py-2 
            rounded-md hover:bg-yellow-700 cursor-pointer
            flex items-center gap-8 hover:gap-2 
            overflow-hidden transition-all duration-300'>
        <PlusIcon className='flex-shrink-0'/> <span className='text-nowrap pr-'>New Task</span>
      </button>
      
      {IsOpenMenu && (
        <section 
          className='fixed z-50 top-0 left-0 w-full 
          h-screen bg-black/20 backdrop-blur-[1px]
          flex justify-center pt-20'>
            <div
              ref={MenuRef}
              className='w-[500px] min-h-20 h-max
                  bg-black border border-neutral-900 rounded-lg'>
              <form 
                action="" 
                method="post"
                onSubmit={(e) => {e.preventDefault()}}
              >
                <div className='w-full flex justify-end p-2'>
                  <span 
                    onClick={() => {
                      setIsOpenMenu(false);
                      setSelectedTask(null);
                      setInputs({
                        title: '',
                        description: '',
                        status: 'incomplete',
                      });
                    }}
                    className='text-neutral-500 cursor-pointer 
                        hover:text-neutral-300 w-max p-0.5 
                        rounded-full flex border'>
                    <X size={18} />
                  </span>
                </div>
                <div className='flex flex-col gap-4 p-4'>
                  <input 
                    type="text"
                    value={Inputs.title}
                    onChange={(e) => setInputs({...Inputs, title: e.target.value})}
                    name="title"
                    id="title"
                    autoFocus
                    autoComplete="off"
                    maxLength={100}
                    minLength={3}
                    placeholder="Enter task title"
                    className='w-full p-2 border-neutral-900 
                        text-white rounded-md border 
                        focus:outline-none 
                        focus:ring-1 focus:ring-yellow-500'
                    />
                  <input 
                    type="text"
                    value={Inputs.description}
                    onChange={(e) => setInputs({...Inputs, description: e.target.value})}
                    name="description"
                    id="description"
                    placeholder="Enter task description"
                    className='w-full p-2 border-neutral-900 
                        text-white rounded-md border 
                        focus:outline-none 
                        focus:ring-1 focus:ring-yellow-500'
                    />
                  <select 
                    name="status"
                    onChange={(e) => setInputs({...Inputs, status: e.target.value})}
                    value={Inputs.status}
                    id="status"
                    className='w-full p-2 border-neutral-900 
                        text-white rounded-md border 
                        focus:outline-none 
                        focus:ring-1 focus:ring-yellow-500
                        focus:text-yellow-500'
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    type="submit"
                    onClick={() => HandleAddNewTask()}
                    disabled={IsEditButton}
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-300 ${
                      IsEditButton 
                        ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed' 
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}>
                    {selectedTask ? 'Update Task' : 'Add New'}
                  </button>
                </div>
              </form>
            </div>
        </section>
      )}
    </div>
  );
}