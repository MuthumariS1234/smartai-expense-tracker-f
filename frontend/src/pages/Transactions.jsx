import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import Sidebar from "../components/sidebar"
import Navbar from "../components/Navbar"
import Transactiontable from "../components/Transactiontable"

function Transactions() {

const [expenses, setExpenses] = useState([])
const navigate = useNavigate()

useEffect(() => {

const user_id = localStorage.getItem("user_id")

if (!user_id) {
navigate("/login")
return
}

fetch("http://localhost:5000/api/expenses/" + user_id)
.then(res => res.json())
.then(data => {

if(Array.isArray(data)){
setExpenses(data)
}else{
setExpenses([])
}

})
.catch(err => console.log(err))

}, [navigate])

// PDF EXPORT
const exportPDF = () => {

if(expenses.length === 0){
alert("No expenses to export!")
return
}

const doc = new jsPDF()

doc.text("Transactions Report",14,15)

const columns = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp=>[
exp.category,
"₹"+exp.amount,
exp.date,
exp.description
])

autoTable(doc,{
head:[columns],
body:rows,
startY:20
})

doc.save("transactions-report.pdf")

}

// CSV EXPORT
const exportCSV = () => {

if(expenses.length === 0){
alert("No expenses to export!")
return
}

const headers = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp =>
[exp.category,exp.amount,exp.date,exp.description].join(",")
)

const csv = [headers.join(","),...rows].join("\n")

const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"})

const link = document.createElement("a")

const url = URL.createObjectURL(blob)

link.href = url
link.download = "transactions.csv"

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
className="bg-blue-500 text-white px-4 py-2 rounded"
>
Export PDF
</button>

<button
onClick={exportCSV}
className="bg-green-500 text-white px-4 py-2 rounded"
>
Export CSV
</button>

</div>

<Transactiontable expenses={expenses}/>

</div>

</div>

)

}

export default Transactions