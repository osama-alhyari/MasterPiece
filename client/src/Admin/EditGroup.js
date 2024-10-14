import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";
import axios from "axios";

export default function EditGroup() {
  const navigate = useNavigate();

  const { id } = useParams(); // Extract the groupId from the URL
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    parent_id: "",
  });

  async function fetchGroups() {
    const response = await axios.get("http://127.0.0.1:8000/api/group");
    setGroups(response.data.Groups);
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroup = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/api/group/${id}`);
    setGroupData(response.data.Group); // Set the group data
  };

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://127.0.0.1:8000/api/group/${id}`, groupData, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header
          "Content-Type": "application/json", // Optional: if you're sending JSON data
        },
      });
      navigate("/admin/groups");
      // Handle successful update (e.g., navigate to another page or show success message)
    } catch (error) {
      console.error("Error updating group", error);
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
          <BreadcrumbItem active>Edit Group</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Edit {groupData.name} Group
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
                  {groups.map((group) => (
                    <option
                      key={group.id}
                      value={group.id}
                      disabled={id == group.id}
                    >
                      {group.name}
                    </option>
                  ))}
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
