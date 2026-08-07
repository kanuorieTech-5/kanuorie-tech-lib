import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Card,
  Button,
  Loader,
  SectionTitle,
} from "../common";

import { getBooks } from "../../services";


export default function BooksPreview() {

  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchBooks = async () => {

      try {

        const res = await getBooks();

        setBooks(res.data || []);

      } catch (error) {

        console.error(
          "Failed to load books:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchBooks();

  }, []);



  if (loading) return <Loader />;



  return (

    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle

          badge="Digital Library"

          title="Explore Premium Digital Resources"

          subtitle="Access ebooks, guides and learning materials designed to improve your skills."

        />
        {books.length === 0 ? (

          <p className="
            mt-12
            text-center
            text-slate-400
          ">

            New books are coming soon.

          </p>

        ) : (
          <div className="
            mt-16
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-4
          ">
            {books.slice(0,4).map((book,index)=>(
              <motion.div

                key={book._id}

                initial={{
                  opacity:0,
                  y:30
                }}

                whileInView={{
                  opacity:1,
                  y:0
                }}

                transition={{
                  delay:index * 0.1
                }}

                viewport={{
                  once:true
                }}

              >
                <Card

                  className="
                    overflow-hidden
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                  "
                >
                  <img
                    src={
                      book.coverImage ||
                      "/images/book-placeholder.png"
                    }
                    alt={book.title}
                    className="
                      mb-5
                      h-60
                      w-full
                      rounded-2xl
                      object-cover
                    "
                  />
                  <h3 className="
                    mb-3
                    font-bold
                    text-white
                  ">

                    {book.title}

                  </h3>
                  <p className="
                    mb-5
                    font-semibold
                    text-cyan-400
                  ">

                    ₦
                    {Number(book.price)
                      .toLocaleString()
                    }

                  </p>
                  <Link
                    to={`/library/${book._id}`}
                  >

                    <Button fullWidth>

                      View Book

                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>

  );

}