"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ui/hire-me-popup.module.css";

const HireMePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: initial, 2: form, 3: success
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<{ email?: string; company?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleYesClick = () => setStep(2);
  const handleNoClick = () => setIsOpen(false);

  const validate = () => {
    const newErrors: { email?: string; company?: string } = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    if (!company) newErrors.company = "Company name is required.";
    else if (company.length > 45) newErrors.company = "Company name must be 45 characters or less.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });

      const result = await response.json();

      if (!response.ok) {
        // This will catch the rate limit error (status 429) or other server errors
        throw new Error(result.message || "Something went wrong. Please try again.");
      }

      setStep(3); // Move to success step
    } catch (error: any) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setEmail("");
      setCompany("");
      setErrors({});
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div ref={popupRef} className={styles.popup}>
        {step === 1 && (
          <>
            <h2>I am looking for a job. Would you like to hire me?</h2>
            <div className={styles.buttonContainer}>
              <button className={`${styles.button} ${styles.yesButton}`} onClick={handleYesClick}>
                Yes
              </button>
              <button className={`${styles.button} ${styles.noButton}`} onClick={handleNoClick}>
                No
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2>Great! Please provide your details.</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? styles.inputError : ""}
                required
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.labelContainer}>
                <label htmlFor="company">Company</label>
                <span className={styles.charCounter}>{company.length}/45</span>
              </div>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={45}
                className={errors.company ? styles.inputError : ""}
                required
              />
              {errors.company && <p className={styles.errorText}>{errors.company}</p>}
            </div>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
            {errors.form && (
              <p className={`${styles.errorText} ${styles.formError}`}>{errors.form}</p>
            )}
          </form>
        )}

        {step === 3 && (
          <div className={styles.successMessage}>
            <h2>Thank you!</h2>
            <p>Your inquiry has been received. I will be in touch shortly.</p>
            <button className={`${styles.button} ${styles.submitButton}`} onClick={resetForm}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireMePopup;
