import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

function Navbar(){

const navigate = useNavigate()
const [darkMode,setDarkMode] = useState(false)

const logout = () => {
localStorage.removeItem("user_id")
navigate("/login")
}

// Load saved mode
useEffect(()=>{
const savedMode = localStorage.getItem("darkMode")
if(savedMode === "true"){
document.documentElement.classList.add("dark")
setDarkMode(true)
}
},[])

// Toggle dark mode
const toggleDarkMode = () => {

if(darkMode){
document.documentElement.classList.remove("dark")
localStorage.setItem("darkMode","false")
}else{
document.documentElement.classList.add("dark")
localStorage.setItem("darkMode","true")
}

setDarkMode(!darkMode)

}

return (

<div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg">

<h1 className="text-2xl font-semibold text-black dark:text-white">
Dashboard
</h1>

<div className="flex gap-3 items-center">

<input
type="text"
placeholder="Search..."
className="border rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white"
/>

<button
onClick={toggleDarkMode}
className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg"
>
{darkMode ? "☀️" : "🌙"}
</button>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-lg"
>
Logout
</button>

</div>

</div>

)

}

export default Navbar