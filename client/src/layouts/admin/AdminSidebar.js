import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    href: "starter",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Alert",
    href: "alerts",
    icon: "bi bi-bell",
  },
  {
    title: "Badges",
    href: "badges",
    icon: "bi bi-patch-check",
  },
  {
    title: "Buttons",
    href: "buttons",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Cards",
    href: "cards",
    icon: "bi bi-card-text",
  },
  {
    title: "Grid",
    href: "grid",
    icon: "bi bi-columns",
  },
  {
    title: "Table",
    href: "table",
    icon: "bi bi-layout-split",
  },
  {
    title: "Forms",
    href: "forms",
    icon: "bi bi-textarea-resize",
  },
  {
    title: "Breadcrumbs",
    href: "breadcrumbs",
    icon: "bi bi-link",
  },
  {
    title: "About",
    href: "about",
    icon: "bi bi-people",
  },
];

const AdminSidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div className="profilebg">
        <div className="p-3 d-flex d-lg-none">
          <Button
            className="ms-auto text-white d-lg-none"
            color="secondary"
            size="lg"
            block
            onClick={() => showMobilemenu()}
          >
            Close Menu
          </Button>
        </div>
      </div>
      <div className="p-3 mt-2">
        <Nav vertical>
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === `/admin/${navi.href}`
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
          <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://wrappixel.com/templates/materialpro-react-admin/?ref=33"
          >
            Upgrade To Pro
          </Button>
        </Nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
