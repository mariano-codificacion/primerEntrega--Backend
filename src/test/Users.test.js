import mongoose from "mongoose";
import userModel from "../models/users.models";
import Assert from "assert";
import { beforeEach } from "mocha";

await mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB is connected"))

const assert = Assert.strict

describe('testing Users', () => {
    before(function () {
        this.users = new Users
    })

    beforeEach(function() {
        this.timeout(7000)
    })

    it('Consultar todos los usuarios de la aplicacion', async function() {
        
    })

})

