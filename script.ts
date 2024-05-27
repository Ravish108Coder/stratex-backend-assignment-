import express, { Request, Response } from 'express'
export const app = express()
import cookieParser from 'cookie-parser';
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()




import userRoutes from './routes/user.route'
import bookRoutes from './routes/book.route'

app.use(cors())
app.use(express.json()); // use for parsing application/json
app.use(express.urlencoded({ extended: true })); // use for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // use for parsing cookies

app.use('/api/user', userRoutes)
app.use('/api/book', bookRoutes)

app.get('/', (req, res)=>{
    res.send('hello world')
})
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening at port ${port}`))