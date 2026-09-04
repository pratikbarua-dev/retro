import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PCBTracePattern } from '@/components/ui/PCBDecoration';
import { FullPageSchematicOverlay } from '@/components/ui/ElectronicsDecorations';
import { Cpu, Users, Wrench, ArrowRight, Shield, Lightbulb, Code2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col font-sans selection:bg-[#0066FF] selection:text-white bg-blueprint relative overflow-hidden">
      {/* SCHEMATIC OVERLAY */}
      <PCBTracePattern className="text-blue-500 opacity-20" />
      <FullPageSchematicOverlay opacity={0.1} />

      <Navbar />

      <main className="flex-grow relative z-10">
        {/* HERO HEADER */}
        <section className="py-16 sm:py-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <Badge variant="blue" className="font-mono text-xs">
              :: ABOUT RETRO LAB ::
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight leading-tight">
              FROM IDEA <span className="text-[#0066FF]">&gt;&gt;</span> TO PROTOTYPE
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-mono max-w-2xl mx-auto leading-relaxed">
              A modern, hands-on workspace for electronics, robotics, research, and custom product development.
            </p>
          </div>
        </section>

        {/* CORE PILLARS SECTION */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* MAIN INTRO CARD */}
          <div className="bg-white border border-blue-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-blue-500/5 tech-corner-box space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold font-mono text-slate-900">Modern Prototyping Workspace</h2>
                <p className="text-xs font-mono text-blue-500">:: HARDWARE & ELECTRONICS INFRASTRUCTURE ::</p>
              </div>
            </div>
            <p className="text-slate-700 text-base leading-relaxed">
              Retro Lab is a modern, well-equipped workspace where you can work on robotics, electronics, and a wide range of technology-driven innovative projects. The lab is equipped with almost all the essential modern instruments and equipment required for research, prototyping, and hands-on learning, enabling you to turn your ideas into reality.
            </p>
          </div>

          {/* TWO COLUMN CARDS: MENTORSHIP & CUSTOM PRODUCT R&D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 1: EXPERIENCED MENTORSHIP */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-blue-500/5 space-y-4 tech-corner-box">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-mono text-slate-900">Expert Guidance & Mentorship</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In addition, our experienced and skilled mentors provide guidance and support at every stage of your project. As a result, you will have the opportunity to plan, develop, and complete your project through practical, hands-on experience.
              </p>
              <div className="pt-2">
                <Link href="/consultation">
                  <Button variant="secondary" size="sm" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Book Free Consultation →
                  </Button>
                </Link>
              </div>
            </div>

            {/* CARD 2: CUSTOM PRODUCT DEVELOPMENT */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-blue-500/5 space-y-4 tech-corner-box">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-mono text-slate-900">Customized Hardware & Software</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We also develop customized hardware and software-based products tailored to your specific needs. Whether you have an idea that needs to be transformed into a working prototype or require a complete technology solution, our team can support you throughout the design, development, testing, and implementation process.
              </p>
              <div className="pt-2">
                <Link href="/contact">
                  <Button variant="secondary" size="sm" className="gap-2 border-blue-200 text-[#0066FF] hover:bg-blue-50">
                    Inquire Custom R&D →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CALL TO ACTION BOTTOM BAR */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-[#0066FF] rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20 tech-corner-box">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl font-extrabold font-mono text-white">Ready to Prototype Your Ideas?</h3>
              <p className="text-xs text-blue-100 font-mono">Reserve an ESD-safe workbench session or consult our engineering team today.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/book">
                <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-blue-50 border-0 font-bold">
                  Reserve a Bench Slot
                </Button>
              </Link>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
