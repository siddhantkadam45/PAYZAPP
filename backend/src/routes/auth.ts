import express from "express"
export const Authrouter = express.Router();
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
import dotenv from 'dotenv'
import AuthMiddleware from "../Middleware/Authmiddleware";
import cookieParser from "cookie-parser";
dotenv.config();
import zod, { number } from 'zod'

const Signininput = zod.object({
    number:zod.string().min(10).max(10),
    password:zod.string(),
    email:zod.string().email(),
    name:zod.string()
})
const LoginInput = zod.object({
    number:zod.string(),
    password:zod.string()
})

Authrouter.use(cookieParser());
Authrouter.get('/for',AuthMiddleware, (req,res)=>{
    // console.log(req.body.number)
    console.log(req.body)
    res.send('hi there ')
})

Authrouter.post('/signin', async (req,res) => {
    
    const number = req.body.number;
    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;
    // console.log('inside ')
    const {success} = Signininput.safeParse({number,password,name,email});
    // console.log(success)
    if(!success) {
        res.status(403);
        res.json({
            message:'Enter valid crediantails'
        })
        return ;
    }

    const check = await prisma.user.findFirst({
        where: {
            number : number
        }
    })
    // console.log(check)
    if(check) {
        res.json({
            message:"user already Exits "
        })
        return ;
    }
    // console.log('corr')
    const rounsalt = 10;
    const salt = await bcrypt.genSalt(rounsalt);
    const hash = await bcrypt.hash(password,rounsalt);
    
    try {
        // console.log('insdier tr')
        const response = await prisma.user.create({
            data: {
                email:email,
                name:name,
                number:number,
                password:hash
            },
        })
        // console.log('inside user')
        console.log(response)
        const idfromuser = response.id;

        const payload = {number, password,name,email};
        const token = jwt.sign(payload, process.env.JWT_SECRET!);
        // res.cookie("access_token", token)
        
        // res.status(201);
        // res.json({
        //     message:'user created succ '
        // });
        const createbalance = await prisma.balance.create({
            data: {
                userId:idfromuser,
                amount:50000,
                locked:20000
            }
        })
        console.log(createbalance);
        const expriedate = new Date(Date.now() + 10*24*60*60*1000)

        res.cookie("access_token", token, {
            expires:expriedate
            
        }).status(200).json({ message: 'user created  in' });
        return;
    }catch(error) {
        console.log(error)
        res.status(404);
        res.json({message:'error in creation of user '})
    }
})

Authrouter.post('/login', async (req,res) =>{
    const number = req.body.number;
    const password = req.body.password;
   
    console.log(password)
    const  {success} = LoginInput.safeParse({number,password});
    if(!success) {
        res.status(402);
        res.json({
            message:"wrong crediantls"
        })
        return;
    }

    const userr = await prisma.user.findFirst({
        where: {
            number: number
        }
    })
    if(!userr) {
        res.status(404)
        return res.json({
            message:'user not found'
        })
    }
    console.log('user is ' , userr)
    const checkpassword = await bcrypt.compare(password,userr!.password);
    console.log("checkpassword", checkpassword)
    if(!checkpassword) {
        res.status(401);
        res.json({
            message:'wrong password '
        })
        return;
    }
    const payload = {
        number,
        password,
        email : userr!.email,
        name : userr!.name
    }
    try{
        const expriedate = new Date(Date.now() + 10*24*60*60*1000)
        const token = jwt.sign(payload,process.env.JWT_SECRET!);
        console.log(token)
        res.cookie("access_token", token, {
            // httpOnly: true,
            expires:expriedate
        }, ).status(200).json({ message: 'Successfully logged in' });
        return ;
    }catch {
        res.status(403);
        res.json({
            message:'internal server problem'
        })
        return;
    }   
})

Authrouter.post('/logout', AuthMiddleware,async(req,res)=>{
    try{
        const expriedate = new Date(Date.now() + 10*24*60*60*1000)
        res.cookie("access_token","you have logout", {
            expires:expriedate
        }).status(200).json({message:'successfuly logout'})
        return ;
    }catch(err){
        console.log(err);
        res.status(410).json({message:'Internal Server error'})
        return ;
    }
})

export default Authrouter;