import React, { useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { walletEndpoints } from "../../services/api";
import toast from "react-hot-toast";

const {DEPOSIT_PAYMENT_API} = walletEndpoints;

function Deposit() {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    try {
      console.log(localStorage.getItem("token")); // Ensure token is correctly stored

      await apiConnector(
        "POST", DEPOSIT_PAYMENT_API,
        { amount: Number(amount) },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );
      // alert("Deposit successful!");
      toast.success("Payment Deposited successfully");
      setAmount("");
    } catch (error) {
      toast.error("Payment not Deposited");
      console.error("Error in deposit:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
        className="border rounded-md px-4 py-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleDeposit}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Deposit
      </button>
    </div>
  );
}

export default Deposit;
