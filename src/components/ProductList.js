import { useState, useEffect } from "react";
import axios from "axios";
import https from 'https';
import { useParams } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    const url = process.env.REACT_APP_API_URL;

    let {id} = useParams();

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    console.log("Line 13: ", id);

    console.log("Line 14: ", url)

    useEffect(() => {
      axios.get(`${url}product/getall`, {httpsAgent: agent})
        .then((response) => {
          console.log("Request succeeded: ", response); // log response on success
          setProducts(response.data);
        })
        .catch((error) => {
          console.error("Request failed: ", error); // log error if request fails
        });
    }, [url]);

    const pList = products.map(product =>
      <li className="list-group-item d-flex justify-content-between align-items-center"
        key={product.id} style={{color: product.quantity === 0 ? 'red' : 'blue'}}>
        {product.description} ${product.price} {product.quantity === 0 ? 'Out of Stock' : product.quantity} 
        
        <div className="btn-group">
          <a className={`btn btn-success ${product.quantity === 0 ? 'disabled' : ''}`} 
             href={!id ? 'product/' + product.id : '/orderupdate/' + id + '/' + product.id} 
             role="button" 
             aria-disabled={product.quantity === 0}>
            <i className="bi bi-cart"></i> Buy
          </a>          
        </div>
      </li>
    );
    
    return (
      <div className="container">
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center bg-success text-light">
            <h2>Product List</h2>
          </li>
          {pList}
        </ul>
      </div>
    );
};  

export default ProductList;
