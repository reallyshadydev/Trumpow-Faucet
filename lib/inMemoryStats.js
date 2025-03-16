// lib/inMemoryStats.js

let totalPaidOut = 0;

export function addToTotalPaidOut(amount) {
  totalPaidOut += amount;
}

export function getTotalPaidOut() {
  return totalPaidOut;
}
