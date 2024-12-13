import React, { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiConnector";
import { walletEndpoints } from "../../services/api";
import toast from "react-hot-toast";
import { connectWebSocket, sendMessage } from "../../services/websocketService"; // Import WebSocket functions

const { TRANSFER_PAYMENT_API } = walletEndpoints;

function Transfer() {
  const [details, setDetails] = useState({ amount: "", receiver_id: "" });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Connect to WebSocket when the component mounts
    const socket = connectWebSocket();

    // Listen for wallet update event to update the balance
    socket.on("walletUpdated", (data) => {
      console.log("Wallet updated:", data);
      setBalance(data.balance); // Update balance with the new balance received from server
    });

    // Cleanup on component unmount
    return () => {
      socket.off("walletUpdated");
    };
  }, []);

  const handleTransfer = async () => {
    if (details.amount <= 0 || !details.receiver_id) {
      alert("Enter valid details");
      return;
    }
    try {
      // Send API request to transfer funds
      await apiConnector(
        "POST",
        TRANSFER_PAYMENT_API,
        {
          amount: Number(details.amount),
          receiver_id: details.receiver_id,
        },
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );

      // Emit WebSocket event to notify the backend of the transfer
      sendMessage("transfer", {
        amount: Number(details.amount),
        receiver_id: details.receiver_id,
      });

      toast.success("Payment Transferred successfully");
      setDetails({ amount: "", receiver_id: "" }); // Clear the input fields
    } catch (error) {
      toast.error("Payment not Transferred");
      console.error("Error in transfer:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Transfer Funds</h1>
      <p>Current Balance: ${balance}</p> {/* Display the current balance */}
      <input
        type="number"
        value={details.amount}
        onChange={(e) => setDetails({ ...details, amount: e.target.value })}
        placeholder="Enter Amount"
        className="border rounded-md px-4 py-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <input
        type="text"
        value={details.receiver_id}
        onChange={(e) => setDetails({ ...details, receiver_id: e.target.value })}
        placeholder="Enter User ID"
        className="border rounded-md px-4 py-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
      <button
        onClick={handleTransfer}
        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
      >
        Transfer
      </button>
    </div>
  );
}

export default Transfer;
