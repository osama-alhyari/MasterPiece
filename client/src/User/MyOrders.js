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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  async function fetchOrders() {
    const response = await axios.get("http://127.0.0.1:8000/api/myorders", {
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

  return (
    <>
      <div>
        <Card className="text-white" color="dark">
          <CardBody>
            <CardTitle tag="h5">
              <i className="bi bi-cash-stack me-2"> </i>Your Orders
            </CardTitle>
            <Table
              className="no-wrap mt-3 align-middle"
              responsive
              borderless
              dark
            >
              <thead>
                <tr>
                  <th className="text-center">Order ID</th>
                  <th className="text-center">Order Date</th>
                  <th className="text-center">Items</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody cl>
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index} className="border-top">
                      <td className="text-center">{order.id}</td>
                      <td className="text-center">{order.order_date}</td>
                      <td className="text-center">{order.items}</td>
                      <td className="text-center">{order.total} JOD</td>
                      <td className="text-center">{order.status}</td>
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
