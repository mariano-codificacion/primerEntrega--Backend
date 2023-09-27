import { validatePassword, createHash } from '../utils/bcrypt'
import local from 'passport'
import passport from 'passport'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, passport, done) => {
        
        
        }
    ))
}