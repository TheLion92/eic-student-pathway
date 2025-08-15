import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer role="contentinfo" className="mt-16 border-t bg-footer text-footer-foreground">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <section>
            <h3 className="font-semibold mb-3">EIC Pathway</h3>
            <ul className="space-y-2 text-sm text-footer-foreground/80">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">Login</Link>
              </li>
              <li>
                <Link to="/pathway" className="hover:underline">Your Pathway</Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-footer-foreground/80">
              <li>
                <a
                  href="https://www.bowiestate.edu/academics/special-programs/entrepreneurship-innovation-center/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  Entrepreneurship Innovation Center
                </a>
              </li>
              <li>
                <a href="https://bowiestate.startuptree.co/discover/events" className="hover:underline" aria-disabled
                target="_blank"
                  rel="noreferrer"
                  >
                  Workshops & Events
                </a>
              </li>
              <li>
                <a href="https://bowiestate.startuptree.co/discover/people/mentors" className="hover:underline" aria-disabled
                target="_blank"
                rel="noreferrer"
                >
                  Mentors & Labs
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-footer-foreground/80">
              <li><a href="https://bowie.omnilert.net/subscriber.php" className="hover:underline" aria-disabled>Sign up for BEES Alerts</a></li>
              <li><a href="https://www.bowiestate.edu/about/privacy-statement.php" className="hover:underline" aria-disabled>Privacy</a></li>
              <li><a href="https://www.bowiestate.edu/about/administration-and-governance/division-of-administration-and-finance/human-resources/web-accessibility.php" className="hover:underline" aria-disabled>Web Accessibility</a></li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-footer-foreground/80">
              Bowie State University – Entrepreneurship Innovation Center
              <br /> Bowie, MD 20715
            </p>
            <a
              href="mailto:eic@bowiestate.edu"
              className="text-sm mt-2 inline-block hover:underline"
            >
              eic@bowiestate.edu
            </a>
          </section>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-footer-foreground/70 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} EIC Student Pathway · Bowie State University
          </p>
          <p>Built for students to explore, build, and launch.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
