import { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: "orderID", order: "asc" });
  const [allOrders, setAllorders] = useState([]);

  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${url}order/getall`).then((response) => {
      setAllorders(response.data);
      setOrders(response.data);
    });
  }, []);

  // Function to sort orders by column
  const sortOrders = (column) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc"; 
    const sortedOrders = [...allOrders].sort((a, b) => {
      if (newOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setSortOrder({ column, order: newOrder });
    setOrders(sortedOrders);
  };

  const cancelOrder = async (id) => {
    axios
      .delete(`${url}order/cancel/` + id)
      .then((response) => {
        const updatedOrders = orders.filter((order) => order.orderID !== id);
        setOrders(updatedOrders);
      });
  };

  const oList = orders.map((order) => (
    <tr key={order.id}>
      <td className={sortOrder.column === "orderID" ? "table-info" : ""}>
        {order.orderID}
      </td>
      <td>{order.description}</td>
      <td className={sortOrder.column === "price" ? "table-info" : ""}>
        ${order.price}
      </td>
      <td className={sortOrder.column === "date" ? "table-info" : ""}>
        {new Date(order.date).toLocaleDateString()}
      </td>
      <td className="text-end">
        <div className="btn-group w-100 d-flex flex-column">
          <a
            className="btn btn-success w-100 mb-2"
            href={"orderview/" + order.orderID}
            role="button"
          >
            <i className="bi bi-info-square"></i> View
          </a>
          <a
            className="btn btn-warning w-100 mb-2"
            href={"orderUpdate/" + order.orderID}
            role="button"
          >
            <i className="bi bi-info-square"></i> Update
          </a>
          <button
            type="button"
            onClick={() => cancelOrder(order.orderID)}
            className="btn btn-danger w-100"
          >
            <i className="bi bi-x-square"></i> Cancel
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="container">
        <li className="list-group-item d-flex justify-content-between align-items-center bg-success text-light">
          <h2>Order List</h2>
        </li>
        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-hover">
            <thead className="table-info">
              <tr>
                <th
                  scope="col"
                  style={{ cursor: "pointer" }}
                  onClick={() => sortOrders("orderID")}
                >
                  ID{" "}
                  <i
                    className={
                      sortOrder.column === "orderID" && sortOrder.order === "asc"
                        ? "bi bi-sort-up"
                        : "bi bi-sort-down"
                    }
                  ></i>
                </th>
                <th scope="col">Description</th>
                <th
                  scope="col"
                  style={{ cursor: "pointer" }}
                  onClick={() => sortOrders("price")}
                >
                  Price{" "}
                  <i
                    className={
                      sortOrder.column === "price" && sortOrder.order === "asc"
                        ? "bi bi-sort-up"
                        : "bi bi-sort-down"
                    }
                  ></i>
                </th>
                <th
                  scope="col"
                  style={{ cursor: "pointer" }}
                  onClick={() => sortOrders("date")}
                >
                  Date{" "}
                  <i
                    className={
                      sortOrder.column === "date" && sortOrder.order === "asc"
                        ? "bi bi-sort-up"
                        : "bi bi-sort-down"
                    }
                  ></i>
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{oList}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Orders;
