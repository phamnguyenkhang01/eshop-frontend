import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ModalPopUp = ({showModal, setShowModal}) => {
  return (
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
  )
}
export default ModalPopUp;
