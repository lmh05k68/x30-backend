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
    phones: [{
        type: String,
        maxLength: 20,
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
    addresses:[
        {
            type: String,
        },
    ],
    businessLicense:{
        type: String,
    },
    taxCode:{
        type: String,
        maxLength: 20,
      
    },
    citizenId:{
        type: String,
        maxLength: 50,
    },
    description: String
})
const ShopModel = mongoose.model(collections.shops,shopSchema)
export default ShopModel