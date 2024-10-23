import React from 'react'

interface obj {
    name: string,
    onchange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    typename: string
}
export default function Inputbox({ name, typename, onchange }: obj) {
    return (

        <div className='  mt-0 lg:mt-0 h-full '>
            <div><h2 className=' py-2 text-bold'>{name}</h2></div>
            <div>
                <input type={typename} onChange={onchange}
                    placeholder={`Enter the ${name}`}
                    className='border text-[#848b96] p-1 text-left rounded-md w-full' />
            </div>
        </div>
    )
}
