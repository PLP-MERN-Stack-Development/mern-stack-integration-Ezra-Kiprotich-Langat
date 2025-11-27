import { body } from 'express-validator'


export const registerValidation = [
body('name').isLength({ min: 2 }),
body('email').isEmail(),
body('password').isLength({ min: 6 })
]


export const postValidation = [
body('title').isLength({ min: 3 }),
body('body').isLength({ min: 5 })
]