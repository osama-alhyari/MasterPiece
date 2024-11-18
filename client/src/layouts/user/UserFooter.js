import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export default function UserFooter({ groups }) {
  return (
    <footer
      className="page-footer font-small blue pt-4"
      style={{ backgroundColor: "#343A40" }}
    >
      <div className="container-fluid text-left text-md-left sticky-bottom">
        <div className="row">
          <div className="col-md-6 mt-md-0 mt-3">
            <h5 className="text-uppercase text-white ">About Us</h5>
            <p className="text-white">
              Modern Appliances Kingdom The official distributor of Ajax
              security systems in Jordan, established in 2018 We provide you
              with the latest and best protection devices and automation systems
              Amman - Sweifieh Ali As-Sarayra Street - Building 24
            </p>
          </div>

          <hr className="clearfix w-100 d-md-none pb-0" />

          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="text-uppercase text-white">Groups</h5>
            <ul className="list-unstyled">
              {groups
                ? groups.map((group) => {
                    return (
                      <li>
                        <Link
                          to={`group/${group.id}`}
                          className="text-white text-decoration-underlined"
                        >
                          {group.name}
                        </Link>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>

          <div className="col-md-3 mb-md-0 mb-3">
            <h5 className="text-uppercase text-white">Links</h5>
            <div className="d-flex gap-2">
              <Link to={"https://www.instagram.com/makjosec"} target="blank">
                <Button color="light">
                  <i class="bi bi-instagram"></i>
                </Button>
              </Link>
              <Link to={"https://www.facebook.com/MAKJOSEC"} target="blank">
                <Button color="light">
                  <i class="bi bi-facebook"></i>
                </Button>
              </Link>

              <Link to={"https://www.youtube.com/@makjosec2546"} target="blank">
                <Button color="light">
                  <i class="bi bi-youtube"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="footer-copyright text-center py-1"
        style={{ color: "#888888" }}
      >
        © 2024 Copyright:
        <p>Modern Aplliances Kingdom</p>
      </div>
    </footer>
  );
}
