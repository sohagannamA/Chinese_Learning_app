import React from "react";

export default function MessageBox(props) {
  const { resetObject } = props;
  const { icon, message, handleResetProgress, handleClose,hskLevel } = resetObject;

  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-[#00000090]">
      <div className="flex items-center justify-center h-full">
        <div className="px-5 py-5 mx-5 bg-[#706d6d] rounded">
          <div>
            <p className="text-[yellow] flex items-center justify-center text-2xl">
              {icon}
            </p>
            <p className="text-center text-[#ffffff] text-xl mt-2">{message}</p>
            <div className="mt-3 text-center space-x-2">
              <button
                onClick={handleClose}
                className="bg-[#7b0e0e] px-5 py-1 text-[#e4e1e1] rounded hover:bg-[#670707] cursor-pointer"
              >
                Cencel
              </button>

              <button
                onClick={handleResetProgress}
                className="bg-[#2f4d0d] px-5 py-1 text-[#e4e1e1] rounded hover:bg-[#28321d] cursor-pointer"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
