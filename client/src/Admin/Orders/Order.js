import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Table,
  FormGroup,
  Input,
  Label,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Order() {
  const { id } = useParams(); // Get the order ID from the URL params
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(""); // Track the selected status
  const token = localStorage.getItem("token");

  async function fetchOrder() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const fetchedOrder = response.data.Order;
      setOrder(fetchedOrder);
      setStatus(fetchedOrder.status); // Set initial status
    } catch (error) {
      Swal.fire("Error", "Could not fetch order details", "error");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  // Handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/order/${id}`, // Adjust the endpoint as needed
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire("Success", "Order status updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  if (!order) {
    return <p>Loading order details...</p>;
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={"/admin"}>Dashboard</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to={"/admin/orders"}>Orders</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>Order {order.id}</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Order Details</CardTitle>
          <p>
            <strong>Order Date:</strong> {order.order_date}
          </p>

          <FormGroup>
            <Label for="status">Order Status</Label>
            <Input
              type="select"
              id="status"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="In Progress">In Progress</option>
              <option value="Cancelled">Cancelled</option>
            </Input>
          </FormGroup>

          <p>
            <strong>Total Items:</strong> {order.items}
          </p>
          <p>
            <strong>Total Cost: </strong>
            {order.total} JOD
          </p>

          <h6 className="mt-4">Products Ordered:</h6>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th className="text-center">Image</th>
                <th className="text-center">Product Name</th>
                <th className="text-center">Variant</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.variants && order.variants.length > 0 ? (
                order.variants.map((variant, index) => (
                  <tr key={index} className="border-top">
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <img
                          src={`http://127.0.0.1:8000/product_images/${variant.images[0].name}`}
                          className="rounded-circle"
                          alt="product"
                          width="45"
                          height="45"
                        />
                      </div>
                    </td>
                    <td className="text-center">{variant.product.name}</td>
                    <td className="text-center">{variant.name}</td>
                    <td className="text-center">{variant.pivot.quantity}</td>
                    <td className="text-center">{variant.product.price} JOD</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Products Exist
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
