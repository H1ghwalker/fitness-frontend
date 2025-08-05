'use client';

import { useState } from 'react';
import { Button } from './button';
import { Calendar, Users, TrendingUp, Dumbbell, Smartphone, Globe, Shield } from 'lucide-react';

interface FeatureShowcaseProps {
  onGetStarted: () => void;
}

export default function FeatureShowcase({ onGetStarted }: FeatureShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: "Client Management",
      description: "Easily manage your clients' profiles, contact information, and training history all in one place.",
      color: "blue",
      benefits: ["Organized client database", "Quick access to client info", "Training history tracking"]
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Schedule sessions with drag-and-drop ease and automatic conflict detection.",
      color: "green",
      benefits: ["Drag & drop scheduling", "Conflict detection", "Calendar sync"]
    },
    {
      icon: Dumbbell,
      title: "Workout Builder",
      description: "Create professional workout templates with exercises, sets, and progressions.",
      color: "purple",
      benefits: ["Exercise library", "Template creation", "Progress tracking"]
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track client progress with detailed analytics and visual reports.",
      color: "orange",
      benefits: ["Visual progress charts", "Goal tracking", "Performance metrics"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed specifically for personal trainers to grow their business and deliver better results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-white shadow-lg border-l-4 border-violet-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeFeature === index ? 'bg-violet-100' : 'bg-gray-200'
                  }`}>
                    <feature.icon className={`w-6 h-6 ${
                      activeFeature === index ? 'text-violet-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${
                      activeFeature === index ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      activeFeature === index ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const IconComponent = features[activeFeature].icon;
                  return <IconComponent className="w-8 h-8 text-violet-600" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-600 mb-6">
                {features[activeFeature].description}
              </p>
            </div>

            <div className="space-y-3">
              {features[activeFeature].benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Cloud Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button onClick={onGetStarted} size="lg" className="px-8 py-3">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
} 