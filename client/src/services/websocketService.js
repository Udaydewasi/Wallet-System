import { io } from 'socket.io-client';

// WebSocket connection URL
const SOCKET_URL = 'http://127.0.0.1:4001';
let socket;

export const connectWebSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL); // Initialize WebSocket connection

    // Event listeners
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('walletUpdated', (data) => {
      console.log('Wallet updated:', data);
      // Handle wallet update, update UI as necessary
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  return socket;
};

// Emit event to server (e.g., when deposit, debit, or transfer happens)
export const sendMessage = (event, data) => {
  const socket = getSocket();
  if (socket) {
    socket.emit(event, data); // Emit event to the server
  }
};

export const getSocket = () => socket;