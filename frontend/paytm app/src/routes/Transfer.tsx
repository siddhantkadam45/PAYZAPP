import { useState, useEffect } from "react";
import Generictransferholder from "../components/Generictransferholder";
import Inputbox from "../components/Input"
import Navigate from "../components/navigate";
import { Balancecomponent } from "./ptpTransfer";
import axios from "axios";
import Alert from '@mui/material/Alert';
import zod from 'zod'
// bg-[#ddd9d9]
export default function Transfer() {
    // return <div>hi</div>
    return (
        <div>
            <div className="lg:flex    lg:justify-between lg:items-center lg:flex-row bg-[#faf3f4] flex flex-col gap-24 justify-center ">
                <div className=" lg:h-full lg:w-1/2 lg:justify-center lg:flex lg:items-center flex justify-center  items-center mt-5 lg:mt-0 ">
                    <div className="w-1/2 "><Generictransferholder card={Fortransfer} /></div>
                </div>
                <div className="flex flex-col justify-center    items-center  lg:h-screen lg:w-1/2 lg:gap-24 gap-16">
                    <div className="bg-red-0 w-3/4 overflow-hidden"><Generictransferholder card={Balancecomponent} /></div>
                    <div className="bg-red-0 w-3/4"><Generictransferholder card={Transferdetailsforaddmoney} /></div>
                </div>
            </div>
        </div>
    )
}

interface addmoney {
    bankname: string,
    amount: string
}

const checkinput = zod.object({
    bankname: zod.string(),
    amount: zod.number().refine((val) => {
        return val % 1 == 0
    })
})
function Fortransfer() {
    const [bankname, setbankname] = useState('');
    const [amount, setamount] = useState<Number>(0);
    const [alertmessage, setalertmess] = useState('');
    const [severityy, setsevrity] = useState('');
    async function Addmoneytowallet() {
        try {
            const url = "http://localhost:3000/api/auth/netbanking/hdfc";
            if(Number(amount) <0) {
                setsevrity('error');
                setalertmess("Amount can't be negative")
                return
            }
            if (Number(amount) > 100000) {
                setsevrity('error');
                setalertmess('Cannot Add more than 1 Lakh')
                return
            }
            const b = {
                bankname,
                amount: amount
            }
            const { success } = checkinput.safeParse(b);
            if (!success) {
                // console.log('Enter valid credianlts')
                setsevrity('error');
                setalertmess('Enter valid Crediantails')
                return
            }
            const d: addmoney = {
                bankname,
                amount: String(amount)
            }
            const res = await axios.post(url, d, { withCredentials: true })
            // console.log(res)
            // console.log('response data is ', res)
            setsevrity('success')
            setalertmess(res.data.message)
        }
        catch (err: any) {
            setsevrity('error');
            setalertmess(err.response.data.error)
        }
    }
    if (alertmessage.length > 0) {
        setTimeout(() => {
            setsevrity('')
        }, 5000);
    }
    // console.log(bankname,amount)
    return (
        <div>
            <div className="text-2xl">Add Money </div>
            <div className="flex flex-col gap-4">
                <Inputbox name="Amount" typename="number" onchange={(e) => setamount(Number(e.target.value))} />
                <div>
                    <div>Bank</div>
                    <select className="w-full py-1  border-2 rounded-md mt-2" onChange={(e) => setbankname(String(e.target.value))}>
                        <option value="Hdfc">HDFC</option>
                        <option value="Axis">Axis</option>
                    </select>
                </div>
                <Navigate name="Add Money" onchange={() => Addmoneytowallet()} />
                <div>     
                    {severityy.length > 0 ? (severityy == "success" ? <Alert severity="success">{alertmessage}</Alert> : <Alert severity="error">{alertmessage}</Alert>) : <div></div>}
                </div>
            </div>
        </div>
    )
}


export function Transferdetailsforaddmoney() {

    const [arr, setarr] = useState([]);
    const [loader, setloader] = useState('Loading details from bank ..');
    useEffect(() => {
        async function fetchdata() {
            try {
                console.log('inside the trasferdetialis ')
                const url = "http://localhost:3000/api/auth/getonramp";
                const resp = await axios.get(url,  {
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    withCredentials: true
                  });
                console.log('resp from ', resp)
                console.log(resp.data.onramparray)
                const temp = resp.data.onramparray;
                if(temp.length == 0) {
                    setloader("Does not have previos Transaction .")
                }
                temp.reverse()
                setarr(temp);
                
            } catch (err: any) {
                // console.log(err)
                console.log('err message is ', err.response.data)
                return ;
            }
        }
       setTimeout(() => {
         fetchdata();
       }, 3000);
    }, [])
    // console.log("arr", arr)
    return (
        <div className="bg-green-0 pb-2  ">
            {arr.length > 0 ? (
                <div>
                    <div className="text-2xl p-4">Recent Transcations</div>
                    <div className="h-1/2 overflow-y-auto   scrollbar-thin scrollbar-thumb-blue-500 ">
                        {arr.map((item: any, index) => {

                            return (<div key={index}>

                                <div className="  rounded-lg py-2 px-4 flex flex-col">
                                    <div className="flex justify-between">
                                        <div className=""> Amount Credited </div>
                                        <div className="text-green-600">+ Rs {item.amount}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>Transaction Status </div>
                                        <div className="">{item.status}</div>
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

