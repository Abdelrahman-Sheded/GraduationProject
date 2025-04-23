// app/chat/layout.tsx
import { ReactNode } from "react";
import ControlPanel from "@/app/components/ControlPanel/controlPanel";
import styles from "./layout.module.scss";

export default function ChatLayout({ children }) {
  return (
    <div className={styles.chatLayout}>
      <div className={styles.fixedControlPanel}>
        <ControlPanel />
      </div>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
