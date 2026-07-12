'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Search, Phone, Mail } from 'lucide-react';
import PageBanner from '@/components/shop/PageBanner';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // LCL & FCL Services
  {
    category: 'LCL & FCL Services',
    question: 'What is the difference between LCL and FCL?',
    answer: 'LCL (Less than Container Load) is a service where you share container space with other shippers if you don\'t have enough goods to fill a full container. FCL (Full Container Load) means you book an entire container for your goods exclusively. LCL is cost-effective for smaller shipments, while FCL is better for large volumes.',
  },
  {
    category: 'LCL & FCL Services',
    question: 'How often do you have LCL shipments departing?',
    answer: 'We have fixed weekly sailing schedules for our Master Consolidation (LCL) services to all major global ports, ensuring your supply chain remains predictable and reliable.',
  },
  {
    category: 'LCL & FCL Services',
    question: 'Can you handle dangerous goods (DG) in LCL?',
    answer: 'Yes, we can handle certain classes of dangerous goods in our consolidated containers. However, this is subject to carrier approval, destination regulations, and strict packing requirements. Please contact our team with your MSDS for precise confirmation.',
  },
  // Custom Brokerage
  {
    category: 'Custom Brokerage',
    question: 'Do you handle customs clearance for both export and import?',
    answer: 'Absolutely. We provide end-to-end customs brokerage services for both origin (export) and destination (import) to ensure smooth transit of your goods without unexpected delays.',
  },
  {
    category: 'Custom Brokerage',
    question: 'What documents are required for customs clearance?',
    answer: 'Typically, you will need a Commercial Invoice, Packing List, Bill of Lading (or Airway Bill), and a Certificate of Origin. Depending on the commodity, additional licenses or permits may be required. Our team will guide you exactly on what is needed for your specific shipment.',
  },
  // Pricing & Quotes
  {
    category: 'Pricing & Quotes',
    question: 'How is freight cost calculated?',
    answer: 'Ocean freight (LCL) is usually calculated by volume (Cubic Meter - CBM) or weight (Metric Ton - MT), whichever is greater. Air freight is calculated based on chargeable weight (the greater of actual weight or volumetric weight). FCL is charged per container.',
  },
  {
    category: 'Pricing & Quotes',
    question: 'Are there any hidden fees in your quote?',
    answer: 'No. At Superman Transport, we pride ourselves on transparency. Our quotes clearly break down ocean/air freight, origin charges, destination charges, and any applicable surcharges (like BAF, CAF) so you know exactly what you are paying for.',
  },
  // Warehousing & Trucking
  {
    category: 'Warehousing & Trucking',
    question: 'Do you provide inland trucking to my factory?',
    answer: 'Yes, our inland trucking network covers all provinces and industrial zones. We can pick up your goods directly from your factory/warehouse and deliver them to the port, or vice versa.',
  },
  {
    category: 'Warehousing & Trucking',
    question: 'Can I store my goods in your warehouse before shipping?',
    answer: 'Yes, we offer flexible warehousing solutions including short-term and long-term storage, palletizing, labeling, and professional container stuffing at our CFS (Container Freight Station) facilities.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchSearch = search === '' || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-stone-50 min-h-screen">
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our shipping services, customs clearance, and logistics operations."
        breadcrumb="Home"
        tags={[
          { label: 'Shipping', emoji: '🚢' },
          { label: 'Customs', emoji: '🛡️' },
          { label: 'Warehousing', emoji: '🏢' },
        ]}
      />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-stone-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3f39]/30 shadow-sm"
              placeholder="Search for questions..."
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-[#e62c26] text-white shadow-md'
                    : 'bg-white text-stone-500 border border-stone-200 hover:border-[#ff9b96] hover:text-[#e62c26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No matching questions found</p>
                <p className="text-sm mt-2">Try different keywords or contact us directly.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-start gap-4 flex-1 pr-4">
                      <span className="text-[#e62c26] font-black text-xl leading-none mt-0.5">Q.</span>
                      <span className="font-bold text-stone-900 text-base leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-stone-400 flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180 text-[#e62c26]' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="pl-9 border-l-2 border-[#ffe4e2] ml-2">
                        <p className="text-stone-600 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* CTA liên hệ */}
          <div className="mt-16 bg-white rounded-2xl border border-stone-200 p-10 text-center shadow-lg">
            <h3 className="text-2xl font-black text-stone-900 mb-3">Still have questions?</h3>
            <p className="text-stone-500 mb-8 text-base">
              Our support team is ready to assist you with any logistics inquiries.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center px-8 py-4 bg-[#e62c26] text-white font-bold uppercase tracking-wider rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
              <a
                href="tel:(+84)2836207585"
                className="inline-flex items-center px-8 py-4 border-2 border-stone-200 text-stone-700 font-bold uppercase tracking-wider rounded-xl hover:bg-stone-50 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                (+84) 28 3620 7585
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
