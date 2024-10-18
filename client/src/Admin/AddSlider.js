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
  FormText,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddSlider() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [sliderData, setSliderData] = useState({
    group_id: [], // Store selected group IDs
    image: null, // Store the file object for the slider image
  });

  const token = localStorage.getItem("token");

  // Fetch groups on component load, ensuring admin access
  async function fetchGroups() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/group", {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header with the admin token
          "Content-Type": "application/json",
        },
      });
      setGroups(response.data.Groups); // Set groups only if authorized
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire(
          "Unauthorized",
          "You do not have permission to access this resource.",
          "error"
        );
        navigate("/admin"); // Redirect to dashboard or appropriate page
      } else {
        console.error("Error fetching groups", error);
      }
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle checkbox change for groups
  const handleGroupChange = (e) => {
    const groupId = parseInt(e.target.value);
    const selectedGroups = sliderData.group_id;

    // If the group is already selected, remove it; otherwise, add it
    if (selectedGroups.includes(groupId)) {
      setSliderData({
        ...sliderData,
        group_id: selectedGroups.filter((id) => id !== groupId),
      });
    } else {
      setSliderData({
        ...sliderData,
        group_id: [...selectedGroups, groupId],
      });
    }
  };

  // Handle file input change for the slider image
  const handleFileChange = (e) => {
    setSliderData({ ...sliderData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload and form fields
    const formData = new FormData();
    sliderData.group_id.forEach((groupId) => {
      formData.append("group_id[]", groupId); // Sending group IDs as an array
    });
    formData.append("image", sliderData.image); // Append the image file

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/sliders`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure that the user is authenticated as an admin
            "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file upload
          },
        }
      );
      navigate(`/admin/sliders/edit/${response.data.slider_id}`);
    } catch (error) {
      console.error("Error creating slider", error);
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
            <Link to="/admin/sliders">Sliders</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add Slider</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Create New Slider
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              {/* Group checkboxes */}
              {groups
                ? groups.map((group) => {
                    return (
                      <FormGroup check key={group.id}>
                        <Input
                          type="checkbox"
                          name="group_id[]"
                          value={group.id}
                          checked={sliderData.group_id.includes(group.id)}
                          onChange={handleGroupChange}
                        />
                        <Label check>{group.name}</Label>
                      </FormGroup>
                    );
                  })
                : null}

              {/* Image upload */}
              <FormGroup>
                <Label for="image">Slider Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <FormText>*Upload an image for this slider.</FormText>
              </FormGroup>

              <Button color="success" type="submit">
                Add Slider
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
