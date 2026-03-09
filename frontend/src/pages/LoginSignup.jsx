import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Login states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Signup states
  const [name, setName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  
  const navigate = useNavigate()
  
  const login = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      
      const data = await res.json()
      
      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id)
        navigate("/")
      } else {
        alert(data.message || "Login failed")
      }
    } catch (error) {
      console.log(error)
      alert("Server error")
    }
  }
  
  const signup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email: signupEmail,
          password: signupPassword
        })
      })
      
      if (res.ok) {
        alert("Account Created! Please login.")
        setIsLogin(true)
        setEmail(signupEmail)
        setPassword("")
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
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg ${isLogin ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
          >
            Signup
          </button>
        </div>
        
        {isLogin ? (
          // Login Form
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black dark:text-white text-center">Welcome Back!</h2>
            <input
              placeholder="Email"
              className="border p-3 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600"
            >
              Login
            </button>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-blue-500 hover:underline">
                Signup
              </button>
            </p>
          </div>
        ) : (
          // Signup Form
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-black dark:text-white text-center">Create Account!</h2>
            <input
              placeholder="Name"
              className="border p-3 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              className="border p-3 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-3 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button
              onClick={signup}
              className="bg-blue-500 text-white p-3 rounded-lg font-bold hover:bg-blue-600"
            >
              Signup
            </button>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-green-500 hover:underline">
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginSignup

