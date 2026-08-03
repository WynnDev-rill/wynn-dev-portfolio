import { motion, useReducedMotion } from "framer-motion";
import { GithubIcon, MailIcon } from "./Icons";

const skillGroups = [
  {
    index: "01",
    title: "Product systems",
    items: ["UX architecture", "Local-first data", "SRS & habit loops", "Responsive interfaces"],
  },
  {
    index: "02",
    title: "App engineering",
    items: ["React + TypeScript", "Capacitor + Expo", "Supabase", "Native notifications"],
  },
  {
    index: "03",
    title: "Motion & delivery",
    items: ["Framer Motion", "Three.js", "GitHub Actions", "Vercel"],
  },
];

export function About() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="about-section" id="about">
      <motion.div
        className="about-intro"
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">PROFILE / 03</p>
        <h2>Berangkat dari masalah yang benar-benar terasa.</h2>
        <p>
          Wynn adalah independent developer dari Indonesia yang membangun aplikasi Android dan web di persimpangan produktivitas, belajar, kesehatan, dan pengalaman personal.
        </p>
        <p>
          Polanya sederhana: cari friksi sehari-hari, bentuk sistem yang masuk akal, lalu beri identitas visual yang membuat orang ingin kembali memakainya.
        </p>
      </motion.div>

      <div className="skills-grid" aria-label="Keahlian">
        {skillGroups.map((group) => (
          <article className="skill-card" key={group.title}>
            <span>{group.index}</span>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="contact-panel" id="contact">
        <div>
          <p className="eyebrow">CONTACT / 04</p>
          <h2>Punya produk yang perlu dibuat terasa lebih hidup?</h2>
        </div>
        <div className="contact-actions">
          <a className="button primary-button" href="mailto:indonesiafilmku@gmail.com">
            <MailIcon /> Kirim email
          </a>
          <a className="button ghost-button" href="https://github.com/WynnDev-rill" target="_blank" rel="noreferrer">
            <GithubIcon /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
