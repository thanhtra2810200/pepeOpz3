const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const COMMA_STYLE = { width: '0.3em', overflow: 'visible' } as const;
const CELL_STYLE = { height: '1em' } as const;

/**
 * Odometer — stable rolling odometer.
 *
 * Each digit slot has a fixed reel of 0–9 and only animates translateY.
 * Commas are static. Pixel-identical to the original inline component.
 *
 * Style objects and the digit array are hoisted to module scope so the
 * ~60fps re-renders (while the counter is active) allocate zero new
 * objects.
 */
export function Odometer({ digits }: { digits: string[] }) {
  return (
    <span className="imp-odo">
      {digits.map((char, i) => {
        if (!/\d/.test(char)) {
          return (
            <span key={i} className="imp-odo-slot" style={COMMA_STYLE}>
              {char}
            </span>
          );
        }

        return <DigitWheel key={i} digit={Number(char)} />;
      })}
    </span>
  );
}

function DigitWheel({ digit }: { digit: number }) {
  return (
    <span className="imp-odo-slot">
      <span
        className="imp-odo-reel"
        style={{ transform: `translateY(-${digit}em)` }}
      >
        {DIGITS.map((n) => (
          <span key={n} className="imp-odo-cell" style={CELL_STYLE}>
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}
