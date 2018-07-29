const colorsByVersion = {};
let i = 0;

const colors = [
  '#f2d24b',
  '#f67c00',
  '#6e8eff',
  '#ab59bc',
  '#f691ca',
  '#993366',
  '#009955',
  '#2cbcc9',
  '#d8a499',
  '#63361d',
  '#ff5456',
  '#ff6c3d',
];

export default function getColorByVersion(version) {
  if (version) {
    if (colorsByVersion[version]) return colorsByVersion[version];

    colorsByVersion[version] = colors[i];
    i += 1;
    return colorsByVersion[version];
  }
  return null;
}
