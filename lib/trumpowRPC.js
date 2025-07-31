// lib/trumpowRPC.js
import axios from 'axios';

const rpcUser = process.env.TRMP_RPC_USER;
const rpcPass = process.env.TRMP_RPC_PASS;
const rpcHost = process.env.TRMP_RPC_HOST || '127.0.0.1';
const rpcPort = process.env.TRMP_RPC_PORT;

export async function callTrumpow(method, params = []) {
  const url = `http://${rpcHost}:${rpcPort}/`;
  const data = {
    jsonrpc: '1.0',
    id: 'trumpow-faucet',
    method,
    params
  };

  const auth = {
    username: rpcUser,
    password: rpcPass
  };

  try {
    const response = await axios.post(url, data, { auth });
    return response.data.result;
  } catch (err) {
    // If the node returns an RPC error, pass that along
    throw new Error(err.response?.data?.error?.message || err.message);
  }
}
