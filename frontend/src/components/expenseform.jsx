import { useState, useEffect } from "react"

function ExpenseForm({ onExpenseAdded }){

const [amount,setAmount] = useState("")
const [currency,setCurrency] = useState("₹")
const [category,setCategory] = useState("")
const [customCategory,setCustomCategory] = useState("")
const [description,setDescription] = useState("")
const [payment,setPayment] = useState("")
const [categories,setCategories] = useState([])

const user_id = localStorage.getItem("user_id")

useEffect(()=>{

fetch("http://localhost:5000/api/categories")
.then(res=>res.json())
.then(data=>setCategories(data))

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

await fetch("http://localhost:5000/api/expenses",{

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

alert("Expense Added")

setAmount("")
setCurrency("₹")
setCategory("")
setCustomCategory("")
setDescription("")
setPayment("")

if(onExpenseAdded){
onExpenseAdded()
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
className="bg-indigo-600 text-white px-4 rounded"
>
Add Expense
</button>

</div>

</div>

)

}

export default ExpenseForm