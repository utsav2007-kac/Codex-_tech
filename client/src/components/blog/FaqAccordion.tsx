import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  id?: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  // First item open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faqs-heading" className="my-12">
      <h2 id="faqs-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          const answerId = `faq-answer-${idx}`;
          const buttonId = `faq-button-${idx}`;

          return (
            <div
              key={faq.id || idx}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
            >
              <h3>
                <button
                  id={buttonId}
                  data-faq-id={`faq-q-${idx}`}
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full py-4 px-5 text-left font-bold text-slate-900 hover:text-orange-600 transition-colors flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <span className="text-base sm:text-lg">
                    <span className="text-orange-500 mr-2 font-mono">{idx + 1}.</span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
              </h3>

              {/* Answer is present in HTML for search engines and crawlers */}
              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                className={`${isOpen ? 'block' : 'hidden'} px-5 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 bg-slate-50/50`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqAccordion;
