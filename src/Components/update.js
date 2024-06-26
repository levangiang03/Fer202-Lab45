import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Update() {
    const { pId } = useParams();

    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [listBrands, setListBrands] = useState([]);

    // const [updateIdProduct, setUpdateIdProduct] = useState("");
    const [updateNameProduct, setUpdateNameProduct] = useState("");
    const [updatePriceProduct, setUpdatePriceProduct] = useState("");
    const [updateDiscriptionProduct, setUpdateDiscriptionProduct] = useState("");
    const [updateCateProduct, setUpdateCateProduct] = useState("");
    const [updateBrandProduct, setUpdateBrandProduct] = useState([]);  // Initialize as empty array

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

            })
            .catch((e) => console.log(e));

        fetch(`http://localhost:9999/products/${pId}`)
            .then((res) => res.json())
            .then((productData) => {
                setProduct(productData);
                handleEditProduct(productData); // Pass the fetched product data
            })
            .catch((e) => console.log(e));

        fetch("http://localhost:9999/categories")
            .then((res) => res.json())
            .then((categoriesData) => {
                setCategories(categoriesData);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, [pId]); // Add pId as a dependency to useEffect

    const handleEditProduct = (product) => {
        setUpdateNameProduct(product.name);
        setUpdatePriceProduct(parseInt(product.price));
        setUpdateDiscriptionProduct(product.description);
        setUpdateCateProduct(parseInt(product.category));
        setUpdateBrandProduct(product.brand);
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();

        const updatedProduct = {
            name: updateNameProduct,
            price: parseInt(updatePriceProduct),
            description: updateDiscriptionProduct,
            category: parseInt(updateCateProduct),
            brand: updateBrandProduct
        };

        // Check input valid
        if (parseInt(updatePriceProduct) <= 0) {
            alert('Price must be greater than 0');
            return;
        }

        if (updateNameProduct === "") {
            alert('Name is not valid');
            return;
        }

        if (updateCateProduct === "") {
            alert('Category is not valid');
            return;
        }

        if (updateBrandProduct.length === 0) {
            alert('Brand is not valid');
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to update this product?"
        )
        if (confirmed) {
            fetch(`http://localhost:9999/products/${pId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            })
            .then(data => {
                alert('Product updated successfully');
                navigate("/product");
            })
            .catch((err) => console.error("Error updating product:", err));
        }
    };
    
    // Add Brand[] of Create/Update Product
    const handleAddProductBrand = (e, brand) => {
        if (e.target.checked) {
            setUpdateBrandProduct(prev => [
                ...prev, { id: updateBrandProduct.length + 1, name: brand }
            ]);
        }
        else {
            setUpdateBrandProduct(prev => prev.filter(item => item.name !== brand));
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
                    <h1 style={{ textAlign: "center" }}>Update Product</h1>
                    <Form onSubmit={handleUpdateProduct}>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input ID</h6>
                                <input
                                    style={{ width: "100%" }}
                                    type="number"
                                    value={product.id}
                                    disabled
                                ></input>
                            </Col>
                            <Col>
                                <h6>Input Name</h6>
                                <input
                                    style={{ width: "100%" }}
                                    value={updateNameProduct}
                                    onChange={(e) => setUpdateNameProduct(e.target.value)}
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
                                    value={updatePriceProduct}
                                    onChange={(e) => setUpdatePriceProduct(e.target.value)}
                                ></input>
                            </Col>
                            <Col>
                                <h6>Input Description</h6>
                                <input
                                    style={{ width: "100%" }}
                                    value={updateDiscriptionProduct}
                                    onChange={(e) => setUpdateDiscriptionProduct(e.target.value)}
                                ></input>
                            </Col>
                        </Row>
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <h6>Input Category</h6>
                                <Form.Select
                                    value={updateCateProduct}
                                    onChange={(e) => setUpdateCateProduct(e.target.value)}
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
                                            checked={updateBrandProduct.some(b => b.name === brand)}
                                        />
                                    ))}
                                </Form>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Update Product
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
