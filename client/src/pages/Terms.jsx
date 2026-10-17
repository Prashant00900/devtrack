import LegalLayout, { Section } from "../components/LegalLayout";

function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="October 2026">
      <Section title="1. Using DevTrack">
        <p>
          By creating an account or using DevTrack you agree to these terms. If you do not agree,
          please do not use the service.
        </p>
      </Section>

      <Section title="2. Your account">
        <p>
          Give accurate information and keep your password safe. You are responsible for activity
          on your account. You must be at least 13 years old to use DevTrack.
        </p>
      </Section>

      <Section title="3. Acceptable use">
        <ul className="list-disc pl-5 space-y-1">
          <li>Do not try to break, overload or gain unauthorised access to the service.</li>
          <li>Do not upload or submit unlawful, harmful or other people&apos;s private information.</li>
          <li>Do not misuse the AI features or try to bypass usage limits.</li>
        </ul>
      </Section>

      <Section title="4. Scores, analysis and AI output">
        <p>
          Skill gap scores, resume scores, interview reports and English corrections are guidance
          only. They are not the scores of any employer or applicant tracking system, and they do
          not guarantee an interview or a job. AI output can be wrong, so please check it before
          relying on it.
        </p>
      </Section>

      <Section title="5. Learning links and third parties">
        <p>
          DevTrack links to third-party websites and courses. We do not control them and are not
          responsible for their content, availability or pricing.
        </p>
      </Section>

      <Section title="6. Availability">
        <p>
          DevTrack runs on free hosting plans. It may be slow, unavailable or change without
          notice. Features can be added, changed or removed at any time.
        </p>
      </Section>

      <Section title="7. Ending your use">
        <p>
          You can stop using DevTrack at any time and ask us to delete your account. We may
          suspend accounts that break these terms.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          DevTrack is provided &quot;as is&quot; without warranties. To the extent allowed by law, we
          are not liable for any loss arising from using the service.
        </p>
      </Section>

      <Section title="9. Changes to these terms">
        <p>
          We may update these terms from time to time. Continuing to use DevTrack after a change
          means you accept the new terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions:{" "}
          <a
            href="mailto:rajpootprashant349@gmail.com"
            className="text-blue-400 hover:underline"
          >
            rajpootprashant349@gmail.com
          </a>
        </p>
      </Section>
    </LegalLayout>
  );
}

export default Terms;