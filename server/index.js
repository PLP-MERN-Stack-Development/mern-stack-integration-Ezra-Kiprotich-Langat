import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import path from 'path'


import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import categoriesRoutes from './routes/categories.js'
import errorHandler from './middleware/errorHandler.js'


dotenv.config()


const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL || '*' }))


// Connect to DB
connectDB()


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/categories', categoriesRoutes)


// Static uploads (if using local storage)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// Error handler
app.use(errorHandler)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on ${PORT}`))