import React, { useState } from "react";

const DrinkOption = ({ sizeOptions, sugarOptions, toppingOptions, onOptionChange }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSugar, setSelectedSugar] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    onOptionChange({ size, sugar: selectedSugar, toppings: selectedToppings });
  };

  const handleSugarChange = (sugar) => {
    setSelectedSugar(sugar);
    onOptionChange({ size: selectedSize, sugar, toppings: selectedToppings });
  };

  const handleToppingChange = (topping) => {
    const newToppings = selectedToppings.includes(topping)
      ? selectedToppings.filter((t) => t !== topping)
      : [...selectedToppings, topping];
    setSelectedToppings(newToppings);
    onOptionChange({ size: selectedSize, sugar: selectedSugar, toppings: newToppings });
  };

  // Filter out options with value "none"
  const filteredSizeOptions = sizeOptions.filter(option => option.toLowerCase() !== "none");
  const filteredSugarOptions = sugarOptions.filter(option => option.toLowerCase() !== "none");
  const filteredToppingOptions = toppingOptions.filter(option => option.toLowerCase() !== "none");

  return (
    <div className="mt-4">
      {/* Size Options */}
      {filteredSizeOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Size</h3>
          <div className="flex space-x-2">
            {filteredSizeOptions.map((size, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded-full ${
                  selectedSize === size ? "bg-yellow-600 text-white" : ""
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sugar Options */}
      {filteredSugarOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Sugar Level</h3>
          <div className="flex space-x-2">
            {filteredSugarOptions.map((sugar, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded-full ${
                  selectedSugar === sugar ? "bg-yellow-600 text-white" : ""
                }`}
                onClick={() => handleSugarChange(sugar)}
              >
                {sugar}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topping Options */}
      {filteredToppingOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Toppings</h3>
          <div className="flex space-x-2">
            {filteredToppingOptions.map((topping, index) => (
              <button
                key={index}
                className={`px-3 py-1 border rounded-full ${
                  selectedToppings.includes(topping)
                    ? "bg-yellow-600 text-white"
                    : ""
                }`}
                onClick={() => handleToppingChange(topping)}
              >
                {topping}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkOption;