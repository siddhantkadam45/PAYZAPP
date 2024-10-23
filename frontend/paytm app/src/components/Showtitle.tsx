type obj ={
    title : string,
    description:string
}

export default function Showtitle({title, description}: obj) {
  return (  
    <div>
        <div className=' text-center text-[##0f0f0f] font-bold text-3xl lg:text-3xl mt -4 p-3 '>{title}</div>
        <div className='text-center  text-[#848b96] p-1 lg:p-2 text-lg	'>{description}</div>
    </div>
  )
}