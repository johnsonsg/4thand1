export type PositionGroup = "Offense" | "Defense" | "Special Teams";

export const toGroups = (...groups: PositionGroup[]): PositionGroup[] => groups;

export interface Player {
  id: string;
  name: string;
  number: string;
  position: string;
  positionGroup: PositionGroup[];
  spotlight?: boolean;
  year: string;
  height: string;
  weight: string;
  image: string;
  stats: string;
  hudlUrl?: string;
  bio: string;
  accolades: string[];
}

export const players: Player[] = [
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    number: "7",
    position: "Quarterback",
    positionGroup: toGroups("Offense"),
    year: "Senior",
    height: "6'2\"",
    weight: "195 lbs",
    image: "/images/players/marcus-johnson.jpg",
    stats: "2,340 YDS / 22 TD / 4 INT",
    bio: "A three-year varsity starter, Marcus has led the Eagles offense since his sophomore year. Known for his pocket presence and deep ball accuracy, he holds the school record for single-season passing touchdowns. Committed to play at the collegiate level next fall.",
    accolades: [
      "1st Team All-District QB (2024, 2025)",
      "District 8-6A Offensive MVP",
      "MaxPreps All-State Honorable Mention",
    ],
  },
  {
    id: "david-chen",
    name: "David Chen",
    number: "22",
    position: "Running Back",
    positionGroup: toGroups("Offense"),
    year: "Junior",
    height: "5'10\"",
    weight: "185 lbs",
    image: "/images/players/david-chen.jpg",
    stats: "890 YDS / 12 TD / 5.8 YPC",
    bio: "David is an explosive playmaker with elite vision and breakaway speed. He emerged as the primary ball carrier this season and has quickly become one of the most feared rushers in the district. Also contributes as a kick returner.",
    accolades: [
      "2nd Team All-District RB (2025)",
      "District 8-6A Newcomer of the Year",
    ],
  },
  {
    id: "james-williams",
    name: "James Williams",
    number: "55",
    position: "Linebacker",
    positionGroup: toGroups("Defense"),
    year: "Senior",
    height: "6'1\"",
    weight: "225 lbs",
    image: "/images/players/james-williams.jpg",
    stats: "48 TKL / 6 SCK / 2 FF",
    bio: "The heart and soul of the Eagles defense, James is a two-year captain who leads by example. His combination of speed, instincts, and physicality makes him a nightmare for opposing offenses. He quarterbacks the defense from the middle linebacker position.",
    accolades: [
      "1st Team All-District LB (2024, 2025)",
      "District 8-6A Defensive MVP",
      "Team Captain (2024, 2025)",
    ],
  },
  {
    id: "tyler-martinez",
    name: "Tyler Martinez",
    number: "11",
    position: "Wide Receiver",
    positionGroup: toGroups("Offense"),
    year: "Senior",
    height: "6'0\"",
    weight: "175 lbs",
    image: "/images/players/tyler-martinez.jpg",
    stats: "52 REC / 780 YDS / 9 TD",
    bio: "Tyler is the Eagles' top deep threat with exceptional route-running ability and reliable hands. His chemistry with QB Marcus Johnson has produced some of the most memorable plays in recent program history.",
    accolades: [
      "1st Team All-District WR (2025)",
      "MaxPreps Player of the Week (Week 6)",
    ],
  },
  {
    id: "ryan-oconnor",
    name: "Ryan O'Connor",
    number: "88",
    position: "Tight End",
    positionGroup: toGroups("Offense"),
    year: "Junior",
    height: "6'4\"",
    weight: "230 lbs",
    image: "/images/players/ryan-oconnor.jpg",
    stats: "28 REC / 340 YDS / 4 TD",
    bio: "A dual-threat tight end who excels as both a blocker and pass catcher. Ryan's size and athleticism create mismatches all over the field. He has developed into one of the most versatile players on the roster.",
    accolades: ["2nd Team All-District TE (2025)", "Academic All-District"],
  },
  {
    id: "deandre-smith",
    name: "DeAndre Smith",
    number: "3",
    position: "Cornerback",
    positionGroup: toGroups("Defense"),
    year: "Senior",
    height: "5'11\"",
    weight: "170 lbs",
    image: "/images/players/deandre-smith.jpg",
    stats: "5 INT / 18 PBU / 32 TKL",
    bio: "DeAndre is a lockdown corner who rarely allows completions in his coverage. His ball-hawking skills and elite speed make him the anchor of the Eagles secondary. He also contributes as a punt returner.",
    accolades: [
      "1st Team All-District CB (2025)",
      "District 8-6A Defensive Back of the Year",
    ],
  },
  {
    id: "ethan-brooks",
    name: "Ethan Brooks",
    number: "74",
    position: "Offensive Tackle",
    positionGroup: toGroups("Offense"),
    year: "Senior",
    height: "6'5\"",
    weight: "285 lbs",
    image: "/images/players/ethan-brooks.jpg",
    stats: "0 Sacks Allowed / 92% Run Block Grade",
    bio: "The anchor of the offensive line, Ethan is a powerful and technically sound blocker who has started every game for three consecutive seasons. He sets the tone in the run game and provides elite pass protection.",
    accolades: [
      "1st Team All-District OL (2024, 2025)",
      "Team Captain (2025)",
    ],
  },
  {
    id: "kai-nakamura",
    name: "Kai Nakamura",
    number: "44",
    position: "Safety",
    positionGroup: toGroups("Defense"),
    year: "Junior",
    height: "6'0\"",
    weight: "190 lbs",
    image: "/images/players/kai-nakamura.jpg",
    stats: "3 INT / 42 TKL / 1 FR",
    bio: "A rangy and instinctive safety who patrols the back end of the defense. Kai's football IQ and tackling ability make him a reliable last line of defense. He has emerged as one of the top defensive players in the district.",
    accolades: [
      "2nd Team All-District S (2025)",
      "Academic All-District",
    ],
  },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}
