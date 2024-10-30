import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, InputGroup, InputGroupText, Input, Table } from "reactstrap";

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
          <Table
            className="no-wrap mt-3 align-middle"
            responsive
            borderless
            dark
          >
            <thead>
              <tr>
                <th className="">Product</th>
                <th className="">Variant</th>
                <th className="text-center">Quantity</th>
                <th className="">Price Per Unit</th>
                <th className="">Total</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody cl>
              {cart.variants.map((variant, index) => (
                <tr key={index} className="border-top">
                  <td className="">{variant.product.name}</td>
                  <td className="">{variant.name}</td>
                  <td className="">
                    {/*
  This component uses @tailwindcss/forms

  yarn add @tailwindcss/forms
  npm install @tailwindcss/forms

  plugins: [require('@tailwindcss/forms')]

  @layer components {
    .no-spinner {
      -moz-appearance: textfield;
    }

    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }
  }
*/}

                    <div>
                      <label htmlFor="Quantity" className="sr-only">
                        {" "}
                        Quantity{" "}
                      </label>

                      <div className="flex items-center rounded border border-gray-200">
                        <button
                          type="button"
                          className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                        >
                          &minus;
                        </button>

                        <input
                          type="number"
                          id="Quantity"
                          value="1"
                          className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />

                        <button
                          type="button"
                          className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                        >
                          &plus;
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="">{variant.product.price} JOD</td>
                  <td className="">
                    {variant.product.price * variant.pivot.quantity} JOD
                  </td>
                  <td className="">
                    <Button
                      color="danger"
                      onClick={() => handleRemoveFromCart(variant.id)}
                    >
                      <i class="bi bi-trash3-fill"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Clear Cart Button */}
          <Button
            color="warning"
            className="mt-3 text-white"
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
