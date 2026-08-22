import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total Employees
    const totalEmployees = await prisma.user.count({ where: { role: 'EMPLOYEE' } });
    const totalStaff = await prisma.user.count();

    // Today Attendance Stats
    const todayAttendance = await prisma.attendance.findMany({ where: { date: today } });
    const presentToday = todayAttendance.filter((a) => a.status === 'Present').length;
    const absentToday = totalEmployees - todayAttendance.length;
    const leaveToday = todayAttendance.filter((a) => a.status === 'Leave').length;
    const halfDayToday = todayAttendance.filter((a) => a.status === 'Half-day').length;

    // Leave Request Stats
    const pendingLeaves = await prisma.leaveRequest.count({ where: { status: 'Pending' } });
    const approvedLeaves = await prisma.leaveRequest.count({ where: { status: 'Approved' } });
    const rejectedLeaves = await prisma.leaveRequest.count({ where: { status: 'Rejected' } });

    // Payroll Totals
    const profiles = await prisma.employeeProfile.findMany();
    const totalCompanyPayroll = profiles.reduce((acc, curr) => acc + curr.netSalary, 0);

    // Chart Data: Employees by Department
    const departmentCounts: Record<string, number> = {};
    profiles.forEach((p) => {
      const dept = p.department || 'General';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    const departmentChart = Object.entries(departmentCounts).map(([name, value]) => ({ name, value }));

    // Chart Data: Attendance Status Breakdown
    const attendanceChart = [
      { name: 'Present', value: presentToday },
      { name: 'Absent', value: absentToday > 0 ? absentToday : 0 },
      { name: 'Leave', value: leaveToday },
      { name: 'Half-Day', value: halfDayToday },
    ];

    // Chart Data: Leave Breakdown
    const leaveChart = [
      { name: 'Pending', value: pendingLeaves },
      { name: 'Approved', value: approvedLeaves },
      { name: 'Rejected', value: rejectedLeaves },
    ];

    // Chart Data: Payroll Breakdown by Dept
    const payrollDeptMap: Record<string, number> = {};
    profiles.forEach((p) => {
      const dept = p.department || 'General';
      payrollDeptMap[dept] = (payrollDeptMap[dept] || 0) + p.netSalary;
    });
    const payrollChart = Object.entries(payrollDeptMap).map(([department, amount]) => ({ department, amount }));

    // Recent activity (recent 5 leave requests & recent 5 attendance logs)
    const recentLeaves = await prisma.leaveRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, employeeId: true, profile: { select: { department: true } } } },
      },
    });

    return res.json({
      success: true,
      stats: {
        totalEmployees,
        totalStaff,
        presentToday,
        absentToday: absentToday > 0 ? absentToday : 0,
        leaveToday,
        halfDayToday,
        pendingLeaves,
        approvedLeaves,
        totalCompanyPayroll,
      },
      charts: {
        departmentChart,
        attendanceChart,
        leaveChart,
        payrollChart,
      },
      recentLeaves,
    });
  } catch (error: any) {
    console.error('Admin dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard stats.' });
  }
};

export const getEmployeeDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const today = new Date().toISOString().split('T')[0];

    const user = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { profile: true },
    });

    // Today Attendance
    const todayAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    // Monthly attendance records count
    const allAttendance = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });

    const presentDays = allAttendance.filter((a) => a.status === 'Present').length;
    const totalWorkingHours = allAttendance.reduce((acc, curr) => acc + curr.workingHours, 0);

    // Leaves
    const leaves = await prisma.leaveRequest.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    });

    const totalAllowed = 24;
    const usedLeaves = leaves
      .filter((l) => l.status === 'Approved')
      .reduce((acc, curr) => acc + curr.numberOfDays, 0);
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

    // Notifications
    const recentNotifications = await prisma.notification.findMany({
      where: { userId: employeeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return res.json({
      success: true,
      user: {
        name: user?.name,
        employeeId: user?.employeeId,
        role: user?.role,
        department: user?.profile?.department,
        designation: user?.profile?.designation,
        netSalary: user?.profile?.netSalary,
      },
      todayAttendance,
      attendanceSummary: {
        totalDaysLogged: allAttendance.length,
        presentDays,
        totalWorkingHours: parseFloat(totalWorkingHours.toFixed(1)),
      },
      leaveSummary: {
        totalQuota: totalAllowed,
        usedLeaves,
        availableLeaves: Math.max(0, totalAllowed - usedLeaves),
        pendingLeaves,
      },
      recentLeaves: leaves.slice(0, 4),
      recentNotifications,
    });
  } catch (error: any) {
    console.error('Employee dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employee dashboard stats.' });
  }
};
