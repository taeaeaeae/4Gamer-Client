export function metricNumber(n: bigint) {
  const degrees = ['', 'K', 'M', 'B', 'T'];
  let degreeCount = 0;

  let nSimplified = Number(n);
  for (; nSimplified >= 1000; nSimplified /= 1000) degreeCount += 1;

  return (Number.isInteger(nSimplified)
    ? `${nSimplified}${degrees[degreeCount]}`
    : `${nSimplified.toFixed(1)}${degrees[degreeCount]}`
  );
}
