

const Footer = () => (
  <footer className="bg-[#191716] text-gray-400 text-sm mt-12 border-t border-gray-700">
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <p className="mb-2">
          Questions? Call{" "}
          <span className="text-lime-400 font-semibold">000-040-1843</span>
        </p>
        <ul className="space-y-1">
          <li>FAQ</li>
          <li>Investor Relations</li>
          <li>Privacy</li>
          <li>Speed Test</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li>Help Centre</li>
          <li>Jobs</li>
          <li>Cookie Preferences</li>
          <li>Legal Notices</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li>Account</li>
          <li>Ways to Watch</li>
          <li>Corporate Information</li>
          <li>Only on Bingatch</li>
        </ul>
      </div>
      <div>
        <ul className="space-y-1">
          <li>Media Centre</li>
          <li>Terms of Use</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;