import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Task,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  Employee,
  DayClockState,
  NotificationItem,
  ActivityItem,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_ATTENDANCE_HISTORY,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_LEAVE_BALANCES,
  INITIAL_EMPLOYEES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';
import { triggerConfetti } from '../utils';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Clock / Attendance Live State
  clockState: DayClockState;
  checkIn: (location?: 'office' | 'remote' | 'field') => void;
  checkOut: () => void;
  startBreak: () => void;
  endBreak: () => void;
  setWorkLocation: (location: 'office' | 'remote' | 'field') => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, status: Task['status']) => void;

  // Attendance History
  attendanceHistory: AttendanceRecord[];
  logAttendanceNote: (date: string, note: string) => void;

  // Leaves
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  applyLeave: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  reviewLeave: (id: string, status: 'approved' | 'rejected', remarks?: string) => void;

  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;

  // Notifications & Activities
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activities: ActivityItem[];
  addActivity: (action: string, target: string, type: ActivityItem['type']) => void;

  // Toasts
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Global Search / Command Bar
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Clock state with active live timer
  const [clockState, setClockState] = useState<DayClockState>(() => {
    const saved = localStorage.getItem('dayflow_clock_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default: checked in at 08:58 AM with 4h 25m already elapsed today
    return {
      isCheckedIn: true,
      isOnBreak: false,
      checkInTime: '08:58:12',
      lastBreakStartTime: null,
      accumulatedWorkSeconds: 15920, // ~4h 25m
      accumulatedBreakSeconds: 2700, // 45m
      workLocation: 'office',
    };
  });

  // Clock ticker
  useEffect(() => {
    localStorage.setItem('dayflow_clock_state', JSON.stringify(clockState));
  }, [clockState]);

  useEffect(() => {
    if (!clockState.isCheckedIn) return;

    const timer = setInterval(() => {
      setClockState((prev) => {
        if (!prev.isCheckedIn) return prev;
        if (prev.isOnBreak) {
          return {
            ...prev,
            accumulatedBreakSeconds: prev.accumulatedBreakSeconds + 1,
          };
        } else {
          return {
            ...prev,
            accumulatedWorkSeconds: prev.accumulatedWorkSeconds + 1,
          };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clockState.isCheckedIn]);

  // 2. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('dayflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. Attendance history
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('dayflow_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_attendance', JSON.stringify(attendanceHistory));
  }, [attendanceHistory]);

  // 4. Leave balances & requests
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(() => {
    const saved = localStorage.getItem('dayflow_leave_balances');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dayflow_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_leave_balances', JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem('dayflow_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // 5. Employees
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  // 6. Activities & Notifications
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('dayflow_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('dayflow_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 7. Toasts & Search modal
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const showToast = useCallback((title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addActivity = useCallback((action: string, target: string, type: ActivityItem['type']) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      user: {
        name: 'Alexandre Chen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      },
      action,
      target,
      timestamp: 'Just now',
      type,
    };
    setActivities((prev) => [newAct, ...prev]);
  }, []);

  // Clock Actions
  const checkIn = useCallback(
    (location: 'office' | 'remote' | 'field' = 'office') => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setClockState({
        isCheckedIn: true,
        isOnBreak: false,
        checkInTime: timeStr,
        lastBreakStartTime: null,
        accumulatedWorkSeconds: 0,
        accumulatedBreakSeconds: 0,
        workLocation: location,
      });
      triggerConfetti();
      showToast('Checked in successfully!', `Punch-in recorded at ${timeStr} (${location.toUpperCase()})`, 'success');
      addActivity('punched in at', `${timeStr} (${location})`, 'attendance');
    },
    [showToast, addActivity]
  );

  const checkOut = useCallback(() => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const todayStr = now.toISOString().split('T')[0];
    const totalHours = Number((clockState.accumulatedWorkSeconds / 3600).toFixed(2));
    const breakMins = Math.round(clockState.accumulatedBreakSeconds / 60);

    // add to history
    const record: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: todayStr,
      checkIn: clockState.checkInTime || '09:00:00',
      checkOut: timeStr,
      workingHours: totalHours > 0 ? totalHours : 8.0,
      breakDurationMinutes: breakMins,
      status: 'present',
      location: clockState.workLocation === 'office' ? 'HQ Office - Floor 4' : 'Remote Workstation',
      device: 'MacBook Pro (macOS)',
      ipAddress: '192.168.1.104',
      notes: 'Day completed successfully',
    };

    setAttendanceHistory((prev) => [record, ...prev.filter((r) => r.date !== todayStr)]);
    setClockState((prev) => ({
      ...prev,
      isCheckedIn: false,
      isOnBreak: false,
    }));
    showToast('Checked out', `Total hours logged today: ${totalHours}h`, 'info');
    addActivity('checked out at', `${timeStr} (${totalHours}h logged)`, 'attendance');
  }, [clockState, showToast, addActivity]);

  const startBreak = useCallback(() => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setClockState((prev) => ({
      ...prev,
      isOnBreak: true,
      lastBreakStartTime: timeStr,
    }));
    showToast('Break started', 'Workday timer paused. Take a restful pause!', 'info');
    addActivity('started coffee / lunch break at', timeStr, 'attendance');
  }, [showToast, addActivity]);

  const endBreak = useCallback(() => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setClockState((prev) => ({
      ...prev,
      isOnBreak: false,
    }));
    showToast('Resumed work', 'Workday timer running again. Welcome back!', 'success');
    addActivity('resumed focus work at', timeStr, 'attendance');
  }, [showToast, addActivity]);

  const setWorkLocation = useCallback((location: 'office' | 'remote' | 'field') => {
    setClockState((prev) => ({ ...prev, workLocation: location }));
  }, []);

  // Tasks Actions
  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Task Created', `"${newTask.title}" added to board`, 'success');
      addActivity('created new task', newTask.title, 'task');
    },
    [showToast, addActivity]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated = { ...t, ...updates };
            if (updates.status === 'completed' && t.status !== 'completed') {
              updated.completedAt = new Date().toISOString().split('T')[0];
              triggerConfetti();
              showToast('Task Completed! 🎉', `"${t.title}" marked as finished.`, 'success');
              addActivity('completed task', t.title, 'task');
            }
            return updated;
          }
          return t;
        })
      );
    },
    [showToast, addActivity]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task Deleted', 'Task was removed from workspace', 'info');
    },
    [showToast]
  );

  const moveTaskStatus = useCallback(
    (id: string, status: Task['status']) => {
      updateTask(id, { status });
    },
    [updateTask]
  );

  // Attendance note
  const logAttendanceNote = useCallback((date: string, note: string) => {
    setAttendanceHistory((prev) =>
      prev.map((item) => (item.date === date ? { ...item, notes: note } : item))
    );
  }, []);

  // Leaves
  const applyLeave = useCallback(
    (req: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
      const newRequest: LeaveRequest = {
        ...req,
        id: `lr-${Date.now()}`,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      setLeaveRequests((prev) => [newRequest, ...prev]);
      // deduct from balance
      setLeaveBalances((prev) =>
        prev.map((b) =>
          b.type === req.type
            ? {
                ...b,
                used: b.used + req.days,
                available: Math.max(0, b.available - req.days),
              }
            : b
        )
      );
      showToast('Leave Application Submitted', `Requested ${req.days} day(s) of ${req.type} leave`, 'success');
      addActivity('applied for leave', `${req.days} days (${req.type})`, 'leave');
    },
    [showToast, addActivity]
  );

  const reviewLeave = useCallback(
    (id: string, status: 'approved' | 'rejected', remarks?: string) => {
      setLeaveRequests((prev) =>
        prev.map((lr) => {
          if (lr.id === id) {
            return {
              ...lr,
              status,
              reviewedBy: 'Current Manager',
              reviewDate: new Date().toISOString().split('T')[0],
              reviewerRemarks: remarks || (status === 'approved' ? 'Approved as requested.' : 'Declined per team coverage requirements.'),
            };
          }
          return lr;
        })
      );
      showToast(
        status === 'approved' ? 'Leave Approved' : 'Leave Rejected',
        `Leave request was ${status}`,
        status === 'approved' ? 'success' : 'warning'
      );
      addActivity(status === 'approved' ? 'approved leave request' : 'declined leave request', `ID: ${id}`, 'leave');
    },
    [showToast, addActivity]
  );

  // Employees
  const addEmployee = useCallback(
    (emp: Omit<Employee, 'id'>) => {
      const newEmp: Employee = {
        ...emp,
        id: `emp-${Date.now()}`,
      };
      setEmployees((prev) => [newEmp, ...prev]);
      showToast('Employee Added', `${emp.name} added to ${emp.department}`, 'success');
      addActivity('added new employee', `${emp.name} (${emp.role})`, 'system');
    },
    [showToast, addActivity]
  );

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
      showToast('Employee Updated', 'Records saved successfully', 'success');
    },
    [showToast]
  );

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', undefined, 'info');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        clockState,
        checkIn,
        checkOut,
        startBreak,
        endBreak,
        setWorkLocation,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        attendanceHistory,
        logAttendanceNote,
        leaveBalances,
        leaveRequests,
        applyLeave,
        reviewLeave,
        employees,
        addEmployee,
        updateEmployee,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activities,
        addActivity,
        toasts,
        showToast,
        removeToast,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
