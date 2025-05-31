// app/chat/layout.tsx
import { ReactNode } from "react";
import ControlPanel from "@/app/components/ControlPanel/controlPanel";
import NavigationControls from "@/app/components/NavigationControls/NavigationControls";
import styles from "./layout.module.scss";

// app/layout.jsx

export const metadata = {
  title: "Resume Screening App",
  description: "AI-powered resume screening application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={styles.chatLayout}>
          <NavigationControls>
            <ControlPanel />
          </NavigationControls>
          <main className={styles.mainContent}>{children}</main>
        </div>
      </body>
    </html>
  );
}
