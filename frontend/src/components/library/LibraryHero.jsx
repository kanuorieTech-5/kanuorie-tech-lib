import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

import { Button, Badge } from "../common";

export default function LibraryHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-8">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left */}

        <div>
          <Badge>Digital Library</Badge>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
            Learn Smarter.
            <span className="block text-blue-400">Build Faster.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            Explore premium books, guides, documentation and learning resources
            carefully curated to help you become a better software developer.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/courses">
              <Button size="lg">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/books">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                Browse Library
              </Button>
            </Link>
          </div>
        </div>

        {/* Right */}

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <BookOpen className="mb-6 h-10 w-10 text-blue-400" />

            <h3 className="text-3xl font-bold text-white">500+</h3>

            <p className="mt-2 text-slate-300">Learning Resources</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <GraduationCap className="mb-6 h-10 w-10 text-cyan-400" />

            <h3 className="text-3xl font-bold text-white">Beginner → Expert</h3>

            <p className="mt-2 text-slate-300">Structured Learning</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:col-span-2">
            <h3 className="text-2xl font-bold text-white">
              Everything you need to master modern software development.
            </h3>

            <p className="mt-4 leading-7 text-slate-300">
              Frontend, Backend, DevOps, UI/UX, AI, System Design, Interview
              Preparation and much more—all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
