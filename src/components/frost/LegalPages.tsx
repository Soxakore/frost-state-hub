import { PageHeader, FrostCard } from "./Ui";

export function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </PageHeader>
      <section className="container max-w-4xl pb-14">
        <FrostCard>
          <div className="prose-wiki space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Whiteout Command — State 4285 website ("the Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
              <p>
                Whiteout Command is a community-driven coordination hub for State 4285 in the mobile game Whiteout Survival by Century Games. The Site provides event schedules, alliance directories, transfer coordination, state rules, guides, and other community resources.
              </p>
              <p className="mt-2">
                This Site is not affiliated with, endorsed by, or officially connected to Century Games or Whiteout Survival. All game-related content, images, and trademarks belong to their respective owners.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">3. User Accounts</h2>
              <p>
                Certain features of the Site require user registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">4. User Conduct</h2>
              <p>When using the Site, you agree not to:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Post false, misleading, or harmful content</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Share private or sensitive state strategy information publicly</li>
                <li>Attempt to gain unauthorized access to the Site or its systems</li>
                <li>Use the Site for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the Site's functionality</li>
              </ul>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">5. Content & Intellectual Property</h2>
              <p>
                Game-related images, icons, and assets displayed on this Site are the property of Century Games and are used for community and informational purposes. User-submitted content remains the property of the respective user, but you grant the Site a non-exclusive license to display and use such content for the purpose of operating the community hub.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">6. Moderation & Enforcement</h2>
              <p>
                State leadership and moderators reserve the right to remove content, restrict access, or suspend accounts that violate these terms or the state rules at their discretion. Decisions regarding moderation are final.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p>
                The Site is provided "as is" without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content, event schedules, or alliance information displayed on the Site.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>
                Whiteout Command and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the Site, including but not limited to in-game losses, missed events, or transfer complications.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of the Site after changes are posted constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">10. Contact</h2>
              <p>
                For questions about these Terms of Service, please reach out to state leadership through the in-game communication channels or the community Discord server.
              </p>
            </div>
          </div>
        </FrostCard>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy">
        <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </PageHeader>
      <section className="container max-w-4xl pb-14">
        <FrostCard>
          <div className="prose-wiki space-y-6 text-muted-foreground leading-relaxed">
            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
              <p>When you use Whiteout Command — State 4285, we may collect the following information:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong className="text-foreground">Account information:</strong> Email address, display name, and avatar when you register</li>
                <li><strong className="text-foreground">Application data:</strong> In-game name, power level, furnace level, alliance, and other details submitted through transfer applications or reports</li>
                <li><strong className="text-foreground">Usage data:</strong> Pages visited, actions taken, and timestamps for operational purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Operate and maintain the community coordination hub</li>
                <li>Process transfer applications and reports</li>
                <li>Manage user accounts and role-based access</li>
                <li>Improve the Site's functionality and user experience</li>
                <li>Communicate important state updates and announcements</li>
              </ul>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">3. Data Storage & Security</h2>
              <p>
                Your data is stored securely using Supabase, a trusted cloud database platform with industry-standard encryption. We implement reasonable security measures to protect your information, but no method of electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">4. Data Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. Your information may be shared only in the following circumstances:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong className="text-foreground">State leadership:</strong> Transfer applications and reports are visible to authorized moderators and leadership roles</li>
                <li><strong className="text-foreground">Legal requirements:</strong> If required by law or to protect the rights and safety of our users</li>
              </ul>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">5. Cookies & Tracking</h2>
              <p>
                The Site uses essential cookies for authentication and session management. We do not use third-party tracking cookies or advertising trackers. Your login session is managed through secure tokens stored in your browser.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Access and review the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact state leadership through in-game channels or the community Discord server.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">7. Children's Privacy</h2>
              <p>
                The Site is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div>
              <h2 className="font-command text-xl font-bold text-foreground mb-3">9. Contact</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please reach out to state leadership through the in-game communication channels or the community Discord server.
              </p>
            </div>
          </div>
        </FrostCard>
      </section>
    </>
  );
}
