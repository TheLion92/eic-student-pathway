import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/eic-hero.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
const steps = [
  {
    title: "Phase 1: Ideation",
    desc: "Spark your idea and define the problem you solve.",
  },
  {
    title: "Phase 2: Validation",
    desc: "Test assumptions, interview users, validate demand.",
  },
  { title: "Phase 3: Build", desc: "Craft a scrappy MVP and iterate fast." },
  { title: "Phase 4: EIC Resources", desc: "Work with mentors and EIC labs." },
  { title: "Phase 5: Launch", desc: "Pitch, refine, and launch with confidence." },
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>EIC Student Pathway – Bowie State Entrepreneurship</title>
        <meta
          name="description"
          content="Experience the EIC on your phone. Follow the 5-stage pathway with motivation and rewards to launch your venture."
        />
        <link rel="canonical" href="/" />
        <meta property="og:title" content="EIC Student Pathway" />
        <meta
          property="og:description"
          content="Follow the 5-stage entrepreneurial journey from ideation to launch."
        />
      </Helmet>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden dark">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Students collaborating at the EIC innovation center"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, hsl(var(--hero-start) / 0.7), hsl(var(--hero-end) / 0.85))",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
              EIC Student Pathway
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl mb-8 text-foreground/90">
              The Entrepreneurship Innovation Center is on your phone!! Progress through a
              5 guided phases with motivation, resources, and rewards.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button variant="hero" size="lg">Get Started</Button>
              </Link>
              <a
                href="https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="hero" size="lg">Learn about the EIC</Button>
              </a>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <header className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-2">
              The 5-Phase Entrepreneurial Journey
            </h2>
            <p className="text-muted-foreground">
              Clear milestones, real support, and code-gated progress at the EIC.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((s, i) => (
              <Card key={s.title} className="h-full">
                <CardContent className="p-5 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Step {i + 1}</p>
                    <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <div className="pt-4">
                    <Link to="/login">
                      <Button className="w-full">Start here</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
