'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Personal Trainer",
    location: "New York, NY",
    content: "TrainerHub transformed how I manage my fitness business. The scheduling and progress tracking features are game-changers! I've doubled my client base since using it.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    role: "Fitness Coach",
    location: "Los Angeles, CA",
    content: "The workout builder is intuitive and saves me hours of planning time. My clients love the progress tracking and I love the professional reports.",
    rating: 5,
    avatar: "MR"
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Health Coach",
    location: "Chicago, IL",
    content: "Since using TrainerHub, I have doubled my client base. The automated scheduling is a massive time-saver and the analytics help me deliver better results.",
    rating: 5,
    avatar: "EW"
  },
  {
    id: 4,
    name: "David Chen",
    role: "Strength Coach",
    location: "Miami, FL",
    content: "The client management system is incredibly organized. I can track everything from progress to payments in one place. Highly recommended!",
    rating: 5,
    avatar: "DC"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Personal Trainers Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of fitness professionals who have transformed their business with TrainerHub.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 ${
                  index === currentIndex ? 'scale-105 shadow-xl' : 'scale-95 opacity-75'
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-violet-200 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                    <span className="text-violet-600 font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-violet-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600 mb-2">10,000+</div>
            <div className="text-gray-600">Active Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600 mb-2">50,000+</div>
            <div className="text-gray-600">Clients Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-violet-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
} 