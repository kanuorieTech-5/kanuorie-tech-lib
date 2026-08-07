export default function CookiePolicy() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">

      <h1 className="mb-10 text-5xl font-bold">
        Cookie Policy
      </h1>

      <div className="space-y-8 leading-8 text-gray-700">

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            What Are Cookies?
          </h2>

          <p>
            Cookies are small text files stored on your
            device to improve your browsing experience.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            How We Use Cookies
          </h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>Authentication</li>
            <li>User preferences</li>
            <li>Analytics</li>
            <li>Security</li>
            <li>Performance improvements</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            Managing Cookies
          </h2>

          <p>
            You may disable cookies through your browser
            settings. Some platform features may not
            function correctly without them.
          </p>
        </section>

      </div>

    </section>
  );
}