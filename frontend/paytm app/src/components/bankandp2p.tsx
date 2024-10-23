import { Transferdetails } from '../routes/ptpTransfer'
import { useState } from 'react';
export default function Bankandp2p() {
    const [bankorp2p, setbankorp2p] = useState(0);

    return (

        <div>
            <div className="bg-green-0 lg:mt-16 mt-5 flex justify justify-around w-1/2 gap-15">
                <div>
                    <button className=" px-3 py-1 text-md border-2 rounded-full ml-5   bg-[#ffffff] shadow-lg transition-all duration-300 hover:text-xl" onClick={() => setbankorp2p(0)}>
                        Bank Transactions
                    </button>
                </div>
                <div>
                    <button className="px-3 py-1 text-md border-2 rounded-full ml-5  hover:text-xl bg-[#ffffff] shadow-lg" onClick={() => setbankorp2p(1)}>
                        P2P Transactions
                    </button>
                </div>

            </div>
            <Forbanktransfer bankorp2p={bankorp2p} />
        </div>
    )
}

import { Transferdetailsforaddmoney } from '../routes/Transfer'

function Forbanktransfer({ bankorp2p }: any) {
    return (
        <div className='bg-red-0 p-2  gap-2 lg:w-1/2 border-2 rounded-lg mt-10 ml-3 bg-[#ffffff] shadow-lg '>
            <div>
                {!bankorp2p ? <Transferdetailsforaddmoney /> : <Transferdetails />}
            </div>
        </div>
    )
}