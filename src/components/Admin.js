import { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${url}product/getall`).then((response) => {
      setProducts(response.data);
    });
  }, []);  

  const pList = products.map((product) => (
    <li 
      className="list-group-item d-flex justify-content-between align-items-center"
      key={product.id}
      style={{
        color: product.quantity === 0 ? 'red' : 'blue',
        whiteSpace: 'nowrap',  // Prevent wrapping of text
        overflow: 'hidden',    // Prevent overflow
        textOverflow: 'ellipsis' // Add ellipsis if text is too long
      }}
    >
      <div className="flex-grow-1" style={{ maxWidth: '70%' }}>
        {product.description} ${product.price} {product.quantity === 0 ? 'Out of Stock' : product.quantity}
      </div>
      <div className="btn-group ms-auto" style={{ flexWrap: 'wrap', maxWidth: '30%' }}>
        <a className="btn btn-success btn-sm" href={'product/' + product.id} role="button">
          <i className="bi bi-info-square"></i> View
        </a>
        <a className="btn btn-warning btn-sm" href={'productUpdate/' + product.id} role="button">
          <i className="bi bi-pencil-square"></i> Edit
        </a>
        <button
          type="button"
          onClick={() => deleteProduct(product.id)}
          className="btn btn-danger btn-sm"
        >
          <i className="bi bi-x-square"></i> Delete
        </button>
      </div>
    </li>
  ));

  const deleteProduct = async (id) => {
    axios.delete(`${url}product/delete/` + id).then((response) => {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
    });
  };

  return (
    <>
      <div className="container">
        <ul className="list-group">
          <li className="list-group-item d-flex justify-content-between align-items-center bg-success text-light">
            <h2>Product List</h2>
            <div className="ms-auto">
              <a className="btn btn-info btn-sm" href={'productCreate'} role="button">
                <i className="bi bi-plus-square"></i> Create
              </a>
            </div>
          </li>
          {pList}
        </ul>
      </div>
    </>
  );
};

export default Admin;
