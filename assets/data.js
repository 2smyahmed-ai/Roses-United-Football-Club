/* Roses United FC — site content.
   Everything here is sourced from the club's public profiles (Instagram @rosesunitedfc, @jjrcmvp,
   Superprof listing) except where a block is marked SAMPLE. Edit this file to update the site. */
window.RU = {
  links: {
    ig: 'https://www.instagram.com/rosesunitedfc/',
    igCoach: 'https://www.instagram.com/jjrcmvp/',
    superprof: 'https://www.superprof.com/experienced-tutor-soccer-altadena-juan-offers-private-lessons-tailored-your-needs.html'
  },

  /* Match Centre. SAMPLE: replace with the live schedule from
     pasadena.civicrec.com/CA/pasadena-ca/leagues/publicTeam/1355735/226713 */
  season: {
    sample: true,
    team: 'Roses United U8',
    name: { en: 'Fall 2026', es: 'Otoño 2026' },
    league: 'Pasadena Youth League',
    games: [
      { d: '2026-09-12T09:00', opp: 'Arroyo FC', home: true, venue: 'Villa Parke', res: [3, 1] },
      { d: '2026-09-19T10:00', opp: 'Eaton Canyon SC', home: false, venue: 'Victory Park', res: [2, 2] },
      { d: '2026-09-26T09:00', opp: 'Linda Vista United', home: true, venue: 'Brookside Park', res: [4, 2] },
      { d: '2026-10-03T11:00', opp: 'Altadena Lions', home: false, venue: 'Jefferson Park', res: [1, 2] },
      { d: '2026-10-10T09:00', opp: 'Colorado Street FC', home: true, venue: 'Villa Parke', res: [5, 3] },
      { d: '2026-10-17T09:30', opp: 'Arroyo FC', home: false, venue: 'Brookside Park', res: null },
      { d: '2026-10-24T10:00', opp: 'Eaton Canyon SC', home: true, venue: 'Villa Parke', res: null },
      { d: '2026-10-31T09:00', opp: 'Linda Vista United', home: false, venue: 'Robinson Park', res: null },
      { d: '2026-11-07T11:00', opp: 'Altadena Lions', home: true, venue: 'Brookside Park', res: null },
      { d: '2026-11-14T09:00', opp: 'Colorado Street FC', home: false, venue: 'Victory Park', res: null }
    ]
  },

  venues: {
    'Villa Parke': 'Villa Parke Community Center, 363 E Villa St, Pasadena, CA 91101',
    'Brookside Park': 'Brookside Park, 360 N Arroyo Blvd, Pasadena, CA 91103',
    'Victory Park': 'Victory Park, 2575 Paloma St, Pasadena, CA 91107',
    'Jefferson Park': 'Jefferson Park, 1501 E Villa St, Pasadena, CA 91106',
    'Robinson Park': 'Robinson Park, 1081 N Fair Oaks Ave, Pasadena, CA 91103'
  },

  /* Shirt numbers seen in the club's own photos. Names stay off the public site. */
  squad: [
    { n: 2, img: 'img/match-team-huddle', cap: { en: 'Pre-game huddle', es: 'Charla antes del partido' } },
    { n: 5, img: 'img/coach-huddle', cap: { en: 'Hands in with Coach JC', es: 'Manos al centro con el Coach JC' } },
    { n: 6, img: 'img/match-strike-6', cap: { en: 'Striking through the ball', es: 'Golpeando el balón' } },
    { n: 13, img: 'img/match-team-huddle', cap: { en: 'Listening in before kickoff', es: 'Atentos antes del saque' } },
    { n: 15, img: 'img/coach-huddle', cap: { en: 'Front of the huddle', es: 'Al frente de la charla' } },
    { n: 16, img: 'img/bib-16', cap: { en: 'Bib on, ready to go', es: 'Con el peto, listo' } },
    { n: 21, img: 'img/match-team-huddle', cap: { en: 'Squad photo day', es: 'Día de foto del equipo' } },
    { n: 23, img: 'img/reel-rcfc-poster', cap: { en: 'Night out under the lights', es: 'Noche bajo las luces' } },
    { n: 30, img: 'img/match-dribble-30', cap: { en: 'Head up, ball close', es: 'Cabeza arriba, balón pegado' } }
  ],

  programs: [
    {
      id: 'private', n: 1, tone: 'rose', back: 'PRIVATE', photo: 'img/coach-1on1-s',
      t: { en: '1-on-1 coaching', es: 'Entrenamiento 1 a 1' },
      kick: { en: 'Private training', es: 'Entrenamiento privado' },
      price: '$35', per: { en: '/hr', es: '/hora' },
      p: { en: 'Sessions built around your player: their level, their goals, their pace.', es: 'Sesiones hechas a la medida de tu jugador: su nivel, sus metas, su ritmo.' },
      list: {
        en: ['First session free', '5 hours $175 · 10 hours $350', 'At the field, your park, your home, or online', 'Up to 20 miles from Altadena'],
        es: ['Primera sesión gratis', '5 horas $175 · 10 horas $350', 'En la cancha, tu parque, tu casa o en línea', 'Hasta 20 millas de Altadena']
      },
      cta: { en: 'Book a free session', es: 'Reserva una sesión gratis' }
    },
    {
      id: 'group', n: 2, tone: 'paper', back: 'GROUP', photo: 'img/train-03-s',
      t: { en: 'Small-group training', es: 'Entrenamiento en grupo' },
      kick: { en: 'Group training', es: 'En grupo' },
      price: null,
      p: { en: 'Bring a friend or a sibling. Lots of touches, lots of games, the same patient coaching.', es: 'Trae a un amigo o hermano. Muchos toques, muchos juegos y la misma paciencia.' },
      list: {
        en: ['Green bibs vs orange bibs', 'Cones, pop-up goals, real decisions', 'Great for teammates who want extra work', 'Ask for current times'],
        es: ['Petos verdes contra naranjas', 'Conos, porterías y decisiones reales', 'Ideal para compañeros que quieren más', 'Pregunta por los horarios']
      },
      cta: { en: 'Ask about groups', es: 'Pregunta por los grupos' }
    },
    {
      id: 'team', n: 3, tone: 'ink', back: 'TEAM', photo: 'img/match-team-huddle-s',
      t: { en: 'Club teams', es: 'Equipos del club' },
      kick: { en: 'Play for the Roses', es: 'Juega con los Roses' },
      price: null,
      p: { en: 'League football in Pasadena in the black kit, with teammates who become friends.', es: 'Fútbol de liga en Pasadena con la camiseta negra y compañeros que se vuelven amigos.' },
      list: {
        en: ['Boys and girls, by birth year', 'League games around Pasadena', 'Coached by Coach JC', 'Black home kit with the rose crest'],
        es: ['Niños y niñas, por año de nacimiento', 'Partidos de liga en Pasadena', 'Dirigidos por el Coach JC', 'Uniforme negro con el escudo de la rosa']
      },
      cta: { en: 'Ask about team spots', es: 'Pregunta por un lugar' }
    }
  ],

  /* "A session, drawn": what the club's photos and the In Real Time LA video show. */
  session: [
    { k: 'warm', img: 'img/train-10-s', t: { en: 'Warm-up', es: 'Calentamiento' },
      p: { en: 'Moving around the cones. Feet awake, heads up, everyone talking.', es: 'Movimiento entre conos. Pies despiertos, cabeza arriba, todos hablando.' } },
    { k: 'ball', img: 'img/coach-1on1-s', t: { en: 'Ball mastery', es: 'Dominio del balón' },
      p: { en: 'A ball for every player. Sole rolls, cuts and turns: the moves kids keep practicing at home.', es: 'Un balón por jugador. Pisadas, cortes y giros: los movimientos que practican en casa.' } },
    { k: 'game', img: 'img/train-03-s', t: { en: 'Small-sided games', es: 'Juegos reducidos' },
      p: { en: 'Green bibs against orange, pop-up goals, constant decisions. The game is the best teacher.', es: 'Petos verdes contra naranjas, porterías pequeñas, decisiones constantes. El juego es el mejor maestro.' } },
    { k: 'huddle', img: 'img/coach-huddle-s', t: { en: 'Huddle', es: 'Charla final' },
      p: { en: 'Every session ends together: what went well, what’s next, and who helped a teammate.', es: 'Cada sesión termina juntos: qué salió bien, qué sigue y quién ayudó a un compañero.' } }
  ],

  /* Superprof reviews, verbatim (first names as published). */
  reviews: [
    { n: 'Veronica', t: 'Coach Josi has been an incredible influence on our son and his team. He leads with kindness, patience, and a calm, confident presence that creates a positive environment for every child.' },
    { n: 'Cindy', t: 'We’ve seen so much growth in our daughter’s skills and confidence. She loves being part of the team and has built great relationships with her teammates.' },
    { n: 'Daisy', t: 'Nico loves working one-on-one with his coach. The individualized attention has helped him build confidence, learn new soccer tricks and skills, and improve each session.' },
    { n: 'Christian', t: 'The coaching staff is patient, encouraging, and genuinely invested in each child’s growth, not only as a soccer player but also as a person.' },
    { n: 'Nicole', t: 'The coaches really care about the kids learning the sport and were very encouraging and inviting to our kid.' },
    { n: 'Maria', t: 'Overall, it feels like a team that truly cares about its players and the community, and I really enjoyed being a part of it.' },
    { n: 'Monica', t: 'He made soccer fun for my boys and connected with each player showing his dedication to the sport and supporting players to reach new potential.' },
    { n: 'Chris', t: 'We’ve seen a lot of improvement in both of our kids, and we really appreciate the positive, supportive environment he creates. We highly recommend Roses United FC.' },
    { n: 'Jay', t: 'I love the patience and confidence coach gives the players. We have had such a positive experience.' },
    { n: 'Medelin', t: 'I appreciate that the team was equally talked to when kids either made mistakes or tried to talk down other players.' },
    { n: 'Toure', t: 'Perfect coaching and great motivation for the kids that loves soccer.' },
    { n: 'Monica', t: 'He is very patient with the kids. He explains soccer moves to the kids very well.' },
    { n: 'Daisy', t: 'My child’s confidence on and off the ball has skyrocketed because of the positive, personalized encouragement they receive every week.' }
  ],

  /* Photos and reels from @rosesunitedfc (and the In Real Time LA collab). */
  gallery: [
    { src: 'img/match-strike-6', r: '1', cat: 'match', cap: { en: 'Spring 2026 · Nº 6', es: 'Primavera 2026 · Nº 6' } },
    { src: 'img/train-mountains', r: '45', cat: 'training', cap: { en: 'Training under the San Gabriels', es: 'Entrenando frente a las San Gabriel' } },
    { src: 'img/video-irt', video: 'video/in-real-time-la.mp4', poster: 'img/reel-irt-poster', r: '45', cat: 'reels', cap: { en: 'In Real Time LA · Preseason', es: 'In Real Time LA · Pretemporada' } },
    { src: 'img/match-dribble-30', r: '1', cat: 'match', cap: { en: 'Matchday · Nº 30', es: 'Día de partido · Nº 30' } },
    { src: 'img/train-03', r: '45', cat: 'training', cap: { en: 'Green vs orange', es: 'Verdes contra naranjas' } },
    { src: 'img/coach-huddle', r: '45', cat: 'match', cap: { en: 'The huddle', es: 'La charla' } },
    { src: 'img/train-02', r: '45', cat: 'training', cap: { en: 'Eyes on the ball', es: 'Ojos en el balón' } },
    { src: 'img/video-rcfc', video: 'video/gracias-rose-city.mp4', poster: 'img/reel-rcfc-poster', r: '916', cat: 'reels', cap: { en: 'Gracias, Rose City Futbol Club', es: 'Gracias, Rose City Futbol Club' } },
    { src: 'img/match-focus', r: '1', cat: 'match', cap: { en: 'Locked in', es: 'Concentrado' } },
    { src: 'img/train-01', r: '45', cat: 'training', cap: { en: 'Knees up, ball close', es: 'Rodillas arriba, balón pegado' } },
    { src: 'img/coach-1on1', r: '45', cat: 'training', cap: { en: '1-on-1 with Coach JC', es: '1 a 1 con el Coach JC' } },
    { src: 'img/match-team-huddle', r: '1', cat: 'match', cap: { en: 'Spring 2026 · U8 squad', es: 'Primavera 2026 · Equipo U8' } },
    { src: 'img/train-05', r: '45', cat: 'training', cap: { en: 'First touch', es: 'Primer toque' } },
    { src: 'img/bib-16', r: '1', cat: 'training', cap: { en: 'Nº 16 in orange', es: 'Nº 16 de naranja' } },
    { src: 'img/train-08', r: '45', cat: 'training', cap: { en: 'Chasing it down', es: 'A por el balón' } },
    { src: 'img/kit-home', r: '1', cat: 'match', cap: { en: 'The home kit', es: 'El uniforme local' } },
    { src: 'img/train-09', r: '45', cat: 'training', cap: { en: 'Shooting practice', es: 'Práctica de tiro' } },
    { src: 'img/train-07', r: '45', cat: 'training', cap: { en: 'Pressing together', es: 'Presionando juntos' } },
    { src: 'img/train-04', r: '45', cat: 'training', cap: { en: 'Pink socks, big heart', es: 'Calcetas rosas, gran corazón' } },
    { src: 'img/train-10', r: '45', cat: 'training', cap: { en: 'End of session', es: 'Fin de la sesión' } }
  ],

  faq: [
    { q: { en: 'My child has never played. Is that okay?', es: 'Mi hijo nunca ha jugado. ¿Está bien?' },
      a: { en: 'Yes. Plenty of Roses players started as excited-but-nervous first-timers. Coach JC works at each player’s own pace, and the first session is free so your child can try it with no pressure.', es: 'Sí. Muchos jugadores de los Roses empezaron emocionados pero nerviosos. El Coach JC trabaja al ritmo de cada jugador y la primera sesión es gratis, sin presión.' } },
    { q: { en: 'How much is private training?', es: '¿Cuánto cuesta el entrenamiento privado?' },
      a: { en: '$35 per hour, or save time with a 5-hour pack ($175) or a 10-hour pack ($350). Your first session is free.', es: '$35 por hora, o un paquete de 5 horas ($175) o 10 horas ($350). La primera sesión es gratis.' } },
    { q: { en: 'Where do sessions take place?', es: '¿Dónde son las sesiones?' },
      a: { en: 'Around Pasadena, including Brookside Park by the Rose Bowl and Villa Parke. Private sessions can come to your local park or home, anywhere within 20 miles of Altadena, or happen online.', es: 'En Pasadena, incluyendo Brookside Park junto al Rose Bowl y Villa Parke. Las sesiones privadas pueden ser en tu parque o casa, hasta 20 millas de Altadena, o en línea.' } },
    { q: { en: 'Do you coach girls?', es: '¿Entrenan a niñas?' },
      a: { en: 'Absolutely. The Roses are boys and girls, and our squads and groups are mixed.', es: 'Claro. Los Roses son niños y niñas, y nuestros equipos y grupos son mixtos.' } },
    { q: { en: 'How long is a session?', es: '¿Cuánto dura una sesión?' },
      a: { en: 'About an hour: warm-up, ball work, games, and a huddle at the end.', es: 'Alrededor de una hora: calentamiento, trabajo con balón, juegos y una charla al final.' } },
    { q: { en: 'What should my player bring?', es: '¿Qué debe traer mi jugador?' },
      a: { en: 'Cleats, shin guards, a full water bottle and, if you have one, a ball (size 3 for U8 and younger, size 4 for U9 to U12). We bring the cones, bibs and goals.', es: 'Tachones, espinilleras, agua y, si tienen, un balón (talla 3 para U8 o menores, talla 4 de U9 a U12). Nosotros llevamos conos, petos y porterías.' } },
    { q: { en: 'How do team spots work?', es: '¿Cómo funcionan los lugares en los equipos?' },
      a: { en: 'Teams are built by season and birth year. Send us your player’s birth year and we’ll tell you what’s open and when the next season starts.', es: 'Los equipos se forman por temporada y año de nacimiento. Envíanos el año de tu jugador y te diremos qué hay disponible y cuándo empieza la próxima temporada.' } }
  ]
};
