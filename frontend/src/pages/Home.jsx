import { useState, useEffect,  } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar";
import FeaturesSlider from "../components/FeaturesSlider";
import Footer from "../components/footer";
import {FaCode,FaRocket,FaMobileAlt,FaPalette,FaCloud,FaChartLine,FaBookOpen,FaBuilding,FaShieldAlt,FaUsers,
FaHandshake,FaArrowRight,FaLaptopCode,FaLightbulb,FaGlobe,FaCogs, FaFacebook,FaInstagram,FaTwitter,FaLinkedinIn,FaGithub,} from "react-icons/fa";
import HomeNav from "../components/HomeNav";

export default function Home() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    text: "",
  });

  /* ================= LOAD COMMENTS (SAFE) ================= */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("comments");
      setComments(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.error("Failed to parse comments:", err);
      setComments([]);
    }
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= SUBMIT COMMENT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.text) {
      alert("All fields are required");
      return;
    }

    const newComment = {
      ...form,
      id: Date.now(),
    };

    const updated = [...comments, newComment];

    setComments(updated);
    localStorage.setItem("comments", JSON.stringify(updated));

    setForm({ name: "", email: "", text: "" });
  };
  const services = [
      {
      title:"Software Development",
      icon:<FaCode />,
      },
      {
      title:"Mobile Applications",
      icon:<FaMobileAlt />,
      },
      {
      title:"UI/UX Design",
      icon:<FaPalette />,
      },
      {
      title:"Cloud Deployment",
      icon:<FaCloud />,
      },
      {
      title:"Technology Consulting",
      icon:<FaChartLine />,
      },
      {
      title:"Digital Branding",
      icon:<FaRocket />,
      },
    ];
  
  const slides = [
    {
      title:"Digital Products",
      subtitle:
      "KanuorieTech builds scalable technology solutions for businesses and startups.",
      icon:<FaRocket />,
      button:"Start Project",
      path:"/contact",
    },

    {
      title:"Technology Services",
      subtitle:
      "Software, mobile apps, cloud infrastructure and digital transformation.",
      icon:<FaCode />,
      button:"Explore Services",
      path:"/Services",
    },

    {
      title:"KanuorieTech Library",
      subtitle:
      "Our learning platform for developers and digital creators.",
      icon:<FaBookOpen />,
      button:"Open Library",
      path:"/library",
    },
    {
      title:"Personalized courses",
      subtitle:"Access your saved courses, track progress, and continue learning anytime.",
      icon:<FaLightbulb />,
      button:"Browse Courses",
      path:"/courses",
    },
    {
      title:"Enterprise Solutions",
      subtitle:"Custom systems and scalable platforms for organizations.",
      icon:<FaBuilding />,
      button:"Contact Us",
      path:"/contact",
    },
  ];
  const settings = {
    dots:true,
    infinite:true,
    autoplay:true,
    autoplaySpeed:5000,
    speed:800,
    slidesToShow:1,
    slidesToScroll:1,
    arrows:false,
    pauseOnHover:true,
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <HomeNav />
      <section className="bg-blac">
        <Slider {...settings}>
          {slides.map((slide)=>(
          <div key={slide.title}>
            <div className="flex items-center justify-center bg-gradient-to-br from-black via-blue-600 to-black text-white">
              <div className="max-w-6x lmx-auto px-6 text-center">
               <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-purple-500/10 flex items-center justify-center text-5xl text-blue-400">
                 {slide.icon}
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                 {slide.title}
                </h1>
                <p className="mt-8 max-w-3xl mx-auto text-gray-300 text-xl leading-9">
                 {slide.subtitle}
                </p>
                <button onClick={() => navigate(slide.path)}
                  className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-purple-700 transition">
                   {slide.button}
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
          ))}
        </Slider>
      </section>
      <main className="max-w-7xl mx-auto px-4">
        {/* =====================================
          KANUORIETECH COMPANY EXPERIENCE
        ===================================== */}
        <section className="">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
            {/* ================= HERO ================= */}
          <section className="py-16 flex items-center">
            <div className="max-w-5xl">
              <div className="inline-flex px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-blue-400 text-sm mb-8">
                TECHNOLOGY • SOFTWARE • DIGITAL PRODUCTS
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                  Engineering
                <br />
                  Digital Products
                <br />
                <span className="text-blue-500">
                  For The Future
                </span>
              </h1>
              <p className="mt-8 max-w-3xl text-xl text-gray-700 leading-9">
                KanuorieTech is a modern technology company
                building software, digital infrastructure,
                and scalable platforms that help businesses,
                founders, and organizations grow.
              </p>
              <div className="mt-10 flex flex-wrap gap-5">
                <button
                  onClick={() => navigate("/projects")}
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-purple-700 font-semibold transition">
                  Start a Project
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/100 transition font-semibold bg-blue-600">
                  Explore Products
                </button>
              </div>
           </div>
          </section>
          {/* ================= COMPANY OVERVIEW ================= */}
          <section className="">
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <p className="text-blue-400 font-semibold mb-4">
                  WHO WE ARE
                </p>
                <h2 className="text-5xl font-black mb-8">
                  Building Technology
                  That Creates Growth
                </h2>
                <p className="text-gray-700 text-lg leading-9">
                  KanuorieTech partners with startups,
                  businesses, and organizations to design,
                  build, launch, and scale modern digital
                  products.

                  We combine engineering, strategy,
                  and design to create technology that
                  delivers measurable value.
                </p>
              </div>
              <div className="space-y-5">
                {[
                "Modern Engineering",
                "Business-Focused Solutions",
                "Cloud-Ready Infrastructure",
                "Scalable Architecture",
                "Reliable Product Delivery",
                ].map((item)=>(
                <div
                 key={item}
                  className=" p-6 rounded-2xl bg-white text-black font-semibold">
                  ✓ {item}
                </div>
               ))}
             </div>
            </div>
          </section>
          
           {/* ================= SERVICES ================= */}
            <section className="pb-32 py-16">
              <div className="text-center mb-16 ">
                <p className="text-blue-400">
                  SERVICES
                </p>
                <h2 className="text-5xl font-black">
                  Technology Services
                </h2>
              </div>
              <div className="grid-col-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service)=>(
                <div
                  key={service.title}
                  className="bg-white text-black rounded-3xl p-10 shadow-xl hover:-translate-y-3 transition">
                  <div className=" w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-3xl mb-8">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-gray-600">
                    Built for modern businesses and
                    high-growth digital products.
                  </p>
                </div>
                ))}
              </div>
            </section>

            {/* ================= PRODUCTS ================= */}

            <section className="pb-32 py-16">
              <div className="text-center mb-16">
                <p className="text-blue-400">
                  PRODUCTS
                </p>
                <h2 className="text-5xl font-black">
                  What We Have Built
                </h2>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                 {/* PRODUCT 1 */}
                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-black p-10">
                  <div className="text-5xl mb-6">
                    📚
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    KanuorieTech Library
                  </h3>
                  <p className="mt-5 text-gray-300">
                    A learning and resource platform
                    for developers and digital creators.
                  </p>
                  <ul className="mt-8 space-y-3 text-gray-300">
                    <li>✓ Saved Courses</li>
                    <li>✓ Progress Tracking</li>
                    <li>✓ Learning Resources</li>
                    <li>✓ Personalized Dashboard</li>
                  </ul>
                  <button
                    onClick={() => navigate("/library")}
                    className="mt-10 px-6 py-3 bg-white text-black rounded-xl font-bold ">
                    Open Library
                  </button>
                </div>

                {/* PRODUCT 2 */}
                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-black p-10">
                  <div className="text-5xl mb-6">
                   <FaBookOpen />
                  </div>
                  <h3 className="text-3xl font-black text-white">
                    UketBook Store       
                  </h3>
                  <p className="mt-5 text-gray-300">
                    A digital bookstore for the purchase and download of ebooks, audiobooks, and other digital content.
                  </p>
                  <ul className="mt-8 space-y-3 text-gray-300">
                    <li>✓ Comprehensive Categories</li>
                    <li>✓ Secure Payment Processing</li>
                    <li>✓ Easy Download and Access</li>
                    <li>✓ Offline Reading Capability</li>
                  </ul>
                  <button
                    onClick={() => navigate("/products")}
                    className="mt-10 px-6 py-3 bg-white text-black rounded-xl font-bold ">
                    visit Store
                  </button>
                </div>

                {/* PRODUCT 3 */}
               <div className="bg-white text-black rounded-3xl p-10">
                  <div className="text-5xl mb-6">
                    🏢
                  </div>
                  <h3 className="text-3xl font-black">
                    Enterprise Solutions
                  </h3>
                  <p className="mt-5 text-gray-600">
                    Custom systems for organizations
                    and large business operations.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* ================= WHY US ================= */}
        <section className="pb-32 py-16">
          <div className="text-center mb-16">
            <p className="text-blue-400">
              WHY KANUORIETECH
            </p>
            <h2 className="text-5xl font-black">
              Why Companies Work With Us
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
            "Modern Technology",
            "Business-Driven Solutions",
            "Scalable Systems",
            "Reliable Partnership",
            ].map((item)=>(

            <div
              key={item}
              className=" bg-white text-black rounded-3xl p-10 shadow-xl">
              <div className="text-5xl mb-5">
                ⚡
              </div>
              <h3 className="font-bold text-2xl">
                {item} 
              </h3>
              <p className="mt-4 text-gray-600">
                Built for sustainable business growth.
              </p>
            </div>
            ))}
          </div>
        </section>
        {/* ================= FEATURED WORK ================= */}
        <section className="pb-32 py-16">
          <div className="text-center mb-16">
            <p className="text-blue-400">
              FEATURED WORK
            </p>
            <h2 className="text-5xl font-black">
              Selected Projects
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
            {
            title:"KanuorieTech Library",
            desc:"Digital learning platform."
            },
            {
            title:"Business Dashboard",
            desc:"Data-driven operations."
            },
            {
            title:"Enterprise Portal",
            desc:"Internal productivity tools."
            },
            ].map((project)=>(
          <div
            key={project.title}
            className="rounded-3xl overflow-hidden bg-white text-black">
            <div className="h-56 bg-gradient-to-br from-blue-600 to-black"/>
              <div className="p-8">
                <h3 className="text-2xl font-black">
                 {project.title}
                </h3>
                <p className="mt-4 text-gray-600">
                  {project.desc}
                </p>
              </div>
            </div>
            ))}
          </div>
        </section>
        {/* ================= PROCESS ================= */}
        <section className="pb-10">
          <div className="text-center mb-20">
            <p className="text-blue-400">
             OUR PROCESS
            </p>
            <h2 className="text-5xl font-black">
              How We Build
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {[
            "Discover",
            "Strategy",
            "Design",
            "Build",
            "Launch",
            ].map((step,index)=>(
            <div
              key={step}
              className="bg-white text-black rounded-3xl p-10 text-center">
              <div className="text-blue-600 text-5xl font-black">
                0{index+1}
              </div>
              <h3 className="mt-6 font-bold text-xl">
              {step}
              </h3>
            </div>
            ))}
          </div>
        </section>
        {/* ================= TESTIMONIALS ================= */}
        <section className="pb-10">
          <div className="text-center mb-16">
            <p className="text-blue-400">
              TESTIMONIALS
            </p>
            <h2 className="text-5xl font-black">
              What People Say
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
            {
            name:"Startup Founder",
            quote:
            "Professional execution and outstanding communication."
            },
            {
            name:"Product Designer",
            quote:
            "Modern experience and strong delivery."
            },
            {
            name:"Business Owner",
            quote:
            "KanuorieTech transformed our digital presence."
            },
            ].map((item)=>(

            <div
              key={item.name}
              className="bg-white text-black rounded-3xl p-10">
              <p className="text-gray-600">
                "{item.quote}"
              </p>
              <h4 className="mt-8 font-black">
                {item.name}
              </h4>
            </div>
            ))}
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="rounded-[40px] bg-gradient-to-r from-blue-600 to-black p-16 mb-10">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-black text-white">
              Ready To Build With KanuorieTech?
            </h2>
            <p className="mt-6 text-gray-200">
              From software to scalable digital
              products—we help turn ideas into reality.
            </p>
            <div className="mt-10 flex gap-5">
              <button
                onClick={() => navigate("/projects")}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold">
                Start Project
              </button>

              <button
                onClick={() => navigate("/products")}
                className="px-8 py-4 rounded-xl border border-white text-white">
                Explore Products
              </button>
            </div>
          </div>
        </section>
        <section className="mb-5 p-4 rounded-2xl bg-white text-black text-center">
          <h2 className="text-5xl font-black text-center">
            Ready to Level Up?
          </h2>

          <p className="text-gray-700 mt-4">
            Join thousands of tech enthusiasts who are already learning and growing with KanuorieTechLib. 
            Your next big breakthrough is just a click away! create an account to save your favorite resources,
            track your progress, and contribute to the community.
          </p>

          <Link
            to="/library"
            className="bg-purple-600 text-white px-6 py-3 rounded-full mt-6 inline-block"
          >
            Get Started Now
          </Link>
        </section>

      </main>
      
      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-10 px-5 bg-black text-white">
        <div className="grid md:grid-cols-5 gap-10">
          <div>
            <h3 className="font-black text-2xl text-blue-400">KanuorieTech</h3>
            <p className="mt-5 text-gray-400">Engineering real digital growth.</p>
          </div>
          <div>
            <h4 className="font-bold mb-5">Company</h4>
            <div className="space-y-3">
              <p>About</p>
              <p>Services</p>
              <p>Products</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-5">Products</h4>
            <div className="space-y-3">
              <p>Library</p>
              <p>SaaS</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-5">Resources</h4>
            <div className="space-y-3">
              <p>Blog</p>
              <p>Help</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-5">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:info@kanuorietech.com" className="text-gray-400 hover:text-white">
                info@kanuorietech.com
              </a>
              <div>
                <h2 className="text-white font-bold text-xl mb-6">Follow Us On Social Media</h2>
                <div className="flex gap-4">
                  <a
                    className="text-blue-600 flex gap-4"
                    href="https://www.linkedin.com/in/orie-kanu-8b85683a6?"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    className="text-blue-600 flex gap-4"
                    href="https://www.instagram.com/stephaniekanu_/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    className="text-blue-600 flex gap-4"
                    href="https://twitter.com/kanustephanie22"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    className="text-blue-600 flex gap-4"
                    href="https://web.facebook.com/stephgirlsplace/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    className="text-blue-600 flex gap-4"
                    href="https://github.com/stephaniekanu-5"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}