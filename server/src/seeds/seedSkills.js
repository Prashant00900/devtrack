import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Skill from "../models/Skill.js";

const skills = [
  { name: "HTML", category: "frontend" },
  { name: "CSS", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "Redux", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "REST API", category: "backend" },
  { name: "JWT Authentication", category: "backend" },
  { name: "GraphQL", category: "backend" },
  { name: "Socket.IO", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "Java", category: "backend" },
  { name: "MongoDB", category: "database" },
  { name: "Mongoose", category: "database" },
  { name: "MySQL", category: "database" },
  { name: "PostgreSQL", category: "database" },
  { name: "Redis", category: "database" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "Docker", category: "devops" },
  { name: "CI/CD", category: "devops" },
  { name: "AWS", category: "devops" },
  { name: "Linux", category: "devops" },
  { name: "Data Structures", category: "cs-fundamentals" },
  { name: "Algorithms", category: "cs-fundamentals" },
  { name: "System Design", category: "cs-fundamentals" },
  { name: "OOP", category: "cs-fundamentals" },
  { name: "Operating Systems", category: "cs-fundamentals" },
  { name: "DBMS", category: "cs-fundamentals" },
  { name: "Computer Networks", category: "cs-fundamentals" },
  { name: "Jest", category: "testing" },
  { name: "Unit Testing", category: "testing" },
  { name: "Communication", category: "soft-skills" },
  { name: "Problem Solving", category: "soft-skills" },
  { name: "Teamwork", category: "soft-skills" },
];

const run = async () => {
  await connectDB();
  for (const skill of skills) {
    await Skill.updateOne({ name: skill.name }, { $set: skill }, { upsert: true });
  }
  console.log(`Seeded ${skills.length} skills`);
  await mongoose.disconnect();
  process.exit(0);
};

run();