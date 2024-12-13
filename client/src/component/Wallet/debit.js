import React, { useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { walletEndpoints } from "../../services/api";
import toast from "react-hot-toast";

const {DEBIT_PAYMENT_API} = walletEndpoints;

function Debit() {
  const [amount, setAmount] = useState("");

  const handleDebit = async () => {
    if (amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    try {
      await apiConnector(
        "POST",DEBIT_PAYMENT_API,
        { amount: Number(amount) },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );
      // alert("Debit successful!");
      toast.success("Payment Debited successfully");
      setAmount("");
    } catch (error) {
      console.error("Error in debit:", error);
      toast.error("Payment not Debited");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Debit Funds</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        className="border rounded-md px-4 py-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        onClick={handleDebit}
        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
      >
        Debit
      </button>
    </div>
  );
}

export default Debit;
