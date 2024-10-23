
import Sidebar from './components/Sidebar'
import Titlebar from './components/Titleofpaytm'

export default function Anothermain() {
    return (
        <div className="lg:flex lg:flex-col gap-2 overflow-y-auto   scrollbar-thin scrollbar-thumb-blue-500  h-screen overflow-hidden">
        <div className="  lg:fixed top-0 left-0 right-0">
            <Titlebar />
        </div>

        <div>
            <div className="lg:mt-11  overflow-hidden ">
                <Sidebar /> 
            </div>
        </div>
        </div>
    )
}
