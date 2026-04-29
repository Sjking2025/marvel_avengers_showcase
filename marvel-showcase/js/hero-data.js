export const HEROES = [
  {
    id: "iron-man",
    name: "Iron Man",
    realName: "Tony Stark",
    tagline: "Genius. Billionaire. Avenger.",
    description: "Armored in cutting-edge technology and driven by an unbreakable will, Tony Stark became more than a hero — he became the foundation of the Avengers.",
    accentColor: "#e74c3c",
    secondaryColor: "#f39c12",
    particleType: "techGrid",
    stats: {
      power: 85, speed: 70, intelligence: 100, combat: 80, durability: 75
    },
    abilities: ["Powered Armor", "Repulsor Beams", "Flight", "AI Integration", "Genius Intellect"],
    bgGradient: "radial-gradient(ellipse at 60% 50%, rgba(192,57,43,0.15) 0%, transparent 70%)",
    filmAppearances: 10,
    firstAppearance: "Iron Man (2008)"
  },
  {
    id: "thor",
    name: "Thor",
    realName: "Thor Odinson",
    tagline: "God of Thunder. Worthy.",
    description: "Heir to the Asgardian throne, Thor wields Mjolnir with the fury of a thousand storms. His power transcends worlds — only the worthy may stand beside him.",
    accentColor: "#5dade2",
    secondaryColor: "#f4d03f",
    particleType: "lightning",
    stats: {
      power: 100, speed: 80, intelligence: 70, combat: 95, durability: 98
    },
    abilities: ["Lightning Control", "Mjolnir", "Flight", "Superhuman Strength", "Stormbreaker"],
    bgGradient: "radial-gradient(ellipse at 40% 50%, rgba(93,173,226,0.15) 0%, transparent 70%)",
    filmAppearances: 9,
    firstAppearance: "Thor (2011)"
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    realName: "Peter Parker",
    tagline: "Friendly. Neighborhood. Legend.",
    description: "With great power comes great responsibility. Peter Parker carries the weight of New York on his shoulders — and swings through it with a smile.",
    accentColor: "#e74c3c",
    secondaryColor: "#2980b9",
    particleType: "cityRain",
    stats: {
      power: 72, speed: 95, intelligence: 90, combat: 85, durability: 65
    },
    abilities: ["Spider-Sense", "Wall-Crawling", "Web-Slinging", "Enhanced Agility", "Genius Inventor"],
    bgGradient: "radial-gradient(ellipse at 50% 80%, rgba(41,128,185,0.12) 0%, transparent 70%)",
    filmAppearances: 7,
    firstAppearance: "Captain America: Civil War (2016)"
  },
  {
    id: "black-panther",
    name: "Black Panther",
    realName: "T'Challa",
    tagline: "King of Wakanda. Protector.",
    description: "T'Challa is not merely a superhero — he is a king, a strategist, and the living embodiment of Wakanda's strength and grace.",
    accentColor: "#bb8fce",
    secondaryColor: "#17a589",
    particleType: "vibranium",
    stats: {
      power: 88, speed: 92, intelligence: 95, combat: 98, durability: 80
    },
    abilities: ["Vibranium Suit", "Enhanced Senses", "Panther Habit", "King's Knowledge", "Tactical Genius"],
    bgGradient: "radial-gradient(ellipse at 50% 40%, rgba(142,68,173,0.15) 0%, transparent 70%)",
    filmAppearances: 5,
    firstAppearance: "Captain America: Civil War (2016)"
  },
  {
    id: "captain-america",
    name: "Captain America",
    realName: "Steve Rogers",
    tagline: "I can do this all day.",
    description: "From a scrawny kid from Brooklyn to the first Avenger — Steve Rogers proves that the strongest power is an unbreakable heart.",
    accentColor: "#5dade2",
    secondaryColor: "#c0392b",
    particleType: "starField",
    stats: {
      power: 80, speed: 78, intelligence: 82, combat: 100, durability: 88
    },
    abilities: ["Vibranium Shield", "Super Soldier Serum", "Peak Human Physique", "Master Tactician", "Leadership"],
    bgGradient: "radial-gradient(ellipse at 30% 50%, rgba(46,134,193,0.15) 0%, transparent 70%)",
    filmAppearances: 11,
    firstAppearance: "Captain America: The First Avenger (2011)"
  }
];

export function getHeroById(id) {
  return HEROES.find(hero => hero.id === id);
}

export function getHeroIndex(id) {
  return HEROES.findIndex(hero => hero.id === id);
}