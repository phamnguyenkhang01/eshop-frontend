import OrderButton from"./OrderButton";
import axios from "axios";
import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import ModalPopUp from "./Modal";

const OrderUpdate = () => {
    let [order, setOrder] = useState({});
    let [newOrder, setNewOrder] = useState([]);
    let {id} = useParams();
    const [localTotal, setLocalTotal] = useState(0);
    const [localDesc, setLocalDesc] = useState(0);
    const [productQuantities, setProductQuantities] = useState([]);
    const [productList, setProductList] = useState()
    const [showModal, setShowModal] = useState(false);

    const url = process.env.REACT_APP_API_URL;

    const handleDelete = (id) => {
      setNewOrder((newOrder)=>({
        ...newOrder,
        products : newOrder.products.filter((product) => product.id !== id)
      }));
    }

    const handleUpdate = (id, quantity) => {
     
      setNewOrder((newOrder)=({
        ...newOrder,
        products: newOrder.products.map((product)=>
          product.id === id ? {...product, quantity : quantity} : product
        ),
      }));

      if (newOrder.products?.reduce((total,product) => total + parseInt(product.quantity), 0) === 0)
        cancelOrder(newOrder.orderID);
    };
    
    const isAddButtonDisabled = (id, currentQuantity) => {
      const storageQuantity = productQuantities[id]
      return currentQuantity >= storageQuantity + order.products.find((item) => item.id === id)?.quantity;
    };

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



    useEffect(() =>{
      axios.get(`${url}order/get/` + id).then((response) => {
        setOrder(response.data);
        setNewOrder(response.data);
        setLocalTotal(response.data.price);
      });
    }, [id]);
    let navigate = useNavigate();
    let count = newOrder.products?.reduce((total,product) => total + parseInt(product.quantity), 0);
    

    useEffect(() => {
      if(newOrder.products){
        const total = newOrder.products.reduce(
          (total,product) => total + parseInt(product.quantity) * product.price, 700);
          setLocalTotal(total);
        const description = "Default Computer + " +  newOrder.products.map((product) =>  product.description).join(" + ") ;
          setLocalDesc(description);
      }
    }, [newOrder.products]);
   

    const oList = newOrder.products?.map((product, index) =>
      <li class ="list-group-item d-flex justify-content-between align-items-center" key={product.id}>
        <h4>{index+1}.&nbsp;</h4>
        <div class="card flex-row w-100">
          <img class="card-img-left" src={'../'+product.image} alt={product.description} width="300"></img>
            <div class="card-body">
                <h4 class="card-title ht, h4-sm">{product.description}</h4>
                <p class="card-text">${product.price}</p>
                <p class="card-text">Quantity: {product.quantity}</p>
             </div> 
        </div>
        <div class="btn-group">
          <OrderButton quantity={product.quantity} handleDelete={handleDelete} id={product.id} handleUpdate={handleUpdate} isAddButtonDisabled={isAddButtonDisabled}/>
        </div>
        </li>
      )

      const cancelOrder = async (id) => {
        axios.delete(`${url}order/cancel/`+id).then((response)=>{
          navigate("/orders");
        }
      );
      }

      const updateOrder = async (id) => {

        for (const newProduct of newOrder.products){
          const oldQuantity = (order.products.find(product => product.id === newProduct.id)).quantity
          const count = newProduct.quantity - oldQuantity
          const storageQuantity = productQuantities[newProduct.id]
          console.log('Line 113 : ', oldQuantity, ' and ', (count > storageQuantity) ? storageQuantity : count)
          handleUpdate(newProduct.id, oldQuantity +  (count >= storageQuantity ? storageQuantity : count))
          setShowModal(count > storageQuantity ? true : false ); 
        }

        setNewOrder((newOrder)=({
          ...newOrder,
          price : localTotal,
          description : localDesc
        }));
        axios.put(`${url}order/update`, JSON.stringify(newOrder), {headers: {'content-type':'application/json'}}).then((response)=>{
          console.log(response.data);
        });

      }

      console.log("Line 120: ", order)
      console.log("Line 121: ", newOrder)
  
    return (
      <>
        <div class="container">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center bg-success text-light"><h2>Order #: {newOrder.orderID}</h2>
            <div class="align-right"><a class="btn btn-info" href="/orders">Back to Order list</a></div>
            <div class="align-right"><a class="btn btn-warning" role="button" onClick={()=> updateOrder(newOrder.orderID)}><i class="bi bi-plus=square"></i>Finish Update</a></div>
            <div class="align-right"><a class="btn btn-primary" href={`/orderUpdate/${newOrder.orderID}/add-products`} role="button">Add A Product</a></div>
            <div class="align-right"><a class="btn btn-danger" role="button" onClick={()=> cancelOrder(newOrder.orderID)}><i class="bi bi-plus=square"></i>Cancel Order</a></div>
            </li>  
          <div class="card bg-secondary">

            <div class="card-body d-flex justify-content-between align-items-center">
                <h5 class="card-title">Order Placed: {new Date(newOrder.date).toLocaleDateString()}</h5>
                <h5 class="card-title">Items:{count}</h5>
                
                <h5 class="card-title">Total: ${localTotal.toFixed(2)}</h5>   
                <p class="card-text">Order Description: {localDesc}</p>   
            </div>
          </div>
          <ModalPopUp showModal={showModal} setShowModal={setShowModal}/>
          {oList}
          </ul> 

          <hr style={{height:"2px"}}></hr>             
        </div>                      
      </>
    );
}

export default OrderUpdate;