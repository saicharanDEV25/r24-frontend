export const BIKE_BRANDS = [
  {
    brand: "KTM",
    models: [
      "125 Duke",
      "200 Duke",
      "250 Duke",
      "390 Duke",
      "RC 200",
      "RC 390",
      "250 Adventure",
      "390 Adventure",
      "390 Adventure X",
      "390 Enduro R",
    ],
  },
  {
    brand: "Royal Enfield",
    models: ["Continental GT 650"],
  },
  {
    brand: "Yamaha",
    models: ["R15"],
  },
  {
    brand: "Bajaj",
    models: ["RS"],
  },
  {
    brand: "Benelli",
    models: ["TRK 502", "Leoncino 500", "Imperiale 400"],
  },
  {
    brand: "Kawasaki",
    models: ["Z900"],
  },
  {
    brand: "Helmets",
    models: [],
  },
  {
    brand: "Riding Gear",
    models: [],
  },
  {
    brand: "Exhaust",
    models: [],
  },
];

// shared between Products and Accessories so the two pages can't drift out of sync
export const BRAND_FILTER_OPTIONS = [
  "All", "KTM", "Royal Enfield", "Yamaha", "Bajaj", "Benelli", "Kawasaki",
  "Helmets", "Riding Gear", "Exhaust",
];

// excludes model-less entries (Helmets/Riding Gear/Exhaust) for flows that need an actual bike
export const REAL_BIKE_BRANDS = BIKE_BRANDS.filter((b) => b.models.length > 0);

export const KTM_BIKES = BIKE_BRANDS.find((b) => b.brand === "KTM").models;

// KTM lineup grouped for a two-step "pick the model, then the CC" picker.
export const KTM_FAMILIES = [
  {
    family: "Duke",
    variants: [
      { cc: "125", model: "125 Duke" },
      { cc: "200", model: "200 Duke" },
      { cc: "250", model: "250 Duke" },
      { cc: "390", model: "390 Duke" },
    ],
  },
  {
    family: "RC",
    variants: [
      { cc: "200", model: "RC 200" },
      { cc: "390", model: "RC 390" },
    ],
  },
  {
    family: "Adventure",
    variants: [
      { cc: "250", model: "250 Adventure" },
      { cc: "390", model: "390 Adventure" },
      { cc: "390 X", model: "390 Adventure X" },
    ],
  },
  {
    family: "Enduro",
    variants: [
      { cc: "390 R", model: "390 Enduro R" },
    ],
  },
];
