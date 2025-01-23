import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProductForm from "./ProductForm";

const ProductUpdate = () => {
    const [product, setProduct] = useState([]);
    let {id} = useParams();
    const url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${url}product/get/` + id).then((response) => {
            setProduct(response.data);
        });
    }, []);

    const navigate = useNavigate();    

    const handleChange = (event) => {
        setProduct({
            ...product,
            [event.target.id]: event.target.value,
        });
    }

    const handleSubmit= (event) => {
        event.preventDefault();
        updateProduct(product,url);
        navigate("/admin")
        window.location.reload();
    }

    return <ProductForm product={product} handleChange={handleChange} handleSubmit={handleSubmit} />
}

const updateProduct = async (product,url) => {
    axios.put(`${url}product/update`, JSON.stringify(product), {headers: {'content-type': 'application/json'}}).then((response) => {
        console.log(response.data);
    });
}

export default ProductUpdate;
