import React from "react";
import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../Resources/logo.png";

const DashBoardNavbar = () => {
  return (
    <div className="px-10">
      <Navbar fluid rounded>
        <Navbar.Brand href="/">
          <img src={logo} className="mr-3 h-9 sm:h-9" alt="Aarya Stays Logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="/dashboard/order" className="text-lg">
            Orders
          </Navbar.Link>
          <Navbar.Link href="/dashboard/property" className="text-lg">
            Properties
          </Navbar.Link>
          <Navbar.Link href="/dashboard/amenity" className="text-lg">
            Amenity
          </Navbar.Link>
          <Navbar.Link href="/dashboard/card" className="text-lg">
            Cards
          </Navbar.Link>
          <Navbar.Link href="/dashboard/faq" className="text-lg">
            Faq
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default DashBoardNavbar;
