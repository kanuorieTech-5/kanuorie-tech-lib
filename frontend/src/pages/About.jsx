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
      <AboutPreview />

      <Stats />

      <Partners />

      <CTA />
    </>
  );
}