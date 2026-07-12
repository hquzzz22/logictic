import { Link } from '@/i18n/routing';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ShopFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-black tracking-tighter text-white uppercase mb-6">
              Superman<span className="text-[#e62c26]">.</span>
            </div>
            <p className="text-stone-400 mb-6 leading-relaxed text-sm">
              Superman has experience in handling the formalities and documentation required for your imports and exports. We work with all international station to guarantee that your load will safely reach without any delays.
            </p>
            <div className="flex space-x-3">
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-[#e62c26] hover:text-white transition-colors text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-[#e62c26] hover:text-white transition-colors text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services/master-consolidation" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Master Consolidation</Link></li>
              <li><Link href="/services/air-freight" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Air Freight</Link></li>
              <li><Link href="/services/sea-freight" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Sea Freight</Link></li>
              <li><Link href="/services/inland-trucking" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Inland Trucking</Link></li>
              <li><Link href="/services/warehousing" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Warehousing</Link></li>
              <li><Link href="/services/custom-brokerage" className="text-stone-400 hover:text-[#ff3f39] transition-colors">Custom Brokerage</Link></li>
            </ul>
          </div>

          {/* Ho Chi Minh Office */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Ho Chi Minh Office</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 text-[#e62c26] shrink-0 mt-0.5" />
                <span className="text-stone-400 group-hover:text-white transition-colors">Ho Chi Minh, Vietnam</span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-[#e62c26] shrink-0" />
                <a href="tel:(+84)2836207585" className="text-stone-400 group-hover:text-white transition-colors">(+84) 28 3620 7585 / 587</a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 text-[#e62c26] shrink-0" />
                <a href="mailto:info@spmt.com.vn" className="text-stone-400 group-hover:text-white transition-colors">info@spmt.com.vn</a>
              </li>
            </ul>
          </div>

          {/* Hai Phong Office */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider text-sm">Hai Phong Office</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 mr-3 text-[#e62c26] shrink-0 mt-0.5" />
                <span className="text-stone-400 group-hover:text-white transition-colors">Hai Phong, Vietnam</span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-[#e62c26] shrink-0" />
                <a href="tel:(+84)919863179" className="text-stone-400 group-hover:text-white transition-colors">(+84) 919 86 31 79</a>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 text-[#e62c26] shrink-0" />
                <a href="mailto:info@spmt.com.vn" className="text-stone-400 group-hover:text-white transition-colors">info@spmt.com.vn</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Superman Transport. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-stone-500 uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-[#ff3f39] transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-[#ff3f39] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
