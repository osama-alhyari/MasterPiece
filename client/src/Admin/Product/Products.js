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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [render, setRender] = useState(0);

  const token = localStorage.getItem("token");

  async function changeProductAvailability(id, availability, index) {
    if (availability === 1) {
      await axios.patch(
        `http://127.0.0.1:8000/api/hide/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
            "Content-Type": "application/json", // Optional: if you're sending JSON data
          },
        }
      );
      const newProducts = products;
      newProducts[index].is_available = 0;
      setProducts(newProducts);
    } else {
      await axios.patch(
        `http://127.0.0.1:8000/api/show/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
            "Content-Type": "application/json", // Optional: if you're sending JSON data
          },
        }
      );
      const newProducts = products;
      newProducts[index].is_available = 1;
      setProducts(newProducts);
    }
    setRender(render + 1);
  }

  async function fetchProducts() {
    const response = await axios.get("http://127.0.0.1:8000/api/adminproduct", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
        "Content-Type": "application/json", // Optional: if you're sending JSON data
      },
    });
    setProducts(response.data.Products);
  }

  useEffect(() => {
    fetchProducts();
  }, [render]);

  const handleDelete = (productId) => {
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
          await axios.delete(`http://127.0.0.1:8000/api/product/${productId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
              "Content-Type": "application/json", // Optional: if you're sending JSON data
            },
          });
          setProducts(products.filter((product) => product.id !== productId)); // Update the UI
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was a problem deleting the product.",
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
          <BreadcrumbItem active>Products</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <CardBody>
            <CardTitle tag="h5" className="d-flex justify-content-between">
              <span>
                <i className="bi bi-bag-fill me-2"> </i>Product List
              </span>
              <div className="d-flex justify-content-end">
                <Link to={"create"}>
                  <Button className="btn" color="success">
                    Add Product
                  </Button>
                </Link>
              </div>
            </CardTitle>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th className="text-center">Groups</th>
                  <th>Price</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  ? products.map((product, index) => (
                      <tr key={index} className="border-top">
                        <td>
                          <div className="d-flex align-items-center p-2">
                            <img
                              src={`http://127.0.0.1:8000/product_images/${product.image}`}
                              className="rounded-circle"
                              alt="avatar"
                              width="45"
                              height="45"
                            />
                          </div>
                        </td>
                        <td>{product.name}</td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            {product.groups.map((group) => {
                              return (
                                <Badge color="dark" className="ms-3" pill>
                                  {group.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </td>
                        <td>{product.price} JOD</td>
                        <td className="text-center">
                          <FormGroup switch>
                            <Input
                              className="float-none"
                              type="switch"
                              checked={product.is_available === 1}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                changeProductAvailability(
                                  product.id,
                                  product.is_available,
                                  index
                                );
                              }}
                            />
                          </FormGroup>
                        </td>
                        <td>
                          <div className="text-center d-flex flex-lg-row flex-column gap-1 justify-content-center align-items-center">
                            <Link to={`edit/${product.id}`}>
                              <Button className="btn" color="primary">
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </Link>
                            <Link>
                              <Button
                                className="btn"
                                color="danger"
                                onClick={() => handleDelete(product.id)} // Handle delete action
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  : "No Products Exist"}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
