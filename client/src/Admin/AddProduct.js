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
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    groups: [], // Store selected groups as an array of group IDs
    image: null, // Store the file object for the image
  });
  const token = localStorage.getItem("token");

  // Fetch groups on component load
  async function fetchGroups() {
    const response = await axios.get("http://127.0.0.1:8000/api/group", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
        "Content-Type": "application/json", // Optional: if you're sending JSON data
      },
    });
    setGroups(response.data.Groups);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle text input changes (e.g., name, description)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle checkbox change for groups
  const handleGroupChange = (e) => {
    const groupId = parseInt(e.target.value);
    const selectedGroups = productData.groups;

    // If the group is already selected, remove it; otherwise, add it
    if (selectedGroups.includes(groupId)) {
      setProductData({
        ...productData,
        groups: selectedGroups.filter((id) => id !== groupId),
      });
    } else {
      setProductData({
        ...productData,
        groups: [...selectedGroups, groupId],
      });
    }
  };

  // Handle file input change for the product image
  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload and form fields
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("image", productData.image); // Append the image file

    // Append selected groups as multiple values
    productData.groups.forEach((groupId) => {
      formData.append("groups[]", groupId); // Sending group IDs as an array
    });

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file upload
          },
        }
      );
      navigate(`/admin/products/edit/${response.data.product_id}`);
    } catch (error) {
      console.error("Error creating product", error);
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
            <Link to="/admin/products">Products</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Product</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Create New Product
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Product Name"
                  type="text"
                  value={productData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter Product Description"
                  type="text"
                  value={productData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="Enter Product Price"
                  type="number"
                  value={productData.price}
                  onChange={handleInputChange}
                />
              </FormGroup>

              {/* Group checkboxes */}
              {groups.map((group) => {
                return (
                  <FormGroup check key={group.id}>
                    <Input
                      type="checkbox"
                      name="groups[]"
                      value={group.id}
                      checked={productData.groups.includes(group.id)}
                      onChange={handleGroupChange}
                    />
                    <Label check>{group.name}</Label>
                  </FormGroup>
                );
              })}

              {/* Image upload */}
              <FormGroup>
                <Label for="image">Product Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <FormText>*Upload a cover image for this product.</FormText>
              </FormGroup>

              <Button color="success" type="submit">
                Add Product
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
