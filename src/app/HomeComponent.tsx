'use client';
import {
  ArrowUp,
  Paperclip,
  Sunset,
  Plus,
  Calendar,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRecentNotes } from './useRecentNotes';
import Link from 'next/link';

export default function HomeComponent() {
  const [noteText, setNoteText] = useState('');
  const { data: session } = useSession();
  const User_Name = session?.user?.name;

  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Daily Planning', icon: Calendar, color: 'bg-blue-500', completed: false },
    { id: 2, title: 'Quick Note', icon: Zap, color: 'bg-purple-500', completed: false },
    { id: 3, title: 'Priority Task', icon: Star, color: 'bg-orange-500', completed: false },
    { id: 4, title: 'Time Tracking', icon: Clock, color: 'bg-green-500', completed: false }
  ]);

  const { recentNotes, loading } = useRecentNotes(3);

  const handleQuickAction = (id: number) => {
    setQuickActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening';
  const greetingIcon =
    currentHour < 12 ? '🌅' : currentHour < 17 ? '☀️' : '🌅';

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <main className="w-full min-h-screen p-4">
      <section className="max-w-6xl mx-auto">
        {/* Greeting Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-3xl animate-pulse">{greetingIcon}</div>
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent flex-1 max-w-32"></div>
            <Sunset size={32} className="text-orange-400" />
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent flex-1 max-w-32"></div>
          </div>
          <h1 className="text-4xl font-light text-neutral-400 mb-2">
            {greeting},{' '}
            <span className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {User_Name}
            </span>
          </h1>
          <p className="text-neutral-500 text-lg">Ready to make today productive?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Taking Section */}
          <div className="lg:col-span-2">
            {/* Quick Capture */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-neutral-200 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" />
                    Quick Capture
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-500">
                      {noteText.length}/500
                    </span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="What's on your mind? Start typing to capture your thoughts..."
                    rows={6}
                    maxLength={500}
                    className="w-full p-4 bg-neutral-900/50 border border-neutral-700 rounded-lg text-neutral-200 
                      placeholder-neutral-500 resize-none outline-none focus:border-orange-400 focus:ring-2 
                      focus:ring-orange-400/20 transition-all duration-200"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-neutral-700/50 transition-colors group">
                      <Paperclip size={16} className="text-neutral-400 group-hover:text-orange-400" />
                    </button>
                    <button className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 
                      hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 
                      transform hover:scale-105 shadow-lg">
                      <ArrowUp size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Recent Notes - Dynamic from Firebase */}
            <div className="mt-6 bg-neutral-800/30 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-blue-400" />
                Recent Notes
              </h3>

              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-neutral-700/50 rounded"></div>
                  ))}
                </div>
              ) : recentNotes.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <p>No recent notes yet</p>
                  <p className="text-sm">Start creating notes to see them here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Link
                      key={note.uuid}
                      href={`/notes/${note?.uuid}`}
                      className="flex p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/30 
                        hover:border-neutral-600 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-200 group-hover:text-orange-400 transition-colors">
                            {note.title || 'Untitled Note'}
                          </h4>
                          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                            {note.preview || note.content?.slice(0, 100)}
                          </p>
                        </div>
                        <span className="text-xs text-neutral-600 ml-4 whitespace-nowrap">
                          {formatTimeAgo(note.lastAccessed)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-green-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className={`w-full p-3 rounded-lg border border-neutral-700/50 
                        hover:border-neutral-600 transition-all duration-200 group
                        ${action.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-neutral-800/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color} ${action.completed ? 'opacity-60' : ''}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <span className={`text-sm font-medium ${action.completed ? 'text-green-400 line-through' : 'text-neutral-200'}`}>
                          {action.title}
                        </span>
                        {action.completed && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-800/30 backdrop-blur-sm 
              border border-neutral-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-neutral-200 mb-4">Today&apos;s Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Notes Created</span>
                  <span className="text-2xl font-bold text-orange-400">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Tasks Completed</span>
                  <span className="text-2xl font-bold text-green-400">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Productivity</span>
                  <span className="text-2xl font-bold text-blue-400">85%</span>
                </div>
                <div className="w-full bg-neutral-700/50 rounded-full h-2 mt-4">
                  <div className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full w-4/5 
                    transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
