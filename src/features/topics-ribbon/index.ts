import { topicsContent } from "./content";

/** Every topic of both ribbons, once (JSON-LD `knowsAbout`). */
export const topicLabels = [
  ...new Set([...topicsContent.creamRibbon, ...topicsContent.redRibbon].map((t) => t.label)),
];

export { TopicsRibbon } from "./ui/topics-ribbon";
