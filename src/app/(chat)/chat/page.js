"use client";
import React from "react";
import ControlPanel from "@/app/components/ControlPanel/controlPanel";
import MainSection from "@/app/components/MainSection/mainSection";
import Navigation from "@/app/components/Navigation/navigation";
import styles from "./page.module.scss";

function ChatPage() {
  return (
    <>
      <div className={styles.main}>
        <MainSection />
      </div>
    </>
  );
}

export default ChatPage;
