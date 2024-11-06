import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          About Core Values
        </h1>
        <p className="text-xl text-gray-600">
          Discover and prioritize what matters most to you
        </p>
      </div>

      {/* Purpose Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Why Core Values Matter
        </h2>
        <div className="prose prose-lg text-gray-600">
          <p>
            Understanding your core values is essential for making meaningful life decisions 
            and living authentically. This app helps you explore and organize your values 
            through an interactive and thoughtful process.
          </p>
          <p>
            Whether you're at a crossroads in life, planning your future, or simply want 
            to better understand yourself, identifying your core values provides a compass 
            for decision-making and personal growth.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-blue-600 text-xl mb-2">1. Explore</div>
            <p className="text-gray-600">
              Browse through carefully curated value cards and begin sorting them based 
              on their importance to you.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-blue-600 text-xl mb-2">2. Prioritize</div>
            <p className="text-gray-600">
              Organize values into categories, helping you identify which ones resonate 
              most strongly with your personal beliefs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="text-blue-600 text-xl mb-2">3. Reflect</div>
            <p className="text-gray-600">
              Review your choices and gain insights into what truly matters to you, 
              helping guide future decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              🎯 Clear Decision Making
            </h3>
            <p className="text-gray-600">
              Use your identified values as a framework for making choices that align 
              with what truly matters to you.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              🧭 Personal Growth
            </h3>
            <p className="text-gray-600">
              Gain deeper self-awareness and understanding of your motivations and 
              priorities.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              🤝 Better Relationships
            </h3>
            <p className="text-gray-600">
              Communicate your values clearly to others and understand what drives 
              your interactions.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              ⚡ Increased Motivation
            </h3>
            <p className="text-gray-600">
              Align your goals with your values for more meaningful and sustainable 
              motivation.
            </p>
          </div>
        </div>
      </section>

      {/* Data Privacy Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Data & Privacy
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              📱 Private & Local Storage
            </h3>
            <p className="text-gray-600">
              All your selections and progress are stored directly on your device. 
              Think of it like having a personal notebook that only exists on your 
              phone or computer.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              🔒 Complete Privacy
            </h3>
            <p className="text-gray-600">
              Your data never leaves your device - we don't use any external servers 
              or cloud storage. Your personal journey stays completely private.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">
              💾 Automatic Saving
            </h3>
            <p className="text-gray-600">
              Every change you make is automatically saved on your device. You can 
              close the app and come back later - your progress will be waiting for you.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              ⚡ Works Offline
            </h3>
            <p className="text-gray-600">
              Because everything is stored on your device, you can use the app even 
              without an internet connection. Perfect for deep reflection anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-900 mb-2">
            ⚠️ Important Note
          </h3>
          <p className="text-gray-600">
            If you clear your browser data or uninstall the app, your stored 
            information will be deleted. Consider taking screenshots or noting down 
            important results if you want to keep them long-term.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            💡 Pro Tip
          </h3>
          <p className="text-gray-600">
            For the best experience, install this as an app on your device 
            (look for the "Install" button in your browser). This makes it easier 
            to access and use, just like any other app on your device!
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
