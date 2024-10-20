import React, { useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddVariant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [variantData, setVariantData] = useState({
    name: "",
    sku: "",
    stock: "",
  });
  const [images, setImages] = useState([]); // For storing multiple image files
  const [coverIndex, setCoverIndex] = useState(0); // Index for the cover image
  const [imagePreviews, setImagePreviews] = useState([]); // To store image previews

  // Handle text input changes (e.g., name, sku, stock)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVariantData({ ...variantData, [name]: value });
  };

  // Handle multiple file input change and generate image previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setImages(files);

    // Generate image preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Create a FormData object to handle file upload and form fields
    const formData = new FormData();
    formData.append("name", variantData.name);
    formData.append("sku", variantData.sku);
    formData.append("stock", variantData.stock);
    formData.append("product_id", id); // Append the product ID
    formData.append("cover_index", coverIndex); // Append the cover image index

    // Append images to FormData
    images.forEach((image, index) => {
      formData.append("images[]", image); // Append each image
    });

    try {
      await axios.post(`http://127.0.0.1:8000/api/variant`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file upload
        },
      });

      Swal.fire({
        title: "Variant Added!",
        text: "Press OK To Continue",
        icon: "success",
      }).then(() => {
        navigate(`/admin/products/edit/${id}`); // Navigate to the product page after pressing OK
      }); // Redirect to the product page after success
    } catch (error) {
      console.error("Error creating variant", error);
    }
  };

  return (
    <>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Add A Variant To This Product
        </CardTitle>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <FormGroup>
                <Label for="name">Variant Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Variant Name"
                  type="text"
                  value={variantData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="sku">Stock Keeping Unit (SKU)</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="Enter Variant SKU"
                  type="text"
                  value={variantData.sku}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  placeholder="Enter Variant Stock"
                  type="number"
                  value={variantData.stock}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            {/* Image upload */}
            <FormGroup>
              <Label for="images">Variant Images</Label>
              <Input
                accept="image/*"
                id="images"
                name="images"
                type="file"
                multiple
                onChange={handleFileChange} // Handle multiple file upload
              />
              <FormText>*Upload multiple images for this variant.</FormText>
            </FormGroup>

            {/* Display image previews with radio buttons for cover selection */}
            {imagePreviews.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="border">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{ height: "150px" }}
                    />
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="radio"
                          name="cover"
                          checked={coverIndex === index} // Check the selected cover image
                          onChange={() => setCoverIndex(index)} // Set the cover index
                        />
                        Set as Cover
                      </Label>
                    </FormGroup>
                  </div>
                ))}
              </div>
            )}

            <Button color="success" type="submit">
              Save Variant
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
