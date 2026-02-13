export interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  category: string;
  body: string[];
}

export const articles: Article[] = [
  {
    slug: "eagles-clinch-third-straight-victory",
    title: "Eagles Clinch Third Straight Victory with Dominant Performance",
    date: "Sep 27, 2025",
    author: "Coach Rivera",
    excerpt:
      "A commanding 42-7 win over the Hamilton Hawks puts the Eagles at 3-1 heading into the second half of the season.",
    image: "/images/news-1.jpg",
    category: "Game Recap",
    body: [
      "The Westfield Eagles delivered their most complete game of the season Friday night, rolling past the Hamilton Hawks 42-7 in front of a packed home crowd at Eagle Stadium.",
      "Quarterback Marcus Johnson was electric from the opening drive, connecting on 18 of 22 passes for 287 yards and three touchdowns. His favorite target, Ryan O'Connor, hauled in seven catches for 142 yards and two scores, including a spectacular one-handed grab in the end zone that brought the crowd to its feet.",
      "The ground game was equally dominant. Running back David Chen gashed the Hawks defense for 156 yards on 19 carries, breaking off touchdown runs of 34 and 52 yards. His ability to find cutback lanes kept Hamilton's defense on its heels all night.",
      "Defensively, the Eagles were suffocating. Linebacker James Williams led the charge with 11 tackles, two sacks, and a forced fumble that set up a short-field touchdown in the third quarter. The defense held Hamilton to just 143 total yards and forced four turnovers.",
      "\"This is the standard we need to play at every week,\" said Head Coach Rivera after the game. \"The kids came prepared, executed the game plan, and played with tremendous energy from start to finish.\"",
      "The victory improves Westfield to 3-1 on the season and sets up a critical matchup next Friday against the undefeated Riverside Titans. Kickoff is set for 7 PM at Riverside Stadium.",
    ],
  },
  {
    slug: "fall-camp-wrap-up-new-faces",
    title: "Fall Camp Wrap-Up: New Faces Ready to Contribute",
    date: "Aug 20, 2025",
    author: "Sports Desk",
    excerpt:
      "Head Coach Rivera highlights key newcomers who impressed during fall training camp and are poised for breakout seasons.",
    image: "/images/news-2.jpg",
    category: "Team News",
    body: [
      "As fall camp wraps up and the regular season approaches, the Westfield Eagles coaching staff is buzzing about a talented group of newcomers who have earned significant roles heading into the 2025 campaign.",
      "Perhaps the most exciting addition is sophomore wide receiver DeAndre Smith, who transferred in from Central High over the summer. At 6'1\" with blazing 4.4 speed, Smith has been virtually uncoverable in practice. \"DeAndre is a special talent,\" said offensive coordinator Mike Thompson. \"He stretches the field in a way we haven't had in recent years.\"",
      "On the defensive side of the ball, junior safety Kai Nakamura has turned heads with his instincts and ball-hawking ability. Nakamura recorded three interceptions during the team's scrimmage sessions and has solidified the starting free safety spot.",
      "The offensive line also gets a boost with the arrival of 6'4\", 285-pound junior Ethan Brooks, who projects as the starting right tackle. Brooks brings a nasty streak and exceptional footwork that should help anchor a line tasked with protecting Marcus Johnson.",
      "\"Every year you need young guys to step up,\" said Head Coach Rivera. \"This group has shown maturity beyond their years. They've earned the right to compete for playing time, and I fully expect them to make an impact from Week 1.\"",
      "The Eagles open their season on September 5th at home against the Northside Bears. Season tickets are still available through the school's athletic department.",
    ],
  },
  {
    slug: "homecoming-game-october-17",
    title: "Homecoming Game Set for October 17 Against Rival Central",
    date: "Sep 15, 2025",
    author: "Athletic Department",
    excerpt:
      "Mark your calendars for the biggest game of the year. Pre-game festivities start at 4 PM with kickoff at 7 PM.",
    image: "/images/news-3.jpg",
    category: "Events",
    body: [
      "The Westfield Eagles Athletic Department is thrilled to announce that this year's Homecoming game will take place on Friday, October 17th, as the Eagles host their crosstown rivals, the Central High Bulldogs.",
      "This year's Homecoming promises to be the biggest yet, with a full slate of festivities planned for students, alumni, and the entire Westfield community. Pre-game celebrations will kick off at 4 PM in the Eagle Stadium parking lot with a tailgate party featuring food trucks, live music from the Westfield Marching Band, and games for all ages.",
      "The Homecoming Court presentation will take place at 6:30 PM on the field, followed by the national anthem and kickoff at 7 PM. Halftime will feature the crowning of the Homecoming King and Queen, along with a special performance by the award-winning Westfield Dance Team.",
      "The Eagles-Bulldogs rivalry is one of the oldest in the district, dating back to 1958. Last year's contest was an instant classic, with Westfield pulling out a dramatic 28-24 victory on a last-minute touchdown pass from Marcus Johnson to Tyler Martinez.",
      "\"Homecoming week is about so much more than football,\" said Athletic Director Sarah Mitchell. \"It's about bringing our community together and celebrating what makes Westfield special. We want every student, parent, and alumnus to feel welcome.\"",
      "Tickets for the Homecoming game are $8 for adults and $5 for students with ID. They can be purchased online through the school website or at the gate on game day. The Eagles encourage fans to wear gold for a \"Gold Out\" theme.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
