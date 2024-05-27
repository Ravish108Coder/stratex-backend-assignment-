import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express'
import { prisma } from "../prisma";
import { User } from "@prisma/client";

type AuthUser = Omit<User, 'password'>;

export interface AuthRequest extends Request {
    user?: AuthUser;
    token?: string;
  }
  //TODO:change its type

export const isAuthenticated = async (req:AuthRequest, res:Response, next: NextFunction) => {
    
    if(!req.headers || !req.headers.authorization) throw new Error('unauthorized access')
    
    let token = req.headers.authorization;
    token = token.split(' ')[1]
    try {
        const verified:any = jwt.verify(token, process.env.JWT_SECRET!)
        if (!verified) {
            return res.status(200).json({ status: false, message: 'User not verified' })
        }
        // const user = await User.findById(verified.id).select('-password');
        const user = await prisma.user.findUnique({
            where: {
                id: verified.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        })
        if (!user) {
            return res.status(200).json({ status: false, message: 'User not found' })
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error: any) {
        return res.status(200).json({ status: false, message: error.message })
    }
};