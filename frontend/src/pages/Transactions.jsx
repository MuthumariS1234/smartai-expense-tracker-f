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

  // Load expenses
  useEffect(() => {
    const user_id = localStorage.getItem("user_id")

    if (!user_id) {
      navigate("/login")
      return
    }

    fetch("http://localhost:5000/api/expenses/" + user_id)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setExpenses(data)
        } else {
          setExpenses([])
        }
      })
      .catch(err => console.log(err))
  }, [navigate])

  // EXPORT PDF
  const exportPDF = () => {
    try {
      if (!expenses || expenses.length === 0) {
        alert("No expenses to export!")
        return
      }

      const doc = new jsPDF()
      
      doc.setFontSize(18)
      doc.text("Transactions Report", 14, 15)
      
      const tableColumn = ["Category", "Amount", "Date", "Description"]
      
      const tableRows = expenses.map(exp => [
        exp.category || "",
        "₹" + (exp.amount || "0"),
        exp.date || "",
        exp.description || ""
      ])
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: "grid",
        styles: { fontSize: 10 }
      })
      
      doc.save("transactions-report.pdf")
      alert("PDF exported successfully!")
    } catch (error) {
      console.error("PDF export error:", error)
      alert("Failed to export PDF")
    }
  }

  // EXPORT CSV
  const exportCSV = () => {
    try {
      if (!expenses || expenses.length === 0) {
        alert("No expenses to export!")
        return
      }

      const headers = ["Category", "Amount", "Date", "Description"]
      
      const rows = expenses.map(exp =>
        [
          `"${exp.category || ""}"`,
          exp.amount || "0",
          exp.date || "",
          `"${exp.description || ""}"`
        ].join(",")
      )
      
      const csvContent = [headers.join(","), ...rows].join("\n")
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      
      link.setAttribute("href", url)
      link.setAttribute("download", "transactions-report.csv")
      link.style.visibility = "hidden"
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert("CSV exported successfully!")
    } catch (error) {
      console.error("CSV export error:", error)
      alert("Failed to export CSV")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 p-8 text-black dark:text-white">
        <Navbar />

        <Transactiontable expenses={expenses} />
      </div>
    </div>
  )
}

export default Transactions
