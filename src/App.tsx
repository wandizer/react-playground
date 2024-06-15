import { Header } from "./components/Header/Header";
import ImgReactVirtual from "./assets/tanstack-react-virtual.png";
import { SectionCard } from "./components/SectionCard/SectionCard";

function App() {
  return (
    <div>
      <Header />
      <main className="m-4 gap-4 flex flex-wrap">
        <SectionCard
          img={{ src: ImgReactVirtual, alt: "react-virtual" }}
          title="Horizontal Virtual Slide"
          description="Example of a horizontal virtual slide using react-virtual from TanStack."
          tags={["react", "virtual", "horizontal"]}
          renderOverlay
          onClick={() => console.log("clicked")}
        />
        <SectionCard renderOverlay />
        <SectionCard renderOverlay />
      </main>
    </div>
  );
}

export default App;
