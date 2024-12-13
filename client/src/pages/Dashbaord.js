import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../services/operations/authAPI";
import { apiConnector } from "../services/apiConnector";
import { endpoints, walletEndpoints } from "../services/api";

const { UPDATE_DISPLAY_PICTURE_API, FETCHIMAGE_API } = endpoints;
const { FETCHBALANCE_API } = walletEndpoints;

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState(null); // To store user ID

  // Fetch wallet balance and user ID
  const fetchWalletBalance = async () => {
    try {
      const response = await apiConnector(
        "GET",
        FETCHBALANCE_API,
        null,
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );
      const account = response.data.id; // Assuming the user ID is stored here
      setBalance(response.data.balance);
      console.log(response.data);
      setUserId(account); // Store the user ID
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setBalance("Error loading balance");
    }
  };

  // Fetch profile image
  const fetchProfileImage = async () => {
    try {
      const response = await apiConnector(
        "GET",
        FETCHIMAGE_API,
        null,
        { Authorization: `Bearer ${localStorage.getItem("token")}` }
      );
      setProfileImage(response.data.image);
    } catch (error) {
      console.error("Error while fetching image:", error);
      setProfileImage("Error loading image");
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    const formData = new FormData();
    formData.append("displayPicture", file);

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      );
      setProfileImage(response.data.data.image);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchProfileImage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
      >
        Logout
      </button>

      {/* Profile Image */}
      <div className="absolute top-6 left-6 flex flex-col items-center">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm text-gray-500 mt-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Wallet Balance Section */}
      <div className="flex flex-col items-center mt-20">
        <div className="bg-white shadow-md rounded-lg p-6 text-center w-80">
          {/* Display User ID */}
          {userId && (
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Account Number: {userId}
            </h3>
          )}
          <h2 className="text-2xl font-semibold text-gray-700">Wallet Balance</h2>
          <p className="text-xl text-green-600 mt-4">
            {balance !== null ? `₹ ${balance}` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={() => navigate("/deposit")}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Deposit
        </button>
        <button
          onClick={() => navigate("/debit")}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          Debit
        </button>
        <button
          onClick={() => navigate("/transfer")}
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
        >
          Transfer
        </button>
        <button
          onClick={() => navigate("/transactions")}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          Transaction History
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
