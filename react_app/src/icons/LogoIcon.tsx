import React from 'react';

type LogoIconProps = {
  className?: string;
  /** width of the SVG (can be number or CSS size string) */
  width?: number | string;
  /** height of the SVG (can be number or CSS size string) */
  height?: number | string;
  /** main color of the logo (default: black) */
  color?: string;
  /** optional background (set to a CSS color to render a background rectangle) */
  background?: string | null;
  /** accessible title */
  title?: string;
};

const LogoIcon: React.FC<LogoIconProps> = ({
  className,
  width = 200,
  height = 60,
  color = '#b7e22aff',
  background = null,
  title = 'bingatch',
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      {/* optional background to mimic your neon screenshot */}
      {background ? <rect width="100%" height="100%" fill={background} /> : null}

      {/* Text-based logo. If you need a pixel-perfect match with the screenshot
          it's best to convert the exact vector outlines of the font to <path>s
          (I can do that if you want). */}
      <g transform="translate(10,0)">
        <text
          x={0}
          y={72}
          fontFamily="Inter, Poppins, 'Helvetica Neue', Arial, sans-serif"
          fontWeight={800}
          fontSize={80}
          letterSpacing={-6}
          fill={color}
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          bingatch
        </text>
      </g>
    </svg>
  );
};

export default LogoIcon;
