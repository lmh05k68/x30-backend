import mongoose from 'mongoose'
import {userStatus} from '../const/user.const.js'
import collections from '../const/collection.const.js'
const adminSchema = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 255},
    email:{type: String, required: true, maxLength: 255},
    password:{
        type: String,
        maxLength:1000,
        required: true
    },
    phoneNumber: {
        type: String,
        maxLength: 20,
        required: true
    },
})
const AdminModel = mongoose.model(collections.admins,adminSchema)
export default AdminModel