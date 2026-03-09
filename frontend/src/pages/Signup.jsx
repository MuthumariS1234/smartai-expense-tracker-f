import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Signup(){

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const navigate = useNavigate()

const signup = async () => {

try {
  const res = await fetch("http://localhost:5000/api/signup", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      name,
      email,
      password
    })

  })

  if (res.ok) {
    alert("Account Created! Please login.")
    navigate("/login")
  } else {
    alert("Signup failed")
  }
} catch (error) {
  console.log(error)
  alert("Server error")
}

}

return (

<div className="flex flex-col gap-3 p-10 bg-gray-100 dark:bg-gray-900 min-h-screen items-center justify-center">

<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">

<h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">Create Account</h2>

<input
placeholder="Name"
className="border p-3 w-full mb-4 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Email"
className="border p-3 w-full mb-4 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-3 w-full mb-6 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={signup}
className="bg-blue-500 text-white p-3 w-full rounded-lg font-bold hover:bg-blue-600"
>
Signup
</button>

<p className="text-center mt-4 text-gray-600 dark:text-gray-400">
Already have an account?{" "}
<Link to="/login" className="text-green-500 hover:underline">Login</Link>
</p>

<p className="text-center mt-2 text-gray-600 dark:text-gray-400">
Or use combined page:{" "}
<Link to="/login/signup" className="text-purple-500 hover:underline">Login/Signup</Link>
</p>

</div>

</div>

)

}

export default Signup
