import { useEffect, useState } from "react";
import {
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Row,
    Table,
    Form,
    Button,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [catID, setCatID] = useState("all");
    const [search, setSearch] = useState("");
    const [rangeValue, setRangeValue] = useState("0");
    const [listBrands, setListBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [checkFilterList, setCheckFilterList] = useState(true);

    useEffect(() => {
        // Fetch products
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((productsData) => {
                // Set list of brands
                const brandsSet = [];
                productsData.forEach((product) => {
                    product.brand.forEach((brand) => {
                        if (!brandsSet.includes(brand.name)) {
                            brandsSet.push(brand.name);
                        }
                    });
                })
                setListBrands(brandsSet);

                // Apply filters to products
                let filteredProducts = productsData;

                // Filter by category
                if (catID !== "all") {
                    filteredProducts = filteredProducts?.filter(
                        (p) => p.category == catID
                    );
                }

                // Filter by search query
                if (search.length > 0) {
                    filteredProducts = filteredProducts?.filter((p) =>
                        p.name.toLowerCase().includes(search.toLowerCase())
                    );
                }

                // Filter by price range
                filteredProducts = filteredProducts?.filter((p) => p.price > rangeValue);

                // Filter by selected brands
                if (selectedBrands.length > 0) {
                    filteredProducts = filteredProducts?.filter((p) =>
                        p.brand.some((b) => selectedBrands?.some((sb) => sb.name === b.name))
                    );
                }

                if (filteredProducts?.length > 0) {
                    setCheckFilterList(true);
                }
                else {
                    setCheckFilterList(false);
                }

                // Set filtered products
                setProducts(filteredProducts);
            })
            .catch((err) => console.error("Error fetching products:", err));

        // Fetch categories
        fetch("http://localhost:9999/categories")
            .then((res) => res.json())
            .then((categoriesData) => {
                setCategories(categoriesData);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, [catID, search, rangeValue, selectedBrands]);

    // Handle Brand checkbox change in Filter
    const handleBrandChange = (brandName) => {
        setSelectedBrands((prevBrands) => {
            // Tìm vị trí của thương hiệu trong mảng selectedBrands
            const index = prevBrands.findIndex((b) => b.name === brandName);

            if (index !== -1) {
                const updatedBrands = [...prevBrands];
                updatedBrands.splice(index, 1);
                return updatedBrands;
            } else {
                const newBrand = {
                    id: prevBrands.length + 1,
                    name: brandName,
                };
                return [...prevBrands, newBrand];
            }
        });
    };

    // Delete Product
    const handleDeleteProduct = (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );
        if (confirmed) {
            fetch(`http://localhost:9999/products/${productId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        // Delete successfully => reset the list
                        fetch("http://localhost:9999/products")
                            .then((res) => res.json())
                            .then((productsData) => {
                                let filteredProducts = productsData;

                                if (catID !== "all") {
                                    filteredProducts = filteredProducts.filter(
                                        (p) => p.category === catID
                                    );
                                }

                                if (search.length > 0) {
                                    filteredProducts = filteredProducts.filter((p) =>
                                        p.name.toLowerCase().includes(search.toLowerCase())
                                    );
                                }

                                filteredProducts = filteredProducts.filter((p) => p.price > rangeValue);

                                if (selectedBrands.size > 0) {
                                    filteredProducts = filteredProducts.filter((p) =>
                                        p.brand.some((b) => selectedBrands.has(b.name))
                                    );
                                }

                                setCheckFilterList(filteredProducts.length > 0);
                                setProducts(filteredProducts);
                                alert('Delete successfully');
                            })
                            .catch((err) => console.error("Error fetching products:", err));
                    } else {
                        alert('Failed to delete product');
                    }
                })
                .catch((err) => console.error("Error deleting product:", err));
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={3}>
                    {/* Filter */}
                    <Container fluid>
                        <Row>
                            <Col>
                                <h1>Filter</h1>
                            </Col>
                        </Row>

                        {/* By Category */}
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                <h3>By Category</h3>
                                <Form>
                                    <Form.Select onChange={(e) => setCatID(e.target.value)}>
                                        <option value="all">All</option>
                                        {categories &&
                                            categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Form>
                            </Col>
                        </Row>

                        {/* By Price */}
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                <h3>By Price</h3>
                                <Form>
                                    <h6>Range: {rangeValue}</h6>
                                    <Form.Range
                                        type="range"
                                        min={0}
                                        max={100000000}
                                        onChange={(e) => setRangeValue(e.target.value)}
                                    />
                                </Form>
                            </Col>
                        </Row>

                        {/* By Brand */}
                        <Row style={{ marginTop: "20px" }}>
                            <Col>
                                <h3>By Brand</h3>
                                <Form>
                                    {listBrands?.map((brand, index) => (
                                        <Form.Check
                                            id={index}
                                            key={index}
                                            type="checkbox"
                                            label={brand}
                                            onChange={() => handleBrandChange(brand)}
                                            checked={selectedBrands.some((b) => b.name === brand)}
                                        />
                                    ))}
                                </Form>
                            </Col>
                        </Row>

                    </Container>
                </Col>
                <Col md={9}>
                    <Container fluid>
                        <Row>
                            <Col>
                                <h1 style={{ textAlign: "center" }}>List of Products</h1>
                            </Col>
                        </Row>

                        {/* Search by Name */}
                        <Row style={{ margin: "20px -10px" }}>
                            <Col>
                                <Form>
                                    <h3>Search</h3>
                                    <input
                                        placeholder="Enter Product's name"
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ width: "100%" }}
                                    ></input>
                                </Form>
                            </Col>
                        </Row>

                        {/* Button Add */}
                        <Row style={{ textAlign: 'end', margin: '20px 0px' }}>
                            <Col>
                                <Link to={'/product/addProduct'} className="btn btn-success">
                                    + Add
                                </Link>
                            </Col>
                        </Row>

                        {/* Table */}
                        {
                            checkFilterList ?
                                (
                                    // Display table if CheckFilterList true
                                    <Row>
                                        <Col>
                                            <Table hover striped bordered>
                                                <thead>
                                                    <tr style={{ textAlign: 'center' }}>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Description</th>
                                                        <th>Category</th>
                                                        <th>Brand</th>
                                                        <th colSpan={2}>Functions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products?.map((p) => (
                                                        <tr key={p.id}>
                                                            <td>{p.id}</td>
                                                            <td>
                                                                <Link to={`/product/${p.id}`}>{p.name}</Link>
                                                            </td>
                                                            <td>{p.price}</td>
                                                            <td>{p.description}</td>
                                                            <td>
                                                                {categories?.find((c) => c.id == p.category)?.name}
                                                            </td>
                                                            <td>
                                                                {p.brand.map((b) => (
                                                                    <p key={b.id}>{b.name}</p>
                                                                ))}
                                                            </td>
                                                            <td>
                                                                <Link to={`/product/updateProduct/${p.id}`} className="btn btn-success">
                                                                    Update
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => handleDeleteProduct(p.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                ) : <h6 style={{ color: 'red', textAlign: 'center' }}>Product not exist</h6>
                        }
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
