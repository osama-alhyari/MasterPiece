import React, { useState, useEffect } from "react";
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

export default function AdminProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState(""); // State to track password error

  async function fetchUserData() {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/view_user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserData({
        name: response.data.user.name,
        phone: response.data.user.phone,
        email: response.data.user.email,
      });
    } catch (error) {
      Swal.fire("Error", "Could not fetch user data", "error");
    }
  }

  // Fetch the user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    // If password is being changed, validate it
    if (name === "password") {
      validatePassword(value);
    }
  };

  // Validate password against the required pattern
  const validatePassword = (password) => {
    // Password regex matching backend validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password && !passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character."
      );
    } else {
      setPasswordError(""); // No error if password is valid or empty (optional)
    }
  };

  // Handle form submission for updating the user profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the password is valid before submitting
    if (passwordError) {
      Swal.fire("Error", passwordError, "error");
      return; // Don't submit if there's a password error
    }

    const formData = {
      name: userData.name,
      phone: userData.phone,
      password: userData.password || null, // Send password only if it's filled
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/admin_updates_profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire("Success", "Your Account updated successfully", "success");
      navigate(`/admin/starter`);
    } catch (error) {
      console.error("Error details:", error.response?.data);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Could not update your account",
        "error"
      );
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
          <BreadcrumbItem active>Account</BreadcrumbItem>
        </Breadcrumb>

        {/* Card for the form */}
        <Card>
          <CardTitle
            tag="h6"
            className="d-flex justify-content-between border-bottom p-3 mb-0"
          >
            <span>Your Account</span>
            <span className="text-decoration-underline">{userData.email}</span>
          </CardTitle>
          <CardBody>
            {/* Set autoComplete="off" on the form */}
            <Form onSubmit={handleSubmit} autoComplete="off">
              {/* Name Input */}
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter New Name"
                  type="text"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              {/* Phone Input */}
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter Phone Number (10 digits)"
                  type="text"
                  value={userData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength="10"
                />
              </FormGroup>

              {/* Password Input (Optional) */}
              <FormGroup>
                <Label for="password">Password (Optional)</Label>
                {/* Set autoComplete="new-password" for the password field */}
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter a new password"
                  type="password"
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
                <FormText>
                  Leave blank if you do not want to change the password. The
                  password must be at least 8 characters long, contain an
                  uppercase letter, a lowercase letter, a digit, and a special
                  character.
                </FormText>
                {passwordError && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {passwordError}
                  </div>
                )}
              </FormGroup>
              <div className="d-flex justify-content-between">
                <Button
                  color="success"
                  type="submit"
                  disabled={!!passwordError}
                >
                  Update Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
