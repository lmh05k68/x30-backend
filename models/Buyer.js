import mongoose from 'mongoose'
import {userStatus} from '../const/user.const.js'
import collections from '../const/collection.const.js'
const buyerSchema = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 255},
    email:{type: String, required: true, maxLength: 255},
    status: {
        type: String,
        enum: [userStatus.active,userStatus.inactive],
        default: userStatus.active
    },
    trustIndex:{
        type: Number,
        min: 0
    },
    img: {
        type: String,
        maxLength: 1000
    },
    password:{
        type: String,
        maxLength:1000,
        required: true
    },
    addresses:[
        {
            type: String,
            address: String,
            isDefault: Boolean
        },
    ],
    phoneNumber: {
        type: String,
        maxLength: 20,
        required: true
    },
    paymentMethods:[
        {
            type: String,
            isDefault: Boolean
        }
    ],
    cart:[],
    resetToken: { type: String, default: null },
    tokenExpiration: { type: Date, default: null }
})
const BuyerModel = mongoose.model(collections.buyers,buyerSchema)
export default BuyerModel