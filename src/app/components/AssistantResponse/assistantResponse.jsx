"use client";
import React from "react";
import styles from "./AssistantResponse.module.scss";

function AssistantResponse({ response }) {
  return (
    <div className={styles.assistantBubble}>
      <div className={styles.responseContent}>{response}</div>
    </div>
  );
}

export default AssistantResponse;
