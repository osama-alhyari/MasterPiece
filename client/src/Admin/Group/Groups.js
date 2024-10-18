import axios from "axios";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const token = localStorage.getItem("token");

  async function fetchGroups() {
    const response = await axios.get("http://127.0.0.1:8000/api/group", {
      headers: {
        Authorization: `Bearer ${token}`, // Set the Authorization header
        "Content-Type": "application/json", // Optional: if you're sending JSON data
      },
    });
    setGroups(response.data.Groups);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  // Delete group function
  const handleDelete = (groupId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/group/${groupId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
              "Content-Type": "application/json", // Optional: if you're sending JSON data
            },
          });
          setGroups(groups.filter((group) => group.id !== groupId)); // Update the UI
          Swal.fire("Deleted!", "Your group has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            "There was a problem deleting the group.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <Col lg="12">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={"/admin"}>Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Groups</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <CardBody>
            <CardTitle tag="h5" className="d-flex justify-content-between">
              <span>
                <i className="bi bi-hdd-stack me-2"> </i>
                Groups
              </span>
              <div className="d-flex justify-content-end">
                <Link to={"create"}>
                  <Button className="btn" color="success">
                    Add Group
                  </Button>
                </Link>
              </div>
            </CardTitle>
            <Table responsive borderless className="">
              <thead>
                <tr>
                  <th className="text-center">Group Name</th>
                  <th className="text-center">Number Of Products</th>
                  <th className="text-center">Parent Group</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups
                  ? groups.map((group) => {
                      return (
                        <tr key={group.id} className="border-top">
                          <td className="text-center">{group.name}</td>
                          <td className="text-center">
                            {group.products_count}
                          </td>
                          <td className="text-center">
                            {group.group
                              ? group.group.name
                              : "*No Parent Group*"}
                          </td>
                          <td className="text-center d-flex flex-lg-row flex-column gap-1 justify-content-center">
                            <Link to={`edit/${group.id}`}>
                              <Button className="btn" color="primary">
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </Link>
                            <Link>
                              <Button
                                className="btn"
                                color="danger"
                                onClick={() => handleDelete(group.id)} // Handle delete action
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  : "No Groups Exist"}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
