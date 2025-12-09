import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { IoApps } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import DisplayWord from "./DisplayWord";
import { GiProgression } from "react-icons/gi";
import { GiHamburgerMenu } from "react-icons/gi";
import { Host } from "../api/Host";

export default function Nav() {
  const navigate = useNavigate();
  const [addAction, setAddAction] = useState(false);
  const dropdownRef = useRef(null); // only added
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAddAction(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [searchShow, setSearchShow] = useState(false);
  const [searchKey, seatSearchKey] = useState("");
  const [searchData, setSearchData] = useState();
  const [wordDisplay, setWordDisplay] = useState(false);

  const fetchWords = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${Host.host}api/words/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err) {
      console.error("Fetch words error:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchKey.trim()) {
      alert("Search box is empty");
      return;
    }

    // Convert string into array of keywords
    const searchKeysArray = searchKey
      .trim()
      .split(/\s+/) // split by spaces
      .map((key) => key.toLowerCase()); // lowercase for case-insensitive match

    try {
      const searchItem = await fetchWords(); // fetch data

      let searchData = searchItem.filter((data) =>
        searchKeysArray.some(
          (key) =>
            data.chinese === key || // exact match for Chinese
            data.english.toLowerCase() === key // exact match for English
        )
      );
      
      

      // Remove duplicates based on English word
      const uniqueSearchData = Array.from(
        new Map(
          searchData.map((item) => [item.english.toLowerCase(), item])
        ).values()
      );

      if (uniqueSearchData.length === 0) {
        alert("Your Search Data not found");
      } else {
        setSearchData(uniqueSearchData);
        setWordDisplay(!wordDisplay);
        document.body.style.overflowY = "hidden";
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  return (
    <div className="sticky bg-[rgb(19,31,36)] responsive_class  top-0">
      {wordDisplay && (
        <div className="bg-[#1f1e1e] fixed top-0 left-0 h-screen w-full set_zindex">
          <DisplayWord
            words={searchData}
            wordDisplay={wordDisplay}
            setWordDisplay={setWordDisplay}
            from="searchPart"
          />
        </div>
      )}
      <div className="py-5  relative">
        {searchShow ? (
          <div
            className={`w-full absolute top-0 left-0 h-full ${
              wordDisplay ? "-z-10" : "z-50"
            }`}
          >
            <div className="flex items-center h-full">
              <div className="flex gap-10 items-center justify-between w-full bg-[rgb(26,41,49)] rounded pl-5 pr-2 py-1">
                <input
                  type="text"
                  onChange={(e) => seatSearchKey(e.target.value)}
                  className="w-full outline-0 text-gray-200"
                  placeholder="Search with Chinese or English"
                />
                <div className="space-x-0.5 flex">
                  <button
                    onClick={handleSearch}
                    className="bg-[rgb(35,53,64)] h-[30px] w-[30px] md:w-[70px] flex items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-700 px-1 py-1"
                  >
                    <MdOutlineSearch />
                  </button>
                  <button
                    onClick={() => setSearchShow(!searchShow)}
                    className="bg-[rgb(35,53,64)] h-[30px] w-[30px] md:w-[70px] flex items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-700 px-1 py-1"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex items-center justify-between">
          <NavLink to="/">
            <div className="text-[20px]  text-yellow-300 rounded-full">
              Hanyuzen🌟
            </div>
          </NavLink>
          <div className="flex items-center justify-between space-x-3">
            <div
              onClick={() => setSearchShow(!searchShow)}
              className="  h-[35px] w-[35px] border-2 border-[#4f4d4d] hover:border-[#686868] rounded-full cursor-pointer flex items-center justify-center"
            >
              <MdSearch className="text-[#bebbbb] text-[20px]" />
            </div>
            <NavLink to="/progress">
              <div className="  h-[35px] w-[35px] border-2 border-[#4f4d4d] rounded-full hover:border-[#686868] cursor-pointer flex items-center justify-center">
                <GiProgression className="text-[#bebbbb] text-[15px]" />
              </div>
            </NavLink>
            <div
              onClick={() => handleLogout()}
              className=" h-[35px] w-[35px] border-2 border-[#4f4d4d] rounded-full hover:border-[#686868] cursor-pointer flex items-center justify-center"
            >
              <MdOutlineLogout className="text-[#bebbbb] text-[20px]" />
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}
