import { createFileRoute } from "@tanstack/react-router";
import TrelloAPI from "../../components/TrelloAPI/TrelloAPI";

export const Route = createFileRoute("/features/trello-api")({
  component: TrelloAPI,
});
