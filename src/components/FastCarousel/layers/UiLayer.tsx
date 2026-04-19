import classNames from "classnames";
import { TRANSITION_DURATION, useFastCarousel } from "../store/useFastCarousel";

type UiLayerProps = {
  title: string;
  description: string;
  buttonText: string;
};

export function UiLayer({
  title,
  description,
  buttonText,
}: UiLayerProps): JSX.Element {
  const isTransitioning = useFastCarousel((state) => state.isTransitioning);
  const style = { transitionDuration: `${TRANSITION_DURATION}ms` };

  return (
    <div
      className={classNames(
        "w-full h-[calc(100vw/16*9*0.70)] z-20 flex flex-col items-start justify-end p-12 gap-4",
        "transition-opacity ease-linear",
        {
          "opacity-0": isTransitioning,
          "opacity-100": !isTransitioning,
        },
      )}
      style={style}
    >
      <h1 className="text-white text-5xl">{title}</h1>
      <p className="text-white text-lg max-w-2xl">{description}</p>
      <button className="bg-white/80 hover:bg-white text-black font-bold py-2 px-4 rounded">
        {buttonText}
      </button>
    </div>
  );
}
