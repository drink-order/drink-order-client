"use client";
import React, { useState } from "react";

const DrinkOption = () => {
    // State to keep track of the selected options
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedSugar, setSelectedSugar] = useState(null);
    const [selectedTopping, setSelectedTopping] = useState(null);

    // Function to handle button clicks
    const handleSelection = (event, group) => {
        const selectedValue = event.target.textContent;

        // Update state based on the clicked group
        switch (group) {
            case "size":
                setSelectedSize(selectedValue);
                break;
            case "sugar":
                setSelectedSugar(selectedValue);
                break;
            case "topping":
                setSelectedTopping(selectedValue);
                break;
            default:
                break;
        }
    };

    // Function to check if an option is selected
    const isSelected = (group, value) => {
        switch (group) {
            case "size":
                return selectedSize === value;
            case "sugar":
                return selectedSugar === value;
            case "topping":
                return selectedTopping === value;
            default:
                return false;
        }
    };

    return (
        <div className="font-sans p-6 max-w-[400px] mx-auto">
            {/* Size Options */}
            <div className="mb-6">
                <label className="block font-bold mb-2">Size</label>
                <div className="flex gap-2 justify-left">
                    {["S", "M", "L"].map((size) => (
                        <button
                            key={size}
                            className={`w-14 py-2 border-2 rounded-lg cursor-pointer text-sm transition-all 
                                ${isSelected("size", size)
                                    ? "text-[#5D4435] bg-[#fcefe6] border-[#f39c12] font-bold"
                                    : "border-[#ccc] bg-white"
                                }`}
                            onClick={(e) => handleSelection(e, "size")}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sugar Options */}
            <div className="mb-6">
                <label className="block font-bold mb-2">Sugar</label>
                <div className="flex gap-2 justify-left">
                    {["30%", "50%", "70%", "100%"].map((sugar) => (
                        <button
                            key={sugar}
                            className={`w-14 py-2 border-2 rounded-lg cursor-pointer text-sm transition-all ${
                                isSelected("sugar", sugar)
                                    ? "text-[#5D4435] bg-[#fcefe6] border-[#f39c12] font-bold"
                                    : "border-[#ccc] bg-white"
                            }`}
                            onClick={(e) => handleSelection(e, "sugar")}
                        >
                            {sugar}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topping Options */}
            <div className="mb-6">
                <label className="block font-bold mb-2">Topping</label>
                <div className="flex gap-4 mb-2 justify-left">
                    {["Boba", "RedBeans", "Jelly", "Pearl"].map((topping, index) => (
                        <button
                            key={index}
                            className={`w-20 py-2 border-2 rounded-lg cursor-pointer text-sm transition-all ${
                                isSelected("topping", topping)
                                    ? "text-[#5D4435] bg-[#fcefe6] border-[#f39c12] font-bold"
                                    : "border-gray4 bg-white"
                            }`}
                            onClick={(e) => handleSelection(e, "topping")}
                        >
                            {topping}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DrinkOption;
