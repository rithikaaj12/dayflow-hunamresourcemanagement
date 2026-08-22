"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployeeSalary = exports.getAllPayroll = exports.getMyPayroll = void 0;
const db_1 = require("../database/db");
const getMyPayroll = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        if (!employeeId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const user = await db_1.prisma.user.findUnique({
            where: { id: employeeId },
            include: { profile: true },
        });
        const payrolls = await db_1.prisma.payroll.findMany({
            where: { employeeId },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({
            success: true,
            currentSalaryStructure: {
                basicSalary: user?.profile?.basicSalary || 0,
                allowances: user?.profile?.allowances || 0,
                deductions: user?.profile?.deductions || 0,
                netSalary: user?.profile?.netSalary || 0,
            },
            history: payrolls,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve payroll details.' });
    }
};
exports.getMyPayroll = getMyPayroll;
const getAllPayroll = async (req, res) => {
    try {
        const { department, search } = req.query;
        const whereClause = {};
        if (department && department !== 'All') {
            whereClause.profile = { department: department };
        }
        if (search) {
            const q = search.toLowerCase();
            whereClause.OR = [
                { name: { contains: q } },
                { email: { contains: q } },
                { employeeId: { contains: q } },
            ];
        }
        const employeesWithPayroll = await db_1.prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                role: true,
                profile: {
                    select: {
                        department: true,
                        designation: true,
                        basicSalary: true,
                        allowances: true,
                        deductions: true,
                        netSalary: true,
                    },
                },
                payrolls: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { name: 'asc' },
        });
        const totalCompanyPayroll = employeesWithPayroll.reduce((acc, curr) => acc + (curr.profile?.netSalary || 0), 0);
        return res.json({
            success: true,
            totalCompanyPayroll,
            employees: employeesWithPayroll,
        });
    }
    catch (error) {
        console.error('Fetch all payroll error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve company payroll.' });
    }
};
exports.getAllPayroll = getAllPayroll;
const updateEmployeeSalary = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { basicSalary, allowances, deductions, payPeriod } = req.body;
        const basic = parseFloat(basicSalary) || 0;
        const allow = parseFloat(allowances) || 0;
        const deduct = parseFloat(deductions) || 0;
        const net = basic + allow - deduct;
        const updatedProfile = await db_1.prisma.employeeProfile.update({
            where: { userId: employeeId },
            data: {
                basicSalary: basic,
                allowances: allow,
                deductions: deduct,
                netSalary: net,
            },
        });
        // Create a new monthly payroll record
        const period = payPeriod || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const newPayrollRecord = await db_1.prisma.payroll.create({
            data: {
                employeeId,
                payPeriod: period,
                basicSalary: basic,
                allowances: allow,
                deductions: deduct,
                netSalary: net,
                status: 'Paid',
            },
        });
        // Notify employee
        await db_1.prisma.notification.create({
            data: {
                userId: employeeId,
                title: 'Salary Slip Released',
                message: `Your payroll for ${period} has been processed. Net Salary: $${net.toLocaleString()}`,
                type: 'success',
            },
        });
        return res.json({
            success: true,
            message: 'Salary structure and payroll record updated successfully.',
            profile: updatedProfile,
            payrollRecord: newPayrollRecord,
        });
    }
    catch (error) {
        console.error('Update salary error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update salary.' });
    }
};
exports.updateEmployeeSalary = updateEmployeeSalary;
