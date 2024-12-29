import jwt from 'jsonwebtoken';
import { findBuyerById } from '../repositories/buyer.repository.js';

const buyerAuthMiddleware = {
    authentication: async (req, res, next) => {
        const authToken = req.headers['authorization'];
        try {
            const token = authToken && authToken.split(' ')[1];
            if (!token) throw new Error('Please login again');

            const verifyToken = jwt.verify(token, process.env.ACCESS_TK_KEY);
            const { id } = verifyToken;

            const user = await findBuyerById(id);
            if (!user) throw new Error('Unauthorized');

            req.currentUser = user;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({ message: "Token expired, please login again" });
            }
            return res.status(401).send({ message: err.message });
        }
    }
};
export default buyerAuthMiddleware;