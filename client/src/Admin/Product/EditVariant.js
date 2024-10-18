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
  FormText,
} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditVariant({ variant }) {
  const [variantData, setVariantData] = useState({
    name: variant.name,
    sku: variant.sku,
    stock: variant.stock,
    images: variant.images, // Initial images from the variant
  });

  const [newImages, setNewImages] = useState([]); // New images uploaded by the user
  const [deletedImageIds, setDeletedImageIds] = useState([]); // To store IDs of deleted images
  const [coverImage, setCoverImage] = useState({
    type: variant.images.some((img) => img.is_variant_cover === 1)
      ? "existing"
      : "new", // Set type to "existing" if a cover exists, otherwise "new"
    value: variant.images.find((img) => img.is_variant_cover === 1)?.id || null, // Use null if no cover image exists
  });

  const onRadioBtnClick = (type, id) => {
    setCoverImage({ type, value: id });
  };

  // Handle input changes for variant fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVariantData({ ...variantData, [name]: value });
  };

  // Handle file input for new images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevImages) => [...prevImages, ...files]);

    // Automatically set the first new image as the cover if no cover is selected yet
    if (!coverImage.value && newImages.length === 0) {
      setCoverImage({ type: "new", value: 0 }); // First new image
    }
  };

  // Handle image deletion
  const handleImageDelete = (index, imageId = null) => {
    if (imageId) {
      setDeletedImageIds([...deletedImageIds, imageId]); // Add image ID to deleted images
    }

    // Remove the image from the list
    const updatedImages = [...variantData.images];
    updatedImages.splice(index, 1);
    setVariantData({ ...variantData, images: updatedImages });

    // If the deleted image is the cover, set the first available image as the new cover
    if (coverImage.type === "existing" && coverImage.value === imageId) {
      if (updatedImages.length > 0) {
        setCoverImage({ type: "existing", value: updatedImages[0].id });
      } else if (newImages.length > 0) {
        setCoverImage({ type: "new", value: 0 }); // First new image
      }
    }
  };

  // Handle new image deletion (before upload)
  const handleNewImageDelete = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);

    // If the deleted new image is the cover, set the first available image as the new cover
    if (coverImage.type === "new" && coverImage.value === index) {
      if (updatedNewImages.length > 0) {
        setCoverImage({ type: "new", value: 0 }); // First new image
      } else if (variantData.images.length > 0) {
        setCoverImage({ type: "existing", value: variantData.images[0].id });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Create a FormData object to send the variant data and images
    const formData = new FormData();
    formData.append("name", variantData.name);
    formData.append("_method", "PUT");
    formData.append("sku", variantData.sku);
    formData.append("stock", variantData.stock);

    // Handle cover image (either send cover_id or cover_index)
    if (coverImage.type === "existing" && coverImage.value !== null) {
      formData.append("cover_id", coverImage.value); // Send cover_id if it's an existing image and has a valid ID
    } else if (coverImage.type === "new" && coverImage.value !== null) {
      formData.append("cover_index", coverImage.value); // Send cover_index if it's a new image and has a valid index
    }

    deletedImageIds.forEach((id) => {
      formData.append("deleted_images_ids[]", id); // Properly append each deleted image ID
    }); // Send deleted images' IDs

    // Append new images to FormData
    newImages.forEach((image, index) => {
      formData.append(`images[]`, image);
    });

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/variant/${variant.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //   console.log(response.data.req);

      Swal.fire({
        title: "Variant Updated!",
        text: "Press OK To Continue",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating variant", error);
    }
  };

  return (
    <>
      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          Edit Variant
        </CardTitle>
        <CardBody>
          <Form onSubmit={handleSubmit}>
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

            {/* Existing Images Preview */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {variant.images.length > 0 ? (
                  <Label>Existing Images</Label>
                ) : null}
                <div className="d-flex flex-wrap gap-2">
                  {variantData.images.map((image, index) => (
                    <div key={image.id} className="d-flex flex-column gap-1">
                      <img
                        src={`http://127.0.0.1:8000/product_images/${image.name}`}
                        alt={`Existing ${image.name}`}
                        style={{
                          height: "150px",
                          border: "1px solid black",
                          maxWidth: "250px",
                        }}
                      />
                      <FormGroup check className="p-0">
                        <Button
                          size="sm"
                          block
                          color="primary"
                          onClick={() => onRadioBtnClick("existing", image.id)} // Set as cover
                          active={
                            coverImage.type === "existing" &&
                            coverImage.value === image.id
                          }
                        >
                          {coverImage.type === "existing" &&
                          coverImage.value === image.id
                            ? "Cover"
                            : "Set as Cover"}
                        </Button>
                      </FormGroup>
                      <Button
                        block
                        color="danger"
                        size="sm"
                        onClick={() => handleImageDelete(index, image.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* New Images Preview */}
              <div>
                {newImages.length > 0 ? <Label>New Images</Label> : null}
                <div className="d-flex flex-wrap gap-2">
                  {newImages.map((image, index) => (
                    <div key={index} className="d-flex flex-column gap-1">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index}`}
                        style={{
                          height: "150px",
                          maxWidth: "250px",
                          border: "1px solid black",
                        }}
                      />

                      <FormGroup check className="p-0">
                        <Button
                          size="sm"
                          block
                          color="primary"
                          onClick={() => onRadioBtnClick("new", index)} // Set as cover
                          active={
                            coverImage.type === "new" &&
                            coverImage.value === index
                          }
                        >
                          {coverImage.type === "new" &&
                          coverImage.value === index
                            ? "Cover"
                            : "Set as Cover"}
                        </Button>
                      </FormGroup>
                      <Button
                        block
                        color="danger"
                        size="sm"
                        onClick={() => handleNewImageDelete(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <FormGroup>
              <Label for="new_images">Upload New Images</Label>
              <Input
                id="new_images"
                name="new_images"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <FormText>Upload new images for this variant.</FormText>
            </FormGroup>

            <Button color="success" type="submit">
              Save Changes
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  );
}
