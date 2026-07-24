import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 📥 FETCH COURSES
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Fetch course error:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
useEffect(() => {
  const refresh = () => fetchCourses();

  window.addEventListener("course-update", refresh);

  return () =>
    window.removeEventListener("course-update", refresh);
}, []);
  // 🗑 DELETE COURSE
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this course?")) return;

    try {
      await API.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 📊 PROGRESS UPDATE (FIXED SAFETY)
  const updateProgress = async (courseId, newProgress) => {
    try {
      const res = await API.put(`/courses/${courseId}/progress`, {
        progress: newProgress,
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                progress: res.data?.progress ?? newProgress,
                completed: res.data?.completed ?? false,
              }
            : c
        )
      );
    } catch (err) {
      const data = err.response?.data;

      if (data?.nextAvailable) {
        alert(
          `${data.message}\nNext update: ${new Date(
            data.nextAvailable
          ).toLocaleString()}`
        );
      } else {
        alert(data?.message || "Error updating progress");
      }
    }
  };

  // 📝 OPEN NOTES
  const openNotes = (course) => {
    setActiveNoteId(course.id);
    setNoteText(course.notes || "");
  };

  // 💾 SAVE NOTES
  const saveNotes = async (id) => {
    try {
      const res = await API.put(`/courses/${id}/notes`, {
        notes: noteText,
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                notes: res.data?.notes ?? noteText,
              }
            : c
        )
      );

      setActiveNoteId(null);
    } catch (err) {
      console.error("Save notes error:", err);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">🎓 My Courses</h1>

        {courses.length === 0 ? (
          <div className="space-y-4">
            <p className="text-gray-500">No saved courses yet. choose and save courses from the library for a personalized learning experience.</p>
            <button className="text-sm mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded" onClick={() => window.location.href = "/library"}>
              Browse Library
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => {
              // ✅ FIXED SAFE ACCESS
              const currentProgress = Math.min(
                course?.progress || 0,
                100
              );

              return (
                <div
                  key={course.id}
                  className="border p-4 rounded-xl shadow bg-white flex flex-col"
                >
                  <img
                    src={
                      course.image ||
                      "https://via.placeholder.com/300x200?text=Course"
                    }
                    className="h-40 w-full object-cover rounded mb-3"
                  />

                  <h2 className="font-semibold text-lg">
                    {course.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-2">
                    {course.category || "Uncategorized"}
                  </p>

                  {/* PROGRESS */}
                  <div className="w-full bg-gray-200 h-2 rounded mb-2">
                    <div
                      className="bg-purple-600 h-2 rounded"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>

                  <p className="text-xs mb-3">
                    {currentProgress}% complete
                  </p>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center mt-3">
                    {course.link && (
                      <button
                        onClick={() => {
                          window.open(
                            course.link,
                            "_blank",
                            "noopener,noreferrer"
                          );

                          const newProgress = Math.min(
                            currentProgress + 1,
                            100
                          );

                          updateProgress(course.id, newProgress);
                        }}
                        className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700"
                      >
                        Continue Learning →
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-white text-xs hover:bg-yellow-600 self-end rounded-lg bg-red-500 py-1 px-1"
                    >
                      Remove
                    </button>
                  </div>

                  <button
                    onClick={() => openNotes(course)}
                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mt-2"
                  >
                    Notes
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* NOTES MODAL */}
        {activeNoteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <h2 className="text-lg font-bold mb-3">
                Course Notes
              </h2>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full border p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={5}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveNoteId(null)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => saveNotes(activeNoteId)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}