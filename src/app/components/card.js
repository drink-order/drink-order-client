// import React from 'react';

// export default function Card({ image, title, soldCount, price , category}) {
//   return (
//     <div className="max-w-xs w-44 h-44 border border-[black] rounded-lg shadow-lg">
//       {/* Product Image */}
//       <div className="flex justify-center mb-10">
//       <img src={image} className="h-32 w-32 object-cover" />

//       </div>
      
//       {/* Product Title */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-sm font-semibold text-center mb-1">{title}</h2>
//         <p className="text-xs text-gray-500 text-center mb-0.5">{soldCount} sold</p>
//       </div>

//       {/* Price and Add Button */}
//       <div className="flex justify-between items-center">
//         <span className="text-lg font-bold">${price}</span>
//         <button className="bg-yellow-500 text-white px-2 py-0.5 rounded-full hover:bg-yellow-600">+</button>
//       </div>
//     </div>
//   );
// };
// import React from 'react';

// export default function Card({ image, title, soldCount, price, category }) {
//   return (
//     <div className="max-w-xs w-40 h-50 border border-secondary rounded-lg shadow-md p-2">
//       {/* Product Image */}
//       <div className="flex justify-center mb-1">
//         <img src={image} className="w-36 h-36 object-cover rounded-md"/>
//       </div>

//       {/* Product Title and Sold Count */}
//       <div className="flex flex-col items-start px-1">
//         <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
//         <p className="text-xs text-gray-500">{category}</p>
//         <p className="text-xs text-gray-500">{soldCount} sold</p>
//       </div>

//       {/* Price and Add Button */}
//       <div className="flex justify-between items-center mt-auto px-1">
//         <span className="text-md font-bold text-gray-900">${price}</span>
//         <button className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600">
//           +
//         </button>
//       </div>
//     </div>
//   );
// }

// Card.js
// import React from 'react';

// export default function Card({ image, title, soldCount, price, category }) {
//   return (
//     <div className="max-w-xs w-full h-auto border border-secondary rounded-lg shadow-md p-2">
//       {/* Product Image */}
//       <div className="flex justify-center mb-1">
//         <img src={image} className="w-36 h-36 object-cover rounded-md" />
//       </div>

//       {/* Product Title and Sold Count */}
//       <div className="flex flex-col items-start px-1">
//         <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
//         <p className="text-xs text-gray-500">{category}</p>
//         <p className="text-xs text-gray-500">{soldCount} sold</p>
//       </div>

//       {/* Price and Add Button */}
//       <div className="flex justify-between items-center mt-auto px-1">
//         <span className="text-md font-bold text-gray-900">${price}</span>
//         <button
//           onClick={() => onClick && onClick ({ image, title, soldCount, price, category })}
//           className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600"
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// }
import React from 'react';

export default function Card({ image, title, soldCount, price, category, onClick }) {
  return (
    <div className="max-w-xs w-full h-auto border border-secondary rounded-lg shadow-md p-2">
      {/* Product Image */}
      <div className="flex justify-center mb-1">
        <img src={image} alt={title} className="w-36 h-36 object-cover rounded-md" />
      </div>

      {/* Product Title and Sold Count */}
      <div className="flex flex-col items-start px-1">
        <h2 className="text-sm font-semibold text-gray-800 truncate">{title}</h2>
        <p className="text-xs text-gray-500">{category}</p>
        <p className="text-xs text-gray-500">{soldCount} sold</p>
      </div>

      {/* Price and Add Button */}
      <div className="flex justify-between items-center mt-auto px-1">
        <span className="text-md font-bold text-gray-900">${price.toFixed(2)}</span>
        <button
          onClick={() =>
            onClick &&
            onClick({ image, title, soldCount, price, category })
          }
          className="bg-primary text-white px-3 py-1 rounded-full hover:bg-yellow-600"
        >
          +
        </button>
      </div>
    </div>
  );
}
