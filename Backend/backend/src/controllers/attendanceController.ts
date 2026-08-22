import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthRequest } from '../middleware/auth';

const getTodayString = () => new Date().toISOString().split('T')[0];
const getTimeString = () => new Date().toTimeString().split(' ')[0];

export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const today = getTodayString();
    const timeNow = getTimeString();

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({
        success: false,
        message: `Already checked in today at ${existing.checkIn}`,
        attendance: existing,
      });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
      update: {
        checkIn: timeNow,
        status: 'Present',
      },
      create: {
        employeeId,
        date: today,
        checkIn: timeNow,
        status: 'Present',
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: employeeId,
        title: 'Check-In Recorded',
        message: `Successfully checked in at ${timeNow} on ${today}. Have a productive day!`,
        type: 'success',
      },
    });

    return res.json({
      success: true,
      message: `Checked in successfully at ${timeNow}`,
      attendance,
    });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return res.status(500).json({ success: false, message: 'Check-in failed.' });
  }
};

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const today = getTodayString();
    const timeNow = getTimeString();

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today,
        },
      },
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ success: false, message: 'You have not checked in today yet.' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: `Already checked out today at ${attendance.checkOut}`,
        attendance,
      });
    }

    // Calculate working hours
    const [inH, inM] = attendance.checkIn.split(':').map(Number);
    const [outH, outM] = timeNow.split(':').map(Number);

    let diffHours = (outH * 60 + outM - (inH * 60 + inM)) / 60;
    if (diffHours < 0) diffHours = 0;
    const workingHours = parseFloat(diffHours.toFixed(2));
    const status = workingHours < 4 ? 'Half-day' : 'Present';

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: timeNow,
        workingHours,
        status,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: employeeId,
        title: 'Check-Out Recorded',
        message: `Checked out at ${timeNow}. Total hours logged today: ${workingHours} hrs.`,
        type: 'info',
      },
    });

    return res.json({
      success: true,
      message: `Checked out successfully at ${timeNow}`,
      attendance: updated,
    });
  } catch (error: any) {
    console.error('Check-out error:', error);
    return res.status(500).json({ success: false, message: 'Check-out failed.' });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const attendances = await prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });

    const today = getTodayString();
    const todayRecord = attendances.find((a) => a.date === today) || null;

    // Summary calculations
    const presentCount = attendances.filter((a) => a.status === 'Present').length;
    const halfDayCount = attendances.filter((a) => a.status === 'Half-day').length;
    const leaveCount = attendances.filter((a) => a.status === 'Leave').length;
    const totalHours = attendances.reduce((acc, curr) => acc + curr.workingHours, 0);

    return res.json({
      success: true,
      todayRecord,
      summary: {
        totalRecords: attendances.length,
        present: presentCount,
        halfDay: halfDayCount,
        leave: leaveCount,
        totalHoursLogged: parseFloat(totalHours.toFixed(1)),
      },
      records: attendances,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve attendance history.' });
  }
};

export const getAllAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { date, department, employeeId } = req.query;

    const whereClause: any = {};

    if (date) {
      whereClause.date = date as string;
    }

    if (employeeId && employeeId !== 'All') {
      whereClause.employeeId = employeeId as string;
    }

    if (department && department !== 'All') {
      whereClause.user = {
        profile: {
          department: department as string,
        },
      };
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            profile: {
              select: {
                department: true,
                designation: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return res.json({ success: true, records });
  } catch (error: any) {
    console.error('Fetch all attendance error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve attendance records.' });
  }
};
