"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaveRequests = exports.getMyLeaves = exports.applyLeave = void 0;
const db_1 = require("../database/db");
const applyLeave = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        if (!employeeId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { leaveType, startDate, endDate, reason } = req.body;
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'Leave type, start date, end date and reason are required.' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
            return res.status(400).json({ success: false, message: 'End date cannot be prior to start date.' });
        }
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const leaveRequest = await db_1.prisma.leaveRequest.create({
            data: {
                employeeId,
                leaveType,
                startDate,
                endDate,
                numberOfDays,
                reason,
                status: 'Pending',
            },
        });
        // Notify user & Admin
        await db_1.prisma.notification.create({
            data: {
                userId: employeeId,
                title: 'Leave Request Submitted',
                message: `Your ${leaveType} request for ${numberOfDays} day(s) (${startDate} to ${endDate}) has been submitted for approval.`,
                type: 'info',
            },
        });
        // Also notify admins
        const admins = await db_1.prisma.user.findMany({ where: { role: 'ADMIN' } });
        for (const admin of admins) {
            await db_1.prisma.notification.create({
                data: {
                    userId: admin.id,
                    title: 'New Leave Request',
                    message: `${req.user?.name} applied for ${numberOfDays} day(s) ${leaveType}.`,
                    type: 'warning',
                },
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Leave request submitted successfully.',
            leaveRequest,
        });
    }
    catch (error) {
        console.error('Leave apply error:', error);
        return res.status(500).json({ success: false, message: 'Failed to submit leave request.' });
    }
};
exports.applyLeave = applyLeave;
const getMyLeaves = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        if (!employeeId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const leaves = await db_1.prisma.leaveRequest.findMany({
            where: { employeeId },
            orderBy: { createdAt: 'desc' },
        });
        // Compute metrics
        const totalAllowed = 24; // Standard annual quota
        const approvedDays = leaves
            .filter((l) => l.status === 'Approved')
            .reduce((acc, curr) => acc + curr.numberOfDays, 0);
        const pendingRequests = leaves.filter((l) => l.status === 'Pending').length;
        const approvedRequests = leaves.filter((l) => l.status === 'Approved').length;
        const rejectedRequests = leaves.filter((l) => l.status === 'Rejected').length;
        return res.json({
            success: true,
            leaveBalance: {
                totalQuota: totalAllowed,
                usedDays: approvedDays,
                availableDays: Math.max(0, totalAllowed - approvedDays),
                pendingCount: pendingRequests,
                approvedCount: approvedRequests,
                rejectedCount: rejectedRequests,
            },
            requests: leaves,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve leave history.' });
    }
};
exports.getMyLeaves = getMyLeaves;
const getAllLeaveRequests = async (req, res) => {
    try {
        const { status, department } = req.query;
        const whereClause = {};
        if (status && status !== 'All') {
            whereClause.status = status;
        }
        if (department && department !== 'All') {
            whereClause.user = {
                profile: {
                    department: department,
                },
            };
        }
        const requests = await db_1.prisma.leaveRequest.findMany({
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
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ success: true, requests });
    }
    catch (error) {
        console.error('Fetch all leave requests error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve leave requests.' });
    }
};
exports.getAllLeaveRequests = getAllLeaveRequests;
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status. Must be Approved or Rejected.' });
        }
        const leaveReq = await db_1.prisma.leaveRequest.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!leaveReq) {
            return res.status(404).json({ success: false, message: 'Leave request not found.' });
        }
        const updated = await db_1.prisma.leaveRequest.update({
            where: { id },
            data: {
                status,
                adminComment: adminComment || null,
            },
        });
        // Notify Employee
        await db_1.prisma.notification.create({
            data: {
                userId: leaveReq.employeeId,
                title: `Leave Request ${status}`,
                message: `Your ${leaveReq.leaveType} request (${leaveReq.startDate} to ${leaveReq.endDate}) has been ${status.toLowerCase()}.${adminComment ? ` Remark: "${adminComment}"` : ''}`,
                type: status === 'Approved' ? 'success' : 'error',
            },
        });
        // If Approved, create Attendance "Leave" records for each date in range if not already present
        if (status === 'Approved') {
            const curDate = new Date(leaveReq.startDate);
            const stopDate = new Date(leaveReq.endDate);
            while (curDate <= stopDate) {
                const dateStr = curDate.toISOString().split('T')[0];
                try {
                    await db_1.prisma.attendance.upsert({
                        where: {
                            employeeId_date: {
                                employeeId: leaveReq.employeeId,
                                date: dateStr,
                            },
                        },
                        update: { status: 'Leave' },
                        create: {
                            employeeId: leaveReq.employeeId,
                            date: dateStr,
                            status: 'Leave',
                            workingHours: 0,
                        },
                    });
                }
                catch (e) {
                    // ignore duplicate edge
                }
                curDate.setDate(curDate.getDate() + 1);
            }
        }
        return res.json({
            success: true,
            message: `Leave request marked as ${status}.`,
            leaveRequest: updated,
        });
    }
    catch (error) {
        console.error('Update leave status error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update leave status.' });
    }
};
exports.updateLeaveStatus = updateLeaveStatus;
