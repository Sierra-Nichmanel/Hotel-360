import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <MaterialIcon icon="dashboard" className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary uppercase">HOTEL<span className="text-slate-800 dark:text-white">360</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Resources</Link>
              <div className="h-6 w-px bg-primary/20"></div>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth">Login</Link>
              <Link className="bg-primary text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20" href="/auth">Start Free Trial</Link>
            </div>
            <div className="md:hidden">
              <MaterialIcon icon="menu" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <header className="relative h-[850px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Luxury Hotel Lobby" 
              className="w-full h-full object-cover" 
              src="/hero-hotel.png"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <ScrollReveal className="max-w-3xl glass p-8 md:p-16 rounded-xl shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Premium Hospitality Solution</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                The Complete <span className="text-primary">Multi-Branch</span> Hotel Management Platform
              </h1>
              <p className="text-lg text-slate-700 leading-relaxed mb-10 max-w-xl">
                Manage every property, booking, and guest experience from a single, unified dashboard designed for the modern hotelier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth" className="bg-primary text-white px-8 py-4 rounded font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                  Request a Demo <MaterialIcon icon="arrow_forward" />
                </Link>
                <Link href="#" className="bg-white/50 backdrop-blur border border-slate-200 text-slate-900 px-8 py-4 rounded font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2">
                  View Case Studies
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-background-dark" id="features">
          <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <h2 className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4">Core Capabilities</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white uppercase">Engineered for Excellence</h3>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Our suite of tools provides everything you need to scale your hospitality business without the operational friction.
            </p>
          </ScrollReveal>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1} className="p-8 rounded-xl border border-primary/5 bg-background-light dark:bg-slate-800/50 hover:border-primary/30 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <MaterialIcon icon="business_center" />
              </div>
              <h4 className="text-xl font-bold mb-3 uppercase">Multi-Branch Control</h4>
              <p className="text-slate-500 dark:text-slate-400">Centralized management for global hotel chains. View real-time status of all properties from a single login.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="p-8 rounded-xl border border-primary/5 bg-background-light dark:bg-slate-800/50 hover:border-primary/30 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <MaterialIcon icon="trending_up" />
              </div>
              <h4 className="text-xl font-bold mb-3 uppercase">Dynamic Pricing</h4>
              <p className="text-slate-500 dark:text-slate-400">AI-driven revenue management that adjusts rates based on demand, local events, and competitor data.</p>
            </ScrollReveal>
            <ScrollReveal delay={0.3} className="p-8 rounded-xl border border-primary/5 bg-background-light dark:bg-slate-800/50 hover:border-primary/30 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <MaterialIcon icon="event_available" />
              </div>
              <h4 className="text-xl font-bold mb-3 uppercase">Smart Booking</h4>
              <p className="text-slate-500 dark:text-slate-400">Seamless direct booking engine with instant sync across OTAs to eliminate double bookings forever.</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-background-light dark:bg-slate-900/50" id="pricing">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-8 uppercase">Simple, Scalable Pricing</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm font-medium">Monthly</span>
                <button className="relative w-14 h-7 bg-primary rounded-full p-1 focus:outline-none">
                  <div className="bg-white w-5 h-5 rounded-full shadow-sm translate-x-7"></div>
                </button>
                <span className="text-sm font-medium">Annual <span className="text-gold font-bold ml-1">(Save 20%)</span></span>
              </div>
            </ScrollReveal>
            <div className="grid lg:grid-cols-4 gap-6">
              <ScrollReveal delay={0.1} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/10 shadow-sm flex flex-col">
                <h4 className="text-xl font-bold mb-2 uppercase">Starter</h4>
                <p className="text-slate-500 text-sm mb-6">Core features for boutique stays.</p>
                <div className="mb-8 font-bold">
                  <span className="text-4xl font-extrabold uppercase">₦30,000</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Up to 1 Property
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Basic Booking Engine
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Email Support
                  </li>
                </ul>
                <Link href="/auth" className="w-full py-3 rounded border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-center">Get Trial</Link>
              </ScrollReveal>
              <ScrollReveal delay={0.2} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/10 shadow-sm flex flex-col">
                <h4 className="text-xl font-bold mb-2 uppercase">Growth</h4>
                <p className="text-slate-500 text-sm mb-6">Advanced reporting for scaling.</p>
                <div className="mb-8 font-bold">
                  <span className="text-4xl font-extrabold uppercase">₦85,000</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Up to 5 Properties
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Advanced Analytics
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Priority Support
                  </li>
                </ul>
                <Link href="/auth" className="w-full py-3 rounded border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-center">Choose Growth</Link>
              </ScrollReveal>
              <ScrollReveal delay={0.3} className="bg-white dark:bg-background-dark p-8 rounded-xl border-2 border-primary shadow-2xl relative flex flex-col scale-105 z-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
                <h4 className="text-xl font-bold mb-2 uppercase">Scale</h4>
                <p className="text-slate-500 text-sm mb-6">Multi-property optimization.</p>
                <div className="mb-8 font-bold">
                  <span className="text-4xl font-extrabold uppercase">₦220,000</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Up to 20 Properties
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> AI Dynamic Pricing
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Custom Integrations
                  </li>
                </ul>
                <Link href="/auth" className="w-full py-3 rounded bg-primary text-white font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 text-center">Choose Scale</Link>
              </ScrollReveal>
              <ScrollReveal delay={0.4} className="bg-white dark:bg-background-dark p-8 rounded-xl border border-primary/10 shadow-sm flex flex-col">
                <h4 className="text-xl font-bold mb-2 uppercase">Enterprise</h4>
                <p className="text-slate-500 text-sm mb-6">Global hospitality groups.</p>
                <div className="mb-8 font-bold">
                  <span className="text-4xl font-extrabold uppercase">Custom</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Unlimited Properties
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> Dedicated Manager
                  </li>
                  <li className="flex items-center gap-2 text-sm italic">
                    <MaterialIcon icon="check_circle" className="text-primary text-sm" /> White-label Option
                  </li>
                </ul>
                <Link href="mailto:sales@hotel360.com" className="w-full py-3 rounded border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all text-center">Contact Sales</Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <MaterialIcon icon="dashboard" className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white uppercase">HOTEL<span className="text-primary">360</span></span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Empowering hoteliers worldwide with cutting-edge technology to deliver unforgettable guest experiences.
              </p>
              <div className="flex gap-4">
                <Link className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <MaterialIcon icon="facebook" className="text-xs" />
                </Link>
                <Link className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <MaterialIcon icon="public" className="text-xs" />
                </Link>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 uppercase">Product</h5>
              <ul className="space-y-4 text-sm italic">
                <li><Link className="hover:text-primary transition-colors" href="#pricing">Pricing</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Integrations</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Mobile App</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 uppercase">Company</h5>
              <ul className="space-y-4 text-sm italic">
                <li><Link className="hover:text-primary transition-colors" href="#">About Us</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Careers</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Partners</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6 uppercase">Support</h5>
              <ul className="space-y-4 text-sm italic">
                <li><Link className="hover:text-primary transition-colors" href="#">Documentation</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Help Center</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">API Status</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 italic">
            <p>© 2026 Hotel 360 SaaS. By Africentric Technology Hub. All rights reserved.</p>
            <div className="flex gap-8">
              <Link className="hover:text-white" href="#">Privacy Policy</Link>
              <Link className="hover:text-white" href="#">Terms of Service</Link>
              <Link className="hover:text-white" href="#">Cookie Policy</Link>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
