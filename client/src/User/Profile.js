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
  FormText,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  async function fetchUserData() {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/profile`, {
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
      Swal.fire("Error", "Could not fetch your profile data", "error");
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password && !passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters, contain an uppercase letter, a lowercase letter, a digit, and a special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError) {
      Swal.fire("Error", passwordError, "error");
      return;
    }

    const formData = {
      name: userData.name,
      phone: userData.phone,
      password: userData.password || null,
    };

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/customer_updates_profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "Profile Updated!",
        text: "Press OK To Continue",
        icon: "success",
      });
    } catch (error) {
      console.error("Error details:", error.response?.data);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Could not update your profile",
        "error"
      );
    }
  };

  return (
    <div className="container-fluid">
      <Col lg="12">
        <Card color="dark" className="text-white">
          <CardTitle
            tag="h6"
            className=" d-flex justify-content-between align-items-center border-bottom p-3 mb-0"
          >
            Edit Your Profile
            <Button
              color="primary"
              type="button"
              onClick={() => {
                navigate("/orders");
              }}
            >
              View Orders
            </Button>
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <FormGroup>
                <Label for="email">{userData.email}</Label>
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  type="text"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  type="text"
                  value={userData.phone}
                  onChange={handleInputChange}
                  required
                  maxLength="10"
                />
              </FormGroup>

              <FormGroup>
                <Label for="password">Change Password (Optional)</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter a new password"
                  type="password"
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
                Leave blank if you do not want to change your password. Password
                must be at least 8 characters, contain uppercase, lowercase,
                digit, and special character.
                {passwordError && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {passwordError}
                  </div>
                )}
              </FormGroup>

              <Button color="success" type="submit" disabled={!!passwordError}>
                Update Profile
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
}
