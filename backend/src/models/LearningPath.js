const mongoose = require("mongoose");
const slugify = require("../helpers/slugify");

const stageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  number: { type: Number, required: true, min: 1 },
  description: { type: String, default: "", trim: true },
  learningObjectives: { type: [String], default: [] },
}, { _id: true });

const learningPathSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: "", trim: true },
  category: { type: String, default: "Software Development", trim: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All levels"], default: "Beginner" },
  featuredImage: { type: String, default: "" },
  published: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  learningObjectives: { type: [String], default: [] },
  skillsAcquired: { type: [String], default: [] },
  stages: { type: [stageSchema], default: [] },
}, { timestamps: true });

learningPathSchema.pre("validate", function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});
learningPathSchema.index({ published: 1, displayOrder: 1 });

module.exports = mongoose.model("LearningPath", learningPathSchema);
