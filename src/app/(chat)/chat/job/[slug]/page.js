// src/app/job/[slug]/page.js
import { notFound } from "next/navigation";
import JobPageClient from "./JobPageClient";

export async function generateStaticParams() {
  const res = await fetch("http://localhost:8000/job-requirements/list");
  const { job_files } = await res.json();

  return job_files.map((job) => ({
    slug: generateSlug(job.filename), // Only use filename
  }));
}

// src/app/chat/job/[slug]/page.js
async function getJobData(slug) {
  const res = await fetch("http://localhost:8000/job-requirements/list");
  const { job_files } = await res.json();

  // Match purely by filename-derived slug
  const job = job_files.find((j) => generateSlug(j.filename) === slug);

  if (!job) return null;

  const details = await fetch(
    `http://localhost:8000/job-requirements?path=${encodeURIComponent(
      job.path
    )}`
  );
  return await details.json();
}

function generateSlug(filename) {
  return filename
    .toLowerCase()
    .replace(/\.pdf$/i, "") // Remove .pdf (case insensitive)
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
}

export default async function JobPage({ params }) {
  const job = await getJobData(params.slug);
  if (!job) notFound();

  return <JobPageClient job={job} />;
}
