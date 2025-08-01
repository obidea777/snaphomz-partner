export function getRandomColor(): string {
  const letters: string = '0123456789ABCDEF'
  let color: string = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const predefinedColors: string[] = ['#00308B', '#743800', '#5B305E']

export function getPredefinedRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * predefinedColors.length)
  return predefinedColors[randomIndex]
}
