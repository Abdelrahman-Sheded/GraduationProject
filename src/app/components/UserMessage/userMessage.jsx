"use client";
import React from "react";
import styles from "./UserMessage.module.scss";

function UserQuery({ message }) {
  return (
    <div className={styles.userMessageWrapper}>
      <div className={styles.userMessageBubble}>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default UserQuery;
