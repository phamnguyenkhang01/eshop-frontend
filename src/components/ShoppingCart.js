import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import OrderButton from "./OrderButton";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const ShoppingCart = ({ cart, setCart, count }) => {
  const price = cart.reduce(
    (accumulator, product) => accumulator + product.price * product.quantity,
    0
  );
  const [productQuantities, setProductQuantities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState(0);

  const url = process.env.REACT_APP_API_URL;

  const handleDelete = (id) => {
    setCart((cart) => cart.filter((product) => product.id !== id));
  };

  const handleUpdate = (id, quantity) => {
    setCart((cart) =>
      cart.map((product) =>
        product.id === id ? { ...product, quantity: quantity } : product
      )
    );
  };

  const createOrder = async (order) => {
    axios
      .post(`${url}order/create`, order, {
        hearders: { "content-type": "application/json" },
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  const [computerBase, setComputerBase] = useState([]);

  const isAddButtonDisabled = (id, currentQuantity) => {
    return false
  };

  useEffect(() => {
    axios.get(`${url}product/get/0`).then((response) => {
      setComputerBase(response.data);
    });
  }, []);

  let navigate = useNavigate();

  const order = () => {
    const remainingCart = cart.map((product) => {
      const availableQuantity = productQuantities[product.id] || 0;
      const remainingQuantity =
        product.quantity > availableQuantity
          ? product.quantity - availableQuantity
          : 0;

      return {
        ...product,
        quantity: remainingQuantity,
      };
    });

    const od = {
      date: new Date(),
      products: cart.map((product) => {
        const availableQuantity = productQuantities[product.id] || 0;
        const adjusttedQuantity =
          product.quantity > availableQuantity
            ? availableQuantity
            : product.quantity;
        return {
          ...product,
          quantity: adjusttedQuantity,
        };
      }),
    };

    if (count >= 1) {
      if (
        cart.some((product) => product.quantity > productQuantities[product.id])
      ) {
        setShowModal(true);
      }

      createOrder(od);
      setCart(remainingCart);
      setKey(prevKey=> prevKey + 1)
    }
  };

  useEffect(() => {
    const fetchProductQuantities = async () => {
      try {
        const productQuantities = await Promise.all(
          cart.map((product) =>
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
  }, []);

  const pList = cart.map((product, index) => {
    return (
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        key={product.id}
      >
        <div class="card flex-row w-75">
          <img
            class="card-img-left"
            src={"../" + product.image}
            alt={product.description}
            width="300"
          ></img>
          <div class="card-body">
            <h4 class="card-title h5, h4-sm">{product.description} </h4>
            <p class="card-text">${product.price}</p>
            { productQuantities[product.id] === 0 && 
            <p style={{color: 'red'}}>Temporarily Unavailable</p>}
          </div>
        </div>

        <div class="btn-group">
          <OrderButton
            quantity={product.quantity}
            handleDelete={handleDelete}
            id={product.id}
            handleUpdate={handleUpdate}
            isAddButtonDisabled={isAddButtonDisabled}
          />
          <a class="btn btn-info" href={"product/" + product.id} role="button">
            <i class="bi bi-info-square"></i>
          </a>
        </div>
      </li>
    );
  });

  return (
    <>
      <div class="container d-flex justify-content-center">
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center bg-success text-light">
            <h2>Shopping Cart</h2>
          </li>
          <div key={key}>
            {pList}
          </div>
        </ul>

        <hr style={{ height: "2px" }}></hr>

        <div class="d-flex justify-content-center">
          <div class="container">
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center bg-warning text-light ">
                Payment Method
              </li>
            </ul>

            <div class="row p-2">
              <div class="col" data-value="credit">
                <img
                  src="./images/paypal.jpg"
                  width="200px"
                  height="60px"
                  alt="Credit Card"
                ></img>
              </div>
              <div class="col" data-value="paypal">
                <img
                  src="./images/visa.jpg"
                  width="200px"
                  height="60px"
                  alt="Credit Card"
                ></img>
              </div>
            </div>

            <div class="row p-2">
              <div class="col">
                <lable class="pay">Name on Card</lable>
              </div>
              <div class="col">
                <input
                  type="text"
                  name="holdername"
                  placeholder="John Smith"
                ></input>
              </div>
            </div>

            <div class="row p-2">
              <div class="col">
                <label class="pay">Card Number</label>
              </div>
              <div class="col">
                <input
                  type="text"
                  name="ccno"
                  id="ccno"
                  placeholder="0000-0000-0000-0000"
                  alt="Credit Card"
                  minlength="19"
                  maxlength="19"
                ></input>
              </div>
            </div>

            <div class="row p-2">
              <div class="col">
                <label class="pay">CVV</label>
              </div>
              <div class="col">
                <input
                  type="password"
                  name="cvvno"
                  id="cvvno"
                  placeholder="&#9679;&#9679;&#9679;"
                  minlength="3"
                  maxlength="3"
                ></input>
              </div>
            </div>

            <div class="row p-2">
              <div class="col">
                <label class="pay">Expiration Date</label>
              </div>
              <div class="col">
                <input
                  type="text"
                  name="exp"
                  id="exp"
                  placeholder="MM/YY"
                  minlength="5"
                  maxlength="5"
                ></input>
              </div>
            </div>

            <div class="bg-danger d-flex justify-content-between text-light">
              <div>
                <h5>Total Items</h5>
              </div>{" "}
              <div>
                <h5>{count}</h5>
              </div>
            </div>
            <div class="bg-danger d-flex justify-content-between text-light">
              <div>
                <h5>Items Price</h5>
              </div>{" "}
              <div>
                <h5>${price.toFixed(2)}</h5>
              </div>
            </div>

            <div class="bg-danger d-flex justify-content-between text-light">
              <div>
                <h5>{computerBase.description}</h5>
              </div>{" "}
              <div>
                <h5>${computerBase.price}</h5>
              </div>
            </div>

            <div class="bg-danger d-flex justify-content-between text-light">
              <div>
                <h5>TOTAL PRICE</h5>
              </div>{" "}
              <div>
                <h5>${(price + 700).toFixed(2)}</h5>
              </div>
            </div>

            <div class="row p-2">
              {count > 0 ? (
                <button class="btn btn-warning" onClick={() => order()}>
                  {" "}
                  Place Order
                </button>
              ) : (
                <button
                  class="btn btn-success"
                  onClick={() => navigate("/productlist")}
                >
                  Select Products to Order
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Modal Component */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Order Quantity Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            The available quantity is insufficient to fulfill your order at this
            time. We will process a new order for the remaining items shortly.
            We apologize for any inconvenience this may cause and appreciate
            your understanding. Thank you.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Acknowledged
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ShoppingCart;
