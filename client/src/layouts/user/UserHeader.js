import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";

export default function UserHeader({ groups, loggedIn, setLoggedIn }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <Navbar color="dark" dark expand="md" className="fix-header">
      <div className="hstack gap-2">
        <Button
          color="light"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </Button>
        <div className="d-lg-block d-none pe-3">
          <Link to="/">
            <img src="/logos/LogoWhiteMP.png" width="150px" alt="Home"></img>
          </Link>
        </div>
        <div className="d-lg-none d-flex gap-2">
          <Link
            to="/"
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
        </div>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to={`/products`} className="nav-link text-white">
              All Products
            </Link>
          </NavItem>
          {groups
            ? groups.map((group, index) => {
                // Check if the group has children (sub-groups)
                if (group.children && group.children.length > 0) {
                  return (
                    <UncontrolledDropdown inNavbar nav key={index}>
                      <DropdownToggle caret nav className="text-white">
                        {group.name}
                      </DropdownToggle>
                      <DropdownMenu end>
                        {group.children.map((subGroup, subIndex) => (
                          <Link
                            to={`group/${subGroup.id}`}
                            className="text-decoration-none"
                          >
                            <DropdownItem key={subIndex}>
                              {subGroup.name}
                            </DropdownItem>
                          </Link>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  );
                } else {
                  return (
                    <NavItem key={index}>
                      <Link
                        to={`group/${group.id}`}
                        className="nav-link text-white"
                      >
                        {group.name}
                      </Link>
                    </NavItem>
                  );
                }
              })
            : null}
        </Nav>
        <div className="d-flex gap-2">
          <Button
            color="light"
            onClick={() => {
              loggedIn ? navigate("/profile") : navigate("/login");
            }}
          >
            <i class="bi bi-person-circle"></i>
          </Button>
          <Button
            color="light"
            onClick={() => {
              loggedIn ? navigate("/cart") : navigate("/login");
            }}
          >
            <i class="bi bi-cart4"></i>
          </Button>
          <Button
            color="light"
            onClick={() => {
              loggedIn ? handleLogout() : navigate("/login");
            }}
          >
            {loggedIn ? "Log Out" : "Log In"}
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
}
