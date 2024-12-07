import React from 'react';
import Card from './components/card';
import CategorySelector from './components/CategorySelector';

export default function Page() {
  // Array of product data
  const products = [
    {
      id: 1,
      image: '/drink.png',
      title: 'Strawberry Frappe',
      soldCount: '200+',
      price: '10.00',
      category: 'frappe'
    },
    {
      id: 2,
      image: '/chocolateFrappe.png',
      title: 'Chocolate Smoothie',
      soldCount: '150+',
      price: '8.00',
      category: 'ice'
    },
    {
      id: 3,
      image: '/picMenu.jpeg',
      title: 'Vanilla Milkshake',
      soldCount: '180+',
      price: '9.50',
      category: 'hot'
    },
    {
      id: 4,
      image: '/vanillar.png',
      title: 'Vanilla Milkshake',
      soldCount: '180+',
      price: '9.50',
      category: 'frappe'
    },
    {
      id: 5,
      image: '/drink.png',
      title: 'Strawberry Frappe',
      soldCount: '200+',
      price: '10.00',
      category: 'frappe'
    },
    {
      id: 6,
      image: '/drink.png',
      title: 'Strawberry Frappe',
      soldCount: '200+',
      price: '10.00',
      category: 'frappe'
    },
    {
      id: 7,
      image: '/drink.png',
      title: 'Strawberry Frappe',
      soldCount: '200+',
      price: '10.00',
      category: 'frappe'
    },
    {
      id: 8,
      image: '/drink.png',
      title: 'Strawberry Frappe',
      soldCount: '200+',
      price: '10.00',
      category: 'frappe'
    },
  ];
  return (
    <CategorySelector
      categories={[
        {
          image: "/drink.png",
          label: "All",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {products.map((product) => (
                <Card
                  key={product.id} // Always include a unique key when mapping components
                  image={product.image}
                  title={product.title}
                  soldCount={product.soldCount}
                  price={product.price}
                  category={product.category}
                />
              ))}
            </div>
          ),
        },
        {
          image: "/drink.png",
          label: "Hot",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {products
                .filter((product) => product.category === "hot")
                .map((product) => (
                  <Card
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    soldCount={product.soldCount}
                    price={product.price}
                    category={product.category}
                  />
                ))}
            </div>
          ),
        },
        {
          image: "/drink.png",
          label: "Ice",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {products
                .filter((product) => product.category === "ice")
                .map((product) => (
                  <Card
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    soldCount={product.soldCount}
                    price={product.price}
                    category={product.category}
                  />
                ))}
            </div>
          ),
        },
        {
          image: "/drink.png",
          label: "Frappe",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              {products
                .filter((product) => product.category === "frappe")
                .map((product) => (
                  <Card
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    soldCount={product.soldCount}
                    price={product.price}
                    category={product.category}
                  />
                ))}
            </div>
          ),
        },
      ]}
    />
  );
}
