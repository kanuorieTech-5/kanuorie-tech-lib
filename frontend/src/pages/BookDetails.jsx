import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
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
} from "lucide-react";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
  Badge,
} from "../components/common";

import {
  Newsletter,
  CTA,
} from "../components/home";

import {
  getBook,
  getBooks,
} from "../services";

export default function BookDetails() {

  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadBook() {

      try {

        const [bookRes, booksRes] = await Promise.all([
          getBook(id),
          getBooks(),
        ]);

        setBook(bookRes.data);

        setBooks(booksRes.data || []);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadBook();

  }, [id]);

  const relatedBooks = useMemo(() => {

    return books
      .filter((item) => item._id !== id)
      .slice(0, 3);

  }, [books, id]);

  if (loading) {

    return (

      <section className="flex min-h-[70vh] items-center justify-center">

        <Loader />

      </section>

    );

  }

  if (!book) {

    return (

      <section className="flex min-h-[70vh] items-center justify-center px-6">

        <Card className="max-w-lg text-center">

          <BookOpen
            className="mx-auto mb-6 text-blue-600"
            size={60}
          />

          <h2 className="text-3xl font-bold">

            Book Not Found

          </h2>

          <p className="mt-5 leading-8 text-slate-600">

            The requested book could not be found
            or may have been removed.

          </p>

          <Link
            to="/books"
            className="mt-8 inline-block"
          >

            <Button>

              Back To Library

            </Button>

          </Link>

        </Card>

      </section>

    );

  }

  return (

    <>

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:45px_45px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24">

          <Link
            to="/books"
            className="mb-10 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >

            <ArrowLeft size={18} />

            Back to Library

          </Link>

          <div className="grid gap-16 lg:grid-cols-[1.2fr_.8fr]">

            {/* LEFT SIDE */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <Badge>

                {book.category || "Programming"}

              </Badge>

              <h1 className="mt-6 text-5xl font-black leading-tight lg:text-6xl">

                {book.title}

              </h1>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">

                {book.description}

              </p>

              <div className="mt-10 flex flex-wrap gap-8">

                <div className="flex items-center gap-2">

                  <Star
                    fill="currentColor"
                    size={20}
                  />

                  {book.rating || "4.9"}

                </div>

                <div className="flex items-center gap-2">

                  <FileText size={20} />

                  {book.pages || 280} Pages

                </div>

                <div className="flex items-center gap-2">

                  <Download size={20} />

                  {book.downloads || 0} Downloads

                </div>

              </div>

            </motion.div>

            {/* PURCHASE CARD */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
            >

              <Card className="overflow-hidden p-0">

                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-[520px] w-full object-cover"
                />

                <div className="space-y-6 p-8">

                  <div className="flex items-center justify-between">

                    <span className="text-3xl font-black text-blue-600">

                      {book.price
                        ? `₦${book.price}`
                        : "Free"}

                    </span>

                    <Badge>

                      {book.format || "PDF"}

                    </Badge>

                  </div>

                  <Button fullWidth>

                    <Eye className="mr-2" size={18} />

                    Read Preview

                  </Button>

                  <Button
                    fullWidth
                    variant="outline"
                  >

                    <Download className="mr-2" size={18} />

                    Download Sample

                  </Button>
                                    <div className="space-y-5 border-t border-slate-200 pt-6">

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <User size={18} />

                        Author

                      </span>

                      <strong>

                        {book.author || "KanuorieTech"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <Building2 size={18} />

                        Publisher

                      </span>

                      <strong>

                        {book.publisher || "KanuorieTech"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <Languages size={18} />

                        Language

                      </span>

                      <strong>

                        {book.language || "English"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <BookOpen size={18} />

                        Pages

                      </span>

                      <strong>

                        {book.pages || 280}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <HardDrive size={18} />

                        File Size

                      </span>

                      <strong>

                        {book.fileSize || "12 MB"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <Globe size={18} />

                        ISBN

                      </span>

                      <strong>

                        {book.isbn || "978-0-0000-0000-0"}

                      </strong>

                    </div>

                    <div className="flex items-center justify-between">

                      <span className="flex items-center gap-2 text-slate-600">

                        <CalendarDays size={18} />

                        Published

                      </span>

                      <strong>

                        {book.createdAt
                          ? new Date(
                              book.createdAt
                            ).toLocaleDateString()
                          : "2026"}

                      </strong>

                    </div>

                  </div>

                </div>

              </Card>

            </motion.div>

          </div>

        </div>

      </section>

      {/* QUICK BOOK STATS */}

      <section className="-mt-10 pb-24">

        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-4">

          <Card className="text-center">

            <Star
              className="mx-auto text-yellow-500"
              fill="currentColor"
              size={32}
            />

            <h3 className="mt-4 text-3xl font-black">

              {book.rating || "4.9"}

            </h3>

            <p className="text-slate-500">

              Average Rating

            </p>

          </Card>

          <Card className="text-center">

            <BookOpen
              className="mx-auto text-blue-600"
              size={32}
            />

            <h3 className="mt-4 text-3xl font-black">

              {book.pages || 280}

            </h3>

            <p className="text-slate-500">

              Total Pages

            </p>

          </Card>

          <Card className="text-center">

            <Download
              className="mx-auto text-green-600"
              size={32}
            />

            <h3 className="mt-4 text-3xl font-black">

              {book.downloads || "1.2K"}

            </h3>

            <p className="text-slate-500">

              Downloads

            </p>

          </Card>

          <Card className="text-center">

            <FileText
              className="mx-auto text-purple-600"
              size={32}
            />

            <h3 className="mt-4 text-3xl font-black">

              {book.format || "PDF"}

            </h3>

            <p className="text-slate-500">

              Available Format

            </p>

          </Card>

        </div>

      </section>
            {/* ABOUT THE BOOK */}

      <section className="pb-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="About This Book"
            subtitle="A complete overview of what you'll gain from reading this resource."
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_.6fr]">

            <Card className="p-10">

              <div
                className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
                dangerouslySetInnerHTML={{
                  __html:
                    book.content ||
                    `<p>${book.description}</p>`,
                }}
              />

            </Card>

            <Card>

              <h3 className="mb-6 text-2xl font-bold">

                Book Information

              </h3>

              <div className="space-y-5">

                <div className="flex justify-between">

                  <span className="text-slate-500">

                    Category

                  </span>

                  <strong>

                    {book.category || "Programming"}

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">

                    Level

                  </span>

                  <strong>

                    {book.level || "Beginner"}

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">

                    Format

                  </span>

                  <strong>

                    {book.format || "PDF"}

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">

                    Pages

                  </span>

                  <strong>

                    {book.pages || 280}

                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">

                    Downloads

                  </span>

                  <strong>

                    {book.downloads || "1.2K"}

                  </strong>

                </div>

              </div>

            </Card>

          </div>

        </div>

      </section>

      {/* WHAT YOU'LL LEARN */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="What You'll Learn"
            subtitle="Key concepts covered in this book."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {(book.learningOutcomes?.length
              ? book.learningOutcomes
              : [
                  "Understand modern development workflows.",
                  "Write clean and maintainable code.",
                  "Build production-ready applications.",
                  "Master best practices used by professionals.",
                  "Improve problem-solving skills.",
                  "Gain practical project experience.",
                ]).map((item, index) => (

              <Card
                key={index}
                className="flex items-start gap-4"
              >

                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">

                  <BookOpen
                    size={16}
                    className="text-green-600"
                  />

                </div>

                <p className="leading-7 text-slate-700">

                  {item}

                </p>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* TABLE OF CONTENTS */}

      <section className="py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Table of Contents"
            subtitle="A quick look at what is inside the book."
          />

          <div className="mt-16 space-y-4">

            {(book.tableOfContents?.length
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
                ]).map((chapter, index) => (

              <Card
                key={index}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                    {index + 1}

                  </div>

                  <h3 className="font-semibold">

                    {chapter}

                  </h3>

                </div>

                <Badge>

                  Chapter {index + 1}

                </Badge>

              </Card>

            ))}

          </div>

        </div>

      </section>

      {/* BOOK SPECIFICATIONS */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Specifications"
            subtitle="Technical information about this publication."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Card>

              <h4 className="text-sm uppercase tracking-wide text-slate-500">

                ISBN

              </h4>

              <p className="mt-3 text-xl font-bold">

                {book.isbn || "978-0-0000-0000"}

              </p>

            </Card>

            <Card>

              <h4 className="text-sm uppercase tracking-wide text-slate-500">

                Language

              </h4>

              <p className="mt-3 text-xl font-bold">

                {book.language || "English"}

              </p>

            </Card>

            <Card>

              <h4 className="text-sm uppercase tracking-wide text-slate-500">

                Publisher

              </h4>

              <p className="mt-3 text-xl font-bold">

                {book.publisher || "KanuorieTech"}

              </p>

            </Card>

            <Card>

              <h4 className="text-sm uppercase tracking-wide text-slate-500">

                File Size

              </h4>

              <p className="mt-3 text-xl font-bold">

                {book.fileSize || "12 MB"}

              </p>

            </Card>

          </div>

        </div>

      </section>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            title="About The Author"
            subtitle="Learn more about the creator behind this resource."
          />
          <Card className="mt-12 overflow-hidden">
            <div className="
              flex
              flex-col
              gap-8
              md:flex-row
              md:items-center
            ">
              <img

                src={
                  book.author?.image ||
                  "/images/default-avatar.png"
                }

                alt={
                  book.author?.name ||
                  "Author"
                }

                className="
                  h-32
                  w-32
                  rounded-full
                  object-cover
                "

              />


              <div>


                <h3 className="
                  text-2xl
                  font-bold
                ">

                  {
                    book.author?.name ||
                    "KanuorieTech Team"
                  }

                </h3>


                <p className="
                  mt-2
                  text-blue-600
                  font-semibold
                ">

                  {
                    book.author?.role ||
                    "Technology Educator"
                  }

                </p>


                <p className="
                  mt-4
                  max-w-3xl
                  leading-8
                  text-gray-600
                ">

                  {
                    book.author?.bio ||
                    "Passionate about creating practical technology resources that help developers learn, build and grow."
                  }

                </p>


              </div>


            </div>


          </Card>


        </div>


      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="About The Author"
            subtitle="Learn more about the creator behind this resource."
          />

          <Card className="mt-10">

            <div className="flex flex-col gap-6 md:flex-row md:items-center">

              <img
                src={book.author?.image || "/images/default-avatar.png"}
                alt={book.author?.name || "Author"}
                className="h-28 w-28 rounded-full object-cover"
              />

              <div>
                <h3 className="text-2xl font-bold">
                  {book.author?.name || "KanuorieTech Team"}
                </h3>

                <p className="mt-2 font-semibold text-blue-600">
                  {book.author?.role || "Technology Educator"}
                </p>

                <p className="mt-3 max-w-3xl leading-7 text-gray-600">
                  {book.author?.bio ||
                    "Passionate about creating practical technology resources that help developers learn, build and grow."}
                </p>
              </div>

            </div>

          </Card>

        </div>
      </section>
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <SectionTitle
            title="Related Books"
            subtitle="Continue learning with similar resources."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {relatedBooks.map((item) => (
              <Card key={item._id}>

                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-56 w-full rounded-xl object-cover"
                />

                <h3 className="mt-4 line-clamp-2 text-lg font-bold">
                  {item.title}
                </h3>

                <p className="mt-2 font-semibold text-blue-600">
                  ₦{item.price}
                </p>

                <Link to={`/library/${item._id}`}>
                  <Button fullWidth className="mt-4">
                    View Book
                  </Button>
                </Link>

              </Card>
            ))}

          </div>

        </div>
      </section>
      <Newsletter />
      <CTA />
    </>
  );
}