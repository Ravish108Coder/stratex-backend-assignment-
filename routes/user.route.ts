import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { Role } from "@prisma/client";
const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
const router = Router();


// register user
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password, role="USER" } : {name:string, email: string, password: string, role: Role} = req.body;

        if (!name) throw new Error('name is missing');
        if (!email) throw new Error('email is missing');
        if (!password) throw new Error('password is missing');

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name, email, password: hashPassword, role
            }
        })

        return res
            .status(200)
            .json({ error: false, msg: "Account Created Successfully", data: newUser });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});


// login user
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email) throw new Error('email is missing');
        if (!password) throw new Error('password is missing');

        const hashPassword = await bcrypt.hash(password, 10);

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!existingUser) throw new Error('User does not exist')

        const isUserVerified = await bcrypt.compare(password, existingUser.password)

        if (!isUserVerified) throw new Error('Invalide email or password')

        // generate and send token

        const token = jwt.sign({
            id: existingUser.id,
            email
        }, process.env.JWT_SECRET!)

        return res
            .status(200)
            .json({ error: false, msg: "Logged In Successfully", data: { token, existingUser } });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

export default router;
