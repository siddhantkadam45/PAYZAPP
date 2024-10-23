import Titlebar from "../components/Titleofpaytm"
import Anothermain from "../Anothermain"

export default function Newhomebar() {
    return (
        <div className="lg:flex lg:flex-col gap-2 scroll-smooth">
            <div className="  lg:fixed top-0 left-0 right-0">
                <Titlebar />
            </div>

            <div>
                <div className="lg:mt-11 bg-yellow-400  ">
                    <Anothermain /> 
                </div>
            </div>
            
       </div>

    )
}
