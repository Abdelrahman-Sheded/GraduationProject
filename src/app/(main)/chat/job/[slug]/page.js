import { notFound } from "next/navigation";
import JobPageClient from "./JobPageClient";

// Use dynamic rendering to support new slugs without rebuilds
export const dynamic = "force-dynamic";

async function getJobData(slug) {
  try {
    // 1. List all jobs
    const listRes = await fetch("http://localhost:8000/job-requirements/list", {
      cache: "no-store",
    });
    if (!listRes.ok) {
      console.error("Failed to fetch job list (status):", listRes.status);
      throw new Error(`Job list error: ${listRes.status}`);
    }

    const listJson = await listRes.json();
    if (!Array.isArray(listJson.job_files)) {
      console.error("Invalid job list response:", listJson);
      throw new Error("Invalid job list response");
    }

    // 2. Find the job by slug
    const job = listJson.job_files.find((j) => j.slug === slug);
    if (!job) {
      console.error(
        "No matching job for slug:",
        slug,
        listJson.job_files.map((j) => j.slug)
      );
      return null;
    }

    // 3. Fetch job details
    const detailsUrl = `http://localhost:8000/job-requirements/details?path=${encodeURIComponent(
      job.path
    )}`;
    const detailsRes = await fetch(detailsUrl, { cache: "no-store" });
    if (!detailsRes.ok) {
      const errorBody = await detailsRes.text();
      console.error(
        "Failed to fetch job details",
        "Status:",
        detailsRes.status,
        "Body:",
        errorBody
      );
      throw new Error(`Job details error: ${detailsRes.status} - ${errorBody}`);
    }

    const details = await detailsRes.json();
    return { ...job, ...details };
  } catch (err) {
    console.error("getJobData error for slug", slug, err);
    return null;
  }
}

export default async function JobPage({ params: { slug } }) {
  const job = await getJobData(slug);
  if (!job) {
    // Trigger Next.js 404
    notFound();
  }
  return <JobPageClient job={job} />;
}
