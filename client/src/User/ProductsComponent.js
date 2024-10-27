import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Badge,
  CardImg,
} from "reactstrap";

export default function ProductsComponent(props) {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    if (!props.group) {
      const response = await axios.get("http://127.0.0.1:8000/api/product");
      setProducts(response.data.Products);
    } else {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/group/${props.group}`
      );
      setProducts(response.data.Group[0].products);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [props]);

  return (
    <div className="d-flex flex-wrap">
      {products?.map((product) => {
        return (
          <div className="col-3 p-2">
            <Link
              to={`/product/${product.id}`}
              className="text-decoration-none"
            >
              <Card color="secondary" inverse>
                <div className="overflow-hidden">
                  <CardImg
                    className="hoverable"
                    alt="Product Image"
                    src={`http://127.0.0.1:8000/product_images/${product.image}`}
                  />
                </div>

                <CardBody>
                  <CardTitle tag="h5" className="text-center">
                    {product.name}
                  </CardTitle>
                  <hr></hr>
                  <CardText className="text-center" tag="h5">
                    <Badge color="black" pill>
                      {product.price} JOD
                    </Badge>
                  </CardText>
                </CardBody>
              </Card>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
