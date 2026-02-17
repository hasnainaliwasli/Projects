import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../config';
import { ApiError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (id: string, role: string) => {
    const accessToken = jwt.sign({ id, role }, config.jwt.secret, {
        expiresIn: config.jwt.expire as any,
    });
    const refreshToken = jwt.sign({ id, role }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpire as any,
    });
    return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'User already exists with this email');
        }

        const user = await User.create({ name, email, password, role: role || 'researcher' });
        const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            data: {
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                user: { _id: user._id, name: user.name, email: user.email, role: user.role },
                accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        if (!token) {
            throw new ApiError(401, 'No refresh token provided');
        }

        const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string; role: string };
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== token) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const tokens = generateTokens(user._id.toString(), user.role);

        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: { accessToken: tokens.accessToken },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
        }

        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find().select('name email role createdAt');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user?._id);

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        if (name) user.name = name;
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) {
                throw new ApiError(400, 'Email already in use');
            }
            user.email = email;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                user: { _id: user._id, name: user.name, email: user.email, role: user.role }
            },
        });
    } catch (error) {
        next(error);
    }
};
