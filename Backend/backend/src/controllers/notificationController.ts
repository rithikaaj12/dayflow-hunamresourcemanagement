import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

export const broadcastAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, targetRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const whereClause: any = {};
    if (targetRole && targetRole !== 'All') {
      whereClause.role = targetRole;
    }

    const users = await prisma.user.findMany({ where: whereClause, select: { id: true } });

    const notificationsData = users.map((u) => ({
      userId: u.id,
      title: `[Announcement] ${title}`,
      message,
      type: 'info',
    }));

    await prisma.notification.createMany({
      data: notificationsData,
    });

    return res.json({
      success: true,
      message: `Announcement broadcasted to ${users.length} user(s).`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to broadcast announcement.' });
  }
};
