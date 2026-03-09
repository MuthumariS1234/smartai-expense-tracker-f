import { useState, useEffect } from "react"

function ExpenseForm({ onExpenseAdded }){

const [amount,setAmount] = useState("")
const [currency,setCurrency] = useState("₹")
const [category,setCategory] = useState("")
const [customCategory,setCustomCategory] = useState("")
const [description,setDescription] = useState("")
const [payment,setPayment] = useState("")
const [categories,setCategories] = useState([])

// Fallback categories if API fails
const defaultCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transport" },
  { id: 3, name: "Shopping" },
  { id: 4, name: "Groceries" },
  { id: 5, name: "Entertainment" },
  { id: 6, name: "Health" },
  { id: 7, name: "Bills" },
  { id: 8, name: "Education" },
  { id: 9, name: "Travel" },
  { id: 10, name: "General" }
]

const user_id = localStorage.getItem("user_id")

useEffect(()=>{

// Fetch categories from API with cache busting
fetch("http://localhost:5000/api/categories?t=" + Date.now())
.then(res => {
  console.log("API Response status:", res.status)
  return res.json()
})
.then(data=>{
  console.log("Categories fetched:", data, "Array.isArray:", Array.isArray(data))
  if(Array.isArray(data) && data.length > 0){
    setCategories(data)
  } else {
    console.log("Using fallback categories")
    setCategories(defaultCategories)
  }
})
.catch(err=>{
  console.log("Category fetch error:", err)
  setCategories(defaultCategories)
})

},[])


const addExpense = async () => {

if(!amount || !category || !payment || (category === "other" && !customCategory)){
alert("Please fill all fields")
return
}

const finalCategory =
category === "other"
? customCategory
: category

try{

const res = await fetch("http://localhost:5000/api/expenses",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
user_id,
amount,
currency,
category: finalCategory,
description,
date:new Date().toISOString().split("T")[0],
payment_method:payment
})

})

const data = await res.json()

console.log("Server response:",data)

alert("Expense Added")

setAmount("")
setCurrency("₹")
setCategory("")
setCustomCategory("")
setDescription("")
setPayment("")

// refresh homepage data
if(onExpenseAdded){
setTimeout(()=>{
onExpenseAdded()
},200)
}

}catch(error){

console.log(error)
alert("Failed to add expense")

}

}


return(

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">

<h2 className="text-lg font-bold mb-4 text-black dark:text-white">
Add Expense
</h2>

<div className="flex gap-4 flex-wrap">

<input
type="number"
min="1"
placeholder="Amount"
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>


<select
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={currency}
onChange={(e)=>setCurrency(e.target.value)}
>
<option value="₹">₹ INR</option>
<option value="$">$ USD</option>
<option value="€">€ EUR</option>
</select>


<select
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option value="">Select Category</option>

{categories.map(c=>(

<option key={c.id} value={c.name}>
{c.name}
</option>

))}

<option value="other">Other</option>

</select>


{category === "other" && (

<input
type="text"
placeholder="Enter Category"
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={customCategory}
onChange={(e)=>setCustomCategory(e.target.value)}
/>

)}


<select
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={payment}
onChange={(e)=>setPayment(e.target.value)}
>

<option value="">Payment Method</option>
<option>Cash</option>
<option>UPI</option>
<option>Credit Card</option>
<option>Debit Card</option>
<option>Bank Transfer</option>

</select>


<input
type="text"
placeholder="Description"
className="border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>


<button
onClick={addExpense}
className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
>
Add Expense
</button>

</div>

</div>

)

}

export default ExpenseForm