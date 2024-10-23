
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Anothermain from "./Anothermain";
// import Titlebar from "./components/Titleofpaytm";
import Home_orignal from "./routes/Home_orignal";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
// import PtopTransfer from "./routes/ptpTransfer";
// import Transfer from "./routes/Transfer";
// import Homepage from "./routes/Home";
export default function App() {
    return (
        <div className="lg:flex lg:flex-col gap-2 scroll-smooth">
            <div>
                {/* <Home_orignal /> */}
                <Routes >
                    <Route path="/" element={<Home_orignal />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Anothermain />} />

                </Routes>
            </div>
        </div>

    )
}
