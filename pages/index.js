// pages/index.js

import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { callFlopcoin } from '../lib/flopcoinRPC';
import Navbar from '@/components/Navbar';

export default function Home({ faucetBalance, totalPaidOut, numPayouts }) {
  const [address, setAddress] = useState('');
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const onVerifyCaptcha = (token) => {
    setHcaptchaToken(token);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    setMessage('');

    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, hcaptchaToken }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`Success! TxID: ${data.txid}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }

    setIsClaiming(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#212121] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content - removed vertical centering */}
      <main className="flex-grow flex justify-center">
        {/* Updated container with responsive horizontal padding */}
        <div className="w-full max-w-2xl px-6 sm:px-4 p-1 pt-0">
          {/* Banner Image */}
          <div className="w-full">
            <div
              className="mx-auto mt-2"
              style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}
            >
              <img src="/banner.png" alt="Banner" className="w-auto h-auto mt-12" />
            </div>
          </div>

          {/* Stats Block */}
          <div className="flex justify-center mt-1">
            <div className="text-left text-gray-300 space-y-1 mb-4 text-base leading-normal">
              <p className="flex items-center">
                <span className="mr-2 text-xl">⏰</span>
                <span>
                  You can claim <b>100 FLOP</b> every hour.
                </span>
              </p>
              <p className="flex items-center">
                <span className="mr-2 text-xl">🏦</span>
                <span>
                  Faucet Balance: <b>{faucetBalance} FLOP</b>
                </span>
              </p>
              <p className="flex items-center">
                <span className="mr-2 text-xl">💰</span>
                <span>
                  Total Paid Out: <b>{totalPaidOut} FLOP</b>
                </span>
              </p>
              <p className="flex items-center">
                <span className="mr-2 text-xl">❤️</span>
                <span>
                  <a href="/donate" className="underline text-[#e979be] hover:text-[#e979be]">
                    Donate
                  </a>{' '}
                  to keep the faucet running
                </span>
              </p>
            </div>
          </div>

          {/* Claim Form */}
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Enter your FLOP address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-white rounded placeholder-gray-400 h-14 w-[600px] pl-4 pr-2"
              />
              <button
                onClick={handleClaim}
                disabled={!address || !hcaptchaToken || isClaiming}
                className="bg-[#df3da1] text-white px-4 h-14 rounded disabled:opacity-50 hover:bg-[#ce228c] flex items-center justify-center"
              >
                {isClaiming ? 'Processing...' : 'Submit'}
              </button>
            </div>

            {/* hCaptcha */}
            <div className="mt-8 flex justify-center">
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={onVerifyCaptcha}
              />
            </div>

            {/* Message */}
            {message && (
              <div className="mt-4 text-red-400 font-semibold text-center">
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  let faucetBalance = 'N/A';
  let totalPaidOut = 0;
  let numPayouts = 0;

  // Get the current faucet balance
  try {
    faucetBalance = await callFlopcoin('getbalance');
  } catch (err) {
    console.error('Error fetching faucet balance:', err);
  }

  // Fetch the transaction history with a larger count
  try {
    const transactions = await callFlopcoin('listtransactions', ["*", 1000]);
    if (Array.isArray(transactions)) {
      transactions.forEach((tx) => {
        if (tx.category === 'send') {
          totalPaidOut += Math.abs(tx.amount);
          numPayouts += 1;
        }
      });
    }
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }

  // Format numbers
  if (typeof faucetBalance === 'number') {
    faucetBalance = Math.floor(faucetBalance).toLocaleString();
  }
  totalPaidOut = Math.floor(totalPaidOut).toLocaleString();
  numPayouts = Math.floor(numPayouts).toLocaleString();

  return {
    props: {
      faucetBalance,
      totalPaidOut,
      numPayouts,
    },
  };
}
