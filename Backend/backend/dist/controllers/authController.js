"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../database/db");
const register = async (req, res) => {
    try {
        const { employeeId, name, email, password, role } = req.body;
        if (!employeeId || !name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
        }
        // Check existing email or employee ID
        const existingEmail = await db_1.prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email is already registered.' });
        }
        const existingEmpId = await db_1.prisma.user.findUnique({ where: { employeeId } });
        if (existingEmpId) {
            return res.status(400).json({ success: false, message: 'Employee ID is already in use.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';
        const newUser = await db_1.prisma.user.create({
            data: {
                employeeId,
                name,
                email,
                passwordHash,
                role: userRole,
                profile: {
                    create: {
                        department: userRole === 'ADMIN' ? 'Human Resources' : 'Engineering',
                        designation: userRole === 'ADMIN' ? 'HR Manager' : 'Software Engineer',
                        joiningDate: new Date().toISOString().split('T')[0],
                        employmentType: 'Full-Time',
                        basicSalary: 60000,
                        allowances: 10000,
                        deductions: 5000,
                        netSalary: 65000,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        // Create initial notification
        await db_1.prisma.notification.create({
            data: {
                userId: newUser.id,
                title: 'Welcome to Dayflow!',
                message: 'Your account has been created successfully. Welcome aboard!',
                type: 'success',
            },
        });
        const token = jsonwebtoken_1.default.sign({
            id: newUser.id,
            employeeId: newUser.employeeId,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name,
        }, process.env.JWT_SECRET || 'dayflow_secret', { expiresIn: '7d' });
        return res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: newUser.id,
                employeeId: newUser.employeeId,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profile: newUser.profile,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password.' });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            employeeId: user.employeeId,
            email: user.email,
            role: user.role,
            name: user.name,
        }, process.env.JWT_SECRET || 'dayflow_secret', { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: req.user.id },
            include: { profile: true },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.json({
            success: true,
            user: {
                id: user.id,
                employeeId: user.employeeId,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch user data.' });
    }
};
exports.getMe = getMe;
