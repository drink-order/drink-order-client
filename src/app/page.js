// import Image from "next/image";
// import SearchBar from "./components/SearchBar";

// export default function Home() {
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

//       <div className="p-4">
//         <SearchBar />
//       </div>

//       <div>
        
//       </div>
//     </div>
//   );
// }

import Image from "next/image";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";

export default function Home() {
  const mockCategories = [
    {
      image: "/alldrink.png", // Replace with actual image URLs if needed
      label: "ALL",
      content: "ALL",
    },
    {
      image: "hotcoffee.png",
      label: "Hot",
      content: "hot",
    },
    {
      image: "/icedrink.png",
      label: "Ice",
      content: "ice",
    },
    {
      image: "frappedrink.png",
      label: "Frappe",
      content: "frappe",
    },
  ];
  
  return ( // Missing `return` added here
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div>Hello, Thona</div>
        <Image
          src="/drink.png"
          alt="Profile"
          width={48} // Adjusted size for better visibility
          height={48} // Adjusted size for better visibility
          className="rounded-full border-solid border-primary border-2"
        />
      </div>

      <div className="p-4">
        <SearchBar />
      </div>

      <div>
        {/* Add any additional content or components here */}
        <CategorySelector categories={mockCategories} />


      </div>
    </div>
  );
}
