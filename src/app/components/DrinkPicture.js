import React from "react";

export default function DrinkPicture(){
    return (
        <div className="bg-primary w-[350px] h-[250px] border-2 border-secondary rounded-2xl flex item-center justify-center m-5">
            <img
                src="/drinkImage.png" alt="drink"
                className="w-auto h-auto"
            ></img>
        </div>
    )
}