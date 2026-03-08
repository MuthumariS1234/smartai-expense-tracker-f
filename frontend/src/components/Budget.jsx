import { useState, useEffect } from "react"

function Budget({ expenses }){

const [budgets,setBudgets] = useState([])
const [amount,setAmount] = useState("")
const [category,setCategory] = useState("")

const user_id = localStorage.getItem("user_id")

useEffect(()=>{

fetch("http://localhost:5000/api/budgets/"+user_id)
.then(res=>res.json())
.then(data=>setBudgets(data))

},[])



const saveBudget = async()=>{

await fetch("http://localhost:5000/api/budget",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
user_id,
category,
amount
})

})

alert("Budget Saved")

}



const getSpent = (cat)=>{

return expenses
.filter(e=>e.category===cat)
.reduce((sum,e)=>sum+Number(e.amount),0)

}



return(

<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">

<h2 className="font-bold mb-4 text-black dark:text-white">Budget Management</h2>

<div className="flex gap-2 mb-4">

<select
className="border p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded"
onChange={(e)=>setCategory(e.target.value)}
>

<option>Food</option>
<option>Travel</option>
<option>Shopping</option>
<option>Bills</option>
<option>Entertainment</option>

</select>

<input
type="number"
placeholder="Budget Amount"
className="border p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded"
onChange={(e)=>setAmount(e.target.value)}
/>

<button
onClick={saveBudget}
className="bg-green-500 text-white px-3"
>
Set Budget
</button>

</div>



{budgets.map((b)=>{

const spent = getSpent(b.category)

const percent = Math.min((spent/b.amount)*100,100)

return(

<div key={b.id} className="mb-4">

<p className="text-black dark:text-white">
{b.category} Budget: ₹{b.amount}
</p>

<p className="text-gray-700 dark:text-gray-300">
Spent: ₹{spent}
</p>

<div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded">

<div
className={`h-4 rounded ${
percent>100?"bg-red-500":"bg-blue-500"
}`}
style={{width:`${percent}%`}}
>

</div>

</div>

{percent>=80 && percent<100 && (
<p className="text-yellow-600">
⚠ Warning: Budget almost reached
</p>
)}

{percent>=100 && (
<p className="text-red-600">
🚨 Budget exceeded
</p>
)}

</div>

)

})}

</div>

)

}

export default Budget