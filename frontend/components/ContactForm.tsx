"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = Array.isArray(body?.message) ? body.message.join(", ") : (body?.message ?? "Something went wrong. Please try again.");
        setErrorMessage(message);
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="f-status success">Thanks — we&apos;ll be in touch to map the first sweep.</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="f-row">
        <div className="f-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required minLength={2} maxLength={120} />
        </div>
        <div className="f-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="f-row">
        <div className="f-field">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" type="text" maxLength={160} />
        </div>
        <div className="f-field">
          <label htmlFor="facilityType">Facility type</label>
          <select id="facilityType" name="facilityType" defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option value="security">OT / Security</option>
            <option value="bms">Building management</option>
            <option value="iot">Production IoT</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="f-field">
        <label htmlFor="country">Country</label>
        <input id="country" name="country" type="text" maxLength={80} />
      </div>
      <div className="f-field">
        <label htmlFor="message">Tell us about your plant</label>
        <textarea id="message" name="message" required minLength={10} maxLength={2000} />
      </div>
      {/* Honeypot: hidden from real users via CSS, bots that fill every field trip this */}
      <div className="f-field f-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && <p className="f-status error">{errorMessage}</p>}

      <button className="btn btn-solid f-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "SENDING…" : "REQUEST A PILOT"}
      </button>
    </form>
  );
}
