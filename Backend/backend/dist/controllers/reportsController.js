"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportsData = void 0;
const db_1 = require("../database/db");
const getReportsData = async (req, res) => {
    try {
        const { reportType, department, startDate, endDate } = req.query;
        let data = [];
        if (reportType === 'attendance' || !reportType) {
            const where = {};
            if (department && department !== 'All') {
                where.user = { profile: { department: department } };
            }
            if (startDate && endDate) {
                where.date = { gte: startDate, lte: endDate };
            }
            const records = await db_1.prisma.attendance.findMany({
                where,
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            name: true,
                            profile: { select: { department: true, designation: true } },
                        },
                    },
                },
                orderBy: { date: 'desc' },
            });
            data = records.map((r) => ({
                'Employee ID': r.user.employeeId,
                'Employee Name': r.user.name,
                Department: r.user.profile?.department || 'N/A',
                Designation: r.user.profile?.designation || 'N/A',
                Date: r.date,
                'Check In': r.checkIn || 'N/A',
                'Check Out': r.checkOut || 'N/A',
                'Working Hours': r.workingHours,
                Status: r.status,
            }));
        }
        else if (reportType === 'leave') {
            const where = {};
            if (department && department !== 'All') {
                where.user = { profile: { department: department } };
            }
            if (startDate && endDate) {
                where.startDate = { gte: startDate };
                where.endDate = { lte: endDate };
            }
            const requests = await db_1.prisma.leaveRequest.findMany({
                where,
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            name: true,
                            profile: { select: { department: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            data = requests.map((r) => ({
                'Employee ID': r.user.employeeId,
                'Employee Name': r.user.name,
                Department: r.user.profile?.department || 'N/A',
                'Leave Type': r.leaveType,
                'Start Date': r.startDate,
                'End Date': r.endDate,
                Days: r.numberOfDays,
                Reason: r.reason,
                Status: r.status,
                'Admin Comment': r.adminComment || 'N/A',
            }));
        }
        else if (reportType === 'employee') {
            const where = {};
            if (department && department !== 'All') {
                where.profile = { department: department };
            }
            const employees = await db_1.prisma.user.findMany({
                where,
                include: { profile: true },
                orderBy: { name: 'asc' },
            });
            data = employees.map((e) => ({
                'Employee ID': e.employeeId,
                Name: e.name,
                Email: e.email,
                Role: e.role,
                Department: e.profile?.department || 'N/A',
                Designation: e.profile?.designation || 'N/A',
                'Joining Date': e.profile?.joiningDate || 'N/A',
                Phone: e.profile?.phone || 'N/A',
                'Basic Salary ($)': e.profile?.basicSalary || 0,
                'Net Salary ($)': e.profile?.netSalary || 0,
            }));
        }
        else if (reportType === 'payroll') {
            const where = {};
            if (department && department !== 'All') {
                where.user = { profile: { department: department } };
            }
            const payrolls = await db_1.prisma.payroll.findMany({
                where,
                include: {
                    user: {
                        select: {
                            employeeId: true,
                            name: true,
                            profile: { select: { department: true, designation: true } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            data = payrolls.map((p) => ({
                'Employee ID': p.user.employeeId,
                'Employee Name': p.user.name,
                Department: p.user.profile?.department || 'N/A',
                'Pay Period': p.payPeriod,
                'Basic Salary ($)': p.basicSalary,
                'Allowances ($)': p.allowances,
                'Deductions ($)': p.deductions,
                'Net Salary ($)': p.netSalary,
                Status: p.status,
            }));
        }
        return res.json({ success: true, count: data.length, data });
    }
    catch (error) {
        console.error('Reports error:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate report.' });
    }
};
exports.getReportsData = getReportsData;
