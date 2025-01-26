// src/app/about/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { clearGameState } from '@/lib/utils/storage';
import { useMobile } from '@/lib/contexts/MobileContext';
import { getResponsiveTextStyles, getContainerClassName } from '@/lib/utils/styles/textStyles';

const appVersion = process.env.NEXT_PUBLIC_VERSION || '0.0.0';

export default function About() {
  const { isMobile } = useMobile();
  const styles = getResponsiveTextStyles(isMobile);

  useEffect(() => {
    document.title = 'Core Values - About';
  }, []);

  useEffect(() => {
    clearGameState();
  }, []);

  return (
    <div aria-labelledby="about-heading" className={`max-w-4xl ${getContainerClassName(isMobile)}`}>
      <div className="text-center">
        <h1 id="about-heading" className={`${styles.heading} mb-4 whitespace-nowrap font-extrabold sm:mb-6`}>
          About Core <span className="text-blue-700">Values</span>
        </h1>
        <div className={`mx-auto max-w-2xl ${styles.spacing}`} aria-label="Version">
          <p className={`${styles.largeParagraph} font-medium text-black`}>Version {appVersion}</p>
        </div>
      </div>
      <section aria-labelledby="inspiration-heading" className="pt-2">
        <h2 id="inspiration-heading" className={`${styles.subheading} pb-2 font-bold text-black`}>
          What was the inspiration behind Core Values?
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-green-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`mb-2 ${styles.paragraph}`}>
            I'm lucky to have an awesome coach to chat things through with. In one of our first sessions, she had a set
            of physical cards that she lent me to help me identify my core values. I found the exercise to be very
            helpful but understood from my coach that I should periodically revisit my choices because the only constant
            in life is change.
          </p>
          <p className={`mb-2 ${styles.paragraph}`}>
            The challenge was that she wanted them back so it would be fair to say the inspiration for Core Values was
            born out of wanting to have my own set of cards to use whenever I needed them.
          </p>
          <p className={`mb-2 ${styles.paragraph}`}>
            I then decided to send it out into the world in the hope that you will find it helpful as well.
          </p>
        </div>
      </section>

      <section aria-labelledby="why-matters-heading" className="pt-2">
        <h2 id="why-matters-heading" className={`${styles.subheading} pb-2 font-bold text-black`}>
          Why core values matter
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-green-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`mb-2 ${styles.paragraph}`}>
            <b>For you</b> : Whether you are at a crossroads in life, planning your future, or simply want to better understand
            yourself, identifying your core values provides a compass for decision-making and personal growth.
          </p>
          <p className={`mb-2 ${styles.paragraph}`}>
            <b>For your team</b> : You can also use Core Values to help your team or group identify shared values and align on
            a common purpose.
          </p>
        </div>
      </section>
      <section aria-labelledby="you-heading" className="pt-2">
        <h2 id="you-heading" className={`${styles.subheading} pb-2 font-bold text-black`}>
          What others are saying
        </h2>
        <div className={`rounded-lg border border-gray-100 bg-purple-100 p-4 shadow-sm ${styles.prose} text-black`}>
          <p className={`mb-2 ${styles.paragraph}`}>I hope you find Core Values as helpful as I do.</p>

          <p className={`mb-2 ${styles.paragraph}`}>
            There are a number of awesome folks on the internet also talking about the importance of understanding your
            core values. As we all learn differently, here is an article, a podcast and a video to get you started.
            <ul className={`list-none pl-6 text-black ${styles.paragraph}`}>
              <li>
                <span role="img" aria-label="article">
                  📖
                </span>
                <a
                  rel="noopener"
                  title="Let Your Values Drive Your Choices"
                  href="https://jamesclear.com/values-choices"
                  target="_blank"
                >
                  James Clear : Let Your Values Drive Your Choices (Atomic Habits)
                </a>
              </li>
              <li>
                <span role="img" aria-label="podcast">
                  🎧
                </span>
                <a
                  rel="noopener"
                  title="Living Into Our Values"
                  href="https://brenebrown.com/podcast/living-into-our-values/"
                  target="_blank"
                >
                  Brené Brown and Barrett Guillen : Living Into Our Values (Unlocking Us podcast)
                </a>
              </li>
              <li>
                <span role="img" aria-label="video">
                  🎥
                </span>
                <a
                  rel="noopener"
                  title="Core Values - Your Inner Compass"
                  href="https://www.youtube.com/watch?v=mL4l75rMIiQ"
                  target="_blank"
                >
                  Larisa Halilović : Core Values - Your Inner Compass (TEDxFerhadija)
                </a>
              </li>
            </ul>
          </p>
        </div>
      </section>
    </div>
  );
}
