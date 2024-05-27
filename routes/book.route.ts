import { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { Book, Role } from "@prisma/client";
const bcrypt = require("bcryptjs");
import dotenv from "dotenv";
import { AuthRequest, isAuthenticated } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer";
import csv from 'csvtojson'
import { isValidDateFormat } from "../helpers/validPublishedDate";
dotenv.config();
const router = Router();
import fs from "fs"

router.use(isAuthenticated);

type CSVBook = Omit<Book, 'sellerId'>

// Endpoint to fetch all seller books
router.get("/all", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;

        if (!user || !token || user.role === "SELLER") throw new Error('You are not allowed to access this')
        const allBooks = await prisma.book.findMany();
        return res.status(200).json({ error: false, msg: `Total ${allBooks.length} Books Fetched Successfully`, data: allBooks });
    } catch (err: any) {
        return res.status(500).json({ error: true, msg: err.message });
    }
});

// For testing it is authorized or not
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;

        if (!user || !token || user.role !== "SELLER") throw new Error('You are not allowed to access this')


        return res.json({ msg: "You are authorized", data: { user, token } })
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
})

// for uploading books from csvfile
router.post("/upload", upload.single('csvfile'), async (req: any, res: Response) => {
    try {

        // console.log('hi')

        const user = req.user;
        const token = req.token;

        if (!user || !token || user.role !== "SELLER") throw new Error('Unauthorized access')
        // console.log(req.file)
        const jsonArray = await csv().fromFile(req.file?.path)

        // Validate each book in the parsed JSON array
        jsonArray.forEach((book: CSVBook) => {

            // console.log(book)
            if (book.title === '' || book.author === '' || String(book.price) === '' || book.publishedDate==='') {
                console.log(book)
                throw new Error('All fields (title, author, price, publishedDate) must be provided in the CSV file');
            }

            // Additional validation for publishedDate format
            if (!isValidDateFormat(book.publishedDate)) {
                console.log(book)
                throw new Error(`Invalid date format for publishedDate: ${book.publishedDate}`);
            }
        });

        // Create books from the parsed JSON array
        const createdBooks = await prisma.book.createMany({
            data:
                jsonArray.map((book: CSVBook) => ({
                    title: book.title,
                    author: book.author,
                    price: Number(book.price),
                    publishedDate: book.publishedDate,
                    sellerId: user.id
                })),
        });

        // Remove the uploaded file
        fs.unlink(req.file?.path, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${req.file?.path}`, err);
            } else {
                console.log(`Successfully deleted file: ${req.file?.path}`);
            }
        });

        return res
            .status(200)
            .json({ error: false, msg: `${createdBooks.count} Books Uploaded Successfully`, data: createdBooks });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

// for creating a book
router.post("/create", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;

        if (!user || !token || user.role !== "SELLER") throw new Error('Unauthorized access')
        const { title, author, price, publishedDate }: { title: string, author: string, price: number, publishedDate: string } = req.body;

        if (!title) throw new Error('title is missing');
        if (!author) throw new Error('author is missing');
        if (!price) throw new Error('price is missing');
        if (!publishedDate) throw new Error('publishedDate is missing');

        const isValidPublishedDateFormat = isValidDateFormat(publishedDate)

        if (!isValidPublishedDateFormat) throw new Error('publishedDate is not in valide format it should be in (YYYY-MM-DD) format')

        const sellerId = user.id

        const newBook = await prisma.book.create({
            data: {
                title, author, price, sellerId, publishedDate
            }
        })

        if (!newBook) throw new Error('Unable to create a book')

        return res
            .status(200)
            .json({ error: false, msg: "Book Created Successfully", data: newBook });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

// for getting particular seller books
router.get("/sellerBooks", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;

        if (!user || !token || user.role !== "SELLER") throw new Error('Unauthorized access')

        const books = await prisma.book.findMany({
            where: {
                sellerId: user.id
            }
        })

        return res
            .status(200)
            .json({ error: false, msg: `${books.length} Books Fetched Successfully`, data: books });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

// to delete a book by authorized owner seller
router.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;
        const { id: bookId } = req.params

        if (!user || !token || user.role !== "SELLER") throw new Error('Unauthorized access')

        const sellerId = user.id

        // Fetch the book to check the seller
        const book = await prisma.book.findUnique({
            where: {
                id: bookId,
            },
        });

        if (!book) throw new Error(`Book with id ${bookId} not found`);
        if (book.sellerId !== sellerId) throw new Error('Unauthorized: You are not the seller of this book');

        const toBeDeletedBook = await prisma.book.delete({
            where: {
                id: bookId
            }
        })

        if (!toBeDeletedBook) throw new Error('Unable to delete a book')

        return res
            .status(200)
            .json({ error: false, msg: "Book Deleted Successfully", data: toBeDeletedBook });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

// to access a book by authorized owner seller or user
router.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;
        const { id: bookId } = req.params

        if (!user || !token) throw new Error('Unauthorized access')

        const sellerId = user.id

        if (user.role === "SELLER") {
            // Fetch the book to check the seller
            const book = await prisma.book.findUnique({
                where: {
                    id: bookId,
                },
            });

            if (!book) throw new Error(`Book with id ${bookId} not found`);
            if (book.sellerId !== sellerId) throw new Error('Unauthorized: You are not the seller of this book');

        }

        const particularIdBook = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        })

        if (!particularIdBook) throw new Error(`Unable to access this book with id ${bookId}`)

        return res
            .status(200)
            .json({ error: false, msg: "Book Fetched Successfully", data: particularIdBook });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});

// to update a book by authorized owner seller
router.put("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        const token = req.token;
        const { id: bookId } = req.params

        if (!user || !token || user.role !== "SELLER") throw new Error('Unauthorized access')
        const { title, author, price, publishedDate }: { title: string, author: string, price: number, publishedDate: string } = req.body;

        if (!title) throw new Error('title is missing');
        if (!author) throw new Error('author is missing');
        if (!price) throw new Error('price is missing');
        if (!publishedDate) throw new Error('publishedDate is missing');

        const isValidPublishedDateFormat = isValidDateFormat(publishedDate)

        if (!isValidPublishedDateFormat) throw new Error('publishedDate is not in valide format it should be in (YYYY-MM-DD) format')

        const sellerId = user.id

        // Fetch the book to check the seller
        const book = await prisma.book.findUnique({
            where: {
                id: bookId,
            },
        });

        if (!book) throw new Error(`Book with id ${bookId} not found`);
        if (book.sellerId !== sellerId) throw new Error('Unauthorized: You are not the seller of this book');

        const toBeUpdatedBook = await prisma.book.update({
            where: {
                id: bookId
            },
            data: {
                title, author, price, sellerId, publishedDate
            }
        })

        if (!toBeUpdatedBook) throw new Error(`Unable to update this book with id ${bookId}`)

        return res
            .status(200)
            .json({ error: false, msg: "Book Updated Successfully", data: toBeUpdatedBook });
    } catch (err: any) {
        return res.status(400).json({ error: true, msg: err?.message });
    }
});


export default router;
