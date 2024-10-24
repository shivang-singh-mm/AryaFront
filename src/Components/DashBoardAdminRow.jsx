import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { removeAdmin } from "../Store/adminSlice";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

function DashBoardAdminRow({ admin }) {

    const location = useLocation();
    const dispatch = useDispatch();

    const handleRemove = (e) => {
        e.preventDefault();
        const email = {
            email: admin.email
        };
        const payload = dispatch(removeAdmin(email)).unwrap();
        window.location.reload()
    }

    return (
        <div className="md:flex w-full text-center py-9 md:justify-center content-center items-center border-b-2 border-black">
            <div className="basis-1/4 mb-3">
                <h2 className="text-[20px]">{admin?.email}</h2>
            </div>
            <div className="basis-1/4 mb-3">
                <h2 className="text-[20px]">{admin?.name}</h2>
            </div>
            {/* <div className="basis-1/6 mb-3">
          <h2 className="text-l">{formatDate(order.check_in)}</h2>
        </div>
        <div className="basis-1/6 mb-3">
          <h2 className="text-l">{formatDate(order.check_out)}</h2>
        </div> */}
            <div className="basis-1/6 mb-3">
                <button
                    className="block bg-[#F79489] text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border" onClick={handleRemove}
                >
                    Remove Admin
                </button>
            </div>
        </div>
    );
}

export default DashBoardAdminRow;