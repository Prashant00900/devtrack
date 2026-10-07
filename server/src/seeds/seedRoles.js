import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Skill from "../models/Skill.js";
import Role from "../models/Role.js";

// [skill name, minLevel, importance]
const roles = [
  {
    title: "Frontend Developer",
    description: "Builds user interfaces and web apps using HTML, CSS, JavaScript and React.",
    skills: [
      ["HTML", 4, "must"],
      ["CSS", 4, "must"],
      ["JavaScript", 4, "must"],
      ["React", 4, "must"],
      ["Tailwind CSS", 3, "good"],
      ["Redux", 3, "good"],
      ["TypeScript", 3, "good"],
      ["Git", 3, "must"],
      ["REST API", 3, "must"],
      ["Jest", 2, "good"],
    ],
  },
  {
    title: "Backend Developer",
    description: "Builds APIs, databases and server-side logic.",
    skills: [
      ["Node.js", 4, "must"],
      ["Express.js", 4, "must"],
      ["REST API", 4, "must"],
      ["MongoDB", 3, "must"],
      ["PostgreSQL", 3, "good"],
      ["JWT Authentication", 3, "must"],
      ["Git", 3, "must"],
      ["Docker", 2, "good"],
      ["System Design", 2, "good"],
      ["DBMS", 3, "must"],
    ],
  },
  {
    title: "MERN Stack Developer",
    description: "Builds full web apps using MongoDB, Express, React and Node.js.",
    skills: [
      ["JavaScript", 4, "must"],
      ["React", 4, "must"],
      ["Node.js", 4, "must"],
      ["Express.js", 4, "must"],
      ["MongoDB", 4, "must"],
      ["Mongoose", 3, "must"],
      ["REST API", 4, "must"],
      ["JWT Authentication", 3, "must"],
      ["Tailwind CSS", 3, "good"],
      ["Redux", 3, "good"],
      ["Git", 3, "must"],
      ["Postman", 3, "good"],
      ["Docker", 2, "good"],
    ],
  },
  {
    title: "Full Stack Developer",
    description: "Works across frontend, backend, databases and deployment.",
    skills: [
      ["HTML", 4, "must"],
      ["CSS", 4, "must"],
      ["JavaScript", 4, "must"],
      ["React", 4, "must"],
      ["Node.js", 4, "must"],
      ["Express.js", 3, "must"],
      ["MongoDB", 3, "must"],
      ["PostgreSQL", 3, "good"],
      ["REST API", 4, "must"],
      ["Git", 4, "must"],
      ["Docker", 3, "good"],
      ["AWS", 2, "good"],
      ["System Design", 3, "good"],
      ["Data Structures", 3, "must"],
    ],
  },
];

const run = async () => {
  await connectDB();

  for (const role of roles) {
    const requiredSkills = [];

    for (const [name, minLevel, importance] of role.skills) {
      const skill = await Skill.findOne({ name });
      if (!skill) {
        throw new Error(`Skill not found: ${name}. Pehle seedSkills chalao.`);
      }
      requiredSkills.push({ skill: skill._id, minLevel, importance });
    }

    await Role.updateOne(
      { title: role.title },
      { $set: { title: role.title, description: role.description, requiredSkills } },
      { upsert: true }
    );
  }

  console.log(`Seeded ${roles.length} roles`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});