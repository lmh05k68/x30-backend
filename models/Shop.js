import mongoose from 'mongoose'
import {userStatus} from '../const/user.const.js'
import collections from '../const/collection.const.js'
const shopSchema = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 255},
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
    date:{
        type: Date,
        default: Date.now
    },
    addresses:[
        {
            type: String,
            address: String,
            isDefault: Boolean
        },
    ],
    businessLicense:{
        type: String,
        required: true
    },
    taxCode:{
        type: String,
        maxLength: 20,
        required: true
    },
    citizenId:{
        type: String,
        maxLength: 50,
        required: true
    },
    description: String
})
const ShopModel = mongoose.model(collections.shops,shopSchema)
export default ShopModel