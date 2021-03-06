import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Loader from "../../App/layout/Loader";
import { Form, Row, Col, Card, Button, Table } from "react-bootstrap";
import { message, Modal, DatePicker, Popconfirm } from "antd";
import * as moment from "moment";
const { RangePicker } = DatePicker;
function Coupon() {
  const [coupons, setCoupons] = useState(undefined);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [updated, setUpdated] = useState({});
  const [created, setCreated] = useState({});
  useEffect(() => {
    fetchCoupons();
  }, []);
  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get("/coupon");
      if (!data.error) setCoupons(data.coupon);
      else throw new Error(data.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleDelete = async (_id) => {
    try {
      const { data } = await axios.delete(`/coupon/${_id}`);
      if (!data.error) {
        message.success("Delete coupons successful");
        fetchCoupons();
      } else throw new Error(data.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleCreate = async () => {
    try {
      const { data } = await axios.post("/coupon/create", created);
      if (!data.error) {
        message.success("Create discount successful");
        fetchCoupons();
        setModalCreate(false);
      } else throw new Error(data.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleUpdate = async () => {
    try {
      console.log(updated);
      const { data } = await axios.put(`/coupon/${updated._id}`, updated);
      if (!data.error) {
        message.success("Create discount successful");
        fetchCoupons();
        setModalUpdate(false);
      } else throw new Error(data.message);
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };
  const handleInputOnChange = (e) => {
    setUpdated({ ...updated, [e.target.id]: e.target.value });
  };
  const handleInputCreateChange = (e) => {
    setCreated({ ...created, [e.target.id]: e.target.value });
  };
  if (coupons)
    return (
      <>
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title as="h5">DISCOUND</Card.Title>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalCreate(true);
                  }}>
                  + NEW DISCOUNT
                </Button>
              </Card.Header>
              <Card.Body>
                <Table className="text-center" responsive variant="dark" hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>TITLE</th>
                      <th>DISCOUNT</th>
                      <th>CODE</th>
                      <th>BEGIN</th>
                      <th>END</th>
                      <th>MIN</th>
                      <th>MAX</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((cou, i) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{cou.title}</td>
                          <td style={{ maxWidth: "150px" }}>
                            <p className="text-truncate">
                              {cou.discount * 100}%
                            </p>
                          </td>
                          <td>{cou.code}</td>
                          <td>{moment(cou.begin).format("DD/MM/YYYY")}</td>
                          <td>{moment(cou.end).format("DD/MM/YYYY")}</td>
                          <td>{cou.min}</td>
                          <td>{cou.max}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="light"
                              onClick={() => {
                                setUpdated(cou);
                                setModalUpdate(true);
                              }}>
                              <i className="feather icon-edit" /> UPDATE
                            </Button>
                            <Popconfirm
                              title="Are you sure?"
                              okText="Delete"
                              cancelText="Cancel"
                              onConfirm={() => handleDelete(cou._id)}>
                              <Button size="sm" variant="danger">
                                <i className="feather icon-trash" /> DELETE
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          title="NEW DISCOUNT"
          centered
          visible={modalCreate}
          onOk={handleCreate}
          onCancel={() => setModalCreate(false)}>
          <Form>
            <Form.Group>
              <Form.Label>TITLE</Form.Label>
              <Form.Control
                type="text"
                id="title"
                value={created.title}
                onChange={handleInputCreateChange}
              />
              <Form.Label>DESCRIPTION</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                rows={5}
                value={created.description}
                onChange={handleInputCreateChange}
              />
              <Form.Label>DISCOUNT (0 - 1)</Form.Label>
              <Form.Control
                type="number"
                id="discount"
                min={0}
                max={1}
                value={created.discount}
                onChange={handleInputCreateChange}
              />
              <Form.Label>CODE</Form.Label>
              <Form.Control
                type="text"
                id="code"
                value={created.code}
                onChange={handleInputCreateChange}
              />
              <Form.Label>DATE: </Form.Label>
              <RangePicker
                className="m-3"
                onChange={(e) => {
                  setCreated({ ...created, begin: e[0]._d, end: e[1]._d });
                }}
                defaultValue={[
                  moment(new Date(), "DD/MM/YYYY"),
                  moment(new Date(), "DD/MM/YYYY"),
                ]}
                format={"DD/MM/YYYY"}
              />
              <Row>
                <Col className="col-sm-12 col-6">
                  <Form.Label>MIN PRICE TO GET DISCOUNT</Form.Label>
                  <Form.Control
                    type="number"
                    id="min"
                    value={created.min}
                    onChange={handleInputCreateChange}
                  />
                </Col>

                <Col className="col-sm-12 col-6">
                  <Form.Label>MAX DISCOUNT</Form.Label>
                  <Form.Control
                    type="number"
                    id="max"
                    value={created.max}
                    onChange={handleInputCreateChange}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal>
        <Modal
          title="UPDATE DISCOUNT"
          centered
          visible={modalUpdate}
          onOk={handleUpdate}
          onCancel={() => setModalUpdate(false)}>
          <Form>
            <Form.Group>
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" disabled value={updated._id} />
              <Form.Label>TITLE</Form.Label>
              <Form.Control
                type="text"
                id="title"
                value={updated.title}
                onChange={handleInputOnChange}
              />
              <Form.Label>DESCRIPTION</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                rows={5}
                value={updated.description}
                onChange={handleInputOnChange}
              />
              <Form.Label>DISCOUNT (0 - 1)</Form.Label>
              <Form.Control
                type="number"
                id="discount"
                min={0}
                max={1}
                value={updated.discount}
                onChange={handleInputOnChange}
              />
              <Form.Label>CODE</Form.Label>
              <Form.Control
                type="text"
                id="code"
                value={updated.code}
                onChange={handleInputOnChange}
              />
              <Form.Label>DATE: </Form.Label>
              <RangePicker
                className="m-3"
                onChange={(e) => {
                  setUpdated({ ...updated, begin: e[0]._d, end: e[1]._d });
                }}
                defaultValue={[
                  moment(new Date(updated.begin), "DD/MM/YYYY"),
                  moment(new Date(updated.end), "DD/MM/YYYY"),
                ]}
                format={"DD/MM/YYYY"}
              />
              <Row>
                <Col className="col-sm-12 col-6">
                  <Form.Label>MIN PRICE TO GET DISCOUNT</Form.Label>
                  <Form.Control
                    type="text"
                    id="min"
                    value={updated.min}
                    onChange={handleInputOnChange}
                  />
                </Col>

                <Col className="col-sm-12 col-6">
                  <Form.Label>MAX DISCOUNT</Form.Label>
                  <Form.Control
                    type="text"
                    id="max"
                    value={updated.max}
                    onChange={handleInputOnChange}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal>
      </>
    );
  return <Loader />;
}

export default Coupon;
