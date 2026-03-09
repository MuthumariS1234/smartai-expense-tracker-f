import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import Sidebar from "../components/sidebar"
import Navbar from "../components/Navbar"
import Cards from "../components/cards"
import ExpenseForm from "../components/expenseform"
import Transactiontable from "../components/Transactiontable"
import Budget from "../components/Budget"

function Home() {

const [expenses, setExpenses] = useState([])
const [recurring, setRecurring] = useState([])

const navigate = useNavigate()

// LOAD EXPENSES
const loadExpenses = async () => {

try{

const user_id = localStorage.getItem("user_id")

if(!user_id){
navigate("/login")
return
}

const res = await fetch("http://localhost:5000/api/expenses/" + user_id)

if(!res.ok){
throw new Error("Failed to load expenses")
}

const data = await res.json()

console.log("Expenses loaded:",data)

if(Array.isArray(data)){
setExpenses(data)
}else{
setExpenses([])
}

// load recurring safely
try{
const recRes = await fetch("http://localhost:5000/api/recurring-expenses/" + user_id)
const recData = await recRes.json()

if(Array.isArray(recData)){
setRecurring(recData)
}else{
setRecurring([])
}
}catch{
setRecurring([])
}

}catch(err){
console.log("Error loading expenses:",err)
setExpenses([])
}

}

useEffect(()=>{
loadExpenses()
},[])

// CALCULATE TOTAL
const totalExpenses = expenses.reduce(
(sum,item)=> sum + Number(item.amount || 0),
0
)

const dashboardData = {
balance: 50000 - totalExpenses,
expenses: totalExpenses,
budget: 50000
}

// EXPORT PDF
const exportPDF = () => {

if(!expenses.length){
alert("No expenses to export")
return
}

const doc = new jsPDF()

doc.text("Expense Report",14,15)

const columns = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp=>[
exp.category || "",
"₹"+exp.amount,
exp.date || "",
exp.description || ""
])

autoTable(doc,{
head:[columns],
body:rows,
startY:25
})

doc.save("expense-report.pdf")

}

// EXPORT CSV
const exportCSV = () => {

if(!expenses.length){
alert("No expenses to export")
return
}

const headers = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp=>
[exp.category,exp.amount,exp.date,exp.description].join(",")
)

const csv = [headers.join(","),...rows].join("\n")

const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"})

const link = document.createElement("a")
const url = URL.createObjectURL(blob)

link.href = url
link.download = "expense-report.csv"

document.body.appendChild(link)
link.click()
document.body.removeChild(link)

URL.revokeObjectURL(url)

}

return (

<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

<Sidebar/>

<div className="flex-1 p-8 text-black dark:text-white">

<Navbar/>

<div className="flex gap-3 mb-6">

<button
onClick={exportPDF}
className="bg-blue-500 text-white px-4 py-2 rounded-lg"
>
📄 Export PDF
</button>

<button
onClick={exportCSV}
className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
📊 Export CSV
</button>

</div>

<Budget expenses={expenses}/>

<Cards data={dashboardData}/>

{/* RECURRING */}

<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">

<h3 className="text-lg font-bold mb-3">
🔁 Recurring Expenses
</h3>

{recurring.length === 0 ? (

<p className="text-gray-500">
No recurring expenses detected
</p>

) : (

recurring.map((item,index)=>(
<div key={index} className="flex justify-between border-b py-2">
<span>{item.category}</span>
<span>₹{item.amount}</span>
</div>
))

)}

</div>

<ExpenseForm onExpenseAdded={loadExpenses}/>

<Transactiontable expenses={expenses}/>

</div>

</div>

)

}

export default Home