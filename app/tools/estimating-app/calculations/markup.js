export function applyMarkup(cost, percent) {
  return cost + cost * (Number(percent) / 100);
}
