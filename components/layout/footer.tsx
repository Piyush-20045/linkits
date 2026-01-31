import { FOOTER_LINKS, SOCIALS_LINKS } from "@/constants/footer-links";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-600">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Title and Slogan */}
          <div className="flex flex-col items-center md:items-start gap-0.5 text-white">
            <span className="font-geist-mono text-xl font-semibold">
              link<span className="text-neutral-400">its</span>
            </span>
            <span>All your essential web tools, in one place.</span>
          </div>

          {/* Footer Links */}
          <div className="md:pr-4 lg:pr-14 flex gap-8 text-sm text-neutral-400">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.id}
                href="#"
                className="hover:text-neutral-100 transition-colors cursor-pointer font-geist-mono"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-6 text-xs">
            {SOCIALS_LINKS.map((social) => (
              <a
                key={social.id}
                target="_blank"
                href={social.href}
                className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer font-geist-mono"
              >
                {social.icon}
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-6 md:pt-0 pb-2 text-[11px] font-geist-mono text-neutral-400 text-center tracking-widest">
        &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;
