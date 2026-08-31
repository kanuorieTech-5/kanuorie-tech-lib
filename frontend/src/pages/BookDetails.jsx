import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Star,
  Download,
  Eye,
  FileText,
  User,
  Globe,
  CalendarDays,
  Building2,
  Languages,
  HardDrive,
  BookMarked,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
  Badge,
} from "../components/common";

import { Newsletter, CTA } from "../components/home";

import { getBook, getBooks } from "../services";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadBook = async () => {
      setLoading(true);
      setError("");

      try {
        const [bookResponse, booksResponse] = await Promise.all([
          getBook(id),
          getBooks(),
        ]);

        if (!mounted) return;

        setBook(bookResponse?.data || null);
        setBooks(Array.isArray(booksResponse?.data) ? booksResponse.data : []);
      } catch (err) {
        console.error("Failed to load book:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load this book. Please try again.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadBook();
    } else {
      setLoading(false);
      setError("Invalid book ID.");
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  const relatedBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];

    return books
      .filter((item) => item?._id !== id)
      .filter((item) => {
        if (!book?.category) return true;

        return item?.category?.toLowerCase() === book.category?.toLowerCase();
      })
      .slice(0, 3);
  }, [books, id, book]);

  const fallbackRelatedBooks = useMemo(() => {
    if (relatedBooks.length >= 3) {
      return relatedBooks;
    }

    const existingIds = new Set(relatedBooks.map((item) => item?._id));

    const additionalBooks = books
      .filter((item) => item?._id !== id)
      .filter((item) => !existingIds.has(item?._id))
      .slice(0, 3 - relatedBooks.length);

    return [...relatedBooks, ...additionalBooks];
  }, [relatedBooks, books, id]);

  const coverImage =
    book?.coverImage ||
    book?.cover ||
    book?.image ||
    "/images/book-placeholder.jpg";

  const authorName =
    typeof book?.author === "object" ? book?.author?.name : book?.author;

  const authorRole =
    typeof book?.author === "object" ? book?.author?.role : book?.authorRole;

  const authorBio =
    typeof book?.author === "object" ? book?.author?.bio : book?.authorBio;

  const authorImage =
    typeof book?.author === "object" ? book?.author?.image : book?.authorImage;

  const bookPrice =
    book?.price !== undefined && book?.price !== null && book?.price !== ""
      ? `₦${Number(book.price).toLocaleString()}`
      : "Free";

  const rating = book?.rating || "4.9";
  const pages = book?.pages || 280;
  const downloads = book?.downloads || "1.2K";
  const format = book?.format || "PDF";
  const language = book?.language || "English";
  const category = book?.category || "Programming";
  const level = book?.level || "Beginner";
  const publisher = book?.publisher || "KanuorieTech";
  const fileSize = book?.fileSize || "12 MB";
  const isbn = book?.isbn || "Not available";

  const publishedDate = book?.createdAt
    ? new Date(book.createdAt).toLocaleDateString()
    : "2026";

  const learningOutcomes =
    Array.isArray(book?.learningOutcomes) && book.learningOutcomes.length > 0
      ? book.learningOutcomes
      : [
          "Understand modern development workflows.",
          "Write clean and maintainable code.",
          "Build production-ready applications.",
          "Master professional development best practices.",
          "Improve your problem-solving skills.",
          "Gain practical project experience.",
        ];

  const tableOfContents =
    Array.isArray(book?.tableOfContents) && book.tableOfContents.length > 0
      ? book.tableOfContents
      : [
          "Introduction",
          "Getting Started",
          "Core Concepts",
          "Advanced Techniques",
          "Real World Projects",
          "Best Practices",
          "Deployment",
          "Conclusion",
        ];

  const handlePreview = () => {
    const previewUrl = book?.previewUrl || book?.preview || book?.sampleUrl;

    if (!previewUrl) {
      alert("Preview is not available for this book yet.");
      return;
    }

    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const downloadUrl = book?.downloadUrl || book?.fileUrl || book?.pdfUrl;

    if (!downloadUrl) {
      alert("Download is not available for this book yet.");
      return;
    }

    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <Loader />
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <Card className="w-full max-w-lg p-10 text-center">
          <BookOpen size={56} className="mx-auto text-blue-600" />

          <h1 className="mt-6 text-3xl font-black text-slate-900">
            {error ? "Unable to Load Book" : "Book Not Found"}
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            {error ||
              "The book you're looking for may have been removed or is no longer available."}
          </p>

          <Link to="/books" className="mt-8 inline-block">
            <Button>
              <ArrowLeft className="mr-2" size={18} />
              Back to Library
            </Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <Link
            to="/books"
            className="mb-10 inline-flex items-center gap-2 text-blue-400 transition hover:text-blue-300"
          >
            <ArrowLeft size={18} />
            Back to Library
          </Link>

          <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_.85fr]">
            {/* HERO CONTENT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              <Badge>{category}</Badge>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {book.title}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {book.description ||
                  "Explore this practical learning resource from the KanuorieTech Library."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Star
                    size={19}
                    fill="currentColor"
                    className="text-yellow-400"
                  />

                  <span className="font-semibold text-white">{rating}</span>

                  <span>Rating</span>
                </div>

                <div className="flex items-center gap-2">
                  <FileText size={19} />

                  <span>{pages} Pages</span>
                </div>

                <div className="flex items-center gap-2">
                  <Download size={19} />

                  <span>{downloads} Downloads</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge>{level}</Badge>

                <Badge>{format}</Badge>

                <Badge>{language}</Badge>
              </div>
            </motion.div>

            {/* BOOK CARD */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
            >
              <Card className="overflow-hidden p-0">
                <img
                  src={coverImage}
                  alt={book.title}
                  className="h-[480px] w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/images/book-placeholder.jpg";
                  }}
                />

                <div className="space-y-6 p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-black text-blue-600">
                      {bookPrice}
                    </span>

                    <Badge>{format}</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button fullWidth onClick={handlePreview}>
                      <Eye className="mr-2" size={18} />
                      Preview
                    </Button>

                    <Button
                      fullWidth
                      variant="outline"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2" size={18} />
                      Download
                    </Button>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <div className="space-y-4">
                      <InfoRow
                        icon={<User size={17} />}
                        label="Author"
                        value={authorName || "KanuorieTech"}
                      />

                      <InfoRow
                        icon={<Building2 size={17} />}
                        label="Publisher"
                        value={publisher}
                      />

                      <InfoRow
                        icon={<Languages size={17} />}
                        label="Language"
                        value={language}
                      />

                      <InfoRow
                        icon={<BookOpen size={17} />}
                        label="Pages"
                        value={pages}
                      />

                      <InfoRow
                        icon={<HardDrive size={17} />}
                        label="File Size"
                        value={fileSize}
                      />

                      <InfoRow
                        icon={<Globe size={17} />}
                        label="ISBN"
                        value={isbn}
                      />

                      <InfoRow
                        icon={<CalendarDays size={17} />}
                        label="Published"
                        value={publishedDate}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Star fill="currentColor" size={30} />}
            value={rating}
            label="Average Rating"
          />

          <StatCard
            icon={<BookOpen size={30} />}
            value={pages}
            label="Total Pages"
          />

          <StatCard
            icon={<Download size={30} />}
            value={downloads}
            label="Downloads"
          />

          <StatCard
            icon={<FileText size={30} />}
            value={format}
            label="Available Format"
          />
        </div>
      </section>

      {/* =====================================================
          ABOUT BOOK
      ====================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="About This Book"
            subtitle="Discover what this resource offers and how it can support your learning journey."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
            <Card className="p-8 lg:p-10">
              {book.content ? (
                <div
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: book.content,
                  }}
                />
              ) : (
                <p className="leading-8 text-slate-700">
                  {book.description ||
                    "This book provides practical knowledge and resources designed to help readers develop useful technology skills."}
                </p>
              )}
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold">Book Information</h3>

              <div className="mt-7 space-y-5">
                <InfoRow label="Category" value={category} />

                <InfoRow label="Level" value={level} />

                <InfoRow label="Format" value={format} />

                <InfoRow label="Pages" value={pages} />

                <InfoRow label="Language" value={language} />

                <InfoRow label="Publisher" value={publisher} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT YOU'LL LEARN
      ====================================================== */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="What You'll Learn"
            subtitle="Key concepts and practical skills covered in this resource."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {learningOutcomes.map((item, index) => (
              <Card key={`${item}-${index}`} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 size={19} className="text-green-600" />
                </div>

                <p className="leading-7 text-slate-700">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TABLE OF CONTENTS
      ====================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Table of Contents"
            subtitle="A quick overview of the topics covered inside this book."
          />

          <div className="mt-14 space-y-4">
            {tableOfContents.map((chapter, index) => (
              <Card
                key={`${chapter}-${index}`}
                className="flex items-center justify-between gap-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {index + 1}
                  </div>

                  <h3 className="font-semibold text-slate-900">{chapter}</h3>
                </div>

                <Badge>Chapter {index + 1}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          SPECIFICATIONS
      ====================================================== */}

      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="Specifications"
            subtitle="Technical information about this publication."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <SpecificationCard label="ISBN" value={isbn} />

            <SpecificationCard label="Language" value={language} />

            <SpecificationCard label="Publisher" value={publisher} />

            <SpecificationCard label="File Size" value={fileSize} />
          </div>
        </div>
      </section>

      {/* =====================================================
          AUTHOR
      ====================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="About the Author"
            subtitle="Learn more about the creator behind this resource."
          />

          <Card className="mt-14 p-8 lg:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <img
                src={authorImage || "/images/default-avatar.png"}
                alt={authorName || "Author"}
                className="h-28 w-28 shrink-0 rounded-full object-cover shadow-md"
                onError={(event) => {
                  event.currentTarget.src = "/images/default-avatar.png";
                }}
              />

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black text-slate-900">
                    {authorName || "KanuorieTech Team"}
                  </h3>

                  <Badge>Author</Badge>
                </div>

                <p className="mt-2 font-semibold text-blue-600">
                  {authorRole || "Technology Educator"}
                </p>

                <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                  {authorBio ||
                    "Passionate about creating practical technology resources that help developers, students and professionals learn, build and grow."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* =====================================================
          RELATED BOOKS
      ====================================================== */}

      {fallbackRelatedBooks.length > 0 && (
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              title="Related Books"
              subtitle="Continue your learning journey with more resources from the KanuorieTech Library."
            />

            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {fallbackRelatedBooks.map((item) => {
                const relatedCover =
                  item?.coverImage ||
                  item?.cover ||
                  item?.image ||
                  "/images/book-placeholder.jpg";

                return (
                  <motion.div
                    key={item._id}
                    whileHover={{
                      y: -8,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <Card className="overflow-hidden p-0">
                      <img
                        src={relatedCover}
                        alt={item.title}
                        className="h-72 w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/images/book-placeholder.jpg";
                        }}
                      />

                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <Badge>{item.category || "Book"}</Badge>

                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={16} fill="currentColor" />

                            <span className="text-sm font-semibold text-slate-700">
                              {item.rating || "4.9"}
                            </span>
                          </div>
                        </div>

                        <h3 className="mt-5 line-clamp-2 text-xl font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          By{" "}
                          {typeof item.author === "object"
                            ? item.author?.name
                            : item.author || "KanuorieTech"}
                        </p>

                        <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                          {item.description ||
                            "Explore this resource from the KanuorieTech Library."}
                        </p>

                        <Link to={`/books/${item._id}`} className="mt-7 block">
                          <Button fullWidth>
                            View Book
                            <ArrowRight className="ml-2" size={18} />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FINAL READER CTA
      ====================================================== */}

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Card className="overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-0 text-white">
            <div className="px-6 py-16 text-center sm:px-10">
              <BookMarked size={48} className="mx-auto" />

              <h2 className="mt-6 text-4xl font-black lg:text-5xl">
                Ready to Start Reading?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                Continue building your knowledge with practical resources from
                the KanuorieTech Library.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={handlePreview}>
                  <Eye className="mr-2" size={18} />
                  Read Preview
                </Button>

                <Button size="lg" variant="outline" onClick={handleDownload}>
                  <Download className="mr-2" size={18} />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* =====================================================
          NEWSLETTER
      ====================================================== */}

      <Newsletter />

      {/* =====================================================
          CTA
      ====================================================== */}

      <CTA />
    </>
  );
}

/* ============================================================
   SMALL REUSABLE COMPONENTS
============================================================ */

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {icon}

        {label}
      </span>

      <strong className="max-w-[55%] text-right text-sm text-slate-900">
        {value}
      </strong>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <Card className="text-center">
      <div className="flex justify-center text-blue-600">{icon}</div>

      <h3 className="mt-4 text-3xl font-black text-slate-900">{value}</h3>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </Card>
  );
}

function SpecificationCard({ label, value }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 break-words text-lg font-bold text-slate-900">
        {value}
      </p>
    </Card>
  );
}
