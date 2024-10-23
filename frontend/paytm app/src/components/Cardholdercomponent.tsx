interface obj {
    card: React.ComponentType<any>;
}
import backgroundlogin from '../images/login background.jpg'
export default function Cardholder({ card: CardComponent }: obj) {
    return (
        // <div className="h-screen w-screen bg-cover bg-center flex justify-center items-center"
        // style={{ backgroundImage: `url(${backgroundlogin})` }}>
           
            <div className='h-screen w-screen border flex flex-col justify-center '>
                <div className="items-center flex justify-center py-20">
                    <div className="bg-[#ffffff] border items-center   px-5 lg:w-80 w-72	 rounded-md">
                        <CardComponent />
                    </div>
                </div>
            </div>
        // </div>
    );
}