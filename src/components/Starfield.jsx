import icon1 from "../assets/icons/icon1.png";

const createSeededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const buildStars = ({ count, seed, sizeMin, sizeRange, topMin, topRange, leftMin, leftRange }) => {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }, (_, index) => ({
    id: `star-${index + 1}`,
    top: `${topMin + random() * topRange}%`,
    left: `${leftMin + random() * leftRange}%`,
    size: `${sizeMin + random() * sizeRange}px`,
    opacity: 0.55 + random() * 0.35,
    duration: `${2.4 + random() * 3.8}s`,
    delay: `${random() * 4.5}s`,
    rotation: `${random() * 360}deg`,
  }));
};

export default function Starfield({
  className = "",
  count = 22,
  seed = 404,
  sizeMin = 28,
  sizeRange = 26,
  topMin = 8,
  topRange = 84,
  leftMin = 4,
  leftRange = 92,
}) {
  const stars = buildStars({
    count,
    seed,
    sizeMin,
    sizeRange,
    topMin,
    topRange,
    leftMin,
    leftRange,
  });

  return (
    <div aria-hidden="true" className={`starfield ${className}`.trim()}>
      {stars.map((star) => (
        <img
          key={star.id}
          src={icon1}
          alt=""
          className="starfield-item"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
            "--star-rotate": star.rotation,
            "--star-opacity": star.opacity,
          }}
        />
      ))}
    </div>
  );
}
