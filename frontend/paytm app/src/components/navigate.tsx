
interface obj {
    name: string,
    onchange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
export default function Navigate({ name, onchange }: obj) {
    return (
        <div>
            <div className='lg:my-4 my-2'>
                <button onClick={onchange} className='text-center bg-[#18181b] text-[#ececec] text-xl p-1 border rounded-lg w-full h-fit '>{name}</button>
            </div>
        </div>
    )
}