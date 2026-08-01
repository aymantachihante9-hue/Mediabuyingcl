import { getSiteContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SERVICES,
  DEFAULT_PRICING,
  DEFAULT_FAQ,
  DEFAULT_CASE_STUDIES,
  DEFAULT_TESTIMONIALS,
} from "@/lib/default-content";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Problem from "@/components/site/Problem";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Results from "@/components/site/Results";
import Testimonials from "@/components/site/Testimonials";
import Pricing from "@/components/site/Pricing";
import Faq from "@/components/site/Faq";
import LeadForm from "@/components/site/LeadForm";
import Footer from "@/components/site/Footer";

export const revalidate = 60; // ISR — content edits go live within a minute

async function safe<T>(fn: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const rows = await fn();
    return rows.length ? rows : fallback;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const sections = await getSiteContent();
  const byKey = Object.fromEntries(sections.map((s: any) => [s.key, s]));

  const [services, pricing, faqs, cases, testimonials] = await Promise.all([
    safe(() => prisma.serviceCard.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), DEFAULT_SERVICES as any[]),
    safe(() => prisma.pricingPackage.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), DEFAULT_PRICING as any[]),
    safe(() => prisma.faq.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), DEFAULT_FAQ as any[]),
    safe(() => prisma.caseStudy.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), DEFAULT_CASE_STUDIES as any[]),
    safe(() => prisma.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), DEFAULT_TESTIMONIALS as any[]),
  ]);

  // Section renderers — order & visibility fully controlled from admin
  const renderers: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" data={byKey.hero?.data} />,
    problem: <Problem key="problem" data={byKey.problem?.data} />,
    services: <Services key="services" data={byKey.services?.data} items={services} />,
    process: <Process key="process" data={byKey.process?.data} />,
    results: <Results key="results" data={byKey.results?.data} items={cases} />,
    testimonials: <Testimonials key="testimonials" data={byKey.testimonials?.data} items={testimonials} />,
    pricing: <Pricing key="pricing" data={byKey.pricing?.data} items={pricing} />,
    faq: <Faq key="faq" data={byKey.faq?.data} items={faqs} />,
    contact: <LeadForm key="contact" data={byKey.contact?.data} />,
  };

  const ordered = sections
    .filter((s: any) => s.visible && s.key !== "footer")
    .sort((a, b) => a.order - b.order)
    .map((s: any) => renderers[s.key])
    .filter(Boolean);

  return (
    <main className="bg-navy-950 text-slate-100 selection:bg-electric/30">
      <Navbar data={byKey.footer?.data} />
      {ordered}
      <Footer data={byKey.footer?.data} />
    </main>
  );
}
