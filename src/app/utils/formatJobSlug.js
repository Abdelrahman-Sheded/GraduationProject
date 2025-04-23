// utils/formatFilename.js
export const formatJobSlug = (filename) => {
  // Remove .pdf extension if present
  const withoutExtension = filename.replace(/\.pdf$/i, "");

  // Convert to lowercase and replace underscores with hyphens
  return withoutExtension.toLowerCase().replace(/_/g, "-");
};
