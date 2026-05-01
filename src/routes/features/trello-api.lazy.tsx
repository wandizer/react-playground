import { createLazyFileRoute } from "@tanstack/react-router";
import TrelloAPI from "../../components/TrelloAPI/TrelloAPI";

export const Route = createLazyFileRoute("/features/trello-api")({
  component: TrelloAPI,
});
