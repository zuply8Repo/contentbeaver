'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostSchedule, { PostSchedule as PostScheduleType } from '@/app/ui/post-schedule';

interface Post {
  id: number;
  image: string;
  caption: string;
}

export default function PostScheduleTestPage() {
  const router = useRouter();
  const [selectedSchedule, setSelectedSchedule] = useState<PostScheduleType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts] = useState<Post[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
      caption: 'Check out our latest product launch! 🚀 Excited to share what we\'ve been working on.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=400&fit=crop',
      caption: 'Behind the scenes of our creative process. Every detail matters! ✨',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
      caption: 'New collection dropping soon! Stay tuned for something special. 💫',
    },
  ]);
  const [draggedPost, setDraggedPost] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<Map<string, Post>>(new Map());

  const handleSubmit = (schedule: PostScheduleType) => {
    console.log('Schedule submitted:', schedule);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedSchedule(schedule);
      alert(
        `Post scheduled! Timeline: ${schedule.timeline}, Date: ${schedule.date?.toLocaleDateString() || 'N/A'}, Time: ${schedule.time || 'N/A'}`
      );
    }, 1000);
  };

  const handleSave = (schedule: Partial<PostScheduleType>) => {
    console.log('Schedule auto-saved:', schedule);
  };

  const handleChange = (schedule: PostScheduleType) => {
    console.log('Schedule changed:', schedule);
    setSelectedSchedule(schedule);
  };

  const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const handleDateDrop = (date: Date, postId?: string) => {
    console.log('Post dropped on date:', date, 'Post ID:', postId);
    const postIdNum = postId ? parseInt(postId) : null;
    if (postIdNum) {
      const post = posts.find(p => p.id === postIdNum);
      if (post) {
        const dateKey = getDateKey(date);
        setScheduledPosts(prev => new Map(prev).set(dateKey, post));
      }
    }
    const newSchedule: PostScheduleType = {
      timeline: 'later',
      date,
      time: selectedSchedule?.time || '',
    };
    setSelectedSchedule(newSchedule);
    alert(`Post ${postId || 'selected'} scheduled for ${date.toLocaleDateString()}`);
  };

  const handlePostSelect = (postId: number) => {
    setSelectedPost(selectedPost === postId ? null : postId);
  };

  const schedulePost = (date: Date, time: string, postId: string) => {
    const postIdNum = parseInt(postId);
    const post = posts.find(p => p.id === postIdNum);
    if (post) {
      const dateKey = getDateKey(date);
      setScheduledPosts(prev => new Map(prev).set(dateKey, post));
    }
    
    const newSchedule: PostScheduleType = {
      timeline: 'later',
      date,
      time,
    };
    setSelectedSchedule(newSchedule);
    setSelectedPost(null); // Clear selection after scheduling
    
    const timeDisplay = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    alert(`Post ${postId} scheduled for ${date.toLocaleDateString()} at ${timeDisplay}`);
  };

  const handleDateSelect = (date: Date, postId?: string) => {
    const postIdToUse = postId || selectedPost?.toString();
    
    // If a post is selected and time is already selected, schedule immediately
    if (postIdToUse && selectedSchedule?.time) {
      schedulePost(date, selectedSchedule.time, postIdToUse);
    } else if (postIdToUse) {
      // Otherwise, just update the date and wait for time
      const newSchedule: PostScheduleType = {
        timeline: 'later',
        date,
        time: selectedSchedule?.time || '',
      };
      setSelectedSchedule(newSchedule);
    }
  };

  const handleTimeSelect = (time: string, postId?: string) => {
    const postIdToUse = postId || selectedPost?.toString();
    
    // Schedule the post when both date and time are selected
    if (postIdToUse && selectedSchedule?.date) {
      schedulePost(selectedSchedule.date, time, postIdToUse);
    } else if (postIdToUse) {
      // Otherwise, just update the time and wait for date
      const newSchedule: PostScheduleType = {
        timeline: 'later',
        date: selectedSchedule?.date || null,
        time,
      };
      setSelectedSchedule(newSchedule);
    }
  };

  const handleDragStart = (e: React.DragEvent, postId: number) => {
    setDraggedPost(postId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', postId.toString());
  };

  const handleDragEnd = () => {
    setDraggedPost(null);
  };

  const handlePostClick = (e: React.MouseEvent, postId: number) => {
    // Prevent click if we just finished dragging
    if (draggedPost === postId) {
      return;
    }
    handlePostSelect(postId);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Post Schedule Test
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Select a timeline and schedule your image and caption post.
          </p>

          {/* Reset Calendar Button */}
          <button
            onClick={() => {
              setScheduledPosts(new Map());
              setSelectedSchedule(null);
              setSelectedPost(null);
            }}
            className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded shadow disabled:opacity-50"
          >
            Reset Calendar
          </button>
        </div>

        {/* Posts Preview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Scheduled Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                draggable
                onClick={(e) => handlePostClick(e, post.id)}
                onDragStart={(e) => handleDragStart(e, post.id)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg border-2 overflow-hidden 
                  transition-all duration-200 cursor-pointer
                  ${
                    selectedPost === post.id
                      ? 'border-indigo-600 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900 shadow-xl scale-105'
                      : draggedPost === post.id
                      ? 'opacity-50 scale-95 border-indigo-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600'
                  }
                `}
              >
                {/* Selection indicator */}
                {selectedPost === post.id && (
                  <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white rounded-full p-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                {/* Drag indicator */}
                <div className="absolute top-2 right-2 z-10 bg-indigo-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </div>
                {/* Image */}
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
                {/* Caption */}
                <div className="p-4">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                    {post.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Post Indicator */}
        {selectedPost && (
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-indigo-900 dark:text-indigo-100">
              <strong>Post {selectedPost}</strong> selected. Click on a date and time to schedule it.
            </p>
          </div>
        )}

        {/* Post Schedule Component */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
          <PostSchedule
            onSubmit={handleSubmit}
            onSave={handleSave}
            onChange={handleChange}
            onDateDrop={handleDateDrop}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            selectedPostId={selectedPost?.toString()}
            scheduledPosts={scheduledPosts}
            isLoading={isSubmitting}
          />
        </div>

        {/* Current Schedule Display */}
        {selectedSchedule && (
          <div className="mt-8 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Current Schedule
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Timeline:</span>
                <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                  {selectedSchedule.timeline}
                </span>
              </div>
              {selectedSchedule.date && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Date:</span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {selectedSchedule.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {selectedSchedule.time && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Time:</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{selectedSchedule.time}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                Testing Features
              </h3>
              <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <li>• <strong>Click a post</strong> to select it, then click a date and time to schedule</li>
                <li>• <strong>Drag and drop posts</strong> onto calendar dates to schedule them</li>
                <li>• Select different timeline options (Post Now, Schedule for Later, Save as Draft)</li>
                <li>• When "Schedule for Later" is selected, a calendar appears</li>
                <li>• Navigate between months using the arrow buttons</li>
                <li>• Click on a date to select it (past dates are disabled)</li>
                <li>• Select a time using the time dropdown</li>
                <li>• The selected date and time are displayed below the calendar</li>
                <li>• Check browser console for onChange and onSave callbacks</li>
                <li>• Test in dark mode (toggle system theme)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

