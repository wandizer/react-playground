import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { TRANSITION_DURATION, useFastCarousel } from "../store/useFastCarousel";

type CoverProps = {
  isVisible?: boolean;
  src: string;
  alt?: string;
};

export function Cover({ isVisible, src, alt }: CoverProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isReady, setIsReady] = useState(false);

  const handleOnReady = useCallback(() => {
    setIsReady(true);
    useFastCarousel.getState().setIsCoverReady(true);
  }, []);

  useEffect(() => {
    const image = imageRef.current;

    if (!image || !image.complete || !isVisible) {
      return;
    }

    handleOnReady();
  }, [imageRef, handleOnReady, isVisible]);

  const style = { transitionDuration: `${TRANSITION_DURATION}ms` };

  return (
    <img
      ref={imageRef}
      className={classNames(
        "absolute w-full aspect-video h-full",
        "bg-no-repeat bg-center object-cover",
        "transition-opacity ease-linear",
        {
          "opacity-0": !isVisible || !isReady,
          "opacity-100": isVisible && isReady,
        },
      )}
      style={style}
      onLoad={handleOnReady}
      onError={handleOnReady}
      src={src}
      alt={alt}
    />
  );
}
