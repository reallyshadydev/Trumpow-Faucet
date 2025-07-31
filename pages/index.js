// pages/index.js

import React, { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { callTrumpow } from '../lib/trumpowRPC';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
// Import the in-memory counter
import { getTotalPaidOut } from '../lib/inMemoryStats';

export default function Home({ faucetBalance, totalPaidOut, numPayouts }) {
  const [address, setAddress] = useState('');
  const [hcaptchaToken, setHcaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const hcaptchaRef = useRef(null);

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
        setMessage(`Success! You can use the faucet again in one hour!\n TxID: ${data.txid}`);
      } else {
        setMessage(`Error: ${data.error}`);
        if (hcaptchaRef.current) {
          hcaptchaRef.current.resetCaptcha();
        }
        setHcaptchaToken('');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
      if (hcaptchaRef.current) {
        hcaptchaRef.current.resetCaptcha();
      }
      setHcaptchaToken('');
    }

    setIsClaiming(false);
  };

  return (
    <>
      <Head>
        <title>Trumpow Faucet</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <div className="min-h-screen flex flex-col bg-[#212121] text-white">
        <Navbar />
        <main className="flex-grow flex justify-center">
          <div className="w-full max-w-2xl px-6 sm:px-4 p-1 pt-0">
            <div className="w-full">
              <div className="mx-auto mt-2" style={{ transform: 'scale(1.2)', transformOrigin: 'center' }}>
                <img src="/banner.png" alt="Banner" className="w-auto h-auto mt-12" />
              </div>
            </div>

            <div className="flex justify-center mt-1">
              <div className="text-left text-gray-300 space-y-1 mb-4 text-base leading-normal">
                <p className="flex items-center text-xl">
                  <span className="mr-2 text-xl">⏰</span>
                  <span>
                    You can claim <b>{process.env.NEXT_PUBLIC_FAUCET_REWARD} TRMP</b> every hour.
                  </span>
                </p>
                <p className="flex items-center text-xl">
                  <span className="mr-2">🏦</span>
                  <span>
                    Faucet Balance: <b>{faucetBalance} TRMP</b>
                  </span>
                </p>
                <p className="flex items-center text-xl">
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

            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter your TRMP address"
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

              <div className="mt-8 flex justify-center">
                <HCaptcha
                  ref={hcaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                  onVerify={onVerifyCaptcha}
                />
              </div>

              {message && (
                <div
                  className={`mt-4 font-semibold text-center ${
                    message.startsWith('Success') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  let faucetBalance = 'N/A';
  let totalPaidOut = 0;
  let numPayouts = 0;

  try {
    faucetBalance = await callTrumpow('getbalance');
  } catch (err) {
    console.error('Error fetching faucet balance:', err);
  }

  // Use the in-memory counter instead of on-chain calculations
  try {
    totalPaidOut = getTotalPaidOut();
  } catch (err) {
    console.error('Error fetching totalPaidOut:', err);
  }

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
