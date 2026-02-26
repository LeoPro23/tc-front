import type { AgronomicRecipe } from "./types";

export const RECIPES: Record<string, AgronomicRecipe> = {
  "Tuta absoluta": {
    product: "Clorantraniliprol (Coragen)",
    dose: "150-200 ml/ha",
    method: "Aplicacion foliar y control biologico (Nesidiocoris)",
  },
  "Mosca blanca": {
    product: "Imidacloprid / Thiamethoxam",
    dose: "0.5 L/ha",
    method: "Trampas cromaticas amarillas y control quimico suave",
  },
  Minador: {
    product: "Abamectina",
    dose: "0.75 - 1.0 L/ha",
    method: "Eliminacion de brotes danados y aplicacion dirigida",
  },
  Saludable: {
    product: "N/A",
    dose: "N/A",
    method: "Mantener ciclos de riego y fertilizacion estandar",
  },
};
