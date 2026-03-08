import { useEffect, useState } from "react"
import Sidebar from "../components/sidebar"
import Navbar from "../components/Navbar"

import {
PieChart,
Pie,
Cell,
Tooltip,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Legend,
LineChart,
Line
} from "recharts"

const COLORS=["#6366F1","#22C55E","#F59E0B","#EF4444","#06B6D4"]

function Analytics(){

const [expenses,setExpenses] = useState([])

const user_id = localStorage.getItem("user_id")

useEffect(()=>{

fetch("http://localhost:5000/api/expenses/"+user_id)
.then(res=>res.json())
.then(data=>setExpenses(data))

},[])


// total expenses
const total = expenses.reduce((sum,e)=>sum+Number(e.amount),0)

// average
const avg = expenses.length>0 ? total/expenses.length : 0


// category totals
const categoryMap={}

expenses.forEach(e=>{
if(!categoryMap[e.category]){
categoryMap[e.category]=0
}
categoryMap[e.category]+=Number(e.amount)
})

const categoryData = Object.keys(categoryMap).map(cat=>({
name:cat,
value:categoryMap[cat]
}))


// trend data
const trendData = expenses.map(e=>({
date:e.date,
amount:Number(e.amount)
}))


// highest category
let highest=""
let max=0

categoryData.forEach(c=>{
if(c.value>max){
max=c.value
highest=c.name
}
})

return(

<div className="flex">

<Sidebar/>

<div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">

<Navbar/>

{/* Summary cards */}

<div className="grid grid-cols-3 gap-6 mb-6">

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
<h3 className="text-black dark:text-white">Total Expenses</h3>
<p className="text-xl font-bold text-black dark:text-white">₹{total}</p>
</div>

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
<h3 className="text-black dark:text-white">Highest Category</h3>
<p className="text-xl font-bold text-black dark:text-white">{highest}</p>
</div>

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
<h3 className="text-black dark:text-white">Average Expense</h3>
<p className="text-xl font-bold text-black dark:text-white">₹{avg.toFixed(2)}</p>
</div>

</div>


{/* Charts */}

<div className="grid grid-cols-2 gap-6">


{/* Pie Chart */}

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow">

<h3 className="mb-3 font-semibold text-black dark:text-white">
Category Breakdown
</h3>

<PieChart width={400} height={300}>

<Pie
data={categoryData}
dataKey="value"
nameKey="name"
outerRadius={100}
>

{categoryData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</div>


{/* Bar Chart */}

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow">

<h3 className="mb-3 font-semibold text-black dark:text-white">
Category Comparison
</h3>

<BarChart width={400} height={300} data={categoryData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Bar dataKey="value" fill="#6366F1"/>

</BarChart>

</div>


{/* Line Chart */}

<div className="bg-white dark:bg-gray-800 p-4 rounded shadow col-span-2">

<h3 className="mb-3 font-semibold text-black dark:text-white">
Spending Trend
</h3>

<LineChart width={800} height={300} data={trendData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Legend/>

<Line type="monotone" dataKey="amount" stroke="#EF4444"/>

</LineChart>

</div>


</div>

</div>

</div>

)

}

export default Analytics