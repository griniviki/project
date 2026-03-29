// src/pages/Home.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import useSWR from "swr";
import { fetcher, fetchUser, authAxios } from "../helpers/axios";
import CreatePost from "../components/posts/CreatePost";

// ----------------------
// User class
// ----------------------
class User {
  constructor(id, public_id, username, email, name, tel = "", salary = "", salary_after_taxes = "") {
    this.id = id;
    this.public_id = public_id;
    this.username = username;
    this.email = email;
    this.name = name || username;

    this.phoneNumber = tel || "";
    this.isVerified = !!tel;
    this.salary = salary;
    this.salary_after_taxes = salary_after_taxes;
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

  get_salary_info() {
    return {
      beforeTaxes: this.salary,
      afterTaxes: this.salary * (1 - 0.23),
    };
  }
}

// ----------------------
// Base PostModel
// ----------------------
class PostModel {
  constructor(data) {
    Object.assign(this, data);
    this.metadata = data.metadata || [];
  }

  getTitle(langCode = "en") {
    const translation = this.metadata.find(m => m.language.code === langCode);
    return translation ? translation.title : "Untitled";
  }

  getBody(langCode = "en") {
    const translation = this.metadata.find(m => m.language.code === langCode);
    return translation ? translation.body : this.body;
  }

  summary(langCode = "en", length = 50) {
    const text = this.getBody(langCode);
    return text && text.length > length ? text.slice(0, length) + "..." : text;
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

  const user = userData
    ? new User(
        userData.id,
        userData.public_id,
        userData.username,
        userData.email,
        userData.name,
        userData.tel,
        userData.salary_before_taxes,
      )
    : null;

  // Convert raw posts into PostModel objects
  const postObjects = Array.isArray(posts.data)
    ? posts.data.map((p) => new PostModel(p))
    : [];

  const [phoneInput, setPhoneInput] = useState(user ? user.phoneNumber : "");
  const [salaryInput, setSalaryInput] = useState(user ? user.salary : "");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

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

  const handleSalaryUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const salaryInfo = user.get_salary_info();
      const afterTaxes = salaryInfo.afterTaxes;

      await authAxios.patch(`/user/${user.public_id}/`, {
        salary_before_taxes: salaryInput,
        salary_after_taxes: afterTaxes,
      });
      refreshUser();
      alert("Salary updated!");
    } catch (err) {
      alert("Failed to update salary.");
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

              <Form onSubmit={handleSalaryUpdate} className="mb-3">
                <Form.Group>
                  <Form.Label>Update Salary (before taxes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="Enter salary"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">
                  Save Salary
                </Button>
              </Form>

              <p>
                Your salary before taxes is {user.get_salary_info().beforeTaxes}, 
                and after taxes is {user.get_salary_info().afterTaxes}
              </p>

              <CreatePost refresh={posts.mutate} />
            </>
          ) : (
            <p className="text-muted">Login required to create a post.</p>
          )}

          <h2>Posts</h2>

          {/* Language selector */}
          <Form.Group className="mb-3">
            <Form.Label>Select Language</Form.Label>
            <Form.Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
              <option value="es">Spanish</option>
            </Form.Select>
          </Form.Group>

          {postObjects.length > 0 ? (
            postObjects.map((post) => (
              <Card key={post.id || post.public_id} className="mb-3">
                <Card.Body>
                  <Card.Title>{post.getTitle(selectedLanguage)}</Card.Title>
                  <Card.Text>{post.summary(selectedLanguage)}</Card.Text>

                  {/* NEW: Show linguistics type */}
                  {post.linguistics_type !== "none" && (
                    <p className="text-muted">
                      Linguistics: <strong>{post.linguistics_type}</strong>
                    </p>
                  )}

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