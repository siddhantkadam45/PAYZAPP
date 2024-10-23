import { useNavigate } from 'react-router-dom';
import { PiVaultFill } from "react-icons/pi";

export default function Home_orignal () {
    const navigate = useNavigate();

    return (
        <div className=' border-b-2 flex justify-between py-2  bg-[#ebe6e6] px-4 '>
            <div className='text-xl lg:text-3xl flex gap-3  cursor-pointer'>
                <div className='pt-1' >
                    <PiVaultFill />
                </div>
                Vault
            </div>
            <div className='sm:pt-2 bg-green-0 sm:justify-center lg:pt-0 flex gap-5'>
                <button className='bg-black-400 lg:text-xl lg:border rounded-md  mt-1 sm:items-center  lg:mt-0 lg:px-2 lg:py-1 bg-[#1f2937] text-[#e4e5e7]' onClick={() => navigate('/signin')}>
                    Signin
                </button>
                <button className='bg-black-400 lg:text-xl lg:border rounded-md  mt-1 sm:items-center  lg:mt-0 lg:px-2 lg:py-1 bg-[#1f2937] text-[#e4e5e7]' onClick={() => navigate('/signup')}>
                    SignUp
                </button>
            </div>
        </div>
    )
}
