import { useEffect, useState } from "react"
import Inputbox from "../components/Input";
import axios from "axios";
import zod from 'zod'
import Navigate from "../components/navigate";
import Generictransferholder from "../components/Generictransferholder";


import Alert from '@mui/material/Alert';

export default function PtopTransfer() {
    return (
        <div>
            <div className="lg:flex   lg:justify-between lg:items-center lg:flex-row bg-[#faf3f4] flex flex-col gap-24  justify-center pt-0">
                <div className=" lg:h-screen lg:w-1/2 lg:justify-center lg:flex lg:items-center flex justify-center  items-center  mt-4 lg:mt-0">
                    <div className="w-1/2"><Generictransferholder card={Createsendcard} /></div>
                </div>
                <div className="flex flex-col justify-center    items-center  lg:h-screen lg:w-1/2 lg:gap-24 gap-16">
                    <div className="bg-red-0 w-3/4"><Generictransferholder card={Balancecomponent} /></div>
                    <div className="bg-red-0 w-3/4"><Generictransferholder card={Transferdetails} /></div>
                </div>
            </div>
        </div>

    )
}

interface obj {
    to: string,
    amount: Number
}

const checkinput = zod.object({
    to: zod.string().min(10).max(10),
    amount: zod.number().refine((val) => {
        return val % 1 == 0
    })
})
function Createsendcard() {
    const [to, setnumber] = useState<Number>(0);
    const [amount, setamount] = useState<Number>(0);
    const [alertmessage, setalertmess] = useState('');
    const [severityy, setsevrity] = useState('');
    async function sendrequest() {
        try {
            const url = "http://localhost:3000/api/auth/p2ptransfer";
            if(Number(amount) <0) {
                setsevrity('error');
                setalertmess("Amount can't be negative")
                return
            }
            const b: obj = {
                to: String(to),
                amount
            }
            const { success } = checkinput.safeParse(b);
            if (!success) {
                console.log('Enter valid credianlts')
                setsevrity('error');
                setalertmess('Enter valid Crediantails')
                return
            }
            //handle transfer 
            const res = await axios.post(url, b, { withCredentials: true })
            console.log(res.data)
            setsevrity("success");
            setalertmess(res.data.message)
            // handletransfer(res.status)

        }
        catch (err: any) {
            console.log(err.response.data);
            setsevrity('error');
            setalertmess(err.response.data.message)
            //handle not transfer 
            // handletransfer(err.response.status)
        }
    }
    // console.log(to, amount)
    if (alertmessage.length > 0) {
        setTimeout(() => {
            setsevrity('')
        }, 5000);
    }
    return (
        <div className="h-full w-full">
            <div className="flex justify-left text-2xl"> Send </div>
            <Inputbox name="Number" typename="number" onchange={(e) => setnumber(Number(e.target.value))} />
            <Inputbox name="Amount" typename="number" onchange={(e) => setamount(Number(e.target.value))} />
            <Navigate name="Send" onchange={() => sendrequest()} />
            {severityy.length > 0 ? (severityy == "success" ? <Alert severity="success">{alertmessage}</Alert> : <Alert severity="error">{alertmessage}</Alert>) : <div></div>}

        </div>
    )
}

export function Transferdetails() {

    const [arr, setarr] = useState([]);
    const [loader, setloader] = useState('Loading details from bank ..');

    useEffect(() => {
        async function fetchdata() {
            try {
                const url = "http://localhost:3000/api/auth/getp2pdetails";
                const resp = await axios.get(url, { withCredentials: true });
              
                const temp = resp.data.p2ptransfers;
                temp.reverse()
                if(temp.length ==0) {
                    setloader("Does not have previos Transaction .")
                }
                setarr(resp.data.p2ptransfers);
                
            } catch (err: any) {
                console.log('err', err.response.data)

            }
        }
        fetchdata();
    }, [])
    // console.log("arr", arr)
    return (
        <div className="bg-green-0 pb-2  ">
            {arr.length > 0 ? (
                <div>
                    <div className="text-2xl p-2">Recent Transcations</div>
                    <div className=" h-72 overflow-y-auto   scrollbar-thin scrollbar-thumb-blue-500 ">
                        {arr.map((item: any, index) => {

                            return (<div key={index}>

                                <div className="  py-2 px-1 flex flex-col">
                                    <div className="flex justify-between">
                                        <div className=""> Amount Debited </div>
                                        <div className="text-red-600">- Rs {item.amount}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>Amount Credited to </div>
                                        <div>{item.to}</div>
                                    </div>
                                    <div>
                                        {item.time}
                                    </div>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
            ) : <div className="text-xl p-2">{loader}</div>}

        </div>
    )
}


export function Balancecomponent() {
    // const 
    const [totalbalance, settotolbalance] = useState('');
    const [Unlockedbalance, setunlockedbalance] = useState('');
    const [lockedbalace, setlockedbalance] = useState('');
    useEffect(() => {
        async function getbalance() {
            try {
                const url = "http://localhost:3000/api/auth/getbalanced";
                const res = await axios.get(url, { withCredentials: true });
                // console.log(res.data)
                settotolbalance(res.data.totalamount);
                setunlockedbalance(res.data.unlocked)
                setlockedbalance(res.data.lockedamount)
            } catch (err: any) {
                console.log('inside the err', err.response.data)
            }
        }
        getbalance();
    })
    // console.log(totalbalance, Unlockedbalance, lockedbalace)
    return (
        <div className="border-0 ">
            <div >
                <div className="text-3xl bg-red-0">Balance </div>
                <div className="flex  flex-col gap-0">
                    <div className="flex justify-between bg-red-0  border-b-2 border-#dadee4 py-2">
                        <div>Unlocked Balance</div>
                        <div>{Unlockedbalance} Rs.</div>
                    </div>
                    <div className="flex justify-between bg-red-0  border-b-2 border-#dadee4 py-2">
                        <div>Total Locked Balance </div>
                        <div>{lockedbalace} Rs.</div>
                    </div>
                    <div className="flex justify-between bg-red-0  border-b-2 border-#dadee4 py-2">
                        <div>Total Balance</div>
                        <div>{totalbalance} Rs.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

//1000000001