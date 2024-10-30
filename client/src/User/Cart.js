import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, InputGroup, InputGroupText, Input } from "reactstrap";

export default function Cart() {
  const navigate = useNavigate();
  const [loggedIn] = useOutletContext();
  if (!loggedIn) {
    navigate("/login");
  }

  const [cart, setCart] = useState(null); // cart state
  const token = localStorage.getItem("token");

  // Fetch cart data
  async function fetchCart() {
    const response = await axios.get("http://127.0.0.1:8000/api/viewcart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCart(response.data.Cart);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const handleQuantityChange = async (variantId, action) => {
    try {
      if (action === "increment") {
        // Call API to increment quantity
        await axios.patch(
          `http://127.0.0.1:8000/api/incrementItem/${variantId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (action === "decrement") {
        // Call API to decrement quantity
        await axios.patch(
          `http://127.0.0.1:8000/api/decrementItem/${variantId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Fetch the updated cart after making the API call
      fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (variantId) => {
    await axios.delete(`http://127.0.0.1:8000/api/deleteItem/${variantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCart(); // Fetch the updated cart
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      await axios.delete("http://127.0.0.1:8000/api/clearcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (!cart) return <div>Loading cart...</div>;

  async function handleOrderCreation() {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/createorder",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/orders");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      className="container mt-4 text-white"
      style={{ backgroundColor: "#1c1c1e" }}
    >
      <h1>Your Cart</h1>
      <div className="row">
        {/* Cart items list */}
        <div className="col-md-8 cart-list">
          {cart.variants.map((variant) => (
            <div
              key={variant.id}
              className="d-flex justify-content-between align-items-center p-3 mb-3"
            >
              <div className="d-flex align-items-center">
                {/* Variant cover image */}
                <img
                  src={`http://127.0.0.1:8000/product_images/${
                    variant.images.find((img) => img.is_variant_cover === 1)
                      ?.name
                  }`}
                  alt={variant.name}
                  width="100px"
                  className="me-3"
                />

                {/* Product and variant info */}
                <div>
                  <h5>
                    {variant.product.name} ({variant.name})
                  </h5>
                  <p>Price per unit: {variant.product.price} JOD</p>
                  <p>
                    Total price:
                    {variant.product.price * variant.pivot.quantity} JOD
                  </p>
                </div>
              </div>

              {/* Quantity increment/decrement */}
              <div className="d-flex flex-wrap flex-column">
                <div style={{ minWidth: "50%", width: "50%" }}>
                  <InputGroup>
                    <InputGroupText
                      onClick={() =>
                        handleQuantityChange(variant.id, "decrement")
                      }
                      style={{ cursor: "pointer" }}
                    >
                      -
                    </InputGroupText>
                    <Input
                      type="number"
                      value={variant.pivot.quantity}
                      readOnly
                    />
                    <InputGroupText
                      onClick={() =>
                        handleQuantityChange(variant.id, "increment")
                      }
                      style={{ cursor: "pointer" }}
                    >
                      +
                    </InputGroupText>
                  </InputGroup>
                </div>
                <Button
                  style={{ minWidth: "50%", width: "50%" }}
                  color="danger"
                  onClick={() => handleRemoveFromCart(variant.id)}
                >
                  Remove
                </Button>
              </div>

              {/* Remove from cart button */}
            </div>
          ))}

          {/* Clear Cart Button */}
          <Button
            color="warning"
            className="mt-3"
            onClick={handleClearCart}
            disabled={cart.variants.length === 0} // Disable if the cart is already empty
          >
            Clear Cart
          </Button>
        </div>

        {/* Cart summary */}
        <div className="col-md-4 cart-summary">
          <div className="p-3">
            <h3>Total Items: {cart.items}</h3>
            <h3>Total Price: {cart.total} JOD</h3>
            <Button
              color="light"
              className="mt-3"
              onClick={handleOrderCreation}
              disabled={cart.variants.length === 0} // Disable if the cart is already empty
            >
              Make Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
