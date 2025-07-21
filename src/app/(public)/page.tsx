"use client";

import { useState, useEffect } from "react";
import AuthRedirect from "@/components/auth/AuthRedirect";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Calendar, MessageCircle, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const benefitsSection = document.getElementById("benefits-section");
      if (benefitsSection) {
        const benefitsTop = benefitsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        setIsArrowVisible(benefitsTop <= windowHeight);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToHero = () => {
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AuthRedirect>
      <main className="bg-background-white">
        {/* Hero Section */}
        <section id="hero-section" className="bg-gradient-to-b from-background-white via-purple-50 to-background-light py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center px-4">
            <div className="flex flex-col items-center gap-4 mb-8">
              <Dumbbell className="h-12 w-12 text-main" aria-label="TrainerHub Logo Icon" />
              <h1 className="text-5xl md:text-6xl font-bold text-main leading-tight mb-2">
                Transform your <br /> Training Business
              </h1>
              <p className="text-lg md:text-xl text-secondary mb-6 max-w-2xl mx-auto">
                The all-in-one platform for personal trainers to manage clients, schedule sessions, and track progress with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowModal(true)}
                >
                  Sign Up Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById("benefits-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              How would you like to continue?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Trainer Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-main" aria-label="Trainer Icon" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">I'm a Trainer</h3>
                  <p className="text-secondary mb-8">
                    Access your client management dashboard, create workouts, and schedule sessions.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2"
                  >
                    Continue as Trainer →
                  </Button>
                </div>
              </div>
              
              {/* Client Card (Disabled) */}
              <div className="bg-gray-50 rounded-lg shadow-lg p-8 border border-gray-200 opacity-60">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <Users className="h-8 w-8 text-gray-400" aria-label="Client Icon" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-500 mb-4">I'm a Client</h3>
                  <p className="text-gray-500 mb-8">
                    View your training sessions, access your personalized workout plans, and track your fitness progress.
                  </p>
                  <Button
                    disabled
                    size="lg"
                    className="flex items-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Coming Soon →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="benefits-section" className="py-20 bg-background-light">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-14">Everything You Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-main" aria-label="Client Management Icon" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Client Management</h3>
                <p className="text-secondary">
                  Organize client data, track progress, manage subscriptions effortlessly.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-main" aria-label="Workout Builder Icon" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Workout Builder</h3>
                <p className="text-secondary">
                  Create customized workout plans with intuitive drag and drop interface.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-main" aria-label="Smart Scheduling Icon" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Smart Scheduling</h3>
                <p className="text-secondary">
                  Effortlessly schedule sessions, reduce bookings, and reschedule conflicts.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-main" aria-label="Progress Tracking Icon" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">Progress Tracking</h3>
                <p className="text-secondary">
                  Track client progress with detailed analytics and beautiful charts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-14">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Отзыв 1 */}
              <div className="bg-background-light rounded-lg shadow-sm p-6 flex flex-col items-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-main" fill="currentColor" viewBox="0 0 24 24" aria-label="Star">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-4">
                  &quot;TrainerHub transformed how I manage my fitness business. The scheduling and progress tracking features are game-changers!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">SJ</span>
                  <p className="text-sm text-secondary">Sarah Johnson, Personal Trainer, NYC</p>
                </div>
              </div>
              {/* Отзыв 2 */}
              <div className="bg-background-light rounded-lg shadow-sm p-6 flex flex-col items-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-main" fill="currentColor" viewBox="0 0 24 24" aria-label="Star">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-4">
                  &quot;The workout builder is intuitive and saves me hours of planning time. My clients love the progress tracking!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">MR</span>
                  <p className="text-sm text-secondary">Mike Rodriguez, Fitness Coach, LA</p>
                </div>
              </div>
              {/* Отзыв 3 */}
              <div className="bg-background-light rounded-lg shadow-sm p-6 flex flex-col items-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-main" fill="currentColor" viewBox="0 0 24 24" aria-label="Star">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-4">
                  &quot;Since using TrainerHub, I have doubled my client base. The automated scheduling is a massive time-saver!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white text-sm">EW</span>
                  <p className="text-sm text-secondary">Emma Wilson, Health Coach, Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-main text-white py-20">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform YOUR Training Experience?</h2>
            <p className="text-lg mb-8">Join TrainerHub today as a trainer or client and reach your fitness goals.</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowModal(true)}
              className="bg-white text-main hover:bg-background-light"
            >
              Sign Up Now
            </Button>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-light py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-secondary text-sm">©TrainerHub. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Arrow */}
      {isArrowVisible && (
        <Button
          onClick={scrollToHero}
          className="fixed bottom-8 right-8 p-3 bg-main text-white rounded-full shadow-lg hover:bg-main-dark transition-all duration-300 ease-in-out transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" aria-label="Scroll to top" />
        </Button>
      )}
    </AuthRedirect>
  );
}