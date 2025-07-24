const spinnerSize = 48;

export default function LoadinWheel() {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin"
        width={spinnerSize}
        height={spinnerSize}
        viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={spinnerSize / 2}
          cy={spinnerSize / 2}
          r={spinnerSize / 2 - 4}
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-20"
        />
        <path
          d={`M${spinnerSize / 2},4
            a${spinnerSize / 2 - 4},${spinnerSize / 2 - 4} 0 0,1 0,${spinnerSize - 8}`}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
