// import React from 'react'
import { IoMdHome } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { useSetRecoilState, useRecoilValue, RecoilRoot } from "recoil";
import Trackdiv from "../Atoms/Divtodisplay";


export default function Sidebar() {
    
    return (
        <div>
            <RecoilRoot>
                <div className="lg:flex lg:flex-row lg:justify-between lg:h-screen bg-[#faf3f4] flex flex-col justify-start">
                    <div className="lg:w-1/5  lg:h-full  bg-red-0 border-r-2">
                        <Sidebarcontent />
                    </div>
                    <div className="lg:w-4/5 h-full  "> 
                        <Displaycorrectone />
                    </div>
                </div>
            </RecoilRoot>

        </div>
    )
}
import Bankandp2p from "./bankandp2p";
import PtopTransfer from "../routes/ptpTransfer";
import Homepage from "../routes/Home";
import Transfer from "../routes/Transfer";

function Displaycorrectone() {
    const valueoft = useRecoilValue(Trackdiv)
    function temp () {
        if(valueoft ==1 ) {
            return <div><Homepage /></div>
        }
        else if (valueoft == 2) {
            return <div> <Transfer /></div>
        }
        else if (valueoft == 3 ) {
            return <div><Bankandp2p /></div>
        }
        else {
            return <div><PtopTransfer /></div>
        }
    }
    return (
        <div className="h-full">
            {temp()}
        </div>
    )
}
import { BiSolidContact } from "react-icons/bi";
  
function Sidebarcontent() {
    const settracker = useSetRecoilState(Trackdiv)
    const valueoft = useRecoilValue(Trackdiv)
   
    return (
        <div>
            <div className="flex lg:flex-col  lg:items-center  pt-2 lg:h-fit bg-[#faf3f4]  flex-row justify-center gap-1 ">
                
                <div className="lg:w-full  items-center p-2 ">
                    <button className="w-full bg-red-0   flex lg:justify-start items-center gap-3 lg:text-left p-2 hover:text-blue-600" onClick={() => settracker(1)}>
                        <IoMdHome />
                        Home
                    </button>
                </div>

                <div className="lg:w-full  items-center p-2">
                    <button className="w-full bg-red-0   flex lg:justify-start items-center gap-3 lg:text-left p-2 hover:text-blue-600" onClick={() => settracker(2)}>
                        <FaArrowRightArrowLeft />
                        Transfer
                    </button>
                </div>
                <div className="lg:w-full  items-center p-2 ">
                <button className="w-full bg-red-0   flex lg:justify-start items-center gap-3 lg:text-left p-2 hover:text-blue-600" onClick={() => settracker(3)}>
                    <CiClock2 />
                        Transcations
                    </button>
                </div>
                <div className="lg:w-full items-center p-2">
                <button className="w-full bg-red-0   flex lg:justify-start items-center gap-3 lg:text-left p-2 hover:text-blue-600" onClick={() => settracker(4)}>
                       
                    <BiSolidContact />
                        P2P
                    </button>
                </div> 
            </div>
        </div>
    )
}