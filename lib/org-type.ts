// Organisation type is free text (e.g. "Board", "Corporation", "Federation",
// "University") rather than a fixed enum, since real departments use all
// sorts of institutional labels. This list only powers the datalist
// autocomplete suggestions on the form - any value can be typed.
export const ORG_TYPE_SUGGESTIONS = [
  "Sub Department",
  "Board",
  "Corporation",
  "Institution",
  "Federation",
  "University",
  "Society",
  "Council",
  "Authority",
];

export const PARENT_ORG_TYPE = "Parent Department";
