import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dayflow database seeding...');

  // Clean existing database
  await prisma.notification.deleteMany({});
  await prisma.payroll.deleteMany({});
  await prisma.leaveRequest.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.employeeProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const empPassword = await bcrypt.hash('Employee@123', 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      employeeId: 'EMP-001',
      name: 'Sarah Connor (HR Admin)',
      email: 'admin@dayflow.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          phone: '+1 (555) 019-2831',
          address: '742 Evergreen Terrace, Springfield',
          dateOfBirth: '1988-04-12',
          department: 'Human Resources',
          designation: 'Head of People Operations',
          joiningDate: '2021-01-15',
          employmentType: 'Full-Time',
          basicSalary: 95000,
          allowances: 15000,
          deductions: 8000,
          netSalary: 102000,
        },
      },
    },
  });

  console.log('✅ Admin user created: admin@dayflow.com / Admin@123');

  // 2. Create 9 Demo Employees
  const employeeDataList = [
    {
      employeeId: 'EMP-101',
      name: 'John Doe',
      email: 'john.doe@dayflow.com',
      department: 'Engineering',
      designation: 'Senior Frontend Developer',
      joiningDate: '2022-03-01',
      phone: '+1 (555) 123-4567',
      address: '123 Market St, San Francisco, CA',
      dateOfBirth: '1992-06-15',
      basicSalary: 75000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 80000,
    },
    {
      employeeId: 'EMP-102',
      name: 'Jane Smith',
      email: 'jane.smith@dayflow.com',
      department: 'Engineering',
      designation: 'Backend Architect',
      joiningDate: '2021-08-15',
      phone: '+1 (555) 987-6543',
      address: '456 Mission St, San Francisco, CA',
      dateOfBirth: '1990-11-20',
      basicSalary: 85000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 91000,
    },
    {
      employeeId: 'EMP-103',
      name: 'Michael Brown',
      email: 'michael.brown@dayflow.com',
      department: 'Finance',
      designation: 'Financial Analyst',
      joiningDate: '2023-01-10',
      phone: '+1 (555) 246-8101',
      address: '789 Financial Way, New York, NY',
      dateOfBirth: '1994-02-08',
      basicSalary: 62000,
      allowances: 8000,
      deductions: 4000,
      netSalary: 66000,
    },
    {
      employeeId: 'EMP-104',
      name: 'Emily Davis',
      email: 'emily.davis@dayflow.com',
      department: 'Marketing',
      designation: 'Marketing Lead',
      joiningDate: '2022-11-01',
      phone: '+1 (555) 369-2580',
      address: '321 Creative Ave, Austin, TX',
      dateOfBirth: '1993-09-25',
      basicSalary: 68000,
      allowances: 9000,
      deductions: 4500,
      netSalary: 72500,
    },
    {
      employeeId: 'EMP-105',
      name: 'Robert Wilson',
      email: 'robert.wilson@dayflow.com',
      department: 'Sales',
      designation: 'Account Executive',
      joiningDate: '2023-05-20',
      phone: '+1 (555) 147-2583',
      address: '654 Commerce Blvd, Chicago, IL',
      dateOfBirth: '1989-12-05',
      basicSalary: 58000,
      allowances: 15000,
      deductions: 5000,
      netSalary: 68000,
    },
    {
      employeeId: 'EMP-106',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@dayflow.com',
      department: 'Human Resources',
      designation: 'HR Specialist',
      joiningDate: '2022-06-12',
      phone: '+1 (555) 852-9630',
      address: '987 People Rd, Seattle, WA',
      dateOfBirth: '1995-07-18',
      basicSalary: 55000,
      allowances: 7000,
      deductions: 3500,
      netSalary: 58500,
    },
    {
      employeeId: 'EMP-107',
      name: 'David Lee',
      email: 'david.lee@dayflow.com',
      department: 'Engineering',
      designation: 'UI/UX Designer',
      joiningDate: '2023-02-01',
      phone: '+1 (555) 741-8529',
      address: '159 Design Hub, San Jose, CA',
      dateOfBirth: '1996-03-30',
      basicSalary: 65000,
      allowances: 8500,
      deductions: 4000,
      netSalary: 69500,
    },
    {
      employeeId: 'EMP-108',
      name: 'Olivia Taylor',
      email: 'olivia.taylor@dayflow.com',
      department: 'Finance',
      designation: 'Payroll Manager',
      joiningDate: '2021-10-15',
      phone: '+1 (555) 963-7410',
      address: '753 Audit Street, Boston, MA',
      dateOfBirth: '1987-05-14',
      basicSalary: 72000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 77000,
    },
    {
      employeeId: 'EMP-109',
      name: 'Daniel Anderson',
      email: 'daniel.anderson@dayflow.com',
      department: 'Sales',
      designation: 'Sales Representative',
      joiningDate: '2023-08-01',
      phone: '+1 (555) 357-1590',
      address: '456 Pitch Plaza, Denver, CO',
      dateOfBirth: '1994-08-22',
      basicSalary: 50000,
      allowances: 12000,
      deductions: 4000,
      netSalary: 58000,
    },
  ];

  const createdEmployees = [];

  for (const emp of employeeDataList) {
    const user = await prisma.user.create({
      data: {
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        passwordHash: empPassword,
        role: 'EMPLOYEE',
        profile: {
          create: {
            phone: emp.phone,
            address: emp.address,
            dateOfBirth: emp.dateOfBirth,
            department: emp.department,
            designation: emp.designation,
            joiningDate: emp.joiningDate,
            employmentType: 'Full-Time',
            reportingManager: 'Sarah Connor',
            basicSalary: emp.basicSalary,
            allowances: emp.allowances,
            deductions: emp.deductions,
            netSalary: emp.netSalary,
          },
        },
      },
      include: { profile: true },
    });
    createdEmployees.push(user);

    // Initial Welcome Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Dayflow HRMS',
        message: 'Your account is active. Explore your dashboard, attendance log, and salary details.',
        type: 'success',
      },
    });

    // Seed Payroll record
    await prisma.payroll.create({
      data: {
        employeeId: user.id,
        payPeriod: 'August 2026',
        basicSalary: emp.basicSalary,
        allowances: emp.allowances,
        deductions: emp.deductions,
        netSalary: emp.netSalary,
        status: 'Paid',
      },
    });
  }

  console.log(`✅ Created ${createdEmployees.length} demo employees.`);

  // 3. Seed Attendance Records for past 7 days
  const allUsers = [adminUser, ...createdEmployees];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    for (const u of allUsers) {
      // Vary attendance statuses
      const rand = Math.random();
      let status = 'Present';
      let checkIn = '09:00:00';
      let checkOut = '17:30:00';
      let hours = 8.5;

      if (rand < 0.15) {
        status = 'Half-day';
        checkIn = '09:15:00';
        checkOut = '13:00:00';
        hours = 3.75;
      } else if (rand < 0.25) {
        status = 'Leave';
        checkIn = null as any;
        checkOut = null as any;
        hours = 0;
      }

      await prisma.attendance.create({
        data: {
          employeeId: u.id,
          date: dateStr,
          checkIn,
          checkOut,
          workingHours: hours,
          status,
        },
      });
    }
  }
  console.log('✅ Historical attendance records created.');

  // 4. Seed Leave Requests
  const sampleLeaves = [
    {
      emp: createdEmployees[0], // John Doe
      leaveType: 'Paid Leave',
      startDate: '2026-08-25',
      endDate: '2026-08-27',
      numberOfDays: 3,
      reason: 'Family vacation and personal downtime.',
      status: 'Pending',
    },
    {
      emp: createdEmployees[1], // Jane Smith
      leaveType: 'Sick Leave',
      startDate: '2026-08-10',
      endDate: '2026-08-11',
      numberOfDays: 2,
      reason: 'Fever and rest recommended by doctor.',
      status: 'Approved',
      adminComment: 'Get well soon Jane!',
    },
    {
      emp: createdEmployees[2], // Michael Brown
      leaveType: 'Unpaid Leave',
      startDate: '2026-08-01',
      endDate: '2026-08-02',
      numberOfDays: 2,
      reason: 'Relocation assistance.',
      status: 'Approved',
      adminComment: 'Approved by HR.',
    },
    {
      emp: createdEmployees[3], // Emily Davis
      leaveType: 'Paid Leave',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      numberOfDays: 5,
      reason: 'Annual vacation trip.',
      status: 'Pending',
    },
    {
      emp: createdEmployees[4], // Robert Wilson
      leaveType: 'Sick Leave',
      startDate: '2026-08-18',
      endDate: '2026-08-18',
      numberOfDays: 1,
      reason: 'Dental appointment.',
      status: 'Rejected',
      adminComment: 'Please reschedule to weekend if possible due to client demo.',
    },
  ];

  for (const l of sampleLeaves) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: l.emp.id,
        leaveType: l.leaveType,
        startDate: l.startDate,
        endDate: l.endDate,
        numberOfDays: l.numberOfDays,
        reason: l.reason,
        status: l.status,
        adminComment: l.adminComment || null,
      },
    });

    if (l.status === 'Approved') {
      await prisma.notification.create({
        data: {
          userId: l.emp.id,
          title: 'Leave Approved',
          message: `Your ${l.leaveType} request for ${l.numberOfDays} day(s) was approved.`,
          type: 'success',
        },
      });
    }
  }

  console.log('✅ Sample leave requests created.');
  console.log('✨ Seeding complete! Database is ready for Dayflow.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
