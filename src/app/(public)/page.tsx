"use client";

import { useState, useEffect } from "react";
import AuthRedirect from "@/components/auth/AuthRedirect";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Dumbbell, Users, Calendar, MessageCircle, ArrowUp, Star, Play, CheckCircle, TrendingUp, Clock, Award, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { isMobileDevice, checkAuthWithRetry } from "@/lib/utils";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
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

  // Дополнительная проверка авторизации для мобильных устройств
  useEffect(() => {
    const checkAuthOnMount = async () => {
      if (isMobileDevice()) {
        try {
          console.log('HomePage: Additional auth check for mobile devices');
          const isAuthenticated = await checkAuthWithRetry(2, 300);
          
          if (isAuthenticated) {
            console.log('HomePage: User is authenticated, redirecting to /clients');
            router.push('/clients');
          }
        } catch (error) {
          console.log('HomePage: Auth check failed:', error);
        }
      }
    };

    // Проверяем через небольшую задержку, чтобы дать время middleware
    const timer = setTimeout(checkAuthOnMount, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const scrollToHero = () => {
    const heroSection = document.getElementById("hero-section");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqData = [
    {
      question: "What features does TrainerHub offer?",
      answer: "TrainerHub provides client management, workout template creation, session scheduling, and progress tracking. You can manage your clients, create workout templates, schedule sessions, and track client progress all in one platform."
    },
    {
      question: "Is TrainerHub available on mobile devices?",
      answer: "Yes! TrainerHub is fully responsive and works perfectly on all devices - smartphones, tablets, and desktops. You can manage your business from anywhere."
    },
    {
      question: "How do I get started with TrainerHub?",
      answer: "Simply sign up for a free account, add your clients, create workout templates, and start scheduling sessions. The interface is intuitive and easy to use."
    },
    {
      question: "Can I track my clients' progress?",
      answer: "Yes, TrainerHub includes progress tracking features that allow you to monitor your clients' fitness goals, measurements, and session attendance."
    }
  ];

  return (
    <AuthRedirect>
      <main className="bg-background-white">
        {/* Hero Section */}
        <section id="hero-section" className="bg-gradient-to-b from-background-white via-purple-50 to-background-light pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 md:pb-20">
          <div className="max-w-5xl mx-auto text-center px-3 sm:px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-main/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-float">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-main" aria-label="TrainerHub Logo Icon" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-main leading-tight mb-3 sm:mb-4 animate-fade-in-up">
                Transform your <br className="hidden sm:block" /> Training Business
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up px-2">
                The all-in-one platform for personal trainers to manage clients, schedule sessions, and track progress with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto animate-fade-in-up px-2">
                <Button
                  size="lg"
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
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
                  className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-semibold border-2 hover:bg-main hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 sm:mb-12 md:mb-14 animate-fade-in-up">
              Why Choose TrainerHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center animate-fade-in-up">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">Save Time</h3>
                <p className="text-secondary leading-relaxed text-sm sm:text-base">
                  Automate routine tasks and focus on what matters most - your clients and their results.
                </p>
              </div>
              <div className="text-center animate-fade-in-up">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">Grow Business</h3>
                <p className="text-secondary leading-relaxed text-sm sm:text-base">
                  Professional tools help you attract more clients and increase your revenue.
                </p>
              </div>
              <div className="text-center animate-fade-in-up">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-main" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">Pro Results</h3>
                <p className="text-secondary leading-relaxed text-sm sm:text-base">
                  Advanced analytics and tracking help your clients achieve better results faster.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
        <section id="benefits-section" className="py-12 sm:py-16 md:py-20 bg-background-light">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 sm:mb-12 md:mb-14 animate-fade-in-up">Everything You Need</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-main" aria-label="Client Management Icon" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2">Client Management</h3>
                <p className="text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
                  Manage your clients, their profiles, and contact information in one place.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                  <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-main" aria-label="Workout Templates Icon" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2">Workout Templates</h3>
                <p className="text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
                  Create and manage workout templates for different training programs.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-main" aria-label="Session Scheduling Icon" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2">Session Scheduling</h3>
                <p className="text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
                  Schedule training sessions and manage your calendar efficiently.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-main" aria-label="Progress Tracking Icon" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2">Progress Tracking</h3>
                <p className="text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
                  Track your clients' progress with measurements and goal tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-background-light">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 sm:mb-12 md:mb-14 animate-fade-in-up">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Отзыв 1 */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 animate-fade-in-up">
                <div className="flex justify-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-main fill-current" aria-label="Star" />
                  ))}
                </div>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  &quot;TrainerHub transformed how I manage my fitness business. The scheduling and progress tracking features are game-changers!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-main text-white flex items-center justify-center text-xs sm:text-sm font-semibold">SJ</span>
                  <p className="text-xs sm:text-sm text-secondary">Sarah Johnson, Personal Trainer, NYC</p>
                </div>
              </div>
              {/* Отзыв 2 */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 animate-fade-in-up">
                <div className="flex justify-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-main fill-current" aria-label="Star" />
                  ))}
                </div>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  &quot;The workout builder is intuitive and saves me hours of planning time. My clients love the progress tracking!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-main text-white flex items-center justify-center text-xs sm:text-sm font-semibold">MR</span>
                  <p className="text-xs sm:text-sm text-secondary">Mike Rodriguez, Fitness Coach, LA</p>
                </div>
              </div>
              {/* Отзыв 3 */}
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 animate-fade-in-up">
                <div className="flex justify-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-main fill-current" aria-label="Star" />
                  ))}
                </div>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-main" aria-label="Testimonial Icon" />
                  </div>
                </div>
                <p className="text-secondary text-center mb-3 sm:mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                  &quot;Since using TrainerHub, I have doubled my client base. The automated scheduling is a massive time-saver!&quot;
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-main text-white flex items-center justify-center text-xs sm:text-sm font-semibold">EW</span>
                  <p className="text-xs sm:text-sm text-secondary">Emma Wilson, Health Coach, Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary text-center mb-8 sm:mb-12 md:mb-14 animate-fade-in-up">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-background-light rounded-xl p-4 sm:p-6 animate-fade-in-up">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-primary pr-2">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-main flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-main flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <p className="text-secondary mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-main text-white py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto text-center px-3 sm:px-4 md:px-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in-up">Ready to Transform YOUR Training Experience?</h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed animate-fade-in-up">Join TrainerHub today as a trainer or client and reach your fitness goals.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowModal(true)}
                className="bg-white text-main hover:bg-background-light text-sm sm:text-base md:text-lg px-6 sm:px-8 py-2.5 sm:py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
              >
                Sign Up Now
              </Button>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Free 14-day trial</span>
                <span>•</span>
                <span>No credit card required</span>
              </div>
            </div>
            <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background-light py-6 sm:py-8">
        <div className="max-w-6xl mx-auto text-center px-3 sm:px-4 md:px-6">
          <p className="text-secondary text-xs sm:text-sm">©TrainerHub. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Arrow */}
      {isArrowVisible && (
        <Button
          onClick={scrollToHero}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 p-2 sm:p-3 bg-main text-white rounded-full shadow-lg hover:bg-main-dark transition-all duration-300 ease-in-out transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4 sm:h-6 sm:w-6" aria-label="Scroll to top" />
        </Button>
      )}
    </AuthRedirect>
  );
}