export type ProjectVisual = "book" | "fitness" | "flower" | "flow" | "planet" | "cards";

export type ProjectCategory = "Belajar & pengetahuan" | "Kebiasaan & kebugaran" | "Refleksi & kesadaran";

export interface ProjectLink {
  label: string;
  url: string;
  note?: string;
}

export interface Project {
  slug: string;
  name: string;
  eyebrow: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  accent: string;
  accentSecondary: string;
  visual: ProjectVisual;
  icon: string;
  screenshot?: string;
  featured: boolean;
  year: string;
  status: string;
  statusTone: "live" | "active" | "prototype";
  repository: ProjectLink;
  demo?: ProjectLink;
  apk?: ProjectLink;
  features: string[];
  technologies: string[];
  highlights: Array<{ value: string; label: string }>;
  buildNote: string;
}
