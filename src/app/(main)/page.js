import ControlPanel from "../components/ControlPanel/controlPanel";
import styles from "./page.module.scss";
// app/layout.jsx
export const metadata = {
  title: "Home - ResumeGPT",
  description: "AI-powered resume screening assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
