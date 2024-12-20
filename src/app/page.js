// "use client";
// import React from 'react';
// import SearchBar from './components/SearchBar';
// import CategorySelector from './components/CategorySelector';


// const mockCategories = [
//   {
//     label: "Popular",
//     image: "/drink.png",
//     content: [
//       {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Hot Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
      
//        {
//         image: "/drink.png",
//         title: "Ice Amaricano",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Ice",
//     image: "/drink.png",
//     title: "Iced Drinks",
//     content: [
//       {
//         image: "/drink.png",
//         title: "Ice Amaricano",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Hot",
//     image: "/drink.png",
//     content: [
      
//       {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Hot Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Frappe",
//     image: "/drink.png",
//     content: [
      
//       {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
// ];

// export default function Home() {
//   return (
//     <div>
//       <div className="text-letf text-2xl font-bold my-4 mb-2 px-2 ">Hello,Customer</div>
//       <SearchBar className="p=4" /> 
//       <CategorySelector categories={mockCategories} /> 
//       <StickyCartButton />
      
//     </div>
//   );
// }




// "use client";
// import React, { useState } from 'react';
// import SearchBar from './components/SearchBar';
// import CategorySelector from './components/CategorySelector';
// import StickyCardComponent from './components/DrinkDetails';

// const mockCategories = [
//   {
//     label: "Popular",
//     image: "/drink.png",
//     content: [
//       {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Hot Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
      
//        {
//         image: "/drink.png",
//         title: "Ice Amaricano",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Ice",
//     image: "/drink.png",
//     title: "Iced Drinks",
//     content: [
//       {
//         image: "/drink.png",
//         title: "Ice Amaricano",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Ice Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Hot",
//     image: "/drink.png",
//     content: [
      
//       {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//         {
//         image: "/drink.png",
//         title: "Hot Latte",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Hot Cappocino",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
//   {
//     label: "Frappe",
//     image: "/drink.png",
//     content: [
      
//       {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//        {
//         image: "/drink.png",
//         title: "Latte Frappe",
//         soldCount: '120+',
//         price: 9.99 ,
//        },
//     ],
//   },
// ];

// export default function Home() {
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   const addToCart = (item) => {
//     setCartItems((prev) => [...prev, item]);
//     setTotalPrice((prev) => prev + item.price);
//   };

//   const removeFromCart = (item) => {
//     setCartItems((prev) => {
//       const index = prev.findIndex((cartItem) => cartItem.title === item.title);
//       if (index !== -1) {
//         const updatedCart = [...prev];
//         updatedCart.splice(index, 1);
//         return updatedCart;
//       }
//       return prev;
//     });
//     setTotalPrice((prev) => prev - item.price);
//   };

//   return (
//     <div>
//       <div className="text-left text-2xl font-bold my-4 mb-2 px-2">
//         Hello, Customer
//       </div>
//       <SearchBar className="p=4" />
//       <CategorySelector categories={mockCategories} onAddToCart={addToCart} />
//       <StickyCardComponent
//         cartItems={cartItems}
//         totalPrice={totalPrice}
//         onRemoveFromCart={removeFromCart} />
//               </div>
//   );
// }
"use client";
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import CategorySelector from './components/CategorySelector';
import StickyCardComponent from './components/DrinkDetails';

const mockCategories = [
  {
    label: "Popular",
    image: "/drink.png",
    content: [
      { image: "/drink.png", title: "Hot Latte", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Hot Latte", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Hot Cappocino", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Latte Frappe", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Latte Frappe", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Ice Amaricano", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Ice Cappocino", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Ice Latte", soldCount: "120+", price: 9.99 },
    ],
  },
  {
    label: "Ice",
    image: "/drink.png",
    content: [
      { image: "/drink.png", title: "Ice Amaricano", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Ice Latte", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Ice Cappocino", soldCount: "120+", price: 9.99 },
    ],
  },
  {
    label: "Hot",
    image: "/drink.png",
    content: [
      { image: "/drink.png", title: "Hot Latte", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Hot Latte", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Hot Cappocino", soldCount: "120+", price: 9.99 },
    ],
  },
  {
    label: "Frappe",
    image: "/drink.png",
    content: [
      { image: "/drink.png", title: "Latte Frappe", soldCount: "120+", price: 9.99 },
      { image: "/drink.png", title: "Latte Frappe", soldCount: "120+", price: 9.99 },
    ],
  },
];

export default function Home() {
  const [cartItems, setCartItems] = useState([]); // Cart items state
  const [totalPrice, setTotalPrice] = useState(0); // Total price state
  const [selectedDrink, setSelectedDrink] = useState(null); // State for the selected drink

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setTotalPrice((prev) => prev + item.price);
  };

  // Function to remove an item from the cart
  const removeFromCart = (item) => {
    setCartItems((prev) => {
      const index = prev.findIndex((cartItem) => cartItem.title === item.title);
      if (index !== -1) {
        const updatedCart = [...prev];
        updatedCart.splice(index, 1);
        return updatedCart;
      }
      return prev;
    });
    setTotalPrice((prev) => prev - item.price);
  };

  // Function to handle selecting a drink
  const handleSelectDrink = (drink) => {
    setSelectedDrink(drink);
  };

  // Function to close the StickyCardComponent
  const handleCloseStickyCard = () => {
    setSelectedDrink(null);
  };

  return (
    <div>
      <div className="text-left text-2xl font-bold my-4 mb-2 px-2">
        Hello, Customer
      </div>

      {/* Search Bar */}
      <SearchBar className="p=4" />

      {/* Category Selector */}
      <CategorySelector
        categories={mockCategories}
        onSelect={handleSelectDrink} // Pass onSelect to CategorySelector
      />

      {/* Render StickyCardComponent if a drink is selected */}
      {selectedDrink && (
        <StickyCardComponent
          drink={selectedDrink}
          cartItems={cartItems}
          totalPrice={totalPrice}
          onAddToCart={addToCart} // Add to cart function
          onRemoveFromCart={removeFromCart} // Remove from cart function
          onClose={handleCloseStickyCard} // Close StickyCard handler
        />
      )}
    </div>
  );
}
