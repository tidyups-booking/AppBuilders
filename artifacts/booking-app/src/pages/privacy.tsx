import { useEffect } from 'react';
import logoImg from '@assets/833tidyups-logo.png';

const EFFECTIVE_DATE = 'August 3, 2026';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — 833 Tidyups';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 flex items-center gap-4">
          <img
            src={logoImg}
            alt="833 Tidyups Logo"
            className="h-12 w-12 rounded-md object-contain"
          />
          <div>
            <h1 className="font-serif text-3xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">
              833 Tidyups — Effective {EFFECTIVE_DATE}
            </p>
          </div>
        </header>

        <div className="space-y-8 text-sm leading-relaxed [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <section>
            <h2>Overview</h2>
            <p>
              833 Tidyups (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provides home
              cleaning services in Edmonton, Alberta, Canada, along with booking software used by
              our staff and customers (the &ldquo;Services&rdquo;). This Privacy Policy explains
              what information we collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <ul>
              <li>
                <strong>Contact information:</strong> name, phone number, and email address,
                provided when a booking is made.
              </li>
              <li>
                <strong>Service address:</strong> the home address where cleaning services are
                performed.
              </li>
              <li>
                <strong>Booking details:</strong> service type, home size, requested extras,
                appointment date and time, frequency, price estimates, and notes.
              </li>
              <li>
                <strong>Usage data:</strong> basic technical information (such as device type and
                app version) needed to operate and improve the Services.
              </li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To schedule, manage, and perform cleaning appointments.</li>
              <li>To contact you about your bookings, including confirmations and reminders.</li>
              <li>To provide quotes and process payments for services.</li>
              <li>To maintain internal records and improve our Services.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-2">
              We do <strong>not</strong> sell your personal information, and we do not use it for
              third-party advertising.
            </p>
          </section>

          <section>
            <h2>How We Share Information</h2>
            <p>We only share personal information in these limited circumstances:</p>
            <ul>
              <li>
                <strong>Service providers:</strong> trusted vendors that help us operate the
                Services (such as scheduling and field-service software), bound by
                confidentiality obligations.
              </li>
              <li>
                <strong>Our staff:</strong> cleaners and dispatch staff see the booking details
                needed to perform your appointment.
              </li>
              <li>
                <strong>Legal requirements:</strong> when required by law or to protect our rights
                and the safety of others.
              </li>
            </ul>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              We keep booking records for as long as needed to provide the Services, meet
              accounting and legal requirements, and resolve disputes. You may request deletion of
              your personal information at any time (see &ldquo;Your Rights&rdquo; below).
            </p>
          </section>

          <section>
            <h2>Security</h2>
            <p>
              We use reasonable administrative and technical safeguards to protect your
              information, including encrypted connections and access controls. No method of
              storage or transmission is 100% secure, but we work to protect your data
              appropriately.
            </p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>
              Subject to applicable law (including Canada&rsquo;s PIPEDA and Alberta&rsquo;s PIPA),
              you may request access to, correction of, or deletion of your personal information.
              To make a request, contact us using the details below and we will respond within a
              reasonable time.
            </p>
          </section>

          <section>
            <h2>Children&rsquo;s Privacy</h2>
            <p>
              Our Services are not directed at children under 13, and we do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated effective date.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your personal information,
              contact us:
            </p>
            <ul>
              <li>833 Tidyups — Edmonton, Alberta, Canada</li>
              <li>Phone: 833-TIDYUPS</li>
            </ul>
          </section>
        </div>

        <footer className="mt-12 border-t pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} 833 Tidyups. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
