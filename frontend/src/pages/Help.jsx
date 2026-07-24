import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Help() {
  const [search, setSearch] = useState("");

  const faqs = [
    {
      question: "What is KanuorieTechLib?",
      answer:
        "A curated platform for developers to learn and grow.",
    },
    {
      question: "Is it free?",
      answer: "Yes, it's completely free.",
    },
    {
      question: "Can I contribute?",
      answer: "Yes, via your profile after login.",
    },
    {
      question: "Do I need an account?",
      answer:
        "Not required for browsing, but needed for saving progress.",
    },
    {
      question: "How do I add a resource?",
      answer:
        "Go to your profile and click on 'Add Resource'. Fill in the details and save.",
    },
    {
      question: "How do I save a course?",
      answer:
        "Click the '+ Add' button in the library to save a resource as a course.",
    },
    {
      question: "Why is my progress not updating?",
      answer:
        "Ensure you're clicking 'Continue Learning'. Progress increases automatically.",
    },
    {
      question: "Can I edit my profile?",
      answer:
        "Yes, go to your profile page and click 'Edit Profile'.",
    },
    {
      question: "Is KanuorieTech free?",
      answer:
        "Yes, all resources are free to access.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );
  const testimonials = [
    {
      name: "David K.",
      role: "Frontend Developer",
      message:
        "This platform helped me find the best resources to level up my React skills.",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Sarah M.",
      role: "UI/UX Designer",
      message:
        "I love how everything is organized. It saves me hours of searching!",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
    {
      name: "James T.",
      role: "Backend Developer",
      message:
        "Finally a focused learning platform for developers.",
      avatar: "https://i.pravatar.cc/100?img=8",
    },
  ];
    
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4 text-center">
          Help Center 🛠️
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Find answers, guides, and support for using KanuorieTech.
        </p>

        {/* SEARCH */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search for help..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="font-semibold mb-2">📚 Library Help</h3>
            <p className="text-gray-500 text-sm">
              Learn how to find and add resources.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="font-semibold mb-2">🎓 Courses</h3>
            <p className="text-gray-500 text-sm">
              Manage your courses and progress.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="font-semibold mb-2">👤 Account</h3>
            <p className="text-gray-500 text-sm">
              Update profile and settings.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions ❓
          </h2>

          <div className="space-y-4">
            {filteredFAQs.length === 0 && (
              <p className="text-gray-500">No results found.</p>
            )}

            {filteredFAQs.map((faq, index) => (
              <details
                key={index}
                className="bg-white p-4 rounded-xl shadow cursor-pointer"
              >
                <summary className="font-semibold text-lg">
                  {faq.question}
                </summary>
                <p className="text-gray-600 mt-2">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
        {/* TESTIMONIALS */}
        <section className="bg-white p-6 rounded-2xl shadow-md mt-20">
          <h2 className="text-3xl font-bold text-center">
            What Our Users Say 💬
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-xl shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.avatar}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-500">
                      {t.role}
                    </p>
                  </div>
                </div>
                <p className="italic">"{t.message}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SUPPORT */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Still need help?
          </h3>
          <p className="text-gray-500 mb-4">
            Our support team is ready to assist you.
          </p>

          <a
            href="/contact"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
      <footer className="text-center text-gray-500 py-6">
        © {new Date().getFullYear()} KanuorieTech. All rights reserved.
      </footer> 
    </div>
  );
}