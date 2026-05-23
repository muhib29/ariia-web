/** Ensures only one Spline scene loads at a time across the page. */

let activeLoads = 0;
const MAX_CONCURRENT = 1;
const queue: Array<() => void> = [];

export function requestSplineSlot(): Promise<void> {
  return new Promise((resolve) => {
    const run = () => {
      activeLoads += 1;
      resolve();
    };

    if (activeLoads < MAX_CONCURRENT) {
      run();
    } else {
      queue.push(run);
    }
  });
}

export function releaseSplineSlot(): void {
  activeLoads = Math.max(0, activeLoads - 1);
  const next = queue.shift();
  if (next) next();
}
