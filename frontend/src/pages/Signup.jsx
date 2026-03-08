import { useState } from "react"

function Signup(){

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const signup = async()=>{

await fetch("http://localhost:5000/api/signup",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
password
})

})

alert("Account Created")

}

return(

<div className="flex flex-col gap-3 p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">

<h2 className="text-xl font-bold text-black dark:text-white">Signup</h2>

<input
placeholder="Name"
className="border p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
className="border p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={signup}
className="bg-blue-500 text-white p-2"
>
Signup
</button>

</div>

)

}

export default Signup