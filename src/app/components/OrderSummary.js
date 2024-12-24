import React from "react";  
import CardBox from ".././components/CardBox";

export default function SummaryCard() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        {/* Main Card */}
        <main className="max-w-[320px] rounded-xl overflow-hidden bg-white shadow-lg">
            <section className="flex flex-col items-center text-center px-5 pt-10 pb-8 gap-7">
                {/* Heading and Description */}
                <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold text-slate-800">Order Summary</h2>
                <p className="text-gray-500 text-sm">
                    You can now listen to millions of songs, audiobooks, and podcasts
                    on any device anywhere you like!
                </p>
                </div>
    
                {/* Plan Details */}
                {/* <section className="flex bg-blue-50 justify-between w-full items-center rounded-xl px-5 py-3 text-sm">
                <div className="flex gap-2">
                    <div className="flex flex-col">
                    <h3 className="font-bold">Annual Plan</h3>
                    <p className="text-gray-500 text-sm">$59.99/year</p>
                    </div>
                </div>
                <button className="text-blue-800 font-semibold underline hover:opacity-80 hover:no-underline">
                    Change
                </button>
                </section> */}
                <CardBox 
                    name={"Ice Chocolate"}
                    description={"A delicious ice chocolate drink"}
                    price={4.99}
                    originalPrice={6.99}
                    image="\drink.png"
                    
                />
    
                {/* Buttons */}
                <div className="flex flex-col gap-3 w-full">
                <button className="bg-blue-700 font-semibold text-white w-full py-3 text-sm rounded-xl shadow-2xl hover:opacity-80">
                    Proceed to Payment
                </button>
                <button className="text-sm font-bold text-gray-600 hover:text-black">
                    Cancel Order
                </button>
                </div>
            </section>
        </main>
      </div>
    );
}
  