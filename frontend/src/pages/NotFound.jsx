import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

import { Button } from "../components/common";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-8xl font-extrabold text-blue-600">404</h1>

        <h2 className="mt-6 text-4xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-lg leading-8 text-gray-600">
          Sorry, the page you are looking for doesn't exist, has been moved, or
          the URL may be incorrect.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button>
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>

          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        <div className="mt-16">
          <Search className="mx-auto mb-4 h-12 w-12 text-blue-500" />

          <p className="text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </section>
  );
}
