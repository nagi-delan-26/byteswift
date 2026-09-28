import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Byteswift Digital.',
};

export default function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg dark:prose-invert prose-blue">
      <h1>Contact Us</h1>
      <p>
        Have a question, suggestion, or a business inquiry? We&apos;d love to hear from you.
      </p>
      <p>
        You can reach us through our social media channels:
      </p>
      <ul>
        <li><a href="https://x.com/byteswifts" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
        <li><a href="https://facebook.com/byteswiftdigital" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://instagram.com/byteswiftdigital_" target="_blank" rel="noopener noreferrer">Instagram</a></li>
      </ul>
      <p>
        For business inquiries, please reach out to us via direct message on any of the platforms above.
      </p>
    </div>
  );
}
