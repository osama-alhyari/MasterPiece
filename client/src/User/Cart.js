import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Button, InputGroup, Input, Table } from "reactstrap";
import Loader from "../layouts/loader/Loader";

export default function Cart() {
  const navigate = useNavigate();
  const [loggedIn] = useOutletContext();
  const [cart, setCart] = useState(null); // cart state
  const token = localStorage.getItem("token");

  // Fetch cart data
  async function fetchCart() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/viewcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.Cart);
    } catch (e) {
      if (!loggedIn) {
        navigate("/login");
      } else {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  async function handleQuantityChange(variantId, action) {
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
      const response = await axios.get("http://127.0.0.1:8000/api/viewcart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.Cart);
      console.log("clcikedddd");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }

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

  if (!cart) return <Loader />;

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
    <section class="h-100 h-custom" style={{ backgroundColor: "black" }}>
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12">
            <div
              class="card card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <div class="card-body p-0">
                <div class="row g-0">
                  <div class="col-lg-8">
                    <div class="p-5" style={{ backgroundColor: "#343a40" }}>
                      <div class="d-flex justify-content-between align-items-center mb-5">
                        <h1 class="fw-bold mb-0 text-white">Shopping Cart</h1>
                        <h6 class="mb-0 text-muted">3 items</h6>
                      </div>
                      <hr class="my-4"></hr>
                      {cart.variants.length === 0 ? (
                        <h1 className="text-white mb-5 pb-5">Cart is Empty</h1>
                      ) : null}
                      {cart.variants.map((variant, index) => {
                        return (
                          <>
                            <div class="row mb-4 d-flex justify-content-between align-items-center">
                              <div class="col-md-2 col-lg-2 col-xl-2">
                                <img
                                  src={`http://127.0.0.1:8000/product_images/${variant.images[0].name}`}
                                  class="img-fluid rounded-3"
                                  alt="Variant Cover"
                                ></img>
                              </div>
                              <div class="col-md-3 col-lg-3 col-xl-3">
                                <h6 class="text-white">
                                  {variant.product.name}
                                </h6>
                                <h6 class="mb-0 text-white">{variant.name}</h6>
                              </div>
                              <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                                <button
                                  data-mdb-button-init
                                  data-mdb-ripple-init
                                  class="btn btn-link px-2 text-decoration-none text-white"
                                  onClick={() =>
                                    handleQuantityChange(
                                      variant.id,
                                      "decrement"
                                    )
                                  }
                                >
                                  -
                                </button>

                                {/* <input
                                  name="quantity"
                                  value={variant.pivot.quantity}
                                  type="number"
                                  class="form-control form-control-sm px-5 text-center"
                                  readOnly
                                /> */}
                                <h1 className="text-white">
                                  {variant.pivot.quantity}
                                </h1>

                                <button
                                  data-mdb-button-init
                                  data-mdb-ripple-init
                                  class="btn btn-link px-2 text-decoration-none text-white"
                                  onClick={() =>
                                    handleQuantityChange(
                                      variant.id,
                                      "increment"
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                <h6 class="mb-0 text-white">
                                  {variant.pivot.quantity *
                                    variant.product.price}{" "}
                                  JOD
                                </h6>
                              </div>
                              <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                                <a href="#!" class="text-muted">
                                  <i class="fas fa-times"></i>
                                </a>
                              </div>
                            </div>

                            <hr class="my-4 text-white"></hr>
                          </>
                        );
                      })}
                    </div>
                  </div>
                  <div class="col-lg-4 bg-body-tertiary">
                    <div class="p-5">
                      <h3 class="fw-bold mb-5 mt-2 pt-1">
                        Number Of Items: {cart.items}
                      </h3>
                      <hr class="my-4"></hr>

                      <div class="d-flex justify-content-between mb-5">
                        <h5 class="text-uppercase">Total price</h5>
                        <h5>{cart.total} JOD</h5>
                      </div>

                      <button
                        type="button"
                        class="btn btn-dark btn-block btn-lg"
                        onClick={handleOrderCreation}
                        disabled={cart.variants.length === 0}
                      >
                        Make Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
