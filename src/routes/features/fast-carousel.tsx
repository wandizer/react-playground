import { createFileRoute } from "@tanstack/react-router";
import FastCarousel from "../../components/FastCarousel/FastCarousel";

export const Route = createFileRoute("/features/fast-carousel")({
  component: FastCarousel,
});
