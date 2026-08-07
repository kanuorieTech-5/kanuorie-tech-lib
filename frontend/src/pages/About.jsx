import {
  AboutPreview,
  Stats,
  Partners,
  CTA,
} from "../components/home";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-32 text-white">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">

          <span className="rounded-full bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
            About KanuorieTech
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight lg:text-7xl">
            Building Technology
            <span className="text-blue-400">
              {" "}That Creates
            </span>
            <br />
            Opportunities.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
            KanuorieTech is a technology company committed
            to building innovative software solutions,
            empowering businesses, and equipping future
            developers with practical skills through our
            Academy.
          </p>

        </div>

      </section>

      <AboutPreview />

      <Stats />

      <Partners />

      <CTA />
    </>
  );
}