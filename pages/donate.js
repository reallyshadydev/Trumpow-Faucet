import Navbar from '@/components/Navbar';

export default function DonatePage() {

  // Get the faucet address from the environment variable
  const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS;

  return (
    <div className="min-h-screen flex flex-col bg-[#212121] text-white">
      <Navbar />
      <section className="mx-auto max-w-2xl text-center mt-12 px-4 text-gray-300 space-y-7">
        <h1 className="text-4xl md:text-2xl font-ubuntu font-bold text-white mb-4">Donate to <span className='text-[#e979be]'>Trumpow</span> Faucet</h1>
        <p className="text-lg leading-relaxed">
          This faucet is entirely funded by the community and you can help add some Trumpow into it to keep us going.
          You can send Trumpow to the address below and it will be reflected in the faucet's balance after at least 6 confirmations.
        </p>
        <div className="my-4">
            <div className="bg-black text-white p-4 rounded-md w-full overflow-auto text-center">
                {faucetAddress}
            </div>
        </div>
        <p className="text-lg leading-relaxed">
            100% of the donations go to the faucet! If you'd like to support the developer you can send some Trumpow or 
            other currencies to the following addresses:
        </p>
        <div className="my-4">
            <div className="bg-black text-white p-4 rounded-md w-full overflow-auto text-center">
                <b>TRMP:</b> FDm3UURY7sZobJ3BbKRUX4twBx2d52oSEU<br/>
                <b>DOGE:</b> DDuWyhLXsDVtZHedgBoVxgfhroJbEiZ3sT<br/>
                <b>BTC:</b> 3CaUXmAjkBa4PgvJy38yRou5tjHxDPTfZn<br/>
                <b>ETH:</b> 0x609D11cC3839ebBb48C7604347700B7a450E0e55
            </div>
        </div>
      </section>
    </div>
  );
}
