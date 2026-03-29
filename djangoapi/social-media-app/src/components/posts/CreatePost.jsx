// src/components/posts/CreatePost.jsx
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { getUser } from "../../hooks/user.actions";
import Toaster from "../Toaster";

function CreatePost({ refresh }) {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [validated, setValidated] = useState(false);

  const [form, setForm] = useState({
    body: "",
    language: "uk",
    category: 1,
    title: "",
    metaBody: "",
    linguistics_type: "none",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    const data = {
      body: form.body,
      linguistics_type: form.linguistics_type,
      metadata: [
        {
          language: form.language,
          category: form.category,
          title: form.title,
          body: form.metaBody,
        },
      ],
    };

    try {
      await axiosService.post("/post/", data);
      handleClose();
      setToastMessage("Post created 🚀");
      setToastType("success");
      setForm({
        body: "",
        language: "uk",
        category: 1,
        title: "",
        metaBody: "",
        linguistics_type: "none",
      });
      setShowToast(true);
      refresh();
    } catch (err) {
      const backendError =
        err.response?.data && typeof err.response.data === "object"
          ? JSON.stringify(err.response.data)
          : err.message;

      setToastMessage(`Error: ${backendError}`);
      setToastType("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <Form.Group className="my-3 w-75">
        <Form.Control
          className="py-2 rounded-pill border-primary text-primary"
          type="text"
          placeholder="Write a post"
          onClick={handleShow}
        />
      </Form.Group>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>

        <Modal.Body className="border-0">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Post Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Linguistics Type</Form.Label>
              <Form.Select
                value={form.linguistics_type}
                onChange={(e) =>
                  setForm({ ...form, linguistics_type: e.target.value })
                }
              >
                <option value="none">None</option>
                <option value="grammar">Grammar</option>
                <option value="lexis">Lexis</option>
                <option value="phonetics">Phonetics</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              >
                <option value="uk">Ukrainian</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="de">Deutsch</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: Number(e.target.value) })
                }
              >
                <option value={1}>Grammar</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Metadata Title</Form.Label>
              <Form.Control
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Metadata Body</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.metaBody}
                onChange={(e) => setForm({ ...form, metaBody: e.target.value })}
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit} disabled={!form.body}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster
        title="Post!"
        message={toastMessage}
        showToast={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}

export default CreatePost;