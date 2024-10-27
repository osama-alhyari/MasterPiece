import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
} from "reactstrap";
import ProductsComponent from "./ProductsComponent";

export default function Group() {
  const { id } = useParams();
  const [group, setGroup] = useState();

  async function fetchGroup() {
    const response = await axios.get(`http://127.0.0.1:8000/api/group/${id}`);
    setGroup(response.data.Group[0]);
  }

  useEffect(() => {
    fetchGroup();
  }, [id]);

  return (
    <div style={{ backgroundColor: "#1c1c1e" }}>
      <h1 className=" text-white">{group?.name}</h1>
      <ProductsComponent group={id} />
    </div>
  );
}
