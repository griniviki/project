// src/hooks/node.js
import axios from "axios";
import useSWR from "swr";

const nodeBaseURL = "http://localhost:5000"; // ✅ Node backend

// Axios instance for Node
const nodeAPI = axios.create({
  baseURL: nodeBaseURL,
});

// SWR fetcher for Node
const nodeFetcher = async (url) => {
  const res = await nodeAPI.get(url);
  return res.data;
};

// Example hook: fetch posts for a user
function usePosts(publicId) {
  const { data, error, mutate } = useSWR(
    publicId ? `/posts/${publicId}` : null,
    nodeFetcher
  );

  return {
    posts: data?.results || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// Example hook: fetch all posts
function useAllPosts() {
  const { data, error, mutate } = useSWR("/posts", nodeFetcher);

  return {
    posts: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export { usePosts, useAllPosts, nodeAPI };
