import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { RiHome5Line } from "react-icons/ri";
import { FaLanguage } from "react-icons/fa6";
import { BiCategory, BiDumbbell } from "react-icons/bi";
import PhoneNav from "./PhoneNav";

export default function LeftNav() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div>
      {windowWidth > 1000 ? (
        <div className="active_nav_bg fixed top-[10%] bg-[rgb(19,31,36)] w-[250px] h-screen">
          <NavLink to="/">
            <div className="active_color flex items-center hover:bg-[rgb(28,49,63)] my-[20px] px-[50px] py-[10px] space-x-4">
              <RiHome5Line className="text-[25px] text-gray-400" />
              <p className="text-[17px] text-gray-400">HSK</p>
            </div>
          </NavLink>

          <NavLink to="/syllable">
            <div className="active_color flex items-center hover:bg-[rgb(28,49,63)] px-[50px] py-[10px] mb-[20px] space-x-4">
              <FaLanguage className="text-[25px] text-gray-400" />
              <p className="text-[17px] text-gray-400">Syllable</p>
            </div>
          </NavLink>

          <NavLink to="/category">
            <div className="active_color flex items-center hover:bg-[rgb(28,49,63)] px-[50px] py-[10px] mb-[20px] space-x-4">
              <BiCategory className="text-[25px] text-gray-400" />
              <p className="text-[17px] text-gray-400">Category</p>
            </div>
          </NavLink>

          <NavLink to="/practices_card">
            <div className="active_color flex items-center hover:bg-[rgb(28,49,63)] px-[50px] py-[10px] mb-[20px] space-x-4">
              <BiDumbbell className="text-[25px] text-gray-400" />
              <p className="text-[17px] text-gray-400">Practices</p>
            </div>
          </NavLink>
        </div>
      ) : (
        <PhoneNav />
      )}
    </div>
  );
}
