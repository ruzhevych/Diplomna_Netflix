// src/pages/LandingPage.tsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "/logo-green.png"; // <-- шлях до твого лого
import Footer from "../components/Footer/Footer"
import { FaDownload, FaChild } from "react-icons/fa";
import { type Movie, type TMDBResponse } from "../types/movie";
import { getPopularMovies } from "../services/movieApi";

import { GiFilmProjector } from "react-icons/gi";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
  
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState<Movie[]>([]); 

   const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 4; 
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data: TMDBResponse<Movie> = await getPopularMovies();
        setMovies(data.results.slice(0, 10)); 
      } catch (err) {
        console.error("Помилка завантаження:", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
          <div className="flex items-center gap-4">
            
            <Link to="/login">
              <button className="bg-lime-500/80 px-4 py-2 rounded-sm text-white font-semibold hover:bg-lime-400">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/land-bg.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Movies, series and lots of other content <br /> without limits
          </h1>
          <h2 className="text-lg md:text-2xl mb-4">
           From <span className="text-lime-400">4,99 EUR</span>.
            You can cancel subscription anytime
          </h2>
          <p className="mb-6">
            Ready to watch? Enter your e-mail to subscribe or update it!
          </p>
          <div className="flex rounded-sm flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3  w-full sm:w-112 bg-black/70 border border-gray-500"
            />
            <button
              onClick={() => navigate("/register")}
              className="bg-lime-500/80 px-6 py-3 rounded-sm font-bold text-lg hover:bg-lime-400 transition"
            >
              Start
            </button>
          </div>
        </div>
      </section>


      <div className="relative">
        <div
          className="absolute -top-11 left-0 w-full h-10 
                    bg-gradient-to-r from-lime-500 via-lime-600 to-green-600 
                    rounded-t-[50%] 
                    shadow-[0_-20px_30px_rgba(0,0,0,0.6)]"/>
      </div>

      <div className="relative">
        <div className="absolute -top-10 left-0 w-full h-12 bg-black rounded-t-[50%] shadow-[0_-20px_20px_rgba(0,255,0,0.4)]" />
      </div> 


      <section className="bg-black py-12 px-6">
      <div className="max-w-6xl mx-auto relative">
        <h2 className="text-2xl font-bold mb-6 text-white">Popular Now</h2>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        &#8592;
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        &#8594;
      </button>

        <div
  ref={scrollRef}
  className="flex gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth pt-2"
>
  {movies.map((movie, index) => (
    <div
     key={movie.id}
  className="relative min-w-[20%] flex-shrink-0 cursor-pointer group
             rounded-lg transform transition-transform duration-500 hover:scale-105"
  onClick={() => setSelectedMovie(movie)}
    >
      
      <div  className="absolute -left-5 top-2 z-20 text-9xl font-bold text-lime-400
               drop-shadow-[2px_2px_4px_rgba(0,0,0,0.9)]
               [text-shadow:_0_0_2px_white,0_0_10px_black]
               [-webkit-text-stroke:2px_white]">
        {index + 1}
      </div>
      
       <div className="rounded-lg overflow-hidden">
    <img
      src={`${IMG_BASE}${movie.poster_path}`}
      alt={movie.title || movie.original_title}
      className="w-full h-80 object-cover"
    />
  </div>
      
      <p className="mt-2 text-sm text-gray-300 truncate">
        {movie.title || movie.original_title}
      </p>
    </div>
  ))}
</div>


        {selectedMovie && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black/90 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto relative">
           
            <button
              className="absolute top-3 right-3 text-white text-xl font-bold"
              onClick={() => setSelectedMovie(null)}
            >
              &times;
            </button>

            
            <img
              src={`${IMG_BASE}${selectedMovie.poster_path}`}
              alt={selectedMovie.title || selectedMovie.original_title}
              className="rounded-lg w-full mb-4 h-96 object-cover"
            />
            
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedMovie.title || selectedMovie.original_title}
            </h3>
            
            <p className="text-gray-300 mb-4">
              {selectedMovie.overview || "Немає опису."}
            </p>
            
            <a
              href="/login"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Почати
            </a>
          </div>
        </div>
      )}
      </div>
    </section>
  

      
<section className="bg-black py-16 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-2xl font-bold text-white mb-8  tracking-wide">
      More reasons to subscribe
    </h2>
    <div className="grid md:grid-cols-4 gap-8 text-center">
      {[
        { 
          title: "Watch on TV", 
          subtitle: "Smart TV, Playstation, Xbox, Chromecast, Apple TV та інші пристрої.",
          icon: <GiFilmProjector className="text-lime-500 text-6xl mx-auto mb-4 animate-pulse" /> 
        },
        { 
          title: "Download and watch offline", 
          subtitle: "Save your favorite TV shows and movies to your phone or tablet.",
          icon: <FaDownload className="text-lime-500 text-6xl mx-auto mb-4 animate-pulse" /> 
        },
        { 
          title: "Watch anywhere", 
          subtitle: "Watch on your phone, tablet, laptop or TV without restrictions.",
          icon: <MdOutlineScreenSearchDesktop className="text-lime-400 text-6xl mx-auto mb-4 animate-pulse" /> 
        },
        { 
          title: "Create profiles for kids", 
          subtitle: "Safe browsing for kids with their own profiles.Безпечний перегляд для малечі з власними профілями.",
          icon: <FaChild className="text-lime-400 text-6xl mx-auto mb-4 animate-pulse" /> 
        },
      ].map((f, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl p-8 
                     bg-gradient-to-br from-lime-900/30 via-lime-900/20 to-black-900/20
                     shadow-2xl hover:shadow-3xl transition-transform duration-500 hover:scale-105
                    backdrop-blur-md"
        >
          <div className="relative z-10">{f.icon}</div>
          <h3 className="font-bold text-xl md:text-2xl text-white mb-2 mt-4">{f.title}</h3>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">{f.subtitle}</p>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl"></div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* FAQ SECTION */}
      

<section className="bg-black py-12 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl md:text-2xl font-bold text-white mb-8 tracking-wide">
      Поширені запитання
    </h2>
    <div className="space-y-2">
      {[
          {
          "q": "What is the service?",
          "a": "It's an online platform for watching movies and TV series anytime and on any device."
          },
          {
            "q": "How much does a subscription cost?",
            "a": "Subscriptions start from 4.99 EUR per month. You can choose the plan that's right for you."
          },
          {
            "q": "Where can I watch?",
            "a": "Watch on TVs, smartphones, tablets, and computers. All you need is an internet connection."
          },
          {
            "q": "How do I cancel my subscription?",
            "a": "You can cancel your subscription at any time in your account settings without any additional fees."
          },
          {
            "q": "Is there content for children?",
            "a": "Yes! You can create a children's profile with safe viewing and limited access to content."
          }
      ].map((item, i) => (
        <details
          key={i}
          className="group bg-gradient-to-tr from-lime-700/20 via-lime-600/10 to-lime-900/20 
                     backdrop-blur-md rounded-sm p-4 
                     transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <summary className="cursor-pointer font-bold text-lg text-white flex justify-between items-center">
            {item.q}
            <span className="transition-transform duration-300 group-open:rotate-45 text-lime-400 text-xl">+</span>
          </summary>
          <p className="mt-3 text-gray-300 text-sm md:text-base leading-relaxed">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>

      <Footer/>
    </div>
  );
};

export default LandingPage;
