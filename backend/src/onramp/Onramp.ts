import { Router } from "express";
import AuthMiddleware from "../Middleware/Authmiddleware";
import axios from "axios";

import { PrismaClient } from "@prisma/client";
import { error, time } from "console";
const prisma = new PrismaClient()
const onramprouter = Router();
onramprouter.use(AuthMiddleware);
// //zod validation
// const corsoption = {
//     credentials: true  ,
//     origin:true
// }

// import cors from 'cors';
// onramprouter.use(cors(corsoption));

onramprouter.post('/onramp', async (req, res) => {
    console.log('inside the onramp')
    const { provider, token, number, amount, status } = req.body
    // console.log(provider,token,number,amount,status)
    let a = provider
    if (a == '') a= 'HDFC'
    const check = await prisma.user.findFirst({
        where: {
            number: number
        }
    })
    // console.log(check)
    if (!check) {
        res.status(400)
        res.json({
            message: 'user not valid'
        })
        return
    }

    const transactionIdn = token;
    try {
        const rr = await prisma.onRampTransaction.findFirst({
            where: {
                token: transactionIdn,
                status: "Processing"
            }
        })
        // console.log(rr)
        if (rr) {
            return res.status(402).json({ message: "Transaction id already present " })
        }
    } catch (err) {
        console.log(err);
        return res.status(410).json({ message: 'Internal server error' })
    }
    // console.log('for amount and tre')
    // console.log(amount,transactionIdn,provider)
    // console.log('successtill')

    try {
        const ll = await prisma.onRampTransaction.create({
            data: {
                provider:a,
                status: status,
                startTime: new Date(),
                token: transactionIdn,
                userId: check.id,
                amount: Number(amount)
            }
        })
        console.log(ll)
        res.status(200).json({
            message: 'done'
        })
        return
    } catch (error) {
        console.log(error)
        res.status(405).json({
            message: 'fail'
        })
    }
})

onramprouter.post('/updateonramp', async (req, res) => {
    // console.log('inside the up')
    // console.log('req.body', req.body)
    console.log('insdie the update onramp')
    const { number, token, status, provider } = req.body;
    console.log(number)
    let a  = provider;
    if (provider == '') a = 'HDFC'
    const userrecord = await prisma.user.findFirst({
        where: {
            number: number,
        }
    })
    if (!userrecord) {
        res.status(400)
        res.json({
            message: 'user not valid'
        })
        return
    }

    try {
        try { console.log('inside the try ')
            const updateres = await prisma.onRampTransaction.update({
                where: {
                    token: token,
                    provider: a,
                    status: 'Processing'
                },
                data: {
                    startTime: new Date(),
                    status: status
                }
            })
            if (!updateres) {
                return res.status(402).json({ message: 'Transaction not found' })
            }
            console.log('update', updateres)
            return res.status(200).json({
                message: "done"
            })
        }
        catch (err) {
            // console.log(err);
            res.status(404);
            return res.json({ message: "fail" })
        }
    } catch (err) {
        res.status(410);
        return res.json({ message: "Internal server error" })
    }

})
function filtertimestamp(s: string) {
    return s.slice(0, 16)
}
interface objj {
    amount: string,
    time: string,
    status: string
}
onramprouter.get('/getonramp', async (req, res) => {
    // console.log('inside the getonramp')
    console.log('get on ramp isn')
    const number = req.body.number;
    try {
        const userr = await prisma.user.findFirst({
            where: {
                number: number
            }
        })
        if (!userr) {
            res.status(404);
            return res.json({ message: 'user Not found' })
        }
        const id = userr.id;
        try {
            const rr = await prisma.onRampTransaction.findMany({
                where: {
                    userId: id
                }
            })
            let arr: objj[] = [];
           
            for (let i = 0; i < rr.length; i++) {
                const item = rr[i];
                const time = filtertimestamp(String(item.startTime))
                const b = {
                    status: item.status,
                    time,
                    amount: String(item.amount)
                }
                arr.push(b);
            }
            if (arr.length < 4) {
                return res.status(202).json({ onramparray: arr })
            }
            console.log(arr);
            return res.json({ onramparray: arr.slice(arr.length - 3, arr.length) })
        }catch(err) {
            return res.status(402).json({message:'no on ramp transcation'})
        }
    } catch (err) {
        console.log('erro', err);
        console.log('err')
        res.status(410);
        return res.json({ message: 'internal server error' })
    }
})
export default onramprouter;