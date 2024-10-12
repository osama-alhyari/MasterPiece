import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
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