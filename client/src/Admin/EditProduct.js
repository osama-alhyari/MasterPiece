import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditVariant from "./EditVariant";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL params
  const [groups, setGroups] = useState([]);
  const [breadcrumbName, setBreadcrumbName] = useState("");
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
      setBreadcrumbName(product.name);
      setProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        groups: product.groups.map((group) => group.id), // Set the selected groups
        currentImage: product.image,
        variants: product.variants, // Store the current image URL
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
    const file = e.target.files[0];

    // Update the state with the new image file
    setProductData({
      ...productData,
      image: file,
      currentImage: URL.createObjectURL(file), // Update the current image preview
    });
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
      Swal.fire({
        title: "Product Saved!",
        text: "Press OK To Continue",
        icon: "success",
      });
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
          <BreadcrumbItem active>{breadcrumbName}</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Edit Product
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <Label for="image">Product Image</Label>

                  <div className="mb-3">
                    {productData.image ? (
                      <img
                        src={productData.currentImage}
                        alt="Product"
                        style={{ width: "150px", height: "auto" }}
                      />
                    ) : (
                      <img
                        src={`http://127.0.0.1:8000/product_images/${productData.currentImage}`}
                        alt="Product"
                        style={{ width: "150px", height: "auto" }}
                      />
                    )}
                  </div>
                </div>
                <div>
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
                </div>
                <div>
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
                  <Label for="groups">Groups:</Label>
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
                </div>
              </div>

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
                Save Product
              </Button>
            </Form>
          </CardBody>
        </Card>

        {productData.variants ? (
          <>
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                Product Variants
              </CardTitle>
            </Card>
            {productData.variants.map((variant) => {
              return <EditVariant variant={variant} />;
            })}
          </>
        ) : null}

        <Outlet />
        <div className="d-flex justify-content-start justify-content-lg-end">
          <Link to={"addvariant"}>
            <Button color="success" type="submit">
              Add Variant
            </Button>
          </Link>
        </div>
      </Col>
    </div>
  );
}
