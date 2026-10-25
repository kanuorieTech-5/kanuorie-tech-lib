import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function LatestCourses({ courses = [] }) {
  const latestCourses = Array.isArray(courses) ? courses.slice(0, 5) : [];

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <GraduationCap size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Latest Courses</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">Recently added courses</p>
          </div>
        </div>

        <Link
          to="/admin/courses"
          className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {latestCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-10 text-center">
          <GraduationCap className="mx-auto mb-3 text-slate-400" size={32} />

          <p className="font-medium text-slate-700 dark:text-slate-300">No courses yet</p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recently added courses will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {latestCourses.map((course, index) => {
            const id = course._id || course.id || index;

            const title = course.title || course.name || "Untitled Course";

            const instructor =
              course.instructor?.name ||
              course.instructor ||
              course.author?.name ||
              course.author ||
              course.instructorName ||
              "KanuorieTech";

            const image =
              course.thumbnail ||
              course.image ||
              course.coverImage ||
              course.cover ||
              null;

            return (
              <div key={id} className="flex items-center gap-4 py-4">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500">
                    <GraduationCap size={22} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                  </p>

                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {instructor}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                  Course
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}


