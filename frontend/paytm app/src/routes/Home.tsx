import axios from "axios";
import { useEffect, useState } from "react"

function capitalizeFirstLetter(s: string) {
    return s[0].toUpperCase() + s.slice(1);
}

export default function Homepage() {
    const [name, setname] = useState('Sir');
    const [amount, setamount] = useState('Loading');
    
    const [cnt ,setcnt] = useState(0);
    useEffect(() => {
        if(cnt==0) {
            request();
        }
    },[])
    async function request() {
        try {
            const url = "http://localhost:3000/api/auth/getuserbalance";
            const res = await axios.get(url,{ withCredentials: true });
            setname(capitalizeFirstLetter(res.data.name))
            setamount(res.data.amount)
            setcnt(1)
        }catch(err:any) {
            console.log(err)
            console.log(err.response.data)
        }
        
    }
    return (
        <div>
        
            <div className="lg:ml-10 ">
                <div className="font-bold text-4xl p-4 pb-6 pt-8">Hi {name }</div>
                <div className=" flex gap-28  lg:justify-between ">
                    <div className=" bg-[#faf3f4]  " >
                        <div className="text-2xl font-semibold lg:px-10 p-4 pb-2 pt-2 lg:mr-32">Your Account Balance is </div>
                        <div className="text-2xl pt-2 lg:px-10  p-4 pb-2 ">{amount} Rs</div>
                    </div>
                    <div className=" pt-3"><button className="bg-green-400 px-4 py-2 border rounded-full lg:mr-72" onClick={request}>Refresh</button></div>
                </div>
            </div>

        </div>
    )
}
