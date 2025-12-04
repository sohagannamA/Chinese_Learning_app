import React from "react";
import { NavLink } from "react-router-dom";
import { RiHome5Line } from "react-icons/ri";
import { FaLanguage } from "react-icons/fa6";
import { BiCategory } from "react-icons/bi";
import { BiDumbbell } from "react-icons/bi";

export default function PhoneNav() {
  return (
    <div className="activ_nave fixed bottom-0 bg-[rgb(19,31,36)] w-full flex items-center justify-between px-[20px] py-[10px]">
      <NavLink to="/">
        <div className="hover:text-gray-300 text-gray-400">
          <RiHome5Line className="active_color text-[25px]  w-full text-center" />
          <p className="active_color text-[15px]">HSK</p>
        </div>
      </NavLink>
      <NavLink to="/syllable">
        <div className="hover:text-gray-300 text-gray-400">
          <FaLanguage className="text-[20px] active_color w-full text-center" />
          <p className="text-[15px] mt-1 active_color">Syllable</p>
        </div>
      </NavLink>
      <NavLink to="/category">
        <div className="hover:text-gray-300 text-gray-400">
          <BiCategory className="text-[25px] active_color  w-full text-center" />
          <p className="text-[15px] active_color">Category</p>
        </div>
      </NavLink>
      <NavLink to="/practices_card">
        <div className="hover:text-gray-300 text-gray-400">
          <BiDumbbell className="text-[25px] active_color  w-full text-center" />
          <p className="text-[15px] active_color">Practices</p>
        </div>
      </NavLink>
    </div>
  );
}
