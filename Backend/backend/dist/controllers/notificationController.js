"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastAnnouncement = exports.markAsRead = exports.getMyNotifications = void 0;
const db_1 = require("../database/db");
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const notifications = await db_1.prisma.notification.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
    }
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (id === 'all') {
            await db_1.prisma.notification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true },
            });
            return res.json({ success: true, message: 'All notifications marked as read.' });
        }
        await db_1.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        return res.json({ success: true, message: 'Notification marked as read.' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update notification.' });
    }
};
exports.markAsRead = markAsRead;
const broadcastAnnouncement = async (req, res) => {
    try {
        const { title, message, targetRole } = req.body;
        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required.' });
        }
        const whereClause = {};
        if (targetRole && targetRole !== 'All') {
            whereClause.role = targetRole;
        }
        const users = await db_1.prisma.user.findMany({ where: whereClause, select: { id: true } });
        const notificationsData = users.map((u) => ({
            userId: u.id,
            title: `[Announcement] ${title}`,
            message,
            type: 'info',
        }));
        await db_1.prisma.notification.createMany({
            data: notificationsData,
        });
        return res.json({
            success: true,
            message: `Announcement broadcasted to ${users.length} user(s).`,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to broadcast announcement.' });
    }
};
exports.broadcastAnnouncement = broadcastAnnouncement;
