import { Response } from 'express';
import { prisma } from '../database/db';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const { department, search } = req.query;

    const whereClause: any = {};
    if (department && department !== 'All') {
      whereClause.profile = { department: department as string };
    }

    if (search) {
      const query = (search as string).toLowerCase();
      whereClause.OR = [
        { name: { contains: query } },
        { email: { contains: query } },
        { employeeId: { contains: query } },
      ];
    }

    const employees = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, employees });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve employees.' });
  }
};

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        attendances: { orderBy: { date: 'desc' }, take: 10 },
        leaves: { orderBy: { createdAt: 'desc' }, take: 5 },
        payrolls: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving employee profile.' });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      role,
      department,
      designation,
      joiningDate,
      employmentType,
      phone,
      address,
      basicSalary,
      allowances,
      deductions,
    } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Employee ID, Name, Email and Password are required.' });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    }

    const existingId = await prisma.user.findUnique({ where: { employeeId } });
    if (existingId) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const basic = parseFloat(basicSalary) || 50000;
    const allow = parseFloat(allowances) || 8000;
    const deduct = parseFloat(deductions) || 3000;
    const net = basic + allow - deduct;

    const newEmp = await prisma.user.create({
      data: {
        employeeId,
        name,
        email,
        passwordHash,
        role: role || 'EMPLOYEE',
        profile: {
          create: {
            phone: phone || '',
            address: address || '',
            department: department || 'Engineering',
            designation: designation || 'Software Engineer',
            joiningDate: joiningDate || new Date().toISOString().split('T')[0],
            employmentType: employmentType || 'Full-Time',
            basicSalary: basic,
            allowances: allow,
            deductions: deduct,
            netSalary: net,
          },
        },
      },
      include: { profile: true },
    });

    // Generate initial payroll entry
    const currentMonthYear = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    await prisma.payroll.create({
      data: {
        employeeId: newEmp.id,
        payPeriod: currentMonthYear,
        basicSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: net,
        status: 'Paid',
      },
    });

    return res.status(201).json({ success: true, message: 'Employee created successfully!', employee: newEmp });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return res.status(500).json({ success: false, message: 'Failed to create employee.' });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, address, dateOfBirth, department, designation, joiningDate, employmentType, basicSalary, allowances, deductions, role } = req.body;

    const currentUser = req.user;
    const isSelf = currentUser?.id === id;
    const isAdmin = currentUser?.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Permission denied.' });
    }

    const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prepare profile update
    const profileUpdate: any = {};
    if (phone !== undefined) profileUpdate.phone = phone;
    if (address !== undefined) profileUpdate.address = address;
    if (dateOfBirth !== undefined) profileUpdate.dateOfBirth = dateOfBirth;

    // Only admin can update job & salary details
    if (isAdmin) {
      if (department !== undefined) profileUpdate.department = department;
      if (designation !== undefined) profileUpdate.designation = designation;
      if (joiningDate !== undefined) profileUpdate.joiningDate = joiningDate;
      if (employmentType !== undefined) profileUpdate.employmentType = employmentType;

      if (basicSalary !== undefined || allowances !== undefined || deductions !== undefined) {
        const b = basicSalary !== undefined ? parseFloat(basicSalary) : (user.profile?.basicSalary || 0);
        const a = allowances !== undefined ? parseFloat(allowances) : (user.profile?.allowances || 0);
        const d = deductions !== undefined ? parseFloat(deductions) : (user.profile?.deductions || 0);
        profileUpdate.basicSalary = b;
        profileUpdate.allowances = a;
        profileUpdate.deductions = d;
        profileUpdate.netSalary = b + a - d;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: isAdmin && name ? name : user.name,
        role: isAdmin && role ? role : user.role,
        profile: {
          upsert: {
            create: profileUpdate,
            update: profileUpdate,
          },
        },
      },
      include: { profile: true },
    });

    return res.json({ success: true, message: 'Profile updated successfully.', employee: updatedUser });
  } catch (error: any) {
    console.error('Update employee error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update employee.' });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete employee.' });
  }
};
