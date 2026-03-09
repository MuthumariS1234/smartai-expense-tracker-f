import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

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

<div className="flex flex-col gap-3 p-10 bg-gray-100 dark:bg-gray-900 min-h-screen items-center justify-center">

<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">

<h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Login</h2>

<input
placeholder="Email"
className="border p-3 w-full mb-4 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-3 w-full mb-6 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-green-500 text-white p-3 w-full rounded-lg font-bold hover:bg-green-600"
>
Login
</button>

<p className="text-center mt-4 text-gray-600 dark:text-gray-400">
Don't have an account?{" "}
<Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
</p>

<p className="text-center mt-2 text-gray-600 dark:text-gray-400">
Or use combined page:{" "}
<Link to="/login/signup" className="text-purple-500 hover:underline">Login/Signup</Link>
</p>

</div>

</div>

)

}

export default Login
