import RevealOnScroll from "./RevealOnScroll";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section id="contact">
      <RevealOnScroll className="cta">
        <span className="eyebrow">Sonar Contact</span>
        <h2>Put a copilot in your control room</h2>
        <p>
          We&apos;re onboarding pilot sites across energy, utilities, buildings, and manufacturing in the GCC and
          Sub-Saharan Africa. Tell us about your plant — we&apos;ll map the first sweep.
        </p>
        <ContactForm />
      </RevealOnScroll>
    </section>
  );
}
