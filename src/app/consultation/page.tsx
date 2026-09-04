import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Cpu,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  BookOpen,
  MessageSquare,
  Wrench,
} from 'lucide-react';
import {
  SchematicMarginDecorations,
  FullPageSchematicOverlay,
} from '@/components/ui/ElectronicsDecorations';

export default function ConsultationPage() {
  const consultationServices = [
    {
      id: 'cons_1',
      title: 'Circuit & Schematic Review',
      description: 'Get expert feedback on your hardware pinouts, power distribution, voltage regulators, and PCB layout.',
      icon: Cpu,
      badge: 'SCHEMATIC REVIEW',
    },
    {
      id: 'cons_2',
      title: 'Robotics & Firmware Debugging',
      description: 'Stuck on motor drivers, STM32, Arduino, ESP32, or ROS 2 integration? Get 1-on-1 code and hardware debugging assistance.',
      icon: Wrench,
      badge: 'FIRMWARE DEBUG',
    },
    {
      id: 'cons_3',
      title: 'Component & Sensor Selection',
      description: 'Learn how to select the right sensors, microcontrollers, communication modules, and power supplies for your project.',
      icon: Sparkles,
      badge: 'HARDWARE SELECTION',
    },
    {
      id: 'cons_4',
      title: 'Project Feasibility & Roadmap',
      description: 'Planning a competition or final-year thesis project? Get structural advice on budget, components, and milestone execution.',
      icon: BookOpen,
      badge: 'FEASIBILITY REVIEW',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col font-sans selection:bg-[#0066FF] selection:text-white bg-blueprint">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-blueprint py-16 md:py-20 border-b border-slate-200 relative overflow-hidden bg-white/80 backdrop-blur-xs">
          <SchematicMarginDecorations />
          <FullPageSchematicOverlay opacity={0.15} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl relative z-10 space-y-4">
            <Badge variant="blue" className="py-1 px-3 text-xs font-mono">
              :: ENGINEERING MENTORSHIP & PROJECT GUIDANCE ::
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight leading-tight">
              BOOK A MENTOR CONSULTATION
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
              Have questions about your electronics or robotics project? Book a 1-on-1 session with our senior engineers and experienced makers for practical troubleshooting and architectural guidance.
            </p>

            <div className="pt-2 flex justify-center">
              <Link href="/book?package=pack_consultation">
                <Button variant="primary" size="lg" className="shadow-lg shadow-blue-500/20 group font-mono font-bold">
                  Reserve Consultation Slot
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CONSULTATION SERVICES GRID */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="blue" className="mb-2 font-mono text-xs">
              :: HOW WE HELP YOU ::
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 font-mono">
              EXPERT HARDWARE MENTORSHIP
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select any area of project guidance when scheduling your consultation time range.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {consultationServices.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-200 hover:border-[#0066FF] p-6 bg-white shadow-xl shadow-blue-500/5 transition-all flex flex-col justify-between tech-corner-box"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <Badge variant="blue" className="font-mono text-[10px]">
                        {service.badge}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-mono mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-600 flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Available All Week
                    </span>
                    <Link href="/book?package=pack_consultation" className="text-[#0066FF] font-bold hover:underline">
                      Book Now →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA CARD */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-[#0066FF] text-white text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden tech-corner-box">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-2">
              Ready to Accelerate Your Prototype?
            </h2>
            <p className="text-sm text-blue-100 max-w-xl mx-auto mb-6">
              Select your date and time range to confirm your 1-on-1 mentor consultation slot.
            </p>
            <Link href="/book?package=pack_consultation">
              <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-blue-50 border-0 font-mono font-bold">
                Book Consultation Now →
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
