import { Router } from 'express';
import {getTickets, createTicket} from '../controllers/tickets.controller.js';

const routerTicket = Router();

routerTicket.get('/', getTickets);
routerTicket.get('/create', createTicket);

export default routerTicket;