"use client";
import React from "react";
import Post from "@/app/components/Post/post"; // adjust path if different

const mockPosts = [
  {
    title: "Frontend Developer",
    city: "Cairo",
    country: "Egypt",
    wage: [15, 25],
    contract: "Full-Time",
    description:
      "We are looking for a talented frontend developer with experience in React.js and Tailwind CSS.",
  },
  {
    title: "Backend Engineer",
    city: "Alexandria",
    country: "Egypt",
    wage: [20, 35],
    contract: "Part-Time",
    description:
      "Join our backend team working on scalable APIs using Node.js and PostgreSQL.",
  },
];

export default function PostsPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Job Listings</h1>
      {mockPosts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  );
}
