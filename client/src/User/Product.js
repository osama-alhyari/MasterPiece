import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { Button, InputGroup, Input } from "reactstrap";
import Swal from "sweetalert2";
import "./ProductPage.css"; // Create a CSS file for custom styling

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const [loggedIn] = useOutletContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  async function fetchProduct() {
    const response = await axios.get(`http://127.0.0.1:8000/api/product/${id}`);
    const productData = response.data.Product;
    setProduct(productData);
    setSelectedVariant(productData.variants[0]); // Set initial variant
    setSelectedImage(
      productData.variants[0].images.find((img) => img.is_variant_cover === 1)
    ); // Set the initial large image
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedImage(
      variant.images.find((img) => img.is_variant_cover === 1) ||
        variant.images[0]
    ); // Set the cover image or the first image as the default large image
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Update the large image when clicked
  };

  // Function to handle quantity change
  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  async function handleAddToCart() {
    // Logic to add to cart (you can modify this part to integrate with your cart system)
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/addItem/${selectedVariant.id}`,
        { quantity: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Item Added To Cart!",
        text: "Press OK To Continue",
        icon: "success",
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="row">
          {/* Left Column: Product Info */}
          <div className="col-md-6 product-info">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="text-white">{product.name}</h1>
              <h2 style={{ color: "#ff5252" }}>{product.price} JOD</h2>
            </div>
            <p>{product.description}</p>
          </div>

          {/* Right Column: Images and Variant Selection */}
          <div className="col-md-6 product-images">
            {selectedImage && (
              <div className="main-image max-h-50">
                <img
                  src={`http://127.0.0.1:8000/product_images/${selectedImage?.name}`}
                  alt="Main Variant"
                  className=""
                />
              </div>
            )}

            {/* Thumbnails */}
            <div className="thumbnail-gallery mt-3">
              {selectedVariant?.images.map((image) => (
                <div
                  className="thumbnail-container me-2"
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={`http://127.0.0.1:8000/product_images/${image.name}`}
                    alt={image.name}
                    className="thumbnail-image"
                    style={{ cursor: "pointer", margin: "5px" }}
                  />
                </div>
              ))}
            </div>

            {/* Variant/Color Selection */}
            <div className="color-selection mt-4">
              <h5>Select a variant:</h5>
              {product.variants?.map((variant) => (
                <Button
                  key={variant.id}
                  color="light"
                  outline={selectedVariant.id !== variant.id}
                  onClick={() => handleVariantChange(variant)}
                  className="m-1"
                >
                  {variant.name.charAt(0).toUpperCase() + variant.name.slice(1)}
                </Button>
              ))}
            </div>

            {/* Quantity Input with Increase/Decrease Buttons */}
          </div>
        </div>
        <div className="col-4-md d-flex justify-content-center align-items-center flex-column">
          <div className="mt-4 d-flex align-items-center flex-column">
            <h5>Quantity:</h5>
            <InputGroup style={{ width: "50%" }} className="quantity-input">
              <Button
                color="light"
                onClick={() => handleQuantityChange("decrease")}
                style={{ cursor: "pointer" }}
              >
                -
              </Button>
              <Input type="number" value={quantity} readOnly />
              <Button
                color="light"
                onClick={() => handleQuantityChange("increase")}
                style={{ cursor: "pointer" }}
              >
                +
              </Button>
            </InputGroup>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-4">
            <Button
              color="success"
              size="lg"
              onClick={() => {
                if (loggedIn) {
                  handleAddToCart();
                } else {
                  navigate("/login");
                }
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
