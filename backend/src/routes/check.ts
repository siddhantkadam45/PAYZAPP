import {Router} from 'express'

const router = Router();

router.get('/for', (req,res)=>{
    res.send('hi there ')
})