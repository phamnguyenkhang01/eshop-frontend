// This is add product to exisiting order

import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

import Select from "./Select";

const ProductOrder = () => {
    const [newProduct, setNewProduct] = useState([]);
    const [quantity, setQuantity] = useState(1);
    let [order, setOrder] = useState({});
    const [productQuantities, setProductQuantities] = useState([]);

    let {productId} = useParams();
    let {id} = useParams();

    const url = process.env.REACT_APP_API_URL;

    console.log("Line 19", typeof(quantity))


    useEffect(() => {
        axios.get(`${url}product/get/` + productId).then((response) => {
          setNewProduct(response.data);
        });
      }, []); 

    useEffect(() => {
      axios.get(`${url}order/get/` + id).then((response) => {
        setOrder(response.data);
      });
    }, [id]);

    useEffect(() => {
      const fetchProductQuantities = async () => {
        console.log("Line 37: ", order.products);
        try {
          const productQuantities = await Promise.all(
            order.products.map((product) =>
              axios.get(`${url}product/get/${product.id}`)
            )
          );
          const quantities = {};
          productQuantities.forEach((response) => {
            const productData = response.data;
            quantities[productData.id] = productData.quantity;
          });
          setProductQuantities(quantities);
        } catch (error) {
          console.error("Error fetching product quantity: ", error);
        }
      };
      fetchProductQuantities();
    }, [order]);
    
    console.log("Line 33: ", order)

      newProduct.quantity = quantity;
      console.log("Line 34: ", newProduct)


      let navigate = useNavigate();
      console.log("Line 85: ", productQuantities)

    const addProduct = async () => {
      setOrder((prevOrder) => {
        const productIndex = order?.products?.findIndex(
          product=> product.id === newProduct.id
        );

        console.log("Line 45: ", prevOrder.products)
        console.log("Line 46: ", quantity)
        console.log("Line 74: ", productIndex)

        let updatedProducts = [];
        let updatedDescription = "";

        // if (productIndex !== -1){
        //   updatedProducts = prevOrder.products.map((product, index) => 
        //   index === productIndex
        //   ? {...product, quantity: product.quantity + parseInt(quantity)}
        //   : product);
        // }else {
        //   updatedProducts = [...prevOrder.products, newProduct]
        // }

        if (productIndex !== -1){
          updatedProducts = prevOrder.products.map((product, index) =>{
            if (index === productIndex){
              const storage = productQuantities[productId]
              console.log("Line 92: ", quantity, " and ", storage)
              return {...product, quantity: quantity + (quantity > storage ? storage : quantity) }
            }else return product
          })
        }else{
          updatedProducts = [...prevOrder.products, newProduct]
        }


        console.log("Line 60: ", updatedProducts)

        const updatedPrice = updatedProducts.reduce(
          (total, product) => total + product.price * product.quantity,
          700
        );

        console.log("Line 76: ", updatedProducts)


        const updatedOrder ={
          ...prevOrder,
          description: 
            productIndex !== -1
              ? prevOrder.description
              : prevOrder.description + " + " + newProduct.description,
          products: updatedProducts,
          price: updatedPrice
        }

        
      console.log("Line 55: ", updatedOrder)

        axios.put(`${url}order/update`, JSON.stringify(updatedOrder), {headers: {'content-type':'application/json'}}).then((response)=>{
          console.log("Response: ",response.data);
        }).catch((error) =>{
          console.error("Error updating order: ", error);
        });

        return updatedOrder;
      });
    }


    
  

    return (
        <div class="card" style={{width: '30%'}}>
            <img class="card-img-top" src={'../../'+newProduct.image} alt={newProduct.description}></img>
            <div class="card-body">
                <h5 class="card-title">{newProduct.description}</h5>
                <h6 class="card-title">${newProduct.price}</h6>
                <h6 class="card-title">Quantity: {newProduct.quantity}</h6>                              
                <p class="card-text">{newProduct.description}</p>
                <p class="card-text"><Select desc={"Quantity"} n={10} setQuantity={setQuantity}/></p>              
                <a class="btn btn-warning" role="button" onClick={()=> addProduct()}><i class="bi bi-plus=square"></i>Add to Order</a>
            </div>
        </div>
    );
}

export default ProductOrder;
