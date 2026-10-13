// src/pages/Profile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";

export default function Profile() {
  const { profileId } = useParams();

  // Fetch user data
  const { data: user, error: userError, isLoading: userLoading } = useSWR(
    `/user/${profileId}/`,
    fetcher
  );

  // Fetch posts authored by this user
  const { data: posts, error: postsError } = useSWR(
    user ? `/post/?author__public_id=${user.public_id}` : null,
    fetcher
  );

  if (userLoading) return <div>Loading user...</div>;
  if (userError || !user) return <div>Failed to load user.</div>;
  if (postsError) return <div>Failed to load posts.</div>;
  if (!posts) return <div>Loading posts...</div>;

  return (
    <div>
      <h1>Profile: {user.username}</h1>
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.public_id}>{post.body}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
