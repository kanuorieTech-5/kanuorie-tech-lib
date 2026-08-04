import Navbar from "../components/Navbar";
import ImageSlider from "../components/imageSlider";

export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50 rounded-lg">
      <Navbar />
      <ImageSlider />
      <main className="max-w-7xl mx-auto px-6 mt-0 ">
        <div className="max-w-3xl rounded-lg shadow-lg w-full p-4">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Curated knowledge for the{" "}
            <span className="text-gray-500">modern developer.</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Your one-stop destination for the best tech resources, handpicked to help you learn, grow, and stay ahead in the ever-evolving world of technology.
          </p>
           <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Whether you're a beginner looking to learn the basics or an experienced developer seeking advanced resources, we've got you covered. Explore our extensive library of articles, tutorials, courses, and tools across various tech domains.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            We believe in the power of knowledge sharing. Our mission is to empower developers with the best resources for continuous learning and growth. We handpick each resource to ensure quality and relevance, making it easier for you to find exactly what you need to succeed in your tech journey.
          </p>
           <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Explore our vast library of resources across various tech domains, including programming languages, frameworks, DevOps tools, data science, machine learning, design, and much more. Whether you're looking to learn a new skill, stay updated with the latest trends, or find solutions to your coding challenges, KanuorieTechLib has something for everyone.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Join our community of developers and start your learning journey today. With KanuorieTechLib, the best resources are just a click away.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed mb-10">
            Discover and master new tech skills .
          </p>
          <a
            href="/library"
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
          >
            Get Started →
          </a><br /> <br />
          <p className="text-gray-600 mb-6">
             Explore our extensive collection of resources, handpicked to help you stay ahead in the ever-evolving world of technology. Whether you're a beginner or an experienced developer, we have something for everyone.
           </p>
        </div>
        
        <div className="mt-20">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVldmVsb3BlcnxlbnwwfHwwfHww&auto=format&fit=crop&w=800&q=60"
            alt="Developer learning"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="mt-20">
           <a href="/profile"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition">
            + Add Resource
          </a>
          <p className="text-gray-600 mt-4">
            Have a resource to share? Click the button above to contribute to our growing library and help fellow developers learn and grow.
          </p>        
        </div>
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            To empower developers with the best resources for continuous learning and growth.
          </p>
        </div>
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-600 mb-6">  A vast library of resources across various tech domains.</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Programming languages and frameworks.</li>
            <li>DevOps tools and practices.</li>
            <li>Data science and machine learning.</li>
            <li>Design and UX resources.</li>
          </ul>
        </div>    
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Handpicked resources for quality learning.</li>
            <li>Organized by categories and skill levels.</li>
            <li>Regularly updated with the latest content.</li>
            <li>Community-driven recommendations.</li>
          </ul>
        </div>
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">  Connect with fellow developers and share your knowledge.</p>
          <a
            href="/Register"
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition"
          >
            Register Today →
          </a>
        </div>
          <section className="mt-20 px-4 py-2 border border-gray-400">
            <h1 className="text-3xl font-bold mb-4">Leave a Comment</h1>
            <form className="commentForm">
                <p id="commentMsg" role="alert"></p>
                <label for="commentName">Name </label>
                <input type="text" placeholder="commentName" className="w-full sm:w-auto px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500" required /><br /><br />
                <label for="commentEmail" className="">Email </label>
                <input type="email" placeholder="@gmail,com" className="w-full sm:w-auto px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500" required /><br /><br />
                <label for="commentText">Comment</label><br />
                <textarea id="commentText" rows="4" className="border mt-2 w-full" required></textarea><br />
                <button type="submit" className="mt-2 bg-blue-600 text-white px-6 py-2 cursor-pointer hover:bg-blue-700 trasition rounded-lg shadow-md ">Send Comment</button>
            </form>
            <div className="commentList"></div>
         </section>
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest updates and resources.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-900 text-white mt-20" >  
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-4">📚 KanuorieTech</h2>
          <p className="text-gray-400">
            Discover thousands of learning resources, and digital
            libraries all in one place.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/Library" className="hover:text-white">
                Browse Library
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-white">
                My Profile
              </a>
            </li>
            <li>
              <a href="/library" className="hover:text-white">
                My Library
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">
            Email: support@KanuorieTech.com
          </p>
          <p className="text-gray-400">
            Built with ❤️ using React
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-gray-500">
        © {new Date().getFullYear()} KanuorieTechhub... All rights reserved.
      </div>
    </footer>
    </div>
  );
}