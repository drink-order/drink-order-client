'use client';

import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

export const words = ['hello', 'world', 'example', 'help', 'hero', 'hope'];

const SearchBar = () => {
    const [activeSearch, setActiveSearch] = useState([]);

    const handleSearch = (e) => {
        const value = e.target.value;
        if (value === '') {
            setActiveSearch([]);
            return;
        }
        setActiveSearch(words.filter(w => w.includes(value)).slice(0, 8));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="w-full md:w-[500px] relative" onSubmit={handleSubmit}>
            <label htmlFor="search-bar" className="sr-only">Search</label>
            <div className="relative text-white">
                <input
                    id="search-bar"
                    type="search"
                    placeholder="Search for drink"
                    className="w-full p-4 rounded-3xl bg-gray5 text-black"
                    onChange={(e) => handleSearch(e)}
                />
                <button
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-4 bg-primary rounded-full"
                    type="submit"
                >
                    <AiOutlineSearch />
                </button>
            </div>

            {activeSearch.length > 0 && (
                <div className="absolute p-4 bg-white text-black w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
                    {activeSearch.map((s, index) => (
                        <span key={index}>{s}</span>
                    ))}
                </div>
            )}
        </form>
    );
};

export default SearchBar;
