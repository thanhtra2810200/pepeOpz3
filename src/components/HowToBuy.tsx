import { useState, useRef, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import Stepper, { Step, type StepperRef } from '@/components/Stepper';
import { BlockchainPacketField } from '@/components/BlockchainPacketField';
import { STEPS } from '@/components/howToBuy/steps';
import { StepContent } from '@/components/howToBuy/StepContent';

export function HowToBuy() {
  const { ref, visible } = useReveal();
  const stepperRef = useRef<StepperRef>(null);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section
      id="how-to-buy"
      ref={ref}
      className={`section-full relative py-12 px-6 overflow-hidden mesh-bg noise section-reveal ${visible ? 'is-visible' : ''}`}
    >
      <div className="absolute -top-10 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-green-500/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-green-600/8 rounded-full blur-[70px] sm:blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <div className={`text-center mb-12 sm:mb-20 reveal ${visible ? 'is-visible' : ''}`}>
          <span
            className="text-green-400 text-sm font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            How to Buy
          </span>
          <h2
            className="leading-none mt-4"
            style={{
              fontFamily: '"Luckiest Guy", cursive',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '0.01em',
              color: '#fafff4',
              textShadow:
                '0 2px 0 #166534,' +
                '0 4px 0 #14532d,' +
                '0 6px 8px rgba(0,0,0,0.6),' +
                '0 0 40px rgba(86,242,123,0.45)',
            }}
          >
            FOUR STEPS TO <span style={{ color: '#4ade80', textShadow: '0 0 30px rgba(74,222,128,0.6)' }}>GAINS</span>
          </h2>
          <p
            className="max-w-xl mx-auto mt-6 text-sm sm:text-lg px-2 sm:px-0"
            style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#9ca3af' }}
          >
            Buying $PEPE is easier than explaining crypto to your grandma. Follow along.
          </p>
        </div>

        {/* Card + particles wrapper */}
        <div className={`max-w-2xl mx-auto px-2 sm:px-0 reveal ${visible ? 'is-visible' : ''}`}>
          <div className="relative">
            {/* Blockchain packets float around/behind the card */}
            <BlockchainPacketField
              className="pointer-events-none absolute -inset-x-16 sm:-inset-x-32 -inset-y-16 sm:-inset-y-24"
              style={{ zIndex: 2 } as CSSProperties}
            />

            {/* Card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                border: '1px solid rgba(74,222,128,0.18)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                zIndex: 10,
              }}
            >
              {/* Layer 0 — animated step background image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentStep}
                  src={STEPS[currentStep - 1].background}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  style={{ zIndex: 0 }}
                />
              </AnimatePresence>

              {/* Layer 1 — dark overlay ~70% */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.72)', zIndex: 1 }}
              />

              {/* Layer 2 — green gradient tint ~20% */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(145deg, rgba(74,222,128,0.12) 0%, rgba(22,163,74,0.06) 50%, rgba(0,0,0,0.1) 100%)',
                  zIndex: 2,
                }}
              />

              {/* Layer 3 — glass reflection sweep */}
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(74,222,128,0.04) 100%)',
                  zIndex: 3,
                }}
              />

              {/* Layer 4 — content */}
              <div className="relative" style={{ zIndex: 4 }}>
                <Stepper
                  ref={stepperRef}
                  initialStep={1}
                  onStepChange={setCurrentStep}
                  stepCircleContainerClassName="!shadow-none !border-0 !bg-transparent"
                  stepContainerClassName="!p-8"
                  contentClassName="!px-8"
                  footerClassName="!px-8"
                  backButtonText={
                    <span className="flex items-center gap-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </span>
                  }
                  nextButtonText={
                    <span className="flex items-center gap-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      Next <ArrowRight className="w-4 h-4" />
                    </span>
                  }
                  backButtonProps={{
                    className:
                      'px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-gray-300 hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400 transition-all duration-300',
                  }}
                  nextButtonProps={{
                    className:
                      'px-6 py-2.5 rounded-full font-bold text-black bg-gradient-to-b from-green-300 to-green-500 hover:from-green-200 hover:to-green-400 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105',
                  }}
                >
                  {STEPS.map((step, i) => (
                    <Step key={step.title}>
                      <StepContent
                        index={i}
                        total={STEPS.length}
                        icon={step.icon}
                        title={step.title}
                        body={step.body}
                      />
                    </Step>
                  ))}
                </Stepper>
              </div>
            </div>
          </div>
        </div>

        {/* Step dots — mobile-friendly progress */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-8">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => stepperRef.current?.goToStep(i + 1)}
              aria-label={`Go to step ${i + 1}`}
              aria-pressed={i + 1 === currentStep}
              className={`rounded-full transition-all duration-300 ${
                i + 1 === currentStep ? 'w-6 h-2.5 bg-green-400' : 'w-2.5 h-2.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
