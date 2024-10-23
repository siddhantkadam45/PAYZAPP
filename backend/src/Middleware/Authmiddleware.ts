import jwt from 'jsonwebtoken'
// import cookieParser from 'cookie-parser';
import { number } from 'zod';

export default function AuthMiddleware(req: any, res: any, next: any) {
    // console.log('inside the authmiddleware ')
    const cookies = req.cookies.access_token;
    console.log("cookies" , cookies)
    if(!cookies) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    jwt.verify(cookies, process.env.JWT_SECRET!, (err: any, decoded: any) => {

        if (err) {
            console.log(err.message)
            res.status(401).json({ message: 'Invalid token' });
            return
        }
        console.log(decoded.number)
        req.body.number = decoded.number;
        req.body.email = decoded.email;
        next(); 
    })
    
}