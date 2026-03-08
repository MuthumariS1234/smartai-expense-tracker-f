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

function Dashboard(){

const [expenses,setExpenses] = useState([])

const navigate = useNavigate()

// LOAD EXPENSES
const loadExpenses = ()=>{

const user_id = localStorage.getItem("user_id")

if(!user_id){
navigate("/login")
return
}

fetch("http://localhost:5000/api/expenses/"+user_id)
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){
setExpenses(data)
}else{
setExpenses([])
}

})
.catch(err=>console.log(err))

}

useEffect(()=>{
loadExpenses()
},[])

// TOTAL CALCULATION
const totalExpenses = Array.isArray(expenses)
? expenses.reduce((sum,item)=>sum + Number(item.amount),0)
: 0

const dashboardData = {
balance:50000 - totalExpenses,
expenses:totalExpenses,
budget:50000
}

// EXPORT PDF
const exportPDF = () => {

const doc = new jsPDF()

doc.setFontSize(18)
doc.text("Expense Report",14,15)

doc.setFontSize(10)
doc.text("Generated on: " + new Date().toLocaleDateString(),14,22)

const tableColumn = ["Category","Amount","Date","Description"]

const tableRows = []

expenses.forEach(exp=>{
const rowData = [
exp.category,
exp.amount,
exp.date,
exp.description
]

tableRows.push(rowData)
})

autoTable(doc,{
head:[tableColumn],
body:tableRows,
startY:30
})

doc.save("expense-report.pdf")

}

// EXPORT CSV
const exportCSV = () => {

const headers = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp =>
[exp.category,exp.amount,exp.date,exp.description].join(",")
)

const csvContent =
"data:text/csv;charset=utf-8," +
[headers.join(","),...rows].join("\n")

const encodedUri = encodeURI(csvContent)

const link = document.createElement("a")

link.setAttribute("href",encodedUri)
link.setAttribute("download","expense-report.csv")

link.style.display = "none"

document.body.appendChild(link)

link.click()

}

return(

<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

<Sidebar/>

<div className="flex-1 p-8 text-black dark:text-white">

<Navbar/>

{/* EXPORT BUTTONS */}
<div className="mb-4 flex gap-3">

<button
onClick={exportPDF}
className="bg-blue-500 text-white px-4 py-2 rounded-lg"
>
Export PDF
</button>

<button
onClick={exportCSV}
className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
Export CSV
</button>

</div>

<Budget expenses={expenses}/>

<Cards data={dashboardData}/>

<ExpenseForm onExpenseAdded={loadExpenses}/>

<Transactiontable expenses={expenses}/>

</div>

</div>

)

}

export default Dashboard