import Hero from "../components/home/Hero";
import AboutPreview from "../components/home/AboutPreview";
import ImageSlider from "../components/home/ImageSlider";
import Features from "../components/home/Features";
import PlatformFeatures from "../components/home/FeaturesSlider";
import TeamPreview from "../components/home/TeamPreview";
import ServicesPreview from "../components/home/ServicesPreview";
import ProjectsPreview from "../components/home/ProjectsPreview";
import CoursesPreview from "../components/home/CoursesPreview";
import BooksPreview from "../components/home/BooksPreview";
import ProductsPreview from "../components/home/ProductsPreview";
import Testimonials from "../components/home/Testimonials";
import BlogPreview from "../components/home/BlogPreview";
import TechStack from "../components/home/TechStack";
import Newsletter from "../components/home/Newsletter";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <Hero />

      <AboutPreview />

      <ImageSlider />

      <Features />

      <PlatformFeatures />

      <ServicesPreview />

      <ProjectsPreview />

      <CoursesPreview />

      <BooksPreview />

      <ProductsPreview />

      <BlogPreview />

      <Testimonials />

      <TechStack />

      <TeamPreview />

      <Newsletter />

      <CTA />
    </main>
  );
}