import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Card,
  CardBody,
  CardTitle,
  Col,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AddUser() {
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Regex validation
  const validateForm = () => {
    const newErrors = {};

    // Validate name (at least 3 characters)
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "*Name must be at least 3 characters long.";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "*Invalid email address.";
    }

    // Validate phone number (Jordanian format: 07xxxxxxxx)
    const phoneRegex = /^07[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone =
        "*Phone number must start with 07 and be 10 digits long.";
    }

    // Validate password (min 8 characters, at least one letter, one number, and one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "*Password must be at least 8 characters, and include at least one upper case letter, one lower case letter, one number, and one special symbol.";
    }

    // Confirm password matches
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "*Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/signup",
          formData
        );
        Swal.fire("Success", "User added successfully", "success");
        navigate("/admin/users"); // Redirect to the users list
      } catch (e) {
        setErrors({ email: "*Email is already registered." });
      }
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
            <Link to="/admin/users">Users</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Add User</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            Add New User
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              {/* Name Input */}
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <FormText color="danger">{errors.name}</FormText>
                )}
              </FormGroup>

              {/* Email Input */}
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <FormText color="danger">{errors.email}</FormText>
                )}
              </FormGroup>

              {/* Phone Input */}
              <FormGroup>
                <Label for="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="07********"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {errors.phone && (
                  <FormText color="danger">{errors.phone}</FormText>
                )}
              </FormGroup>

              {/* Password Input */}
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <FormText color="danger">{errors.password}</FormText>
                )}
              </FormGroup>

              {/* Confirm Password Input */}
              <FormGroup>
                <Label for="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                />
                {errors.confirm_password && (
                  <FormText color="danger">{errors.confirm_password}</FormText>
                )}
              </FormGroup>

              {/* Submit Button */}
              <Button color="success" type="submit">
                Add User
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
