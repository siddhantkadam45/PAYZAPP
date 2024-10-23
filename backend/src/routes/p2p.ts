
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import AuthMiddleware from '../Middleware/Authmiddleware'
import { Router } from "express";
// import cors from 'cors'
const p2prouter = Router();
p2prouter.use(AuthMiddleware);

// p2prouter.use(cors())

import zod, { number, string } from 'zod'
const checkinput = zod.object({
    to: zod.string().min(10).max(10),
    amount: zod.number().refine((val) => {
        return val % 1 == 0
    })
})

p2prouter.post("/p2ptransfer", async (req, res) => {
   
    const to = req.body.to;
    const from = req.body.number;
    const amount = req.body.amount;
    const { success } = checkinput.safeParse({ to, amount });
    if (!success) {
        res.status(403);
        return res.json({ message: 'invalid crediantls see the amount and number' });
    }
    console.log(success)
    const touserrecord = await prisma.user.findFirst({
        where: {
            number: to
        }
    })
    if (!touserrecord) {
        res.status(404)
        return res.json({
            message: "reciver  record not found"
        })
    }
    const userrecord = await prisma.user.findFirst({
        where: {
            number: from
        }
    })
    if (!userrecord) {
        res.status(404)
        return res.json({
            message: "user record not found"
        })
    }
    const userid = userrecord.id;
    const balacerecordofuser = await prisma.balance.findFirst({
        where: {
            userId: userid
        }
    })
   
    if (!balacerecordofuser) {
        res.status(404)
        return res.json({
            message: "balance record not found"
        })
    }
    if (balacerecordofuser.amount < amount) {
        res.status(402);
        return res.json({
            message: "not sufficient balance "
        })
    }
    // console.log("balacerecordofuser: ", balacerecordofuser)
    // console.log('\n')
    try {
        await prisma.$transaction(async (tx) => {
            const t = await prisma.balance.update({
                where: { userId: balacerecordofuser.userId },
                data: { amount: { decrement: amount } }
            });
            // console.log(t)
            const at = await prisma.balance.update({
                where: { userId: touserrecord.id },
                data: { amount: { increment: amount } }
            })
            // console.log(at);
            try {
                const teae = await prisma.p2pTransfer.create({
                    data: {
                        timestamp: new Date(),
                        fromUserId: balacerecordofuser.userId,
                        toUserId: touserrecord.id,
                        amount: amount
                    }
                })
                // console.log("teae", teae);
            }
            catch (err: any) {
                console.log(err)
                throw new Error(err)
            }
        })

        res.status(202);
        return res.json({
            message: 'successfully transfer'
        })
    } catch (err) {
        console.log(err);
        res.status(402).json({
            message: 'error occur while trancsation'
        })
        return;
    }

})

// p2prouter.post('/p2ponramp', async (req,res) => {
//     const from = req.body.number;
//     const to = req.body.to;

// })

interface obj {
    time:string,
    amount : string
    to:string,

}
function filtertimestamp(s : string) {
    return s.slice(0,16)
} 

p2prouter.get('/getp2pdetails',AuthMiddleware, async (req, res) => {
    console.log('insde')
    try {
        const fromuser = req.body.number;
        const record = await prisma.user.findFirst({
            where: {
                number: fromuser
            }
        })
      
        if (!record) {
            return res.status(402).json({ message: "user record not found" })
        }

        const pp2record = await prisma.p2pTransfer.findMany({
            where: {
                fromUserId: record.id
            }
        })
        let userrecords:obj[] = [];
        for(let i =0;i<pp2record.length;i++) {

            let item = pp2record[i];
            const sendername = await prisma.user.findFirst({
                where: {
                    id: item.toUserId
                }
            })
            const timeoftransaction =  filtertimestamp(String(item.timestamp));
            
            const eachuser = {
                amount : String(item.amount),
                time: timeoftransaction,
                to : String(sendername?.name)
            }
            
            userrecords.push(eachuser)

        }
        // console.log('eachuser ' , userrecords)
        if(userrecords.length<4) {
            res.status(200).json({ p2ptransfers: userrecords })
            return;
        }
        // console.log(userrecords.slice(userrecords.length-3, userrecords.length))
        res.status(200).json({ p2ptransfers: userrecords.slice(userrecords.length-3, userrecords.length) })
        return;
    } catch (err) {
        console.log(err);
        return res.status(404).json({ message: "does not have any transaction" })
    }

})

p2prouter.get('/getuserbalance', AuthMiddleware, async (req, res) => {
    const number = req.body.number;
    console.log('insdie')
    const userrecord = await prisma.user.findFirst({
        where: {
            number: number
        }
    })

    if (!userrecord) {
        res.status(404);
        return res.json({
            message: 'user not found '
        })
    }

    try {
        const balacerecordofuser = await prisma.balance.findFirst({
            where: {
                userId: userrecord.id
            }
        })

        if (!balacerecordofuser) {
            return res.status(402).json({
                message: 'balance record not found'
            })
        }
        // console.log(balacerecordofuser)
        // console.log(userrecord.name, balacerecordofuser.amount)
        res.status(202);
        return res.json({ name: userrecord.name, amount: balacerecordofuser.amount })
    }
    catch (err) {
        return res.status(410).json({ message: 'internal server error' });
    }

})

p2prouter.get('/getbalanced', AuthMiddleware, async (req, res) => {
    const number = req.body.number;
    console.log('insdie')
    const userrecord = await prisma.user.findFirst({
        where: {
            number: number
        }
    })

    if (!userrecord) {
        res.status(404);
        return res.json({
            message: 'user not found '
        })
    }

    try {
        const balacerecordofuser = await prisma.balance.findFirst({
            where: {
                userId: userrecord.id
            }
        })

        if (!balacerecordofuser) {
            return res.status(402).json({
                message: 'balance record not found'
            })
        }
        // console.log(balacerecordofuser)
        // console.log(userrecord.name, balacerecordofuser.amount)
        console.log(balacerecordofuser)
        const totalamount = balacerecordofuser.amount;
        const lockedamount = balacerecordofuser.locked;
        const unlocked = totalamount-lockedamount;
        // console.log(totalamount,lockedamount,unlocked)
        res.status(202);
        return res.json({ totalamount: totalamount, lockedamount: lockedamount, unlocked:unlocked })
    }
    catch (err) {
        return res.status(410).json({ message: 'internal server error' });
    }

})
export default p2prouter;