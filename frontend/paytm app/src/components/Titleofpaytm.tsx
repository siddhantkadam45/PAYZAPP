
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { PiVaultFill } from "react-icons/pi";

export default function Titlebar() {
    const navigate = useNavigate();

    async function Makelogoutrequest() {
        try{
            console.log('inside ')
            const url = 'http://localhost:3000/api/auth/logout'
            const respon = await axios.post(url,{}, {withCredentials:true})
            navigate('/signin')
            console.log('resp', respon.data)
        }catch(err:any) {
            console.log(err)
            console.log(err.response.data)
        }
    }
    
    
    return (
        <div className=' border-b-2 flex justify-between py-2  bg-[#f9f7f6] px-4 py-1'>
            <div className='text-xl lg:text-3xl flex gap-3'>
                <div className='pt-1'><PiVaultFill/></div>
                Vault</div>
            <div className='sm:pt-2 bg-green-0 sm:justify-center lg:pt-0'><button className='bg-black-400 lg:text-xl lg:border rounded-md  mt-1 sm:items-center  lg:mt-0 lg:px-2 lg:py-1 bg-[#1f2937] text-[#e4e5e7]' onClick={()=> Makelogoutrequest()}>Logout</button></div>
        </div>
    )
}


