import {
  Card,
  CardBody,
  CardTitle,
  Table,
  BreadcrumbItem,
  Breadcrumb,
  Badge,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  async function fetchUsers() {
    const response = await axios.get("http://127.0.0.1:8000/api/active_users", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
        "Content-Type": "application/json", // Optional: if you're sending JSON data
      },
    });
    setUsers(response.data.users);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={"/admin"}>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Users</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <CardBody>
            <CardTitle tag="h5" className="d-flex justify-content-between">
              <span>
                <i className="bi bi-people-fill me-2"> </i>User List
              </span>
              <div className="d-flex justify-content-end">
                <Link to={"create"}>
                  <Button className="btn" color="success">
                    Add User
                  </Button>
                </Link>
              </div>
            </CardTitle>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date Created</th>
                  <th>Orders Made</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  ? users.map((user, index) => (
                      <tr key={index} className="border-top">
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.date_created}</td>
                        <td>{user.orders_count}</td>
                        <td>
                          <Link to={`edit/${user.id}`}>
                            <Button className="btn" color="primary">
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  : "No Users Exist"}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
