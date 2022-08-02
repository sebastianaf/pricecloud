import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faBars, faUser } from "@fortawesome/free-solid-svg-icons";

import "../styles/index.css";
import logo from "../assets/img/logo.png";

const Practice = () => {
  const [open, setOpen] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(false);

  return (
    <>
      <div
        className={`${
          !hideSidebar && `hidden`
        } fixed top-0 left-0 w-screen h-screen bg-slate-900/75 backdrop-blur-2lg cursor-pointer`}
        onClick={() => {
          setHideSidebar(!hideSidebar);
        }}
      ></div>
      <div class={`flex flex-row`}>
        <div
          className={`${open ? `w-[270px]` : `w-[70px]`} ${
            !hideSidebar && `hidden`
          } md:flex flex-col flex-none z-10 bg-slate-700 h-screen transition-[width] duration-500`}
        >
          <div
            className={`p-4 bg-slate-900 h-auto duration-500 cursor-pointer`}
          >
            <div className={`flex flex-col items-center justify-center`}>
              <img src={logo} alt={`logo`} className={`max-h-[100px]`} />
              <div
                className={`${
                  !open && `m-[-14px] opacity-0 scale-0`
                } text-slate-100 font-semibold text-xl whitespace-nowrap duration-500`}
              >
                generic-front
              </div>
            </div>
          </div>
          <div className={`grow p-4 bg-slate-700 text-white overflow-x-hidden overflow-y-auto`}></div>
          <div
            className={`cursor-pointer hidden justify-end md:flex  items-center bg-slate-900 hover:bg-slate-800 duration-500 min-h-[50px]`}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <FontAwesomeIcon
              icon={faAngleLeft}
              className={`icon
            ${
              !open && `rotate-180`
            } mx-auto hover:text-slate-400 text-slate-100 duration-500`}
            />
          </div>
        </div>
        <div className={`grow flex flex-col h-screen bg-white w-full`}>
          <div className={`flex justify-between items-center p-2 bg-slate-300 h-[70px] shadow-lg`}>
            <FontAwesomeIcon
              icon={faBars}
              className={`icon cursor-pointer mx-2 md:invisible`}
              onClick={() => {
                setHideSidebar(!hideSidebar);
              }}
            />
            <div className={`flex justify-center items-center`}>
              <div className={`flex flex-col items-end justify-center whitespace-nowrap`}>
                <div className={`m-0 text-left font-semibold`}>generic-user</div>
                <div className={`mt-[-5px] text-sm text-left`}>user-rol</div>
              </div>
              <div className={`w-[32px] h-[32px] mx-2 rounded-full border overflow-hidden flex justify-center items-center`}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={`w-[24px] h-[24px] text-slate-500`}
                />
              </div>
            </div>
          </div>
          <div className={`overflow-x-hidden overflow-y-auto`}></div>
        </div>
      </div>
    </>
  );
};

export default Practice;
