export function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
}

export function rgbDistance(rgb1, rgb2) {
  return Math.sqrt(
    (rgb1[0] - rgb2[0]) ** 2 +
    (rgb1[1] - rgb2[1]) ** 2 +
    (rgb1[2] - rgb2[2]) ** 2
  );
}

export async function filterBirdsByColors(userHexList, threshold = 100) {
  const response = await fetch("/bird_colors.json");
  const birdData = await response.json();

  const userRgbs = userHexList.map(hexToRgb);
  const matches = [];

  for (const [birdName, data] of Object.entries(birdData)) {
    const birdRgbs = data.hex.map(hexToRgb);

    const matchedColors = userRgbs.filter((userRgb) =>
      birdRgbs.some((birdRgb) => rgbDistance(userRgb, birdRgb) < threshold)
    );

    if (matchedColors.length === userRgbs.length) {
      matches.push({
        name: birdName.replace(/_/g, " "),
        matched_color: data.hex[0],
        distance: Math.round(rgbDistance(userRgbs[0], hexToRgb(data.hex[0])) * 100) / 100,
        image: data.image,
      });
    }
  }

  matches.sort((a, b) => a.distance - b.distance);
  return matches;
}