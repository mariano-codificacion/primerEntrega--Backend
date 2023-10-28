import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
code: {
    type: Schema.Types.ObjectId,
    unique: true
},
amount: Number,
purchase_datetime: {
    type: Date,
    default: Date.now
},
user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
},
purchaser: { 
    type: String
},
})


const ticketModel = model('ticket', cartSchema)
export default ticketModel