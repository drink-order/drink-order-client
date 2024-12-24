import Image from "next/image";
import SearchBar from "./components/SearchBar";
import CategorySelector from "./components/CategorySelector";
import { Button } from "./components/Button";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);


  const addToCart = (product) => {
    setCart([...cart, product]);
    setTotal(total + product.price);
  };

  return (
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

      {/* Search Bar */}
      <div className="flex justify-center px-6">
        <SearchBar className="w-full max-w-3xl" />
      </div>

      {/* Category Selector */}
      <div className="mt-6 px-6">
        <CategorySelector
          categories={mockCategories}
          addToCart={addToCart}
        />
      </div>

      <div>
        <StickyCartButton cart={cart} total={total} />
      </div>

    </div>
  );
}