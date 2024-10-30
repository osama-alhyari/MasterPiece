import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
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
  }, [loggedIn]);

  const [groups, setGroups] = useState([]);
  async function fetchGroups() {
    const response = await axios.get("http://127.0.0.1:8000/api/user/group");
    setGroups(response.data.Groups);
    console.log(response.data);
  }
  useEffect(() => {
    fetchGroups();
  }, []);
  return (
    <main>
      {/********header**********/}
      <UserHeader
        groups={groups}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
      <Container
        className="p-4"
        style={{ backgroundColor: "black", minHeight: "49vh" }}
        fluid
      >
        <Outlet context={[loggedIn]} />
      </Container>
      <UserFooter groups={groups} />
    </main>
  );
}
