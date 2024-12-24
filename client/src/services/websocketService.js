import { io } from 'socket.io-client';

// WebSocket connection URL
const REACT_APP_SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
let socket;

export const connectWebSocket = () => {
  if (!socket) {
    socket = io(REACT_APP_SOCKET_URL);

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