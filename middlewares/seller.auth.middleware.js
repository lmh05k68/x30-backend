import jwt from 'jsonwebtoken'
import { findSellerById } from '../repositories/seller.repository.js';

const sellerAuthMiddleware = {
    authentication: async (req, res, next) => {
      const authToken = req.headers['authorization']
      try {
        const token = authToken && authToken.split(' ')[1]
        if(!token) throw new Error('Please login again')
        const verifyToken = jwt.verify(token, process.env.ACCESS_TK_KEY)
        const { _id } = verifyToken
        const user = await findSellerById(_id)
        if(!user) throw new Error('Unauthorized')
              req.currentUser = user
        req.shopId = user.shopId

        next();
      } catch (error) {
        res.status(401).send({
            message: error.message
        })
      }
    }
};
export default sellerAuthMiddleware;