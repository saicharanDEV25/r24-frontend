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
      "790 Duke",
      "890 Duke R",
      "1290 Super Duke R",
    ],
  },
  {
    brand: "Royal Enfield",
    models: ["Continental GT 650"],
  },
  {
    brand: "Yamaha",
    models: ["RS", "R15"],
  },
  {
    brand: "Benelli",
    models: ["TRK 502", "Leoncino 500", "Imperiale 400"],
  },
  {
    brand: "Kawasaki",
    models: ["Z900"],
  },
];

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
      { cc: "790", model: "790 Duke" },
      { cc: "890 R", model: "890 Duke R" },
      { cc: "1290 Super Duke R", model: "1290 Super Duke R" },
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
