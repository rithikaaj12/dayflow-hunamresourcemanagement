export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  avatar: string;
  phone: string;
  location: string;
  joinDate: string;
  employeeId: string;
  managerName?: string;
  workSchedule: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  stats: {
    productivityScore: number;
    tasksCompleted: number;
    hoursLoggedThisMonth: number;
    attendanceRate: number;
  };
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday' | 'on-leave';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss
  checkOut?: string; // HH:mm:ss
  workingHours: number; // in hours (decimal or calculated)
  breakDurationMinutes: number;
  status: AttendanceStatus;
  location: string; // e.g. "HQ Office - Floor 4" or "Remote / Home"
  device: string;
  ipAddress: string;
  notes?: string;
}

export interface DayClockState {
  isCheckedIn: boolean;
  isOnBreak: boolean;
  checkInTime: string | null; // ISO or HH:mm:ss
  lastBreakStartTime: string | null;
  accumulatedWorkSeconds: number;
  accumulatedBreakSeconds: number;
  workLocation: 'office' | 'remote' | 'field';
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  estimatedHours: number;
  loggedHours: number;
  tags: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  phone: string;
  status: 'active' | 'on_leave' | 'remote' | 'in_meeting';
  attendanceToday: 'present' | 'late' | 'not_checked_in' | 'on_leave';
  checkInTimeToday?: string;
  joinDate: string;
  salaryTier?: string;
  productivityScore: number;
  manager: string;
  skills: string[];
  performanceRating: number; // out of 5
}

export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid' | 'maternity' | 'comp_off';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  available: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  isHalfDay?: boolean;
  halfDayType?: 'first_half' | 'second_half';
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewerRemarks?: string;
  handoverTo?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'meeting' | 'focus' | 'review' | 'standup' | 'training';
  startTime: string; // e.g. "09:30 AM"
  endTime: string; // e.g. "10:15 AM"
  location: string;
  participants: { name: string; avatar: string }[];
  isCompleted?: boolean;
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'attendance' | 'task' | 'leave' | 'system' | 'profile';
  badgeColor?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'leave' | 'task' | 'attendance' | 'announcement';
}

export interface DepartmentStat {
  name: string;
  headCount: number;
  avgProductivity: number;
  attendanceRate: number;
  openTasks: number;
  completedTasks: number;
}
