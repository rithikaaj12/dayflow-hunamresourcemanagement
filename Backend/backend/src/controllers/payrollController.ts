import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthRequest } from '../middleware/auth';

export const getMyPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: employeeId },
      include: { profile: true },
    });

    const payrolls = await prisma.payroll.findMany({
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
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve payroll details.' });
  }
};

export const getAllPayroll = async (req: AuthRequest, res: Response) => {
  try {
    const { department, search } = req.query;

    const whereClause: any = {};

    if (department && department !== 'All') {
      whereClause.profile = { department: department as string };
    }

    if (search) {
      const q = (search as string).toLowerCase();
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { employeeId: { contains: q } },
      ];
    }

    const employeesWithPayroll = await prisma.user.findMany({
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

    const totalCompanyPayroll = employeesWithPayroll.reduce(
      (acc, curr) => acc + (curr.profile?.netSalary || 0),
      0
    );

    return res.json({
      success: true,
      totalCompanyPayroll,
      employees: employeesWithPayroll,
    });
  } catch (error: any) {
    console.error('Fetch all payroll error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve company payroll.' });
  }
};

export const updateEmployeeSalary = async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { basicSalary, allowances, deductions, payPeriod } = req.body;

    const basic = parseFloat(basicSalary) || 0;
    const allow = parseFloat(allowances) || 0;
    const deduct = parseFloat(deductions) || 0;
    const net = basic + allow - deduct;

    const updatedProfile = await prisma.employeeProfile.update({
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
    const newPayrollRecord = await prisma.payroll.create({
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
    await prisma.notification.create({
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
  } catch (error: any) {
    console.error('Update salary error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update salary.' });
  }
};
