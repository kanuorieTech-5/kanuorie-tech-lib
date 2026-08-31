export const normalizeCourse = (course) => ({
  id: course.id,
  title: course.title,
  category: course.category || "General",
  image: course.image || course.img,
  link: course.link,
  progress: course.progress ?? course.Progress?.progress ?? 0,
  notes: course.notes || "",
  lastProgressUpdate: course.lastProgressUpdate || null,
});
