import {
  Card,
  CardBody,
  CardTitle,
  Table,
  BreadcrumbItem,
  Breadcrumb,
  Badge,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Customization() {
  const [sliders, setSliders] = useState([]);

  const token = localStorage.getItem("token");

  async function fetchSliders() {
    const response = await axios.get("http://127.0.0.1:8000/api/sliders", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
        "Content-Type": "application/json", // Optional: if you're sending JSON data
      },
    });
    setSliders(response.data.sliders);
  }

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = (sliderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/sliders/${sliderId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
              "Content-Type": "application/json", // Optional: if you're sending JSON data
            },
          });
          setSliders(sliders.filter((slider) => slider.id !== sliderId)); // Update the UI
          Swal.fire("Deleted!", "Your slider has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was a problem deleting the slider.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={"/admin"}>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Sliders</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <CardBody>
            <CardTitle tag="h5">
              <i className="bi bi-images me-2"></i>Slider List
            </CardTitle>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Slider</th>
                  <th className="text-center">Groups</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders ? (
                  sliders.map((slider, index) => (
                    <tr key={index} className="border-top">
                      <td>
                        <div className="d-flex align-items-center p-2">
                          <img
                            src={`http://127.0.0.1:8000/slider_images/${slider.image}`}
                            className="rounded-circle"
                            alt="slider"
                            width="45"
                            height="45"
                          />
                        </div>
                      </td>
                      <td>{slider.name ? slider.name : "No name"}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center">
                          {slider.groups
                            ? slider.groups.map((group) => (
                                <Badge color="dark" className="ms-3" pill>
                                  {group.name}
                                </Badge>
                              ))
                            : "No groups"}
                        </div>
                      </td>
                      <td>
                        <div className="text-center d-flex flex-lg-row flex-column gap-1 justify-content-center align-items-center">
                          <Link to={`edit/${slider.id}`}>
                            <Button className="btn" color="primary">
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </Link>
                          <Link>
                            <Button
                              className="btn"
                              color="danger"
                              onClick={() => handleDelete(slider.id)} // Handle delete action
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Sliders Exist
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="d-flex justify-content-start justify-content-lg-end">
              <Link to={"create"}>
                <Button className="btn" color="success">
                  Add Slider
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
