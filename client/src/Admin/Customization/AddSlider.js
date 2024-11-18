import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  FormText,
  Alert,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddSlider() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [sliderData, setSliderData] = useState({
    group_id: null, // Store selected group ID
    product_id: null, // Store selected product ID
    image: null, // Store the file object for the slider image
  });

  const token = localStorage.getItem("token");

  // Fetch groups and products on component load
  async function fetchGroupsAndProducts() {
    try {
      const groupResponse = await axios.get("http://127.0.0.1:8000/api/group", {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header with the token
        },
      });
      const productResponse = await axios.get(
        "http://127.0.0.1:8000/api/adminproduct", // Adjust this endpoint to match your API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(groupResponse.data.Groups);
      setProducts(productResponse.data.Products);
    } catch (error) {
      console.error("Error fetching groups or products", error);
      if (error.response && error.response.status === 403) {
        Swal.fire(
          "Unauthorized",
          "You do not have permission to access this resource.",
          "error"
        );
        navigate("/admin"); // Redirect to dashboard or appropriate page
      }
    }
  }

  useEffect(() => {
    fetchGroupsAndProducts();
  }, []);

  // Handle group selection, clear product if a group is selected
  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    setSliderData({
      ...sliderData,
      group_id: groupId,
      product_id: null, // Clear product when group is selected
    });
  };

  // Handle product selection, clear group if a product is selected
  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSliderData({
      ...sliderData,
      product_id: productId,
      group_id: null, // Clear group when product is selected
    });
  };

  // Handle file input change for the slider image
  const handleFileChange = (e) => {
    setSliderData({ ...sliderData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload and form fields
    const formData = new FormData();
    if (sliderData.group_id) {
      formData.append("group_id", sliderData.group_id); // Send group_id if selected
    }
    if (sliderData.product_id) {
      formData.append("product_id", sliderData.product_id); // Send product_id if selected
    }
    formData.append("image", sliderData.image); // Append the image file

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/sliders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure that the user is authenticated
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file upload
          },
        }
      );
      navigate("/admin/customization");
    } catch (error) {
      console.error("Error creating slider", error);
    }
  };

  return (
    <div className="container-fluid">
      <Col lg="12">
        {/* Breadcrumb outside the Card */}
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/admin">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/admin/customization">Sliders</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Slider</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Create New Slider
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              {/* Message to guide the user */}
              <Alert color="info">
                You can either choose a product or a group, but not both.
              </Alert>

              {/* Group dropdown */}
              <FormGroup>
                <Label for="group">Select Group</Label>
                <Input
                  type="select"
                  name="group"
                  id="group"
                  value={sliderData.group_id || ""}
                  onChange={handleGroupChange}
                >
                  <option value="">Select a Group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              {/* Product dropdown */}
              <FormGroup>
                <Label for="product">Select Product</Label>
                <Input
                  type="select"
                  name="product"
                  id="product"
                  value={sliderData.product_id || ""}
                  onChange={handleProductChange}
                >
                  <option value="">Select a Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              {/* Image upload */}
              <FormGroup>
                <Label for="image">Slider Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <FormText>*Upload an image for this slider.</FormText>
              </FormGroup>

              <Button color="success" type="submit">
                Add Slider
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
