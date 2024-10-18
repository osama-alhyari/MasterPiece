import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  async function check() {
    const token = localStorage.getItem("token");
    try {
      await axios.get("http://127.0.0.1:8000/api/check/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      navigate("/login");
    }
  }

  useEffect(() => {
    check();
  }, []);
  return (
    <main>
      {/********header**********/}
      <AdminHeader />
      <div className="pageWrapper d-lg-flex">
        {/********Sidebar**********/}
        <aside className="sidebarArea shadow" id="sidebarArea">
          <AdminSidebar />
        </aside>
        {/********Content Area**********/}
        <div className="contentArea">
          {/********Middle Content**********/}
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
