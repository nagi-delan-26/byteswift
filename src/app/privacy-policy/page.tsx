import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Byteswift Digital.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg dark:prose-invert prose-blue">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        At Byteswift Digital, the privacy of our visitors is of extreme importance to us. This privacy policy document outlines the types of personal information is received and collected by Byteswift Digital and how it is used.
      </p>
      
      <h2>Log Files</h2>
      <p>
        Like many other Web sites, Byteswift Digital makes use of log files. The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user&apos;s movement around the site, and gather demographic information. IP addresses, and other such information are not linked to any information that is personally identifiable.
      </p>
      
      <h2>Cookies and Web Beacons</h2>
      <p>
        Byteswift Digital does use cookies to store information about visitors preferences, record user-specific information on which pages the user access or visit, customize Web page content based on visitors browser type or other information that the visitor sends via their browser.
      </p>
      
      <p>If you require any more information or have any questions about our privacy policy, please feel free to contact us.</p>
    </div>
  );
}
