import {
  Card,
  CardBody,
  CardTitle,
  Table,
  BreadcrumbItem,
  Breadcrumb,
  Button,
  FormGroup,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  // Enum values for the status dropdown
  const statusOptions = ["Pending", "Delivered", "In Progress", "Cancelled"];

  async function fetchOrders() {
    const response = await axios.get("http://127.0.0.1:8000/api/allorders", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setOrders(response.data.Orders);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/order/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Success", "Order status updated successfully!", "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error", "Could not update the order status", "error");
    }
  };

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={"/admin"}>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Orders</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <CardBody>
            <CardTitle tag="h5">
              <i className="bi bi-cash-stack me-2"> </i>Orders List
            </CardTitle>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th className="text-center">Order Date</th>
                  <th className="text-center">User Name</th>
                  <th className="text-center">Items</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index} className="border-top">
                      <td className="text-center">{order.order_date}</td>
                      <td className="text-center">{order.user.name}</td>
                      <td className="text-center">{order.items}</td>
                      <td className="text-center">{order.total} JOD</td>
                      <td className="text-center">
                        <Input
                          type="select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Input>
                      </td>
                      <td className="text-center">
                        <Link to={`${order.id}`}>
                          <Button className="btn" color="primary">
                            <i className="bi bi-eye-fill"></i>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Orders Exist
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
