import LegalLayout, { Section } from "../components/LegalLayout";

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 2026">
      <Section title="1. About DevTrack">
        <p>
          DevTrack is a career preparation platform. It helps students and developers track skills
          and projects, analyse resumes, practise mock interviews and follow a learning roadmap.
          This policy explains what information DevTrack collects and how it is used.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Account details:</strong> your name and email address. If you register with a
            password, only a hashed version of the password is stored.
          </li>
          <li>
            <strong>Google sign-in:</strong> if you choose &quot;Continue with Google&quot;, we receive
            your name, email address, profile picture and Google account ID. We do not receive
            your Google password or access your Gmail, Drive or any other Google data.
          </li>
          <li>
            <strong>Information you add:</strong> skills and levels, projects, certifications,
            target role, experience level, GitHub username and LinkedIn link.
          </li>
          <li>
            <strong>Activity:</strong> roadmap progress, skill tracker progress and streaks, and
            mock interview scores and reports.
          </li>
          <li>
            <strong>Technical data:</strong> a login token is kept in your browser&apos;s local storage
            so you stay signed in. We do not use advertising cookies or trackers.
          </li>
        </ul>
      </Section>

      <Section title="3. Resume analysis">
        <p>
          When you use the Resume Analyzer, your resume text is processed to produce a score and
          suggestions. The resume file and its text are not saved on our servers.
        </p>
      </Section>

      <Section title="4. AI features">
        <p>
          The AI Mock Interview and English Coach send your answers and messages, together with
          limited profile context (target role, skill names and project titles), to Google&apos;s
          Gemini API to generate replies and feedback. If the operator enables it, the AI career
          analysis may use Anthropic&apos;s Claude API in the same way. Please do not enter
          sensitive personal information in these features.
        </p>
      </Section>

      <Section title="5. How we use your information">
        <ul className="list-disc pl-5 space-y-1">
          <li>To create your account and sign you in.</li>
          <li>To provide the features you use, such as gap analysis and the roadmap.</li>
          <li>To send password reset emails when you ask for them.</li>
          <li>
            To keep the service running. Platform administrators can see names, email addresses and
            roles of registered users.
          </li>
        </ul>
        <p>We do not sell your personal data and we do not use it for advertising.</p>
      </Section>

      <Section title="6. Services we use">
        <p>To run DevTrack we rely on these providers, who process data on our behalf:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>MongoDB Atlas (database)</li>
          <li>Render (backend hosting) and Vercel (frontend hosting)</li>
          <li>Google (sign-in and Gemini AI)</li>
          <li>Brevo (password reset emails)</li>
          <li>GitHub API (we read public GitHub data for the username you provide)</li>
        </ul>
      </Section>

      <Section title="7. Google user data">
        <p>
          DevTrack&apos;s use and transfer of information received from Google APIs adheres to the
          Google API Services User Data Policy, including the Limited Use requirements. We use your
          Google account information only to sign you in and create your DevTrack account.
        </p>
      </Section>

      <Section title="8. Data retention and deletion">
        <p>
          We keep your data while your account exists. To delete your account and its data, email
          us at the address below and we will remove it.
        </p>
      </Section>

      <Section title="9. Security">
        <p>
          Passwords are hashed, password reset links expire quickly and work only once, and the
          site is served over HTTPS. No online service can promise perfect security, so please use
          a strong, unique password.
        </p>
      </Section>

      <Section title="10. Children">
        <p>DevTrack is not intended for children under 13.</p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this policy from time to time. The date at the top shows when it was last
          changed.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions or deletion requests:{" "}
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

export default Privacy;