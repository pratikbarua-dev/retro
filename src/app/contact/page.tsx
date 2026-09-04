import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col font-sans bg-blueprint">
      <Navbar />

      <main className="flex-grow">
        <section className="py-16 border-b border-slate-200 bg-white/80 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <Badge variant="blue" className="mb-3 font-mono text-xs">
              :: LOCATION & HELP DESK ::
            </Badge>
            <h1 className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              GET IN TOUCH
            </h1>
            <p className="text-slate-600 mt-3 text-base font-mono">
              Have questions about bench availability, custom product development, or robotics mentoring? Reach out to our lab team.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 font-mono">Lab Headquarters</h2>
              
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 font-mono">Address</div>
                    <div className="text-slate-600 text-xs mt-0.5">Changaw, Near Civil Department, Daffodil International University</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Phone className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 font-mono">Phone Support</div>
                    <div className="font-mono text-xs text-slate-600 mt-0.5">+880 1865-326474</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Mail className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 font-mono">Email Enquiries</div>
                    <div className="font-mono text-xs text-slate-600 mt-0.5">mail.retrolab@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <Clock className="w-5 h-5 text-[#0066FF] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 font-mono">Lab Operating Hours</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">Sun – Thu: 10:00 AM – 08:00 PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-blue-500/5 tech-corner-box">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-mono">Send a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Your Name</label>
                  <input type="text" placeholder="Pratik Barua" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Email Address</label>
                  <input type="email" placeholder="pratik@diu.edu.bd" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Subject</label>
                  <input type="text" placeholder="Robotics Club Booking Inquiry" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">Message</label>
                  <textarea rows={4} placeholder="Describe your project requirements or equipment questions..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]" />
                </div>
                <Button variant="primary" size="md" className="w-full justify-center font-mono font-bold">
                  Send Message →
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
