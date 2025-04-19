"use client";
import {
  MapPin,
  Clock,
  DollarSign,
  ShareIcon,
  Edit2,
  Trash2,
} from "lucide-react";
import styles from "./post.module.scss";

function Post({ country, city, wage, description, contract, title }) {
  return (
    <div className={styles.jobPostContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.titleSection}>
          <h1 className={styles.jobTitle}>{title}</h1>
          <div className={styles.jobMeta}>
            <div className={styles.metaItem}>
              <MapPin className={styles.icon} size={18} />
              <span>
                {city}, {country}
              </span>
            </div>
            <div className={styles.metaItem}>
              <DollarSign className={styles.icon} size={18} />
              <span>
                {wage[0] + "/hr"} - {wage[1] + "/hr"}
              </span>
            </div>
            <div className={styles.metaItem}>
              <Clock className={styles.icon} size={18} />
              <span>{contract}</span>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.applyBtn}>
            <Edit2 className={styles.btnIcon} size={18} />
          </button>
          <button className={styles.applyBtn}>
            <ShareIcon className={styles.btnIcon} size={18} />
          </button>
          <button className={styles.deleteBtn}>
            <Trash2 className={styles.btnIcon} size={18} />
          </button>
        </div>
      </div>

      <div className={styles.jobDetails}>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Post;
