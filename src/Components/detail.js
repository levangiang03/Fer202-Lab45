import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

export default function Detail() {
  // Lay gia tri cua tham so tren URL
  const { pId } = useParams();
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9999/products/${pId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((e) => console.log(e));

    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((categoriesData) => {
        setCategories(categoriesData);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Link to={"/product"} className="btn btn-success">
            Go to Home
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Product details</h3>
          <div>Product Id: {product?.id}</div>
          <div>Product Name: {product?.name}</div>
          <div>Price: {product?.price}</div>
          <div>Description: {product?.description}</div>
          <div>Category: {categories?.find((c) => c.id == product.category)?.name}</div>
          <div>
            Brands:
            {product.brand?.map((b) => (
              <li key={b.name}>
                {b.name}
                <br />
              </li>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
