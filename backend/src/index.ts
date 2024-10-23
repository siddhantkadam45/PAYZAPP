import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import Authrouter from './routes/auth'
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bankwebhook from './bankserver/Bankserver';
import onramprouter from './onramp/Onramp';
import p2prouter from './routes/p2p';

const app = express();
const corsoption = {
    credentials: true  ,
    origin:true
}

app.use(cookieParser());

app.use(express.json());
app.use(cors(corsoption));

app.use('/api/auth', Authrouter);
app.use('/api/auth', bankwebhook);
app.use('/api/auth', onramprouter);
app.use('/api/auth', p2prouter);
// app.use('/api/auth', p)


app.listen(3000, () => {
    console.log('successfull')
});