import { createLazyFileRoute } from "@tanstack/react-router";
import { Container } from "../components/Ui/Container.tsx";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  return (
    <>
      {/* Hero */}
      <Container className="relative h-[580px]">
        <div className="absolute scale-[1.4] inset-0 blur-2xl h-[580px] bg-gradient-to-br from-transparent from-30% via-primary/30 to-70% to-transparent" />
        <div className="text-center flex flex-col justify-center items-center h-full">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl md:text-6xl xl:text-[4.125rem] md:leading-[1.1] xl:leading-[1.1] sm:leading-[1.1]">
            My playground
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-300 sm:text-lg md:mt-6 md:max-w-3xl sm:leading-8">
            Cool playground where I experiment with new libraries, techniques
            and projects related to React. Not only for learning purposes but to
            also improve my skills and share knowledge with the community.
          </p>
          <div className="relative px-4 mx-auto mt-10 max-w-3xl sm:px-6">
            <form action="/" accept-charset="UTF-8" method="get">
              <input value="free" type="hidden" name="price" id="price" />
              <div className="relative mx-auto w-full max-w-xl h-14 rounded-full duration-200 group after:border after:border-white/6 after:absolute after:inset-0 after:w-full after:h-full after:border-gray-950/5 after:rounded-full bg-gray-100/60 lg:max-w-none hover:bg-white hover:text-black hover:after:border-cool-indigo-200 after:duration-200 focus-within:bg-white focus-within:after:border-cool-indigo-200 hover:ring-1 ring-cool-indigo-200 focus-within:ring-1 focus-within:ring-cool-indigo-200">
                <input
                  placeholder="What are you looking for?"
                  className="text-gray-800 relative z-10 outline-hidden border-none rounded-full w-full h-14 bg-transparent py-0 pl-6 pr-32 outline-hidden shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.03),0px_1px_3px_0px_rgba(3,7,18,0.05)] hover:outline-hidden placeholder:text-gray-800/80 focus:ring-0"
                  type="text"
                  name="query"
                  id="query"
                />
                <button
                  type="submit"
                  className="inline-flex absolute top-2 right-2 z-20 justify-center items-center w-10 h-10 text-sm text-gray rounded-full transition duration-200 ease-in-out cursor-pointer outline-hidden bg-cool-indigo-500 sm:text-base sm:font-medium hover:bg-cool-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-cool-indigo-400"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
              <input value="template" type="hidden" name="type" id="type" />
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
