export function parseTakeoff(input) {
  return {
    item: input.item || '',
    quantity: Number(input.quantity) || 0,
    unit: input.unit || 'ea'
  };
}
