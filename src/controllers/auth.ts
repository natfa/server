import express, { Request, Response, NextFunction } from 'express'

import { validateLoginCredentials } from '../validators/auth'
import { isAuthenticated } from '../middleware/isAuthenticated'
import { isAdmin } from '../middleware/isAdmin'

import accountdb from '../db/accounts'
import Account from '../models/Account'

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session)
      return next(new Error('req.session is undefined'))

    if (req.session.isAuthenticated)
      return res.status(400).send('Already authenticated')

    const { email, password } = req.body
    const account = await accountdb.getOneByEmail(email)

    if (!account) {
      return res.status(401).end()
    }

    if (password !== account.passwordHash) {
      return res.status(401).end()
    }

    req.session.isAuthenticated = true
    if (account.isAdmin)
      req.session.isAdmin = true

    return res.status(200).end()
  }
  catch(err) {
    return next(err)
  }
}

const createAccount = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, isAdmin } = req.body

    let account = new Account(null, email, password, isAdmin)
    account = await accountdb.saveOne(account)
    // don't send password hash... duh..
    account.passwordHash = ''
    return res.status(200).send(account)
  }
  catch(err) {
    return next(err)
  }
}

const router = express.Router()

// The validateLoginCredentials only checks for gramatical errors,
// such as mistyped email or an empty password. The authenticate
// method actually makes the authentication and checks the DB
router.post('/', validateLoginCredentials, authenticate)
router.post('/create', isAuthenticated, isAdmin, createAccount)

export default router