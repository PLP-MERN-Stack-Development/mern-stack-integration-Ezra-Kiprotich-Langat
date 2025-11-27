import Post from '../models/Post.js'
import { validationResult } from 'express-validator'


export const getPosts = async (req, res, next) => {
try{
const { page = 1, limit = 10, q, category } = req.query
const filter = {}
if(q) filter.$or = [ { title: new RegExp(q, 'i') }, { body: new RegExp(q, 'i') } ]
if(category) filter.categories = category


const skip = (page - 1) * limit
const [items, total] = await Promise.all([
Post.find(filter).populate('author','name').populate('categories','name').sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit)),
Post.countDocuments(filter)
])
res.json({ items, total, page: Number(page), pages: Math.ceil(total/limit) })
} catch(err){ next(err) }
}


export const getPostById = async (req, res, next) => {
try{
const post = await Post.findById(req.params.id).populate('author','name').populate('categories','name')
if(!post) return res.status(404).json({ message: 'Not found' })
res.json(post)
} catch(err){ next(err) }
}


export const createPost = async (req, res, next) => {
try{
const errors = validationResult(req)
if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
const { title, body, categories = [] } = req.body
const featuredImage = req.file ? `/uploads/${req.file.filename}` : undefined
const post = new Post({ title, body, categories, featuredImage, author: req.user._id })
await post.save()
res.status(201).json(post)
} catch(err){ next(err) }
}


export const updatePost = async (req, res, next) => {
try{
const post = await Post.findById(req.params.id)
if(!post) return res.status(404).json({ message: 'Not found' })
if(String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
const { title, body, categories } = req.body
if(req.file) post.featuredImage = `/uploads/${req.file.filename}`
post.title = title ?? post.title
post.body = body ?? p