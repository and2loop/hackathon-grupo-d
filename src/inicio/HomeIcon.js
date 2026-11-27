import Svg, { Circle, Path } from 'react-native-svg';

const paths = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14',
  review: 'M21 12a9 9 0 0 1-13 8l-5 1 1.5-4.5A9 9 0 1 1 21 12z M8.5 12l2.5 2.5 4.5-5',
  user: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4',
  notification: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z',
  back: 'M15 5l-7 7 7 7',
  play: 'M7 4l13 8-13 8z',
  playOutline: 'M7 4l13 8-13 8z',
  chat: 'M4 5h16v11H9l-5 4z',
  film: 'M8 3h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z M10 9l5 3-5 3z',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',
  certificate: 'M9 13l-2 8 5-3 5 3-2-8',
  settings: 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  chevron: 'M9 5l7 7-7 7',
};

const circles = {
  user: { cx: 12, cy: 8, r: 4 },
  certificate: { cx: 12, cy: 9, r: 5 },
  settings: { cx: 12, cy: 12, r: 3 },
};

export default function HomeIcon({ name, color, size = 22 }) {
  const circle = circles[name];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d={paths[name]}
        fill={name === 'play' ? color : 'none'}
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {circle && <Circle {...circle} fill="none" stroke={color} strokeWidth={1.9} />}
    </Svg>
  );
}
