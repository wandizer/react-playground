import { BoardLists } from "./constants";

const _fetch = async (url: string, options: RequestInit = {}) => {
  const fullUrl = _attachAppKeyAndToken(url);
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: { Accept: "application/json", ...options.headers },
    });

    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    return await res.json();
  } catch (err) {
    console.error("Error fetching Trello API:", err);
    throw err instanceof Error ? err : new Error("Unknown error");
  }
};

const _attachAppKeyAndToken = (url: string) => {
  const key = import.meta.env.VITE_TRELLO_API_KEY;
  const token = import.meta.env.VITE_TRELLO_API_TOKEN;

  if (!key || !token) {
    throw new Error(
      "Trello API key and token must be set in environment variables",
    );
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}key=${key}&token=${token}`;
};

/**
 * [GET] /boards/{id}
 * Request a single board.
 */
export const getBoard = async (boardId: string) => {
  return await _fetch(`https://api.trello.com/1/boards/${boardId}`, {
    method: "GET",
  });
};

/**
 * [GET] /boards/{id}/lists
 * Get all lists on a board.
 */
export const getListsOnBoard = async (boardId: string) => {
  return await _fetch(`https://api.trello.com/1/boards/${boardId}/lists`, {
    method: "GET",
  });
};

/**
 * [GET] /lists/{id}/cards
 * Get all cards on a list.
 */
export const getCardsOnList = async (listId: string) => {
  return await _fetch(`https://api.trello.com/1/lists/${listId}/cards`, {
    method: "GET",
  });
};

/**
 * [POST] /cards
 * Create a new card. Query parameters may also be replaced with a JSON request body instead.
 */
export const createNewCard = async (
  listId: string,
  name: string,
  desc?: string,
) => {
  const body = new URLSearchParams({ name, idList: listId });
  if (desc) body.append("desc", desc);
  return await _fetch(`https://api.trello.com/1/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
};

/**
 * [POST] /cards
 * Helper function to create a new Trello card with a specific format for ticketing purposes.
 */
export const createNewTicketCard = async ({
  listId = BoardLists.Doing.id,
  title,
  issueLink,
  mergeRequestLink,
  branchName,
}: {
  listId: string;
  title: string;
  issueLink?: string;
  mergeRequestLink?: string;
  branchName?: string;
}) => {
  const issueLinkMarkdown = issueLink
    ? `[${issueLink.split("/").slice(-1)[0]}](${issueLink})`
    : "ISSUE_LINK";
  const mergeRequestLinkMarkdown = mergeRequestLink
    ? `[${mergeRequestLink.split("/").slice(-1)[0]}](${mergeRequestLink})`
    : "MERGE_REQUEST_LINK";
  const branchNameMarkdown = branchName || "BRANCH_NAME";
  const body = new URLSearchParams({
    name: `TICKET[${issueLink?.split("/")?.slice(-1)?.[0] || ""}]: ${title}`,
    idList: listId,
    desc: `## Issue:

> ${issueLinkMarkdown}

---

## Branches:

> ${branchNameMarkdown}

---

## Merge-request:

> ${mergeRequestLinkMarkdown}`,
  });

  return await _fetch(`https://api.trello.com/1/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
};
