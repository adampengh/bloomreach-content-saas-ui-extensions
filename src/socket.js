'use client';

import { NEXT_PUBLIC_WEBSOCKET_URL } from './lib/constants';
import { io } from 'socket.io-client';

const socketUrl = NEXT_PUBLIC_WEBSOCKET_URL;
console.log('socketUrl', socketUrl);

export const socket = io(socketUrl);
