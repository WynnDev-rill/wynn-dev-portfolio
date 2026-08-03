import type { Project } from "../types";
import { projectBySlug } from "./projects";

export type ExperienceSurface = "light" | "dark";

export interface ExperienceProject extends Project {
  surface: ExperienceSurface;
  headlineLines: [string, string, string];
  systemLabel: string;
  fieldLabel: string;
  signalLabel: string;
  motionNote: string;
}

const experienceOrder = [
  "my-library",
  "memocard",
  "shufflefit-pro",
  "aster-journal",
  "flowly",
  "habitverse",
] as const;

const experienceMeta: Record<(typeof experienceOrder)[number], Omit<ExperienceProject, keyof Project>> = {
  "my-library": {
    surface: "dark",
    headlineLines: ["Membaca", "tanpa kehilangan", "arah."],
    systemLabel: "LIBRARY ENGINE",
    fieldLabel: "CURATED PATHS",
    signalLabel: "KNOWLEDGE FIELD",
    motionNote: "Dua bidang halaman membuka menjadi jalur pengetahuan; setiap simpul bergerak mengikuti hubungan antarbacaan.",
  },
  memocard: {
    surface: "light",
    headlineLines: ["Mengubah", "ingatan", "menjadi sistem."],
    systemLabel: "MEMOCARD ENGINE",
    fieldLabel: "SPACED REPETITION",
    signalLabel: "METRIK RETENSI",
    motionNote: "Lapisan kartu terurai menjadi orbit retensi—menunjukkan proses tangkap, ulang, dan ingat sebagai satu mesin.",
  },
  "shufflefit-pro": {
    surface: "dark",
    headlineLines: ["Gerak yang", "menyesuaikan", "hidup."],
    systemLabel: "ADAPTIVE MOTION",
    fieldLabel: "BODY BALANCE",
    signalLabel: "PROGRESS SIGNAL",
    motionNote: "Beban, poros, dan ritme set saling menyeimbangkan; bentuknya merespons progres tanpa memutus aliran latihan.",
  },
  "aster-journal": {
    surface: "light",
    headlineLines: ["Ruang tenang", "untuk melihat", "diri."],
    systemLabel: "ASTER CORE",
    fieldLabel: "PRIVATE MEMORY",
    signalLabel: "REFLECTION FIELD",
    motionNote: "Kelopak data tumbuh dari pusat privat, lalu membuka perlahan seperti proses menulis yang berubah menjadi refleksi.",
  },
  flowly: {
    surface: "dark",
    headlineLines: ["Perhatian kecil,", "kesadaran yang", "tumbuh."],
    systemLabel: "ATTENTION FLOW",
    fieldLabel: "DAILY RHYTHM",
    signalLabel: "AWARENESS LOOP",
    motionNote: "Satu garis napas berputar tanpa terputus untuk menggambarkan tiga misi kecil yang menjaga perhatian tetap hidup.",
  },
  habitverse: {
    surface: "dark",
    headlineLines: ["Waktu menjadi", "sebuah", "semesta."],
    systemLabel: "ORBITAL HABIT",
    fieldLabel: "24H CYCLE",
    signalLabel: "PLANETARY FIELD",
    motionNote: "Setiap siklus 24 jam menambah orbit baru; kebiasaan divisualkan sebagai semesta yang terus berkembang.",
  },
};

function resolveExperienceProject(slug: (typeof experienceOrder)[number]): ExperienceProject {
  const project = projectBySlug.get(slug);
  if (!project) throw new Error("Missing portfolio project: " + slug);
  return { ...project, ...experienceMeta[slug] };
}

export const experienceProjects = experienceOrder.map(resolveExperienceProject);
export const experienceProjectBySlug = new Map(experienceProjects.map((project) => [project.slug, project]));
