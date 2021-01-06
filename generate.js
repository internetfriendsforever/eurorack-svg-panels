const hpw = 5.08
const height = 128.5
const hps = [1, 1.5, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 21, 22, 28, 42]
const names = hps.map((hp, i) => {
  return `${i.toString().padStart(2, '0')}-${hp}HP-panel`
})

hps.forEach((hp, i) => {
  const tolerance = Math.min(0.3, Math.pow(i, 2) / 10)
  const width = Math.floor(((hp * hpw) - tolerance) * 10) / 10
  const holes = Math.max(1, Math.round((hp + 10) / 12))

  Deno.writeTextFile(`./${names[i]}.svg`, `
    <svg width="${width}mm" height="${height}mm" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" fill="none">
        <rect x="0" y="0" width="${width}mm" height="${height}mm" />
        <line x1="0" x2="${width}mm" y1="9.25mm" y2="9.25mm" stroke-dasharray="0.5mm" />
        <line x1="0" x2="${width}mm" y1="119.25mm" y2="119.25mm" stroke-dasharray="0.5mm" />
        ${Array(holes).fill().flatMap((_, i) => {
          const r = 1.6
          return [3, 125.5].map(y => {
            const x = hp < 4 ? 2.5 : 7.5 + (i * hpw * Math.floor((hp - 3) / Math.max(1, holes - 1)))
            return `
              <circle cx="${x}mm" cy="${y}mm" r="${r}mm" />
              <line x1="${x}mm" x2="${x}mm" y1="${y - r}mm" y2="${y + r}mm" />
              <line x1="${x - r}mm" x2="${x + r}mm" y1="${y}mm" y2="${y}mm" />
            `
          })
        }).join('')}
      </g>
    </svg>
  `);
})

Deno.writeTextFile('./index.html', `
  <title>Panels</title>
  <link rel="stylesheet" href="styles.css" />
  ${hps.map((hp, i) => `
    <figure>
      <img src="${names[i]}.svg" />
      <figcaption>
        ${hp} HP
      </ficaption>
    </figure>
  `).join('')}
`)
