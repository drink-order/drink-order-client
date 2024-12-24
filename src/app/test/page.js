// /** @format */

// import Image from "next/image";

// export default function SummaryCard() {
//   return (
//     //
//     <div className="  bg-[hsl(225,100%,94%)] min-h-screen w-full relative flex items-center justify-center ">
//       {/* bg image container */}
//       <div className="absolute z-10 top-0 left-0 w-full   ">
//         <Image className="hidden sm:flex w-full" src={"/drink.png"} alt="drink.png" />
//         <Image
//           className="sm:hidden w-full h-auto"
//           src={"/drink.png"}
//           alt="drink.png"
//         />
//       </div>

//       {/* main */}

//       <main className="z-50 max-w-[320px] rounded-xl overflow-hidden bg-white  ">
//         <Image src={"/drink.png"} alt="drink.png" />
//         <section className="flex flex-col items-center text-center px-5 pt-10  pb-8  gap-7  ">
//           <div className="flex flex-col gap-3 ">
//             <h2 className="text-3xl font-bold text-slate-800 ">
//               {" "}
//               Order Summary
//             </h2>

//             <p className="text-gray-500 text-sm">
//               You can now listen to millions of songs, audiobooks, and podcasts
//               on any device anywhere you like!
//             </p>
//             {/*  icon , detail, change */}
//             <section className="flex bg-[hsl(225,100%,98%)] justify-between w-full items-center rounded-xl px-5 py-3   text-sm">
//               {/* music icon */}
//               <div className="flex gap-2 ">
//                 <Image src={"/drink.png"} alt="drink.png" />
//                 <div className="flex   flex-col  h-fit ">
//                   <h3 className="font-bold"> Annual Plan</h3>
//                   <p className="text-gray-500 text-sm">$59.99/year</p>
//                 </div>
//               </div>
//               <button className="text-violet-800 font-semibold underline hover:opacity-80 hover:no-underline">
//                 Change
//               </button>
//             </section>
//           </div>
//           {/* buttons */}
//           <div className="flex flex-col gap-3 w-full">
//             <button className=" bg-blue-700 font-semibold text-white w-full py-3  text-sm rounded-xl shadow-2xl hover:opacity-80">
//               {" "}
//               Proceed to Payment
//             </button>
//             <button className="text-sm font-bold text-gray-600  hover:text-black">
//               Cancel Order
//             </button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }