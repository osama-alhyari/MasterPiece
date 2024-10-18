import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Col,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddGroup() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    parent_id: "",
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/group`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
          "Content-Type": "application/json", // Optional: if you're sending JSON data
        },
      });
      navigate("/admin/groups");
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  return (
    <div className="container-fluid">
      <Col lg="12">
        {/* Breadcrumb outside the Card */}
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/admin">Dashboard</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/admin/groups">Groups</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Group</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Create New Group
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="name">Group Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Group Name"
                  type="text"
                  value={groupData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter Group Description"
                  type="text"
                  value={groupData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="parent_id">Parent Group</Label>
                <Input
                  type="select"
                  name="parent_id"
                  id="parent_id"
                  value={groupData.parent_id}
                  onChange={handleInputChange}
                >
                  <option value="">None</option>
                  {groups
                    ? groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))
                    : null}
                </Input>
              </FormGroup>

              <Button color="success" type="submit">
                Save Changes
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
