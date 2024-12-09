import Image from "next/image";
import SearchBar from "./components/SearchBar";

export default function Home() {
  return(
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
        
      </div>
    </div>
  );
}
