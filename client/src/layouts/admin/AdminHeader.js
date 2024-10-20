import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  function handleLogout() {
    localStorage.clear();
    navigate("/user/home");
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  return (
    <Navbar color="secondary" dark expand="md" className="fix-header">
      <div className="d-flex justify-content-between w-100">
        <div className="d-lg-block d-none pe-3">
          <Link to="/admin">
            <img src="/logos/LogoWhiteMP.png" width="150px" alt="Home"></img>
          </Link>
        </div>
        <div className="d-lg-none d-flex gap-2">
          <Link
            to="/admin"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/logos/LogoWhiteSmallMP.png"
              width="75px"
              className="p-auto"
              alt="Mobile Home"
            ></img>
          </Link>
          <Button color="secondary" onClick={() => showMobilemenu()}>
            <i className="bi bi-list"></i>
          </Button>
        </div>
        <Nav className="ms-auto" navbar></Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="transparent">
            <img
              src="/user4.jpg"
              alt="profile"
              className="rounded-circle"
              width="30"
            ></img>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                navigate("/admin/profile");
              }}
            >
              My Account
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default AdminHeader;
