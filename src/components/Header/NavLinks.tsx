import { Link } from "@tanstack/react-router";
import GitHubSvg from "../../assets/github.svg?react";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Features", to: "/features" },
  { name: "About", to: "/about" },
];

export function NavLinks() {
  return (
    <div
      id="navlinks"
      className="invisible absolute top-full left-0 z-20 w-full origin-top-right translate-y-1 scale-90 flex-col flex-wrap justify-end gap-6 rounded-3xl border border-gray-100 bg-white p-8 opacity-0 shadow-2xl shadow-gray-600/10 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 dark:shadow-none lg:visible lg:relative lg:flex lg:w-fit lg:translate-y-0 lg:scale-100 lg:flex-row lg:items-center lg:gap-0 lg:border-none lg:bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none lg:dark:bg-transparent group-data-[state=active]:visible group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 lg:group-data-[state=active]:translate-y-0"
    >
      <div className="w-full text-gray-600 dark:text-gray-200 lg:w-auto lg:pr-4 lg:pt-0">
        <div
          id="links-group"
          className="flex flex-col gap-6 tracking-wide lg:flex-row lg:gap-0 lg:text-sm"
        >
          {navLinks.map(({ name, to }) => (
            <Link
              key={name}
              to={to}
              className="relative hover:text-primary inline-flex transition dark:hover:text-white md:px-4"
              activeProps={{
                className:
                  "after:content-[''] after:w-full after:h-0.5 after:bg-primary/30 after:absolute after:inset-x-0 after:-bottom-5 after:rounded",
              }}
            >
              <span>{name}</span>
              {to === "/features" && (
                <span className="ml-2 flex rounded-full border bg-primary/20 px-2 py-0.5 text-xs tracking-wider text-purple-700 dark:bg-white/10 dark:text-orange-300">
                  New
                </span>
              )}
            </Link>
          ))}
          <a
            href="https://tailtips.dev"
            target="_blank"
            className="flex gap-2 font-semibold text-gray-700 transition hover:text-primary dark:text-white dark:hover:text-white md:px-4"
          >
            <span>TailwindCSS Tips</span>
          </a>
        </div>
      </div>
      <div className="mt-12 lg:mt-0">
        <a
          href="https://github.com/wandizer/"
          className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
        >
          {/* Github */}
          <div className="text-white h-5 w-5 z-0 mr-2">
            <GitHubSvg role="presentation" aria-hidden />
          </div>
          <span className="relative text-sm font-semibold text-white">
            GitHub
          </span>
        </a>
      </div>
    </div>
  );
}
