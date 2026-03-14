// src/pages/Home.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import useSWR from "swr";  // React data‑fetching library
import { fetcher, fetchUser, authAxios } from "../helpers/axios";
import CreatePost from "../components/posts/CreatePost";

// ✅ Classes
class User {
  constructor(id, public_id, username, email, name, tel = "", country = "Україна") {
    this.id = id;
    this.public_id = public_id;
    this.username = username;
    this.email = email;
    this.name = name || username;
    this.country = country;

    this.phoneNumber = tel || "";
    this.isVerified = !!tel; // auto-verified if phone exists
  }

  contactInfo() {
    return `a user ${this.name} with email ${this.email}`;
  }

  addPhone(number) {
    this.phoneNumber = number;
    this.verify();
  }

  verify() {
    this.isVerified = true;
  }

  statusLabel() {
    return this.isVerified ? "Verified" : "Not verified";
  }
}

class PostModel {
  constructor(data) {
    Object.assign(this, data);
  }

  summary() {
    return this.body && this.body.length > 50
      ? this.body.slice(0, 50) + "..."
      : this.body;
  }
}

function Home() {
  const posts = useSWR("/post/", fetcher);
  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
    mutate: refreshUser,
  } = useSWR("/auth/me/", fetchUser);
  // condition ? valueIfTrue : valueIfFalse
  // if ...else, If we got user data from the server, wrap it in a User object. If not, set user to null.
  const user = userData
    ? new User(
        userData.id,
        userData.public_id,
        userData.username,
        userData.email,
        userData.name,
        userData.tel
      )
    : null;

  const postObjects = Array.isArray(posts.data)
    ? posts.data.map((p) => new PostModel(p))
    : [];
console.log(posts.data)
  const [phoneInput, setPhoneInput] = useState(user ? user.phoneNumber : "");

  const handlePhoneUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await authAxios.patch(`/user/${user.public_id}/`, { tel: phoneInput });
      user.addPhone(phoneInput);
      refreshUser();
      alert("Phone number updated!");
    } catch (err) {
      alert("Failed to update phone number.");
    }
  };

  return (
    <Layout>
      <Row className="justify-content-center">
        <Col sm={8}>
          {userLoading && <p>Loading user...</p>}
          {userError && <p className="text-danger">Failed to load user.</p>}

          {user ? (
            <>
              <p>Logged in as {user.contactInfo()}</p>
              <p>
                Телефон: {user.phoneNumber || "—"} — {user.statusLabel()}
              </p>

              <Form onSubmit={handlePhoneUpdate} className="mb-3">
                <Form.Group>
                  <Form.Label>Update Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">
                  Save Phone
                </Button>
              </Form>

              <CreatePost refresh={posts.mutate} />
            </>
          ) : (
            <p className="text-muted">Login required to create a post.</p>
          )}

          <h2>Posts</h2>
          {postObjects.length > 0 ? (
            postObjects.map((post) => (
              <Card key={post.id || post.public_id} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.title || "Untitled"}</Card.Title>
                  <Card.Text>{post.summary()}</Card.Text> {/* 👈 Direct call */}
                  <Button variant="link">Read more</Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;