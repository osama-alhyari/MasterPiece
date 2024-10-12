import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
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

    // Validate password (min 8 characters, at least one letter, one number)
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
    try {
      if (validateForm()) {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/signup",
          formData
        );
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (e) {
      setErrors({ email: "*Email Already Registered , Please Log In" });
    }

    // Handle success (e.g., redirect, display success message)
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 bg-dark">
      <Form
        className="col col-lg-2 col-sm-1 d-flex flex-column justify-center align-items-center w-50 h-auto"
        onSubmit={handleSubmit}
      >
        <img src="/logos/LogoWhiteMP.png" alt="Main Logo" width="200px"></img>

        <FormGroup className="w-100">
          <Label className="me-3" style={{ color: "white" }} for="name">
            Name
          </Label>
          {errors.name && <FormText color="danger">{errors.name}</FormText>}
          <Input
            id="name"
            name="name"
            placeholder="Enter Your Full Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup className="w-100">
          <Label className="me-3" style={{ color: "white" }} for="email">
            Email
          </Label>
          {errors.email && <FormText color="danger">{errors.email}</FormText>}
          <Input
            id="email"
            name="email"
            placeholder="Enter Your Email"
            type="text"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup className="w-100">
          <Label className="me-3" style={{ color: "white" }} for="phone">
            Phone Number
          </Label>
          {errors.phone && <FormText color="danger">{errors.phone}</FormText>}
          <Input
            id="phone"
            name="phone"
            placeholder="07********"
            type="text"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength={10}
          />
        </FormGroup>

        <FormGroup className="w-100">
          <Label className="me-3" style={{ color: "white" }} for="password">
            Password
          </Label>{" "}
          {errors.password && (
            <FormText color="danger">{errors.password}</FormText>
          )}
          <Input
            id="password"
            name="password"
            placeholder="Enter Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </FormGroup>

        <FormGroup className="w-100">
          <Label className="me-3" style={{ color: "white" }} for="confirm">
            Confirm Password
          </Label>
          {errors.confirm_password && (
            <FormText color="danger">{errors.confirm_password}</FormText>
          )}
          <Input
            id="confirm"
            name="confirm_password"
            placeholder="Confirm Your Password"
            type="password"
            value={formData.confirm_password}
            onChange={handleInputChange}
          />
        </FormGroup>

        <div className="w-100 d-flex gap-4">
          <Link to={"/login"}>
            <Button className="btn" color="primary" size="md">
              Already Have An Account?
            </Button>
          </Link>
          <Button className="btn w-100" color="success" size="lg" type="submit">
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}
