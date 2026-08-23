import { Link } from "react-router-dom";
import {
  HelpCircle,
  BookOpen,
  GraduationCap,
  UserCircle,
  Settings,
  Mail,
  ArrowRight,
} from "lucide-react";

import { Card, Button, SectionTitle } from "../components/common";

const HELP_CATEGORIES = [
  {
    title: "Library & Books",
    description:
      "Learn how to browse resources, view books, save resources, and access your learning materials.",
    icon: BookOpen,
    link: "/library",
  },
  {
    title: "Courses",
    description:
      "Find out how to enroll in courses, track your progress, and continue your learning journey.",
    icon: GraduationCap,
    link: "/courses",
  },
  {
    title: "Account & Profile",
    description:
      "Manage your profile information, profile photo, account details, and personal preferences.",
    icon: UserCircle,
    link: "/profile",
  },
  {
    title: "Settings",
    description:
      "Manage your account settings, preferences, notifications, and security options.",
    icon: Settings,
    link: "/settings",
  },
];

export default function Help() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
            <HelpCircle
              className="h-9 w-9 text-cyan-400"
              aria-hidden="true"
            />
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            How Can We Help?
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Find answers, explore our resources, and learn how to
            get the most out of KanuorieTech.
          </p>

        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            Badge="Help Center"
            title="Find What You Need"
            subtitle="Choose a category below to quickly find the information you're looking for."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {HELP_CATEGORIES.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.title}
                  className="flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50">
                    <Icon
                      className="h-6 w-6 text-cyan-600"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-3 flex-1 leading-7 text-slate-600">
                    {item.description}
                  </p>

                  <Link
                    to={item.link}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Explore
                    <ArrowRight
                      size={17}
                      aria-hidden="true"
                    />
                  </Link>
                </Card>
              );
            })}

          </div>

        </div>
      </section>

      {/* FAQ / Common Questions */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">

          <SectionTitle
            Badge="Frequently Asked Questions"
            title="Common Questions"
            subtitle="Here are some quick answers to common questions."
          />

          <div className="mt-12 space-y-4">

            <details className="group rounded-xl border bg-slate-50 p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                How do I create an account?
              </summary>

              <p className="mt-4 leading-7 text-slate-600">
                Click the Register option in the navigation menu,
                provide your account information, and follow the
                registration instructions.
              </p>
            </details>

            <details className="group rounded-xl border bg-slate-50 p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                How do I save a resource?
              </summary>

              <p className="mt-4 leading-7 text-slate-600">
                Open the Library and click the bookmark button on
                any resource you want to save. Saved resources can
                be accessed from your learning dashboard.
              </p>
            </details>

            <details className="group rounded-xl border bg-slate-50 p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                How do I update my profile?
              </summary>

              <p className="mt-4 leading-7 text-slate-600">
                After signing in, open your Profile page from the
                account menu. You can update your personal
                information and profile photo there.
              </p>
            </details>

            <details className="group rounded-xl border bg-slate-50 p-5">
              <summary className="cursor-pointer list-none font-semibold text-slate-900">
                I need additional assistance. What should I do?
              </summary>

              <p className="mt-4 leading-7 text-slate-600">
                If you cannot find an answer here, contact the
                KanuorieTech team and we'll be happy to assist you.
              </p>
            </details>

          </div>

        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10">
            <Mail
              className="h-7 w-7 text-cyan-400"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-3xl font-bold md:text-4xl">
            Still Need Help?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
            Our team is here to help. Send us a message and we'll
            get back to you as soon as possible.
          </p>

          <div className="mt-8">
            <Link to="/contact">
              <Button>
                Contact Us
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}