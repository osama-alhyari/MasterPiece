import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function UserHeader({ groups }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };

  async function check() {
    try {
      const token = localStorage.getItem("token");
      await axios.get("http://127.0.0.1:8000/api/check/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedIn(true);
    } catch (e) {
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    check();
  }, []);

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
          <Link to="/user">
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
        </div>
      </div>

      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
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
          <Button color="light">
            <i class="bi bi-person-circle"></i>
          </Button>
          <Button color="light">
            <i class="bi bi-cart4"></i>
          </Button>
          <Button color="light">{loggedIn ? "Logout" : "Log In"}</Button>
        </div>
      </Collapse>
    </Navbar>
  );
}
