'use client';

import { useState, useEffect } from 'react';

export interface PostSchedule {
  timeline: string;
  date: Date | null;
  time: string;
}

export interface ScheduledPost {
  id: number;
  image: string;
  caption: string;
}

export interface PostScheduleProps {
  onSubmit?: (schedule: PostSchedule) => void;
  onSave?: (schedule: Partial<PostSchedule>) => void;
  onChange?: (schedule: PostSchedule) => void;
  onDateDrop?: (date: Date, postId?: string) => void;
  onDateSelect?: (date: Date, postId?: string) => void;
  onTimeSelect?: (time: string, postId?: string) => void;
  onDeleteScheduledPost?: (dateKey: string) => void;
  selectedPostId?: string;
  scheduledPosts?: Map<string, ScheduledPost>;
  initialSchedule?: Partial<PostSchedule>;
  isLoading?: boolean;
  className?: string;
}

const TIMELINE_OPTIONS = [
  { value: 'now', label: 'Post Now', icon: '⚡' },
  { value: 'later', label: 'Schedule for Later', icon: '📅' },
  { value: 'draft', label: 'Save as Draft', icon: '💾' },
];

export default function PostSchedule({
  onSubmit,
  onSave,
  onChange,
  onDateDrop,
  onDateSelect,
  onTimeSelect,
  onDeleteScheduledPost,
  selectedPostId,
  scheduledPosts,
  initialSchedule,
  isLoading = false,
  className = '',
}: PostScheduleProps) {
  const [schedule, setSchedule] = useState<PostSchedule>({
    timeline: initialSchedule?.timeline || 'later',
    date: initialSchedule?.date || null,
    time: initialSchedule?.time || '',
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialSchedule?.date || null
  );
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draggedOverDate, setDraggedOverDate] = useState<Date | null>(null);

  // Initialize with today's date if timeline is 'later' and no date is set
  useEffect(() => {
    if (schedule.timeline === 'later' && !selectedDate) {
      const today = new Date();
      setSelectedDate(today);
      setSchedule((prev) => ({ ...prev, date: today }));
    }
  }, [schedule.timeline]);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && touched) {
      const timer = setTimeout(() => {
        onSave(schedule);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [schedule, onSave, touched]);

  // Call onChange when schedule changes
  useEffect(() => {
    if (onChange && touched) {
      onChange(schedule);
    }
  }, [schedule, onChange, touched]);

  const handleTimelineChange = (timeline: string) => {
    setTouched(true);
    const newSchedule = { ...schedule, timeline };
    if (timeline === 'now') {
      newSchedule.date = null;
      newSchedule.time = '';
      setSelectedDate(null);
    }
    setSchedule(newSchedule);
    setErrors({});
  };

  const handleDateSelect = (date: Date) => {
    setTouched(true);
    setSelectedDate(date);
    const newSchedule = { ...schedule, date, timeline: 'later' };
    setSchedule(newSchedule);
    setErrors({});
    
    // If a post is selected, call onDateSelect callback
    if (onDateSelect && selectedPostId) {
      onDateSelect(date, selectedPostId);
    }
  };

  const handleTimeChange = (time: string) => {
    setTouched(true);
    setSchedule({ ...schedule, time });
    setErrors({});
    
    // If a post is selected and date is set, call onTimeSelect callback
    if (onTimeSelect && selectedPostId && schedule.date) {
      onTimeSelect(time, selectedPostId);
    }
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    if (isPastDate(date)) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverDate(date);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    if (isPastDate(date)) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggedOverDate(null);
    
    const postId = e.dataTransfer.getData('text/plain');
    
    // Update schedule
    setTouched(true);
    setSelectedDate(date);
    const newSchedule = { ...schedule, date, timeline: 'later' };
    setSchedule(newSchedule);
    setErrors({});
    
    // Call onDateDrop callback if provided
    if (onDateDrop) {
      onDateDrop(date, postId || undefined);
    }
  };

  const handleSubmit = () => {
    // Validate
    const newErrors: Record<string, string> = {};
    if (schedule.timeline === 'later') {
      if (!schedule.date) {
        newErrors.date = 'Please select a date';
      }
      if (!schedule.time) {
        newErrors.time = 'Please select a time';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(schedule);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getScheduledPost = (date: Date): ScheduledPost | undefined => {
    if (!scheduledPosts) return undefined;
    const dateKey = getDateKey(date);
    return scheduledPosts.get(dateKey);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Timeline Selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          When would you like to post?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TIMELINE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleTimelineChange(option.value)}
              disabled={isLoading}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium
                ${
                  schedule.timeline === option.value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-indigo-300 dark:hover:border-indigo-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className="block text-lg mb-1">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar and Time Selection (only for 'later' timeline) */}
      {schedule.timeline === 'later' && (
        <div className="space-y-4">
          {/* Calendar */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Select Date
            </label>
            <div className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-4">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  aria-label="Previous month"
                >
                  <svg
                    className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {monthName}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  aria-label="Next month"
                >
                  <svg
                    className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(year, month, day);
                  const isPast = isPastDate(date);
                  const isSelectedDate = isSelected(date);
                  const isTodayDate = isToday(date);
                  const isDraggedOver = draggedOverDate && 
                    date.getDate() === draggedOverDate.getDate() &&
                    date.getMonth() === draggedOverDate.getMonth() &&
                    date.getFullYear() === draggedOverDate.getFullYear();
                  const scheduledPost = getScheduledPost(date);
                  const dateKey = getDateKey(date);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => !isPast && handleDateSelect(date)}
                      onDragOver={(e) => !isPast && handleDragOver(e, date)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => !isPast && handleDrop(e, date)}
                      disabled={isLoading || isPast}
                      className={`
                        aspect-square rounded-lg text-sm font-medium transition-all duration-150 relative overflow-hidden
                        ${
                          isDraggedOver
                            ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300 dark:ring-green-600 scale-110'
                            : isSelectedDate
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : isTodayDate
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }
                        ${isPast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                        ${scheduledPost ? 'border-2 border-indigo-400 dark:border-indigo-500' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {/* Day number */}
                      <span className={`absolute top-1 left-1 text-xs font-semibold z-10 ${
                        scheduledPost ? 'text-white drop-shadow-md' : ''
                      }`}>
                        {day}
                      </span>
                      {/* Scheduled post thumbnail + delete overlay */}
                      {scheduledPost && (
                        <div className="absolute inset-0 flex items-center justify-center p-0.5">
                          <img
                            src={scheduledPost.image}
                            alt={`Post ${scheduledPost.id}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          {/* Delete button overlay */}
                          {onDeleteScheduledPost && (
                            <button
                              type="button"
                              className="absolute top-1 right-1 z-20 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-700 focus:outline-none"
                              title="Delete scheduled post"
                              onClick={e => {
                                e.stopPropagation();
                                onDeleteScheduledPost(dateKey);
                              }}
                              tabIndex={0}
                            >
                              <span className="sr-only">Delete</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                          {/* Overlay for better text visibility */}
                          <div className="absolute inset-0 bg-black/30 rounded-md" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Time Selection */}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Select Time
            </label>
            <select
              id="time"
              value={schedule.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={isLoading}
              className={`
                w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-100
                border-zinc-200 dark:border-zinc-700
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                cursor-pointer
                ${errors.time ? 'border-red-500 dark:border-red-500' : ''}
              `}
            >
              <option value="">Select a time</option>
              {Array.from({ length: 48 }).map((_, index) => {
                const hour = Math.floor(index / 2);
                const minute = (index % 2) * 30;
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });
                return (
                  <option key={timeString} value={timeString}>
                    {displayTime}
                  </option>
                );
              })}
            </select>
            {errors.time && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.time}</p>
            )}
          </div>

          {/* Selected Date/Time Display */}
          {selectedDate && schedule.time && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                Scheduled for:
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {schedule.time}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {onSubmit && (
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Schedule Post'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

