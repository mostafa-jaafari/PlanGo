'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Ellipsis, GripHorizontal, OctagonAlert, Pen, PlusIcon, Trash2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/FireBase';
import { toast } from 'sonner';
import { updateDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  index: number;
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
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-white ${currentOption.color} hover:opacity-90 transition-all duration-200 shadow-sm`}
      >
        <span className="w-2 h-2 rounded-full bg-white/40"></span>
        {currentOption.label}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-black border border-neutral-700 rounded-lg py-1 z-50 min-w-max shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              className={`w-full text-left px-3 py-2 hover:bg-neutral-800 text-xs flex items-center gap-2 transition-colors duration-150 ${
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

function TaskCard({ title, description, currenttask, date, uuid, onEdit, index }: TaskCardProps) {
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
    <Draggable draggableId={uuid || `task-${index}`} index={index}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative w-full flex flex-col items-center space-y-3 p-4 bg-black rounded-xl 
            border border-neutral-800 transition-all duration-300 ease-out group hover:border-neutral-700 ${
            snapshot.isDragging 
              ? 'shadow-2xl shadow-yellow-500/30 border-yellow-500/60 scale-105 rotate-2 z-50 bg-black/95 backdrop-blur-[1px]' 
              : 'hover:shadow-lg hover:shadow-neutral-900/50 hover:-translate-y-1'
          }`}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
              : provided.draggableProps.style?.transform,
          }}
        >
          {/* Enhanced Drag Handle */}
          <div 
            {...provided.dragHandleProps}
            className={`absolute top-0 left-1/2 -translate-x-1/2 py-2 px-4 flex justify-center items-center cursor-grab active:cursor-grabbing rounded-b-lg transition-all duration-200 ${
              snapshot.isDragging 
                ? 'bg-yellow-500/20 text-yellow-400' 
                : 'bg-neutral-900/50 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
            }`}
          >
            <GripHorizontal size={18} className="transition-transform duration-200 hover:scale-110" />
          </div>
          
          {/* Task Card Content */}
          <div className='flex items-start justify-between pt-6 w-full'>
            <div className='flex flex-col space-y-2 flex-1'>
              <h3 className="font-medium text-white text-base leading-tight">{title}</h3>
              <p className='text-sm text-neutral-400 pl-2 leading-relaxed'>{description}</p>
            </div>
          </div>
          
          <div className="w-full flex justify-start">
            <TaskDropDownMenu
              CurrentStatus={
                ['incomplete', 'inprogress', 'completed'].includes(currenttask)
                  ? (currenttask as 'incomplete' | 'inprogress' | 'completed')
                  : 'incomplete'
              }
              onStatusChange={handleStatusChange}
            />
          </div>
          
          {/* Enhanced Divider */}
          <div className='w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent'/>
          
          {/* Bottom Section */}
          <div className='w-full flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <div className='relative w-8 h-8 border border-neutral-700 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-neutral-600 transition-all duration-200'>
                <Image
                  src={session?.data?.user?.image as string}
                  alt=''
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex flex-col text-xs'>
                <span className="text-neutral-300 font-medium">{session?.data?.user?.name || '...'}</span>
                <span className="text-neutral-500">{formatDate(date)}</span>
              </div>
            </div>
            
            {/* Enhanced Options Menu */}
            <div className='relative'>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOptionsOpen(!IsOptionsOpen);
                }}
                className='flex items-center justify-center w-8 h-8 border border-neutral-700 
                rounded-full cursor-pointer hover:bg-neutral-800 hover:border-neutral-600 
                transition-all duration-200 group/btn'
              >
                <Ellipsis size={14} className="text-neutral-400 group-hover/btn:text-neutral-300" />
              </button>
              
              {IsOptionsOpen && (
                <div 
                  ref={MenuRef}
                  className='absolute z-50 right-0 top-full mt-2
                  bg-black border border-neutral-700 
                  rounded-lg p-1 flex flex-col shadow-lg
                  animate-in fade-in-0 zoom-in-95 duration-200'
                >
                  {[{label: 'Edit', icon: Pen}, {label: 'Delete', icon: Trash2}].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => HandleOptionsFunction(option.label.toLowerCase() as 'edit' | 'delete')}
                      className={`text-sm px-3 py-2 rounded-md cursor-pointer transition-all duration-150 flex items-center gap-2 min-w-max
                        ${option.label.toLowerCase() === "delete" 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                        }`}
                    >
                      <span className="text-xs">
                        <option.icon size={16} />
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </Draggable>
  );
}

export interface Task {
  title: string;
  date: string | { seconds: number; nanoseconds?: number };
  uuid: string;
  lastupdate?: { seconds: number; nanoseconds?: number };
  description?: string;
  status: string;
  order?: number;
}

export default function Task_Page() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const session = useSession();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [Inputs, setInputs] = useState({
    title: '',
    description: '',
    status: 'incomplete',
  });

  const params = useSearchParams();
  const sortParam = params.get('sort');

  const filteredTasks = Tasks.filter(task => {
    if (sortParam === 'incomplete') return task.status === 'incomplete';
    if (sortParam === 'inprogress') return task.status === 'inprogress';
    if (sortParam === 'completed') return task.status === 'completed';
    return true; // Default to showing all tasks if no filter is applied
  });
  useEffect(() => {
    if (!session?.data?.user?.email) return;

    const userDocRef = doc(db, "users", session?.data?.user?.email);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const data = snapshot.data();
      let tasks: Task[] = data?.tasks || [];
      
      // Sort tasks by order, then by date if order is not set
      tasks = tasks.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        
        // Fallback to date sorting
        const aDate = typeof a.date === 'object' ? a.date.seconds : new Date(a.date).getTime() / 1000;
        const bDate = typeof b.date === 'object' ? b.date.seconds : new Date(b.date).getTime() / 1000;
        return bDate - aDate;
      });
      
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

  // Enhanced drag handlers
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    setIsDragging(false);
    
    if (!result.destination) return;

    const items = Array.from(Tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all tasks
    const updatedTasks = items.map((task, index) => ({
      ...task,
      order: index
    }));

    // Update local state immediately for smooth UX
    setTasks(updatedTasks);

    // Save to Firebase
    try {
      const email = session?.data?.user?.email;
      if (!email) return;

      const DocRef = doc(db, 'users', email);
      await setDoc(DocRef, { tasks: updatedTasks }, { merge: true });
      toast.success('Task order saved');
    } catch (error) {
      console.error('Error saving task order:', error);
      toast.error('Failed to save task order');
      // Revert on error
      setTasks(Tasks);
    }
  };

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
        // Add new task - place at the end
        const newTask = {
          title: Inputs.title,
          description: Inputs.description,
          status: Inputs.status,
          date: new Date(),
          uuid: uuidv4(),
          order: oldTasks.length
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
      <div className="w-full py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
          <section
            key={index}
            className="flex flex-col items-center space-y-3 p-4 bg-black rounded-xl border border-neutral-800 animate-pulse"
          >
            <div className="flex items-start justify-between w-full pt-6">
              <div className="flex flex-col space-y-2 w-3/4">
                <div className="h-4 w-2/3 bg-neutral-800 rounded" />
                <div className="h-3 w-1/2 bg-neutral-900 rounded ml-2" />
              </div>
            </div>
            <div className="w-16 h-6 bg-neutral-800 rounded-full mt-2" />
            <div className="w-full h-px bg-neutral-800" />
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 border rounded-full overflow-hidden bg-neutral-800" />
                <div className="flex flex-col space-y-1">
                  <div className="h-3 w-12 bg-neutral-800 rounded" />
                  <div className="h-2 w-10 bg-neutral-900 rounded" />
                </div>
              </div>
              <div className="w-8 h-8 bg-neutral-800 rounded-full" />
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-8 gap-6 transition-all duration-300 ${
              snapshot.isDraggingOver ? 'bg-neutral-900/20' : ''
            } ${isDragging ? 'select-none' : ''}`}
          >
            {filteredTasks?.length > 0 ? filteredTasks.map((task, index) => {
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
                  index={index}
                  onEdit={() => HandleEditTask(task)}
                />
              );
            }) : (
              <div className="flex flex-col space-y-4 text-neutral-400 items-center justify-center col-span-full py-20">
                <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center">
                  <OctagonAlert size={24} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                  <p className="text-sm text-neutral-500">Create your first task to get started!</p>
                </div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      
      {/* Enhanced Floating Action Button */}
      <button
        onClick={() => setIsOpenMenu(!IsOpenMenu)}
        className='fixed right-6 bottom-6 z-40
            bg-gradient-to-r from-yellow-500 to-yellow-600 text-white
            px-4 py-3 rounded-full shadow-lg hover:shadow-xl
            hover:from-yellow-600 hover:to-yellow-700 
            cursor-pointer flex items-center gap-2 
            transition-all duration-300 ease-out
            hover:scale-105 active:scale-95
            group border border-yellow-400/20'
      >
        <PlusIcon size={20} className='flex-shrink-0 group-hover:rotate-90 transition-transform duration-300'/> 
        <span className='font-medium'>New Task</span>
      </button>
      
      {/* Enhanced Modal */}
      {IsOpenMenu && (
        <section 
          className='fixed z-50 top-0 left-0 w-full 
          h-screen bg-black/40 backdrop-blur-[1px]
          flex justify-center items-center p-4
          animate-in fade-in-0 duration-300'>
          <div
            ref={MenuRef}
            className='w-full max-w-md
                bg-black border border-neutral-700 rounded-2xl
                shadow-2xl animate-in zoom-in-95 duration-300'
          >
            <form 
              onSubmit={(e) => {e.preventDefault()}}
              className="p-6"
            >
              <div className='flex justify-between items-center mb-6'>
                <h2 className="text-xl font-semibold text-white">
                  {selectedTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button 
                  type="button"
                  onClick={() => {
                    setIsOpenMenu(false);
                    setSelectedTask(null);
                    setInputs({
                      title: '',
                      description: '',
                      status: 'incomplete',
                    });
                  }}
                  className='text-neutral-400 hover:text-white w-8 h-8 
                      rounded-full flex items-center justify-center
                      border border-neutral-700 hover:border-neutral-600
                      transition-all duration-200'
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className='flex flex-col gap-4'>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
                  <input 
                    type="text"
                    value={Inputs.title}
                    onChange={(e) => setInputs({...Inputs, title: e.target.value})}
                    autoFocus
                    autoComplete="off"
                    maxLength={100}
                    minLength={3}
                    placeholder="Enter task title"
                    className='w-full p-3 bg-neutral-900 border border-neutral-700 
                        text-white rounded-lg transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-yellow-500 placeholder-neutral-500'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                  <textarea 
                    value={Inputs.description}
                    onChange={(e) => setInputs({...Inputs, description: e.target.value})}
                    placeholder="Enter task description"
                    rows={3}
                    className='w-full p-3 bg-neutral-900 border border-neutral-700 
                        text-white rounded-lg resize-none transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-yellow-500 placeholder-neutral-500'
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Status</label>
                  <select 
                    onChange={(e) => setInputs({...Inputs, status: e.target.value})}
                    value={Inputs.status}
                    className='w-full p-3 bg-neutral-900 border border-neutral-700 
                        text-white rounded-lg transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-yellow-500 
                        focus:border-yellow-500'
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  onClick={HandleAddNewTask}
                  disabled={IsEditButton}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 mt-2 ${
                    IsEditButton 
                      ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg active:scale-95'
                  }`}
                >
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </DragDropContext>
  );
}