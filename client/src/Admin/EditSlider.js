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
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditSlider() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get slider ID from URL params
  const [groups, setGroups] = useState([]);
  const [products, setProducts] = useState([]);
  const [sliderData, setSliderData] = useState({
    group_id: null, // Store selected group ID
    product_id: null, // Store selected product ID
    image: null, // Store the file object for the slider image
    currentImage: "", // Store current image URL
  });

  const token = localStorage.getItem("token");

  // Fetch groups, products, and slider data on component load
  async function fetchGroupsProductsAndSlider() {
    try {
      const groupResponse = await axios.get("http://127.0.0.1:8000/api/group", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productResponse = await axios.get(
        "http://127.0.0.1:8000/api/adminproduct",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sliderResponse = await axios.get(
        `http://127.0.0.1:8000/api/sliders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGroups(groupResponse.data.Groups);
      setProducts(productResponse.data.Products);
      setSliderData({
        group_id: sliderResponse.data.Slider.group_id,
        product_id: sliderResponse.data.Slider.product_id,
        currentImage: sliderResponse.data.Slider.name, // Store current image URL
        image: null, // Initially no new image
      });
    } catch (error) {
      console.error("Error fetching groups, products, or slider", error);
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
    fetchGroupsProductsAndSlider();
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
    if (sliderData.image) {
      formData.append("image", sliderData.image); // Append new image if selected
    }
    formData.append("_method", "PUT"); // Laravel requires PUT for update

    try {
      await axios.post(`http://127.0.0.1:8000/api/sliders/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/customization");
    } catch (error) {
      console.error("Error updating slider", error);
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
          <BreadcrumbItem active>Edit Slider</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Edit Slider
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              {/* Message to guide the user */}
              <Alert color="info">
                You can either choose a product or a group, but not both.
              </Alert>

              {/* Display current slider image */}
              {sliderData.currentImage && (
                <div className="mb-3">
                  <img
                    src={`http://127.0.0.1:8000/slider_images/${sliderData.currentImage}`}
                    alt="Slider"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}

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
                <Label for="image">Upload New Slider Image (optional)</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <FormText>
                  *Upload a new image to replace the existing one.
                </FormText>
              </FormGroup>

              <Button color="success" type="submit">
                Save Changes
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
