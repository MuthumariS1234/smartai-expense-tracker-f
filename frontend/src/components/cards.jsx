function Cards({ data }) {
  return (

    <div className="grid grid-cols-3 gap-6 mb-6">

      <div className="bg-green-500 text-white p-6 rounded-xl">
        <p>Total Balance</p>
        <h2 className="text-2xl font-bold">
          ₹{data.balance}
        </h2>
      </div>

      <div className="bg-red-500 text-white p-6 rounded-xl">
        <p>Total Expenses</p>
        <h2 className="text-2xl font-bold">
          ₹{data.expenses}
        </h2>
      </div>

      <div className="bg-yellow-400 text-white p-6 rounded-xl">
        <p>Budget Left</p>
        <h2 className="text-2xl font-bold">
          ₹{data.budget}
        </h2>
      </div>

    </div>
  );
}

export default Cards;