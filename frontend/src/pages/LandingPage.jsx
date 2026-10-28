import Hero from "../components/home/Hero";
import ImageSlider from "../components/home/ImageSlider";
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-90 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <Hero />
      <ImageSlider />
    </main>
  )
}