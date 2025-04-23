// app/layout.jsx
import "./globals.scss";

export const metadata = {
  title: "Resume Screening App",
  description: "AI-powered resume screening application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
