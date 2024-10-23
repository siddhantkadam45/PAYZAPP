import { useState } from "react";
import Inputbox from "./Input";
import Navigate from "./navigate";
import Showtitle from "./Showtitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

// import Newhomebar from "../routes/Newhome_bar";
interface obj {
    number:string,
    password:string
}
//check / test login endpoint 
//check enter value are number , redirection , home page 
export default function Signincomponent() {
    const [number, setname] = useState('');
    const [password, setpassword] = useState('');
    const navigate = useNavigate()
    const [alertmessage, setalertmess] = useState('');
    const [severityy, setsevrity] = useState('');
    async function handlerequest() {
       try{
            if(number.length != 10) {
                    setsevrity('error');
                    setalertmess("Enter Valid Number please ")
                    return ;
                  
            }
            const b: obj ={
                number,
                password
            }
            console.log(typeof(b))
            const url = "http://localhost:3000/api/auth/login"
            // console.log('inside the login')
            const res = await axios.post(url,b,{withCredentials:true});
            // console.log('inside the login')
            console.log(res.data);
            navigate('/dashboard')
       }catch(err:any) {
            console.log(err.response.data)
            setsevrity('error')
            setalertmess(err.response.data.message)
            // console.log(err)
       }
    }
    if (alertmessage.length > 0) {
        setTimeout(() => {
            setsevrity('')
        }, 5000);
    }
    console.log(number,password)
    return (
        <div>
            <Showtitle title="Login" description="Enter the detials to Login" />
            <Inputbox name="Number" typename="text" onchange={(e) => setname(e.target.value)} />
            <Inputbox name="Password" typename="password" onchange={(e) => setpassword(e.target.value)} />
            <Navigate name="Login" onchange={() => handlerequest()} />
            {severityy.length > 0 ? (severityy == "success" ? <Alert severity="success">{alertmessage}</Alert> : <Alert severity="error">{alertmessage}</Alert>) : <div></div>}
        </div>
    )
}