import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'


export const register = async (req, res, next) => {
try{
const errors = validationResult(req)
if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })


const { name, email, password } = req.body
const exists = await User.findOne({ email })
if(exists) return res.status(400).json({ message: 'Email already used' })


const hashed = await bcrypt.hash(password, 10)
const user = new User({ name, email, password: hashed })
await user.save()
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
} catch(err){ next(err) }
}


export const login = async (req, res, next) => {
try{
const { email, password } = req.body
const user = await User.findOne({ email })
if(!user) return res.status(400).json({ message: 'Invalid credentials' })
const match = await bcrypt.compare(password, user.password)
if(!match) return res.status(400).json({ message: 'Invalid credentials' })
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
} catch(err){ next(err) }
}