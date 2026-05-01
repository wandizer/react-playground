import { Link } from '@tanstack/react-router'
import ThemeToggle from '../ThemeToggle.tsx'

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Features', to: '/features' },
  { name: 'About', to: '/about' },
]

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
              {to === '/features' && (
                <span className="ml-2 flex rounded-full border bg-primary/20 px-2 py-0.5 text-xs tracking-wider text-purple-700 dark:bg-white/10 dark:text-orange-300">
                  New
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 lg:mt-0 inline-flex items-center gap-4">
        <a
          href="https://github.com/wandizer/"
          className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
        >
          {/* Github */}
          <div className="text-white h-5 w-5 z-0 mr-2">
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              width="100%"
              height="100%"
            >
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </div>
          <span className="relative text-sm font-semibold text-white">
            GitHub
          </span>
        </a>
        <ThemeToggle />
      </div>
    </div>
  )
}
