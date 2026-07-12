import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react';
import PageBanner from '@/components/shop/PageBanner';

const servicesData: Record<string, { title: string, subtitle: string, content: string, benefits: string[], image: string }> = {
  'master-consolidation': {
    title: 'Master Consolidation',
    subtitle: 'Optimize your shipping costs by combining multiple LCL shipments into a single full container.',
    content: 'Our Master Consolidation service allows businesses to consolidate goods from various suppliers into one optimized shipment. By pooling cargo together, you significantly reduce shipping costs while ensuring safe, timely delivery without waiting to fill an entire container on your own. We handle all coordination between your suppliers to guarantee a seamless process from origin to destination.',
    benefits: [
      'Significant cost reduction compared to individual LCL shipments',
      'Lower risk of damage and loss with dedicated consolidated containers',
      'Simplified customs clearance with single documentation',
      'Fixed weekly sailing schedules for better planning',
      'End-to-end tracking and dedicated support team'
    ],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7a?q=80&w=2070&auto=format&fit=crop'
  },
  'air-freight': {
    title: 'Air Freight',
    subtitle: 'Fast, reliable, and secure air cargo solutions for your time-sensitive shipments globally.',
    content: 'When time is of the essence, Superman Transport\'s Air Freight service delivers. We have established strong partnerships with major airlines to secure space allocations and competitive rates. Whether you need express delivery, standard air freight, or charter services, our team ensures your cargo reaches its destination with maximum speed and security.',
    benefits: [
      'Express and standard delivery options',
      'Door-to-door, airport-to-airport services',
      'Specialized handling for fragile and high-value goods',
      'Global network covering all major international airports',
      'Real-time flight tracking and proactive updates'
    ],
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop'
  },
  'sea-freight': {
    title: 'Sea Freight',
    subtitle: 'Cost-effective and sustainable shipping solutions for large volumes via global sea routes.',
    content: 'As a core component of our logistics solutions, our Sea Freight service handles both FCL (Full Container Load) and LCL (Less than Container Load) shipments. We leverage our extensive network of premium carriers to offer flexible sailing schedules, competitive pricing, and reliable transit times across all major global trade lanes.',
    benefits: [
      'Flexible FCL and LCL shipping options',
      'Competitive rates through volume contracts with premium carriers',
      'Handling of standard, reefer, and out-of-gauge containers',
      'Complete documentation and customs support',
      'Port-to-port and door-to-door delivery'
    ],
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop'
  },
  'inland-trucking': {
    title: 'Inland Trucking',
    subtitle: 'Flexible and secure road freight services for first-mile pickup and final-mile delivery.',
    content: 'Our Inland Trucking service connects ports, airports, and warehouses directly to your door. With a diverse fleet of modern vehicles, we handle everything from standard cargo to specialized transport needs. We ensure that the critical first and last legs of your supply chain are executed with precision and reliability.',
    benefits: [
      'Full Truckload (FTL) and Less than Truckload (LTL) services',
      'GPS-tracked modern fleet for real-time visibility',
      'Specialized equipment for heavy and oversized cargo',
      'Cross-border trucking services',
      'Seamless integration with air and sea freight'
    ],
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop'
  },
  'warehousing': {
    title: 'Warehousing & Distribution',
    subtitle: 'Secure storage, inventory management, and professional container stuffing at origin hubs.',
    content: 'Superman Transport offers state-of-the-art warehousing facilities strategically located near major ports and transport hubs. Our comprehensive warehousing solutions go beyond basic storage, providing value-added services such as packing, labeling, inventory management, and distribution to streamline your supply chain operations.',
    benefits: [
      'Secure, climate-controlled, and standard storage options',
      'Advanced Warehouse Management System (WMS)',
      'Pick, pack, labeling, and palletizing services',
      'Professional container stuffing and un-stuffing',
      'Cross-docking and order fulfillment'
    ],
    image: 'https://images.unsplash.com/photo-1586528116493-a02826a765f7?q=80&w=2070&auto=format&fit=crop'
  },
  'custom-brokerage': {
    title: 'Custom Brokerage',
    subtitle: 'Hassle-free customs clearance handled by licensed professionals to prevent delays.',
    content: 'Navigating the complex world of customs regulations can be challenging. Our team of licensed customs brokers possesses deep expertise in local and international trade laws. We ensure compliance, minimize risks, and expedite the clearance process for your imports and exports, avoiding costly delays and penalties.',
    benefits: [
      'Expert guidance on tariff classifications and valuations',
      'Electronic customs filing for rapid processing',
      'Duty and tax calculation and optimization',
      'Handling of special permits, licenses, and certificates',
      'Proactive resolution of customs queries and inspections'
    ],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
  }
};

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const service = servicesData[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <PageBanner
        title={service.title}
        subtitle={service.subtitle}
        breadcrumb="Services"
        tags={[{ label: 'Global Logistics' }, { label: 'Expert Service' }]}
      />

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[400px] object-cover rounded-3xl shadow-xl mb-12"
              />
              
              <h2 className="text-3xl font-black text-stone-900 mb-6">Overview</h2>
              <p className="text-stone-600 leading-relaxed text-lg mb-10">
                {service.content}
              </p>

              <h3 className="text-2xl font-bold text-stone-900 mb-6">Key Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-[#e62c26] flex-shrink-0" />
                    <span className="text-stone-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <div className="bg-[#e62c26] text-white rounded-3xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-wider">Ready to ship?</h3>
                  <p className="text-[#ffe4e2] mb-8 leading-relaxed">
                    Contact our experts today to get a customized quote for your {service.title.toLowerCase()} needs.
                  </p>
                  
                  <Link
                    href="/contact-us"
                    className="flex items-center justify-center w-full py-4 bg-white text-[#e62c26] font-bold rounded-xl uppercase tracking-wider hover:bg-stone-100 transition-colors mb-4"
                  >
                    Request a Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>

                  <div className="pt-6 border-t border-[#ff3f39]/30 space-y-4">
                    <a href="tel:(+84)2836207585" className="flex items-center gap-3 hover:text-[#ffc9c6] transition-colors">
                      <div className="bg-[#ff3f39] p-2 rounded-lg">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="font-medium">(+84) 28 3620 7585</span>
                    </a>
                    <a href="mailto:info@spmt.com.vn" className="flex items-center gap-3 hover:text-[#ffc9c6] transition-colors">
                      <div className="bg-[#ff3f39] p-2 rounded-lg">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="font-medium">info@spmt.com.vn</span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 bg-white border border-stone-200 rounded-3xl p-8">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-4">Other Services</h4>
                  <div className="space-y-3">
                    {Object.keys(servicesData).filter(key => key !== resolvedParams.slug).map(key => (
                      <Link 
                        key={key} 
                        href={`/services/${key}`}
                        className="block text-stone-500 font-medium hover:text-[#e62c26] hover:pl-2 transition-all"
                      >
                        {servicesData[key].title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
