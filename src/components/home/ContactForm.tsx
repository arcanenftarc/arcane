"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [notice, setNotice] = useState("");

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(siteConfig.copy.formNote);
      }}
    >
      <ul className={styles.grid}>
        <li>
          <label className="visually-hidden" htmlFor="contact-name">
            Name
          </label>
          <input id="contact-name" name="name" type="text" placeholder="Your Name *" required />
        </li>
        <li>
          <label className="visually-hidden" htmlFor="contact-email">
            Email
          </label>
          <input id="contact-email" name="email" type="email" placeholder="Your Email *" required />
        </li>
        <li>
          <label className="visually-hidden" htmlFor="contact-phone">
            Phone
          </label>
          <input id="contact-phone" name="phone" type="text" placeholder="Your Phone (optional)" />
        </li>
        <li>
          <label className="visually-hidden" htmlFor="contact-topic">
            Topic
          </label>
          <input id="contact-topic" name="topic" type="text" placeholder="Topic (optional)" />
        </li>
        <li className={styles.full}>
          <label className="visually-hidden" htmlFor="contact-message">
            Message
          </label>
          <textarea id="contact-message" name="message" placeholder="Your Message *" required rows={6} />
        </li>
        <li className={styles.full}>
          <label className={styles.check}>
            <input type="checkbox" required />
            <span>{siteConfig.copy.formConsent}</span>
          </label>
          <div className={styles.submit}>
            <Button type="submit" full>
              Send Message
            </Button>
          </div>
        </li>
      </ul>
      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
