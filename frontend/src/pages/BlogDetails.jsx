import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  Loader,
} from "../components/common";

import {
  getBlog,
} from "../services";

export default function BlogDetails() {

  const { id } = useParams();

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBlog = async () => {

      try {

        const res = await getBlog(id);

        setBlog(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchBlog();

  }, [id]);

  if (loading) return <Loader />;

  if (!blog) {
    return (
      <div className="py-24 text-center">
        Blog post not found.
      </div>
    );
  }

  return (

    <section className="mx-auto max-w-5xl px-6 py-20">

      <img
        src={blog.image}
        alt={blog.title}
        className="mb-10 h-[450px] w-full rounded-xl object-cover shadow-xl"
      />

      <h1 className="mb-4 text-5xl font-bold">
        {blog.title}
      </h1>

      <p className="mb-10 text-gray-500">

        By {blog.author}

        {blog.createdAt && (
          <>
            {" • "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </>
        )}

      </p>

      <Card className="p-8">

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />

      </Card>

    </section>

  );

}