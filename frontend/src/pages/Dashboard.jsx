import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

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

return(

<div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

<Sidebar/>

<div className="flex-1 p-8 text-black dark:text-white">

<Navbar/>

<Budget expenses={expenses}/>

<Cards data={dashboardData}/>

<ExpenseForm onExpenseAdded={loadExpenses}/>

<Transactiontable expenses={expenses}/>

</div>

</div>

)

}

export default Dashboard