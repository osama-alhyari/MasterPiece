import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserLayout() {
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
      <UserHeader groups={groups} />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}

        {/********Content Area**********/}
        <div className="contentArea">
          {/********Middle Content**********/}
          <Container className="p-4" style={{ backgroundColor: "black" }} fluid>
            <Outlet />
          </Container>
          <UserFooter groups={groups} />
        </div>
      </div>
    </main>
  );
}
