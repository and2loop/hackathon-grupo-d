import Svg, { Circle, Path } from 'react-native-svg';

const paths = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14',
  review: 'M21 12a9 9 0 0 1-13 8l-5 1 1.5-4.5A9 9 0 1 1 21 12z M8.5 12l2.5 2.5 4.5-5',
  user: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 21h4',
  play: 'M7 4l13 8-13 8z',
  shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  chevron: 'M9 5l7 7-7 7',
};

export default function HomeIcon({ name, color, size = 22 }) {
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
      {name === 'user' && (
        <Circle cx={12} cy={8} r={4} fill="none" stroke={color} strokeWidth={1.9} />
      )}
    </Svg>
  );
}
