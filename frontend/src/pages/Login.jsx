import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const navigate = useNavigate()

const login = async()=>{

try{

const res = await fetch("http://localhost:5000/api/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

})

const data = await res.json()

// check if login successful
if(data.user_id){

localStorage.setItem("user_id",data.user_id)

navigate("/")

}else{

alert(data.message || "Login failed")

}

}catch(error){

console.log(error)
alert("Server error")

}

}

return(

<div className="flex flex-col gap-3 p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">

<h2 className="text-xl font-bold text-black dark:text-white">Login</h2>

<input
placeholder="Email"
className="border p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-green-500 text-white p-2"
>
Login
</button>

</div>

)

}

export default Login