// app/layout.jsx
import "@/app/globals.scss"; // or your main CSS file

export const metadata = {
  title: "Your App Title",
  description: "Your app description here",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {" "}
      {/* ✅ required tag */}
      <body>
        {" "}
        {/* ✅ required tag */}
        {children}
      </body>
    </html>
  );
}
