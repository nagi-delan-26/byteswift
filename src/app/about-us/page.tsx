import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Byteswift Digital and A. Bayern.',
};

export default function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg dark:prose-invert prose-blue">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>Byteswift Digital</strong>. Founded and authored by A. Bayern, we are a digital publication dedicated to tech analysis, performance optimization, and cybersecurity insights.
      </p>
      <p>
        Our core focuses include:
      </p>
      <ul>
        <li>Windows and Mac performance optimization</li>
        <li>Android & iOS troubleshooting</li>
        <li>Cybersecurity and VPN analysis</li>
        <li>Artificial Intelligence (AI) tools and workflows</li>
      </ul>
      <p>
        We aim to provide actionable, easy-to-understand guides that empower you to take control of your digital life securely and efficiently.
      </p>
    </div>
  );
}
