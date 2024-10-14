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
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL params
  const [groups, setGroups] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    groups: [], // Store selected groups as an array of group IDs
    image: null, // Store the file object for the image
    currentImage: "", // To store the current image URL
  });

  // Fetch groups on component load
  async function fetchGroups() {
    const response = await axios.get("http://127.0.0.1:8000/api/group");
    setGroups(response.data.Groups);
  }

  // Fetch product data by ID on component load
  async function fetchProduct() {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/adminproduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      const product = response.data.Product;
      setProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        groups: product.groups.map((group) => group.id), // Set the selected groups
        currentImage: product.image, // Store the current image URL
      });
    } catch (error) {
      console.error("Error fetching product", error);
    }
  }

  useEffect(() => {
    fetchGroups();
    fetchProduct();
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

    // Check if productData is populated correctly
    // console.log("Product Data:", productData);

    const token = localStorage.getItem("token");

    // Create a FormData object to handle file upload and form fields
    const formDataa = new FormData();
    formDataa.append("name", productData.name);
    formDataa.append("description", productData.description);
    formDataa.append("price", productData.price);
    formDataa.append("_method", "PUT");

    // Append selected groups as multiple values
    productData.groups.forEach((groupId) => {
      formDataa.append("groups[]", groupId); // Sending group IDs as an array
    });

    // Append image only if a new file is selected
    if (productData.image) {
      formDataa.append("image", productData.image); // Append the new image file
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/product/${id}`,
        formDataa,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file upload
          },
        }
      );
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product", error);
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
          <BreadcrumbItem active>Edit Product</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Edit Product
          </CardTitle>
          <CardBody>
            <Label for="image">Product Image</Label>
            {/* Display the current product image */}
            {productData.currentImage && (
              <div className="mb-3">
                <img
                  src={`http://127.0.0.1:8000/product_images/${productData.currentImage}`}
                  alt="Product"
                  style={{ width: "150px", height: "auto" }}
                />
              </div>
            )}
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
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <FormText>
                  Upload a new cover image for this product (optional).
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
