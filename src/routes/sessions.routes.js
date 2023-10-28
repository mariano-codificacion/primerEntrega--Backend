import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { getCurrent, getGitHub, getGithubSession, getJWT, getLogout, postSession } from "../controllers/session.controller.js";


const sessionRouter = Router()

sessionRouter.post('/login', passport.authenticate('login'), postSession)
  
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: true }, getJWT)) 
   
sessionRouter.get('/current', passportError('jwt'), authorization('user'), getCurrent)

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGitHub)

sessionRouter.get('/githubSession', passport.authenticate('github'), getGithubSession)

sessionRouter.get('/logout', getLogout)
   
export default sessionRouter