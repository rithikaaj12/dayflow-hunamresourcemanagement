import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth';
import * as authCtrl from '../controllers/authController';
import * as empCtrl from '../controllers/employeeController';
import * as attCtrl from '../controllers/attendanceController';
import * as leaveCtrl from '../controllers/leaveController';
import * as payCtrl from '../controllers/payrollController';
import * as notifCtrl from '../controllers/notificationController';
import * as dashCtrl from '../controllers/dashboardController';
import * as repCtrl from '../controllers/reportsController';

const router = Router();

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', authenticate, authCtrl.getMe);

// Employee Management Routes
router.get('/employees', authenticate, empCtrl.getAllEmployees);
router.get('/employees/:id', authenticate, empCtrl.getEmployeeById);
router.post('/employees', authenticate, authorizeRole(['ADMIN']), empCtrl.createEmployee);
router.put('/employees/:id', authenticate, empCtrl.updateEmployee);
router.delete('/employees/:id', authenticate, authorizeRole(['ADMIN']), empCtrl.deleteEmployee);

// Attendance Routes
router.post('/attendance/check-in', authenticate, attCtrl.checkIn);
router.post('/attendance/check-out', authenticate, attCtrl.checkOut);
router.get('/attendance/my', authenticate, attCtrl.getMyAttendance);
router.get('/attendance', authenticate, authorizeRole(['ADMIN']), attCtrl.getAllAttendance);

// Leave Management Routes
router.post('/leaves', authenticate, leaveCtrl.applyLeave);
router.get('/leaves/my', authenticate, leaveCtrl.getMyLeaves);
router.get('/leaves', authenticate, authorizeRole(['ADMIN']), leaveCtrl.getAllLeaveRequests);
router.put('/leaves/:id/status', authenticate, authorizeRole(['ADMIN']), leaveCtrl.updateLeaveStatus);

// Payroll Routes
router.get('/payroll/my', authenticate, payCtrl.getMyPayroll);
router.get('/payroll', authenticate, authorizeRole(['ADMIN']), payCtrl.getAllPayroll);
router.put('/payroll/:employeeId', authenticate, authorizeRole(['ADMIN']), payCtrl.updateEmployeeSalary);

// Notification Routes
router.get('/notifications', authenticate, notifCtrl.getMyNotifications);
router.put('/notifications/all/read', authenticate, notifCtrl.markAsRead);
router.put('/notifications/:id/read', authenticate, notifCtrl.markAsRead);
router.post('/notifications/announcement', authenticate, authorizeRole(['ADMIN']), notifCtrl.broadcastAnnouncement);

// Dashboard Routes
router.get('/dashboard/admin', authenticate, authorizeRole(['ADMIN']), dashCtrl.getAdminDashboardStats);
router.get('/dashboard/employee', authenticate, dashCtrl.getEmployeeDashboardStats);

// Reports Route
router.get('/reports', authenticate, authorizeRole(['ADMIN']), repCtrl.getReportsData);

export default router;
