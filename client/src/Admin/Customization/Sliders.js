import {
  Card,
  CardBody,
  CardTitle,
  Table,
  BreadcrumbItem,
  Breadcrumb,
  Badge,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Sliders() {
  const [sliders, setSliders] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch sliders with error handling
  async function fetchSliders() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/sliders", {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
        },
      });
      setSliders(response.data.Sliders);
    } catch (error) {
      console.error("Error fetching sliders", error);
      Swal.fire("Error", "Unable to fetch sliders.", "error");
    }
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
            <CardTitle tag="h5" className="d-flex justify-content-between">
              <span>
                <i className="bi bi-images me-2"></i>Slider List
              </span>
              <Link to={"create"}>
                <Button className="btn" color="success">
                  Add Slider
                </Button>
              </Link>
            </CardTitle>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Slider</th>
                  <th className="text-center">Redirecting</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders?.length > 0 ? (
                  sliders.map((slider, index) => (
                    <tr key={index} className="border-top">
                      <td>
                        <div className="d-flex align-items-center p-2">
                          <img
                            src={`http://127.0.0.1:8000/slider_images/${slider.name}`}
                            className="rounded-circle"
                            alt="slider"
                            width="100px"
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        {slider?.group
                          ? slider.group.name
                          : slider.product.name}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`edit/${slider.id}`}>
                            <Button className="btn" color="primary">
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </Link>
                          <Button
                            className="btn"
                            color="danger"
                            onClick={() => handleDelete(slider.id)} // Handle delete action
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </Button>
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
          </CardBody>
        </Card>
      </div>
    </>
  );
}
