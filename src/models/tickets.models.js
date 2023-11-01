import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
    id_ticket: {
        type: Schema.Types.ObjectId,
    },
    code: {
        type: String,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    purchaser: {
        type: String
    },
})


const ticketModel = model('ticket', ticketSchema)
export default ticketModel