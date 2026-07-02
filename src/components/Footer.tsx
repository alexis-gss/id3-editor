import type { JSX } from "astro/jsx-runtime";

/**
 * Renders the footer of the application.
 * @return {JSX.Element}
 */
export default function Footer(): JSX.Element {
  return (
    <footer className="mt-4 px-4">
      <p className="border-t border-ink/15 py-4 text-center text-xs text-ink/50">
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://alexis-gousseau.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm transition-colors duration-200 outline-none hover:text-accent hover:underline focus:border-accent focus:text-accent focus:underline focus:ring-2 focus:ring-accent-soft"
        >
          Alexis Gousseau
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
