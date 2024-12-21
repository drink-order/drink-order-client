// import Image from "next/image";
// import SearchBar from "./components/SearchBar";
// import CategorySelector from "./components/CategorySelector";
// import { Button } from "./components/Button";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       <div className="flex justify-between items-center p-4">
//         <div>Hello, Thona</div>
//         <Image
//           src="/drink.png"
//           alt="Profile"
//           width={48} // Adjusted size for better visibility
//           height={48} // Adjusted size for better visibility
//           className="rounded-full border-solid border-primary border-2"
//         />
//       </div>
//       <button>
//         <CategorySelector />
//       </button>
//       <div className="p-4">
//         <>
//         <SearchBar />
//         <Button />
//         </>
        
//       </div>

//     </div>
//   );
// }


import React from 'react'
import Dashboard from './components/Staff-Dashboard/Dashboard'

export default function home() {
  return (
    <div>
      <Dashboard/>
    </div>
  );
}
