"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authCtrl = __importStar(require("../controllers/authController"));
const empCtrl = __importStar(require("../controllers/employeeController"));
const attCtrl = __importStar(require("../controllers/attendanceController"));
const leaveCtrl = __importStar(require("../controllers/leaveController"));
const payCtrl = __importStar(require("../controllers/payrollController"));
const notifCtrl = __importStar(require("../controllers/notificationController"));
const dashCtrl = __importStar(require("../controllers/dashboardController"));
const repCtrl = __importStar(require("../controllers/reportsController"));
const router = (0, express_1.Router)();
// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', auth_1.authenticate, authCtrl.getMe);
// Employee Management Routes
router.get('/employees', auth_1.authenticate, empCtrl.getAllEmployees);
router.get('/employees/:id', auth_1.authenticate, empCtrl.getEmployeeById);
router.post('/employees', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), empCtrl.createEmployee);
router.put('/employees/:id', auth_1.authenticate, empCtrl.updateEmployee);
router.delete('/employees/:id', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), empCtrl.deleteEmployee);
// Attendance Routes
router.post('/attendance/check-in', auth_1.authenticate, attCtrl.checkIn);
router.post('/attendance/check-out', auth_1.authenticate, attCtrl.checkOut);
router.get('/attendance/my', auth_1.authenticate, attCtrl.getMyAttendance);
router.get('/attendance', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), attCtrl.getAllAttendance);
// Leave Management Routes
router.post('/leaves', auth_1.authenticate, leaveCtrl.applyLeave);
router.get('/leaves/my', auth_1.authenticate, leaveCtrl.getMyLeaves);
router.get('/leaves', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), leaveCtrl.getAllLeaveRequests);
router.put('/leaves/:id/status', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), leaveCtrl.updateLeaveStatus);
// Payroll Routes
router.get('/payroll/my', auth_1.authenticate, payCtrl.getMyPayroll);
router.get('/payroll', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), payCtrl.getAllPayroll);
router.put('/payroll/:employeeId', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), payCtrl.updateEmployeeSalary);
// Notification Routes
router.get('/notifications', auth_1.authenticate, notifCtrl.getMyNotifications);
router.put('/notifications/all/read', auth_1.authenticate, notifCtrl.markAsRead);
router.put('/notifications/:id/read', auth_1.authenticate, notifCtrl.markAsRead);
router.post('/notifications/announcement', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), notifCtrl.broadcastAnnouncement);
// Dashboard Routes
router.get('/dashboard/admin', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), dashCtrl.getAdminDashboardStats);
router.get('/dashboard/employee', auth_1.authenticate, dashCtrl.getEmployeeDashboardStats);
// Reports Route
router.get('/reports', auth_1.authenticate, (0, auth_1.authorizeRole)(['ADMIN']), repCtrl.getReportsData);
exports.default = router;
