import React, { useEffect, useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Transactiontable({ expenses: propExpenses }) {

const [expenses, setExpenses] = useState([])

useEffect(() => {

if(Array.isArray(propExpenses)){
setExpenses(propExpenses)
}

},[propExpenses])

// DELETE
const handleDelete = (id) => {

if(!window.confirm("Delete this expense?")){
return
}

fetch("http://localhost:5000/api/delete-expense/" + id,{
method:"DELETE"
})
.then(()=>{
setExpenses(expenses.filter(e=>e.id !== id))
})

}

// EDIT
const handleEdit = (expense) => {

const newCategory = prompt("Enter category",expense.category)
const newDescription = prompt("Enter description",expense.description)
const newAmount = prompt("Enter amount",expense.amount)

if(newCategory === null || newDescription === null || newAmount === null){
return
}

fetch("http://localhost:5000/api/update-expense/" + expense.id,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
category:newCategory,
description:newDescription,
amount:newAmount
})
})
.then(()=>{

setExpenses(expenses.map(e =>
e.id === expense.id
? {...e,category:newCategory,description:newDescription,amount:newAmount}
: e
))

})

}

// EXPORT PDF
const exportPDF = () => {

if(!expenses || expenses.length === 0){
alert("No expenses to export!")
return
}

const doc = new jsPDF()

doc.text("Transactions Report",14,15)

const tableColumn = ["Category","Amount","Date","Description"]

const tableRows = expenses.map(exp=>[
exp.category || "-",
"₹"+exp.amount,
exp.date || "-",
exp.description || "-"
])

autoTable(doc,{
head:[tableColumn],
body:tableRows,
startY:20
})

doc.save("transactions-report.pdf")

}

// EXPORT CSV
const exportCSV = () => {

if(!expenses || expenses.length === 0){
alert("No expenses to export!")
return
}

const headers = ["Category","Amount","Date","Description"]

const rows = expenses.map(exp =>
[
exp.category || "-",
exp.amount || "0",
exp.date || "-",
exp.description || "-"
].join(",")
)

const csvContent = [headers.join(","),...rows].join("\n")

const blob = new Blob([csvContent],{type:"text/csv;charset=utf-8;"})

const link = document.createElement("a")

const url = URL.createObjectURL(blob)

link.href = url
link.download = "transactions-report.csv"

document.body.appendChild(link)
link.click()

document.body.removeChild(link)
URL.revokeObjectURL(url)

}

return (

<div className="mt-8">

<div className="flex justify-between items-center mb-4">

<h2 className="text-xl font-bold text-black dark:text-white">
Transactions
</h2>

<div className="flex gap-3">

<button
onClick={exportPDF}
className="bg-blue-500 text-white px-4 py-2 rounded-lg"
>
📄 PDF
</button>

<button
onClick={exportCSV}
className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
📊 CSV
</button>

</div>

</div>

<table className="w-full bg-white dark:bg-gray-800 rounded shadow">

<thead>

<tr>

<th className="p-3 text-left">Date</th>
<th className="p-3 text-left">Category</th>
<th className="p-3 text-left">Description</th>
<th className="p-3 text-left">Amount</th>
<th className="p-3 text-left">Actions</th>

</tr>

</thead>

<tbody>

{expenses.length === 0 ? (

<tr>
<td colSpan="5" className="text-center p-6">
No transactions found
</td>
</tr>

):(expenses.map(e => (

<tr key={e.id} className="border-b">

<td className="p-3">{e.date}</td>
<td className="p-3">{e.category || "-"}</td>
<td className="p-3">{e.description || "-"}</td>
<td className="p-3">₹{e.amount}</td>

<td className="p-3 space-x-2">

<button
className="bg-yellow-500 text-white px-3 py-1 rounded"
onClick={()=>handleEdit(e)}
>
Edit
</button>

<button
className="bg-red-500 text-white px-3 py-1 rounded"
onClick={()=>handleDelete(e.id)}
>
Delete
</button>

</td>

</tr>

)))}

</tbody>

</table>

</div>

)

}

export default Transactiontable