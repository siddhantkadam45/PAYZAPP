import { Router } from "express";
import AuthMiddleware from "../Middleware/Authmiddleware";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
// import { error } from "console";
// import { Cookies } from "cloudflare/resources/page-shield/cookies";
import zod from 'zod'
const prisma = new PrismaClient();
const bankwebhook = Router();

function generatetranscationid() {
    return 'TXN' + Math.random().toString(36).substring(2, 9); 
}

const inputcheck = zod.object({
    amount:zod.string(),
    bankname:zod.string()
})
bankwebhook.post('/netbanking/hdfc', AuthMiddleware, async (req, res) => {
    try {
        const { number, amount, bankname } = req.body;
        const {success} = inputcheck.safeParse({amount,bankname})
        if(!success) {
            return res.status(402).json({ error: "Not proper format" });
        }
        if(Number(amount)>100000) {
            return res.status(402).json({message:'  Cannot transfer more than 1 Lakh'})
        } 
        const record = await prisma.user.findFirst({ where: { number } })
        if (!record) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const id = record.id;

        const recordofbalance = await prisma.balance.findFirst({ where: { userId: id } });
        console.log("recordofbalance  ", recordofbalance)
        if (!recordofbalance) {
            return res.status(404).json({ error: "Balance record not found" });
        }

        const balanceleft = recordofbalance.amount;
        if ((balanceleft) >= Number(amount)) {
            const token = generatetranscationid();
            const url = "http://localhost:3000/api/auth/onramp";

            const headers = {
                Cookie: req.headers.cookie
            };

            const status = "Processing"
            console.log('this this')
            const response = await axios.post(url, {
                provider: bankname,
                token,
                number,
                amount,
                status
            }, {
                headers: headers, withCredentials: true
            });

            console.log('2 this')
            if (response.data.message == 'done') {
                try {
                    
                    const qres = await prisma.$transaction([
                        prisma.balance.updateMany({
                            where: {
                                userId: id,
                            },
                            data: {
                                amount: {
                                    increment: Number(amount)
                                }
                            }
                        })
                    ])
                    
                    setTimeout(async() => {
                        console.log('inside set timeout for update onramp')
                        const updateurl = 'http://localhost:3000/api/auth/updateonramp'
                        const resfromramp = await axios.post(updateurl, {
                        token,
                        status: "Success",
                        provider: bankname,
                        number: number
                        }, {
                            headers: headers,
                            withCredentials: true
                        })
                        console.log(resfromramp.data)
                    }, 1*1000);

                } catch (error:any) {
                    // console.log(error.response.data);
                    res.status(404).json({
                        message: 'internal server error'
                    })
                    return
                }
            }
            return res.status(200).json({
                message: "Transaction successful",
                transactionId: token,   
            });

        } else {
            return res.status(400).json({
                error: "Insufficient balance"
            });
        }
    } catch (error: any) {
        console.error('Error Response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
        });
        return res.status(500).json({
            error: "An error occurred during the transaction process"
        });
    }
});

export default bankwebhook;
