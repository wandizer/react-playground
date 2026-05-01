import { createLazyFileRoute } from "@tanstack/react-router";
import FastCarousel from "../../components/FastCarousel/FastCarousel";

export const Route = createLazyFileRoute("/features/fast-carousel")({
  component: FastCarousel,
});
