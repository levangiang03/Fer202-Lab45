import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function Add() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listBrands, setListBrands] = useState([]);

    const [addNameProduct, setAddNameProduct] = useState("");
    const [addPriceProduct, setAddPriceProduct] = useState("");
    const [addDiscriptionProduct, setAddDiscriptionProduct] = useState("");
    const [addCateProduct, setAddCateProduct] = useState("");
    const [addBrandProduct, setAddBrandProduct] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:9999/products`)
            .then((res) => res.json())
            .then((productsData) => {
                //Create a list Brand
                const brandsSet = [];
                productsData.forEach((product) => {
                    product.brand.forEach((brand) => {
                        if(!brandsSet.includes(brand.name)){
                            brandsSet.push(brand.name);
                        }
                    });
                });
                setListBrands(brandsSet);

                setProducts(productsData);
            })
            .catch((e) => console.log(e));

        fetch("http://localhost:9999/categories")
            .then((res) => res.json())
            .then((categoriesData) => {
                setCategories(categoriesData);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Add Brand[] of Create/Update Product
    const handleAddProductBrand = (e, brand) => {
        if (e.target.checked) {
            setAddBrandProduct(prev => [
                ...prev, { id: addBrandProduct.length + 1, name: brand }
            ]);
        }
        else {
            setAddBrandProduct(prev => prev.filter(item => item.name !== brand));
        }
    };

    const handleAddProduct = (e) => {
        e.preventDefault();

        //Create a new Product
        const newProduct = {
            id: (products.length + 1).toString(),
            name: addNameProduct,
            price: parseInt(addPriceProduct),
            description: addDiscriptionProduct,
            category: parseInt(addCateProduct),
            brand: addBrandProduct
        };

        if (parseInt(addPriceProduct) <= 0) {
            alert('Price must be greater than 0');
            return;
        }

        if (addNameProduct.trim() === "") {
            alert('Name is not valid');
            return;
        }

        if (addCateProduct.trim() === "") {
            alert('Category is not valid');
            return;
        }

        if (addBrandProduct.length === 0) {
            alert('Brand is not valid');
            return;
        }

        const confirmed = window.confirm(
            "Are you sure want to add this product?"
        )

        if(confirmed){
                    // Send POST request to add the new product
        fetch('http://localhost:9999/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        })
            .then(response => response.json())
            .then(data => {
                alert('Product added successfully');
                navigate("/product");
            })
            .catch(error => {
                console.error('Error adding product:', error);
                // alert('Failed to add product. Please try again.');
            });
        }

    };

    return (
        <Container>
            <Row>
                <Col>
                    <Link to={"/product"} className="btn btn-success">
                        Go to Home
                    </Link>
                </Col>
            </Row>
            <Row style={{ margin: '20px -10px' }}>
                <Col>
                    <h1 style={{ textAlign: "center" }}>Add Product</h1>
                    <Form onSubmit={handleAddProduct}>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input ID</h6>
                                <input
                                    style={{ width: "100%" }}
                                    value={products.length + 1}
                                    disabled
                                ></input>
                            </Col>
                            <Col>
                                <h6>Input Name</h6>
                                <input
                                    style={{ width: "100%" }}
                                    value={addNameProduct}
                                    onChange={(e) => setAddNameProduct(e.target.value)}
                                ></input>
                            </Col>
                        </Row>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input Price</h6>
                                <input
                                    style={{ width: "100%" }}
                                    type="number"
                                    min={0}
                                    value={addPriceProduct}
                                    onChange={(e) => setAddPriceProduct(e.target.value)}
                                ></input>
                            </Col>
                            <Col>
                                <h6>Input Description</h6>
                                <input
                                    style={{ width: "100%" }}
                                    value={addDiscriptionProduct}
                                    onChange={(e) => setAddDiscriptionProduct(e.target.value)}
                                ></input>
                            </Col>
                        </Row>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input Category</h6>
                                <Form.Select
                                    value={addCateProduct}
                                    onChange={(e) => setAddCateProduct(e.target.value)}
                                >
                                    <option value="" disabled>Select a Category</option>
                                    {categories &&
                                        categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input Brand</h6>
                                <Form>
                                    {listBrands?.map((brand, index) => (
                                        <Form.Check
                                            id={index}
                                            key={index}
                                            type="checkbox"
                                            label={brand}
                                            onChange={(e) => handleAddProductBrand(e, brand)}
                                            // checked={addBrandProduct.some(b => b.name === brand)}
                                        />
                                    ))}
                                </Form>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Add Product
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
