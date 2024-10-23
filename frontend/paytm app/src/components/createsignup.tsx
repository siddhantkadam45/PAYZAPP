import { useState } from "react"
import Inputbox from "./Input"
import Navigate from "./navigate"
import axios from "axios"
import Showtitle from "./Showtitle"
import { useNavigate } from "react-router-dom"
interface obj {
    password: string,
    name: string,
    email: string,
    number: string
}
import { Alert } from "@mui/material"
export default function Createesignin() {   
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [number, setnumber] = useState('')
    const [alertmessage, setalertmess] = useState('');
    const [severityy, setsevrity] = useState('');
    console.log(name, number, password, email)
    const navigate = useNavigate()
    async function handlechange() {
        if(number.length != 10) {
            setsevrity('error');
            setalertmess("Enter Valid Number please ")
            return ;
          
        }
        const b: obj = {
            password,
            name,
            email,
            number
        }
        const url = 'http://localhost:3000/api/auth/signin';
        try {
            const res = await axios.post(url, b, {withCredentials:true});
            console.log(res)
            if(res.status != 201) {
                // entervalid c  
                // console.log('error occure')
                console.log(res.data)
            }
            if(res.status  < 300) {
                //redirect to home
                navigate('/dashboard')

            }
            
        } catch (err:any) {
            console.log(err.response.data);
        }
    }
    if (alertmessage.length > 0) {
        setTimeout(() => {
            setsevrity('')
        }, 5000);
    }
    return (
        <div>
            <Showtitle title = "SignUp" description="Enter your imformation to create an account" />
            <Inputbox name="Name" typename="text" onchange={(e) => setname(e.target.value)} />
            <Inputbox name="Email" typename="email" onchange={(e) => setemail(e.target.value)} />
            <Inputbox name="Password" typename="password" onchange={(e) => setpassword(e.target.value)} />
            <Inputbox name="Number" typename="text" onchange={(e) => setnumber(e.target.value)} />
            <Navigate name="Signin" onchange={() => handlechange()} />
            {severityy.length > 0 ? (severityy == "success" ? <Alert severity="success">{alertmessage}</Alert> : <Alert severity="error">{alertmessage}</Alert>) : <div></div>}


        </div>
    )
}
