import Hero from "../components/home/Hero";
import ImageSlider from "../components/home/ImageSlider";
import heroImage from "../assets/WhatsApp Image 2026-08-06 at 12.35.26 PM (1).jpeg";

export default function Home() {
  return (
    <main className="relative bg-cover bg-center bg-no-repeat bg-white text-gray-90 transition-colors duration-300 dark:bg-slate-950 dark:text-white"
      style={{
        backgroundImage: `linear-gradient(
          to bottom right,
          rgba(2, 6, 23, 0.45),
          rgba(15, 23, 42, 0.35),
          rgba(30, 58, 138, 0.30)
        ), url("${heroImage}")`,
      }}
    >
      <Hero />
      <ImageSlider />
    </main>
  );
}
