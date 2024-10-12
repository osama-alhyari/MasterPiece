import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "*Invalid email address.";
    }

    // Validate password (must be at least 8 characters)
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "*Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/login",
          formData
        );
        localStorage.setItem("token", response.data.token);
        if (response.data.role_id === 1) {
          navigate("/admin");
        } else if (response.data.role_id === 2) {
          navigate("/");
        }
      }
    } catch (e) {
      Swal.fire({
        title: "Wrong Credentianls",
        html: "Please Re-enter Your Email And Password",
        timer: 5000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 bg-dark">
      <Form
        className="col col-lg-2 col-sm-1 d-flex flex-column justify-content-center justify-content-md-evenly align-items-center w-50 gap-3"
        onSubmit={handleSubmit}
      >
        <img
          src="/logos/LogoWhiteMP.png"
          alt="Main Logo"
          width="200px"
          className="mb-4"
        ></img>
        <h5 style={{ color: "white", textAlign: "left", width: "100%" }}>
          Welcome Back
        </h5>

        <FormGroup className="w-100">
          <Label style={{ color: "white" }} for="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter Your Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <FormText color="danger">{errors.email}</FormText>}
        </FormGroup>

        <FormGroup className="w-100">
          <Label style={{ color: "white" }} for="password">
            Password
          </Label>
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

        <div className="w-100 d-flex gap-4">
          <Link to={"/register"}>
            <Button className="btn" color="primary" size="md">
              Don't Have An Account?
            </Button>
          </Link>
          <Button className="btn w-100" color="success" size="lg" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
