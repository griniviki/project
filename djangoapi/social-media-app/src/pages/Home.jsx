import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Row, Col, Form, Button, Card, Modal, Badge } from "react-bootstrap";
import useSWR from "swr";
import { fetcher, fetchUser, authAxios, nodeFetcher } from "../helpers/axios";
import CreatePost from "../components/posts/CreatePost";
import "./Home.css";

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
    return translation ? translation.title : this.metadata[0]?.title || "Untitled";
  }

  getBody(langCode = "en") {
    const translation = this.metadata.find(m => m.language.code === langCode);
    return translation ? translation.body : this.metadata[0]?.body || this.body;
  }

  summary(langCode = "en", length = 50) {
    const text = this.getBody(langCode);
    return text && text.length > length ? text.slice(0, length) + "..." : text;
  }
}

// ----------------------
// Home Component
// ----------------------
function Home() {
  const posts = useSWR("/post/", fetcher);
  const { data: userData, error: userError, isLoading: userLoading, mutate: refreshUser } = useSWR("/auth/me/", fetchUser);

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

  const postObjects = Array.isArray(posts.data)
    ? posts.data.map((p) => new PostModel(p))
    : [];

  const [phoneInput, setPhoneInput] = useState(user ? user.phoneNumber : "");
  const [salaryInput, setSalaryInput] = useState(user ? user.salary : "");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  // ✅ Node posts state
  const [nodePosts, setNodePosts] = useState([]);

  useEffect(() => {
    nodeFetcher("/api/post") // ✅ no trailing slash
      .then((data) => {
        console.log("Node posts:", data);
        setNodePosts(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch Node posts", err);
      });
  }, []);


  
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
      setShowSalaryModal(false);
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

              <Button
                variant="primary"
                className="mb-3"
                onClick={() => setShowSalaryModal(true)}
              >
                Update Salary
              </Button>

              <p>
                Your salary before taxes is {user.get_salary_info().beforeTaxes}, 
                and after taxes is {user.get_salary_info().afterTaxes}
              </p>

              {/* Salary Modal */}
              <Modal
                show={showSalaryModal}
                onHide={() => setShowSalaryModal(false)}
                centered
                size="lg"
                className="salary-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Update Salary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group>
                      <Form.Label>Salary (before taxes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={salaryInput}
                        onChange={(e) => setSalaryInput(e.target.value)}
                        placeholder="Enter salary"
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowSalaryModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" onClick={handleSalaryUpdate}>
                    Save Salary
                  </Button>
                </Modal.Footer>
              </Modal>

              <CreatePost refresh={posts.mutate} />
            </>
          ) : (
            <p className="text-muted">Login required to create a post.</p>
          )}

          <h2>Django Posts</h2>
          {postObjects.length > 0 ? (
            postObjects.map((post) => (
              <Card key={post.id || post.public_id} className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {post.getTitle(selectedLanguage)}{" "}
                    <Badge bg="secondary">Django</Badge>
                  </Card.Title>
                  <Card.Text>{post.summary(selectedLanguage)}</Card.Text>
                  {post.linguistics_type !== "none" && (
                    <p className="text-muted">
                      Linguistics: <strong>{post.linguistics_type}</strong>
                    </p>
                  )}
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No Django posts yet.</p>
          )}

          <h2>Node Posts</h2>
          {nodePosts.length > 0 ? (
            nodePosts.map((post) => {
              const translation = post.metadata.find(m => m.language?.code === selectedLanguage);
              const title = translation?.title || post.metadata[0]?.title || "Untitled";
              const body = translation?.body || post.metadata[0]?.body || post.body;

              return (
                <Card key={post.public_id} className="mb-3 border-info">
                  <Card.Body>
                    <Card.Title>
                      {title} <Badge bg="info">Node</Badge>
                    </Card.Title>
                    <Card.Text>{body}</Card.Text>
                    {post.linguistics_type !== "none" && (
                      <p className="text-muted">
                        Linguistics: <strong>{post.linguistics_type}</strong>
                      </p>
                    )}
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p>No Node posts yet.</p>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;