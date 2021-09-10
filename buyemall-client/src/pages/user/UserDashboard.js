import React, { useState, useEffect } from "react";
import UserNav from "../../components/navs/UserNav";
import { getUserOrders } from "../../actions/order";
import { useSelector } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Skeleton } from "antd";
import Invoice from "../../components/order/Invoice";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () => {
    return getUserOrders(user.token).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setLoading(false)
      setOrders(res.data);
    });
  }

  const renderOrderInTable = (order) => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
        </tr>
      </thead>

      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td>
              <b>{p.product.title}</b>
            </td>
            <td>{p.product.price}</td>
            <td>{p.product.brand}</td>
            <td>{p.color}</td>
            <td>{p.count}</td>
            <td>
              {
                (p.product.shipping === "Yes")
                ? <CheckCircleOutlined style={{ color: "green" }} />
                : <CloseCircleOutlined style={{ color: "red" }} />
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      fileName="invoice.pdf"
      className="btn btn-sm btn-block btn-outline-primary"
    >Download PDF</PDFDownloadLink>
  );

  const renderAllOrders = () =>
    orders.map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {renderOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {loading ? <Skeleton active></Skeleton> : (orders.length > 0) ? "User purchase orders" : "No purchase orders" }
          </h4>
          {renderAllOrders()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
