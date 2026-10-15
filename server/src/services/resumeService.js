import { extractText, getDocumentProxy } from "unpdf";
import Profile from "../models/Profile.js";
import Skill from "../models/Skill.js";
import Resource from "../models/Resource.js";
import { SKILL_ALIASES } from "../data/skillAliases.js";

export const extractPdfText = async (buffer) => {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return Array.isArray(text) ? text.join("\n") : text;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasTerm = (text, term) =>
  new RegExp(`(^|[^a-z0-9])${escapeRegex(term)}([^a-z0-9]|$)`, "i").test(text);

const skillFound = (text, name) =>
  (SKILL_ALIASES[name] || [name.toLowerCase()]).some((alias) =>
    hasTerm(text, alias)
  );

const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "created", "led",
  "optimized", "deployed", "integrated", "improved", "managed", "launched",
  "automated", "reduced", "increased", "engineered", "architected", "wrote",
];

const countMatches = (text, regex) => (text.match(regex) || []).length;

export const analyzeResumeText = async (rawText, userId) => {
  const text = rawText.toLowerCase();
  const words = rawText.split(/\s+/).filter(Boolean).length;

  const [profile, allSkills] = await Promise.all([
    Profile.findOne({ user: userId }).populate({
      path: "targetRole",
      populate: { path: "requiredSkills.skill" },
    }),
    Skill.find(),
  ]);

  const detectedSkills = allSkills
    .filter((s) => skillFound(text, s.name))
    .map((s) => s.name);

  // 1) Skills match (45 points)
  const role = profile?.targetRole || null;
  const foundRequired = [];
  let missingRequired = [];
  let skillsPoints = 0;
  const skillsMax = 45;

  if (role) {
    let earned = 0;
    let total = 0;

    role.requiredSkills.forEach((rs) => {
      if (!rs.skill) return;
      const weight = rs.importance === "must" ? 2 : 1;
      total += weight;

      const item = {
        skillId: rs.skill._id,
        name: rs.skill.name,
        importance: rs.importance,
      };

      if (skillFound(text, rs.skill.name)) {
        earned += weight;
        foundRequired.push(item);
      } else {
        missingRequired.push(item);
      }
    });

    skillsPoints = total ? Math.round((earned / total) * skillsMax) : 0;
  } else {
    skillsPoints = Math.round(Math.min(detectedSkills.length / 10, 1) * skillsMax);
  }

  // 2) Sections (20 points)
  const sections = {
    education: /\beducation\b|b\.?\s?tech|bachelor|university|college/.test(text),
    experience: /\bexperience\b|\binternship\b|\bintern\b|work history/.test(text),
    projects: /\bprojects?\b/.test(text),
    skills: /\bskills?\b/.test(text),
    achievements: /\bcertifications?\b|\bachievements?\b|\bawards?\b|\bhackathon\b/.test(text),
  };
  const sectionsPoints = Object.values(sections).filter(Boolean).length * 4;

  // 3) Contact (10 points)
  const contact = {
    email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(text),
    phone: /(\+?\d[\d\s-]{8,}\d)/.test(rawText),
    links: /linkedin\.com|github\.com/.test(text),
  };
  const contactPoints =
    (contact.email ? 4 : 0) + (contact.phone ? 3 : 0) + (contact.links ? 3 : 0);

  // 4) Impact (15 points): action verbs aur numbers
  const actionVerbs = ACTION_VERBS.reduce(
    (sum, v) => sum + countMatches(text, new RegExp(`\\b${v}\\b`, "g")),
    0
  );
  const metrics = countMatches(
    rawText,
    /\b\d+(?:[.,]\d+)?\s?(?:%|\+|x\b|k\b|users|requests|students|projects|apis|endpoints|ms\b|seconds|hours)/gi
  );
  const impactPoints =
    Math.round(Math.min(actionVerbs / 6, 1) * 8) +
    Math.round(Math.min(metrics / 3, 1) * 7);

  // 5) Length (10 points)
  let lengthPoints = 0;
  if (words >= 300 && words <= 900) lengthPoints = 10;
  else if ((words >= 200 && words < 300) || (words > 900 && words <= 1200)) lengthPoints = 5;

  const score = Math.min(
    100,
    skillsPoints + sectionsPoints + contactPoints + impactPoints + lengthPoints
  );

  const breakdown = [
    { key: "skills", label: role ? `Skills match for ${role.title}` : "Skills found", points: skillsPoints, max: skillsMax },
    { key: "sections", label: "Resume sections", points: sectionsPoints, max: 20 },
    { key: "contact", label: "Contact and links", points: contactPoints, max: 10 },
    { key: "impact", label: "Action verbs and numbers", points: impactPoints, max: 15 },
    { key: "length", label: "Length", points: lengthPoints, max: 10 },
  ];

  // Tips
  const tips = [];

  if (!role) {
    tips.push("Target Role select karo, taaki skills role ke hisaab se compare ho sakein.");
  }

  const mustMissing = missingRequired.filter((m) => m.importance === "must");
  if (mustMissing.length) {
    tips.push(
      `Role ki must-have skills resume mein nahi dikhi: ${mustMissing
        .slice(0, 5)
        .map((m) => m.name)
        .join(", ")}. Jo skills tum sach mein jaante ho wahi likho, baaki neeche ke links se seekho.`
    );
  }

  if (!sections.projects) tips.push("Ek 'Projects' section add karo. Har project mein tech stack aur kya banaya wo likho.");
  if (!sections.skills) tips.push("Ek alag 'Skills' section add karo, taaki ATS keywords aasani se pakad sake.");
  if (!sections.education) tips.push("Education section add karo (college, degree, year).");
  if (!sections.achievements) tips.push("Certifications ya achievements ka section add karo.");
  if (!contact.email) tips.push("Resume mein apna email likho.");
  if (!contact.phone) tips.push("Resume mein phone number likho.");
  if (!contact.links) tips.push("GitHub aur LinkedIn ke links add karo.");
  if (actionVerbs < 6) tips.push("Bullet points ki shuruaat action words se karo (Built, Developed, Designed, Implemented...).");
  if (metrics < 3) tips.push("Numbers jodo, jaise 'reduced load time by 40%' ya 'built 12 API endpoints'.");
  if (words < 300) tips.push(`Resume bahut chhota hai (${words} words). Projects aur skills ka detail badhao.`);
  if (words > 900) tips.push(`Resume bahut lamba hai (${words} words). Fresher ke liye 1 page kaafi hai.`);

  // Missing skills ke saath learning links
  const missingIds = missingRequired.map((m) => m.skillId);
  const resources = missingIds.length
    ? await Resource.find({ skill: { $in: missingIds } })
    : [];

  missingRequired = missingRequired
    .sort((a, b) => (a.importance === b.importance ? 0 : a.importance === "must" ? -1 : 1))
    .map((m) => ({
      ...m,
      resources: resources
        .filter((r) => r.skill.toString() === m.skillId.toString())
        .slice(0, 2)
        .map((r) => ({ title: r.title, url: r.url, type: r.type })),
    }));

  const verdict = score >= 75 ? "Strong" : score >= 50 ? "Decent" : "Needs work";

  return {
    score,
    verdict,
    role: role ? { title: role.title } : null,
    breakdown,
    detectedSkills,
    foundRequired,
    missingRequired,
    sections,
    stats: { words, actionVerbs, metrics },
    tips,
  };
};