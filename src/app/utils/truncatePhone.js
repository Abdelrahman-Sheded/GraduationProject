export default function truncatePhone(phoneNumber) {
  if (!phoneNumber) return "N/A";

  const digits = String(phoneNumber).replace(/\D/g, "");

  // 1. Handle full Egyptian number: starts with 20 and has at least 12 digits
  if (digits.startsWith("20") && digits.length >= 12) {
    const local = digits.slice(2, 12);
    return `+20 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(
      6,
      10
    )}`;
  }

  // 2. Handle Egyptian local numbers: starts with 0 and has 11 digits (don't add +20)
  if (digits.startsWith("0") && digits.length >= 11) {
    const local = digits.slice(0, 11); // Keep the 0 here
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 11)}`;
  }

  // 5. If nothing valid, return original
  return phoneNumber;
}
