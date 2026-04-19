import { createLazyFileRoute } from "@tanstack/react-router";
import FastCarousel from "../../components/FastCarousel/FastCarousel";

export const Route = createLazyFileRoute("/project/fast-carousel")({
  component: FastCarousel,
});
