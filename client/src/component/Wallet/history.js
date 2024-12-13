import React, { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiConnector";
import { walletEndpoints } from "../../services/api";
import toast from "react-hot-toast";

const { TRANSACTION_HISTORY_API } = walletEndpoints;

function Transactions() {
  console.log(`"api : " ${TRANSACTION_HISTORY_API}`);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await apiConnector(
        "GET",
        TRANSACTION_HISTORY_API,
        null,
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );
      setTransactions(response.data.transaction);
      toast.success("Transaction History fetched");

    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <div className="w-3/4 max-w-2xl bg-white p-4 rounded-lg shadow-md">
        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {transactions.map((txn, index) => (
              <li key={index} className="py-2">
                <p>
                  <strong>Type:</strong> {txn.type}
                </p>
                <p>
                  <strong>Amount:</strong> {txn.amount}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Date:</strong> {new Date(txn.created_at).toLocaleString()}
                </p>
                {txn.description && (
                  <p>
                    <strong>Description:</strong> {txn.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default Transactions;
