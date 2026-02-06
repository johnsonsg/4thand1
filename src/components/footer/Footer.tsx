export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">
                  W
                </span>
              </div>
              <div>
                <p className="font-display text-lg font-bold uppercase tracking-wider text-foreground">
                  Westfield Eagles
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Football
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Building champions on and off the field since 1952. Home of the
              Eagles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Schedule", "Roster", "Results", "News", "Booster Club"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Westfield High School</p>
              <p>500 Eagles Way</p>
              <p>Westfield, TX 77024</p>
              <p className="pt-2">
                <a
                  href="mailto:football@westfieldisd.org"
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  football@westfieldisd.org
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 Westfield Eagles Football. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
