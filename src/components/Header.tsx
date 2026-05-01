import { Brand } from './Header/Brand.tsx'
import { NavLinks } from './Header/NavLinks.tsx'
import { Container } from './Ui/Container.tsx'

export default function Header() {
  return (
    <header>
      <nav
        id="nav"
        className="sticky group z-10 w-full border-b border-black/5 dark:border-white/5 lg:border-transparent"
      >
        <Container>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 md:gap-0 md:py-4">
            <div className="relative z-20 flex w-full justify-between md:px-0 lg:w-fit">
              <Brand />
              <div className="relative flex max-h-10 items-center lg:hidden">
                <button
                  aria-label="hamburger"
                  id="hamburger"
                  className="relative -mr-6 p-6 active:scale-95 duration-300"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-top group-data-[state=active]:rotate-45 group-data-[state=active]:translate-y-1.5"
                  ></div>
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-gray-950 transition duration-300 dark:bg-white origin-bottom group-data-[state=active]:-rotate-45 group-data-[state=active]:-translate-y-1"
                  ></div>
                </button>
              </div>
            </div>
            <div
              id="navLayer"
              aria-hidden="true"
              className="fixed inset-0 z-10 h-screen w-screen origin-bottom scale-y-0 bg-white/70 backdrop-blur-2xl transition duration-500 group-data-[state=active]:origin-top group-data-[state=active]:scale-y-100 dark:bg-gray-950/70 lg:hidden"
            ></div>
            <NavLinks />
          </div>
        </Container>
      </nav>
    </header>
  )
}
