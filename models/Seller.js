import mongoose from 'mongoose'
import {userStatus} from '../const/user.const.js'
import collections from '../const/collection.const.js'
const sellerSchema = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 255},
    email:{type: String, required: true, maxLength: 255},
    status: {
        type: String,
        enum: [userStatus.active,userStatus.inactive],
        default: userStatus.active
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
    phone: {
        type: String,
        maxLength: 20,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
    }
})
const SellerModel = mongoose.model(collections.sellers,sellerSchema)
export default SellerModel