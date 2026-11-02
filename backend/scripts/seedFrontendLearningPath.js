require("dotenv").config();
const mongoose = require("mongoose");
const LearningPath = require("../src/models/LearningPath");

const stages = [
  "Web Development Fundamentals", "JavaScript Programming", "Git, GitHub and Developer Tools",
  "Advanced CSS and Modern UI Development", "React.js Development", "TypeScript and Modern Frontend Development",
  "Next.js and Modern Frontend Frameworks", "Backend Integration and Full-Stack Fundamentals",
  "Testing, Debugging and Quality Assurance", "Web Accessibility, Security and Performance",
  "Deployment and Production Management", "Professional Development and Career Preparation",
  "Portfolio and Capstone Projects",
];

async function run() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required.");
  await mongoose.connect(process.env.MONGO_URI);
  const slug = "frontend-development-beginner-to-professional";
  const existing = await LearningPath.findOne({ slug });
  if (existing) {
    console.log(`Pathway already exists (${existing._id}); no changes were made.`);
    return;
  }
  await LearningPath.create({
    title: "Frontend Development: Beginner to Professional",
    slug,
    description: "A structured progression through frontend foundations, modern frameworks, production practices, and professional portfolio projects.",
    category: "Frontend Development",
    difficulty: "All levels",
    published: false,
    displayOrder: 1,
    learningObjectives: ["Build accessible, responsive frontend applications", "Develop and test production-ready React applications", "Prepare and deploy a professional project portfolio"],
    skillsAcquired: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js", "Testing", "Accessibility", "Deployment"],
    stages: stages.map((title, index) => ({ number: index + 1, title, description: `Stage ${index + 1} of the frontend development learning pathway.` })),
  });
  console.log("Created the unpublished 13-stage pathway outline. No courses were assigned or published.");
}

run().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
