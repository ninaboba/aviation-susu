// Node script to build and verify 200 questions dataset
const fs = require('fs');

const topicMap = [
  { min: 1, max: 44, code: '081 01', name: 'Subsonic Aerodynamics' },
  { min: 45, max: 64, code: '081 02', name: 'High-Speed Aerodynamics' },
  { min: 65, max: 100, code: '081 03', name: 'Stall, Mach Tuck & Upset Prevention/Recovery' },
  { min: 101, max: 126, code: '081 04', name: 'Stability' },
  { min: 127, max: 142, code: '081 05', name: 'Control' },
  { min: 143, max: 156, code: '081 06', name: 'Limitations' },
  { min: 157, max: 170, code: '081 07', name: 'Propellers' },
  { min: 171, max: 200, code: '081 08', name: 'Flight Mechanics' },
];

function getTopicInfo(id) {
  for (const t of topicMap) {
    if (id >= t.min && id <= t.max) {
      return { topicCode: t.code, topicName: t.name };
    }
  }
  return { topicCode: '081 01', topicName: 'General' };
}

// Raw OCR question database definition
const rawQuestions = [
  {
    id: 1,
    question: "Which SI unit is used for density?",
    options: ["kg/m³", "N", "Pa", "W/m²"],
    lo: "081 01 01 01",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Density is mass per unit volume, kg/m³."
  },
  {
    id: 2,
    question: "Which quantity is a force rather than a quantity of matter?",
    options: ["Weight", "Mass", "Density", "Temperature"],
    lo: "081 01 01 02",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Weight is a force; its SI unit is newton."
  },
  {
    id: 3,
    question: "Newton's third law is most directly illustrated by which statement?",
    options: [
      "For every action there is an equal and opposite reaction",
      "Force equals mass times acceleration",
      "An object remains at rest unless acted upon",
      "Pressure varies inversely with volume"
    ],
    lo: "081 01 01 03",
    verb: "State",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Newton's third law concerns action and reaction."
  },
  {
    id: 4,
    question: "If air temperature increases while pressure remains constant, air density will generally:",
    options: ["Decrease", "Increase", "Remain unchanged", "Become zero"],
    lo: "081 01 01 06",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "At constant pressure, increasing temperature reduces density."
  },
  {
    id: 5,
    question: "Which pressure is measured by a static pressure source?",
    options: ["Ambient static pressure", "Dynamic pressure only", "Total thrust pressure", "Cabin differential pressure"],
    lo: "081 01 01 07",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Static pressure represents the thermodynamic pressure of the surrounding airflow."
  },
  {
    id: 6,
    question: "Dynamic pressure is best interpreted as an indication of:",
    options: [
      "Kinetic energy per unit volume of the airflow",
      "Aircraft weight",
      "Potential energy of altitude only",
      "Fuel energy"
    ],
    lo: "081 01 01 10",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Dynamic pressure is associated with airflow kinetic energy and depends on density and speed."
  },
  {
    id: 7,
    question: "Which pair is correctly matched?",
    options: [
      "IAS—indicated airspeed; TAS—true airspeed",
      "IAS—indicated altitude; TAS—true altitude",
      "CAS—cabin airspeed; TAS—terminal airspeed",
      "EAS—engine airspeed; IAS—indicated altitude"
    ],
    lo: "081 01 01 17",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "These are standard airspeed definitions."
  },
  {
    id: 8,
    question: "A streamline represents a line that is:",
    options: [
      "Everywhere tangent to the instantaneous airflow direction",
      "Always perpendicular to the airflow",
      "A line of constant pressure only",
      "A structural line on the wing"
    ],
    lo: "081 01 02 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "A streamline is tangent to the local velocity vector."
  },
  {
    id: 9,
    question: "A stream tube is formed by:",
    options: [
      "A bundle of streamlines enclosing a flow region",
      "A pressure vessel in the fuselage",
      "The wingtip vortex only",
      "The boundary layer alone"
    ],
    lo: "081 01 02 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Stream tubes are bounded by streamlines."
  },
  {
    id: 10,
    question: "In a converging subsonic stream tube, velocity generally:",
    options: ["Increases", "Decreases", "Becomes zero", "Is unrelated to area"],
    lo: "081 01 02 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Continuity requires higher velocity through a smaller area for steady incompressible flow."
  },
  {
    id: 11,
    question: "Compared with a converging region, a diverging subsonic stream tube generally has:",
    options: [
      "Lower velocity and higher static pressure",
      "Higher velocity and lower static pressure",
      "Zero velocity and zero pressure",
      "Constant velocity regardless of area"
    ],
    lo: "081 01 02 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "For incompressible subsonic flow, deceleration is associated with pressure recovery."
  },
  {
    id: 12,
    question: "Two-dimensional airflow analysis of an aerofoil assumes:",
    options: [
      "Flow is considered in a plane normal to the spanwise direction",
      "All three aircraft axes are simultaneously modelled",
      "Only engine flow is considered",
      "There is no pressure variation"
    ],
    lo: "081 01 01 02 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Two-dimensional aerofoil theory neglects spanwise effects."
  },
  {
    id: 13,
    question: "The resultant aerodynamic force on an aerofoil originates from:",
    options: [
      "The integrated pressure and shear distribution over the surface",
      "The aircraft weight only",
      "The engine thrust line only",
      "The centre of gravity alone"
    ],
    lo: "081 01 01 03 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Pressure and skin-friction forces combine into a resultant."
  },
  {
    id: 14,
    question: "The aerodynamic moment is a tendency of the aerodynamic force to:",
    options: [
      "Rotate the aerofoil about a reference point",
      "Increase aircraft mass",
      "Change air density",
      "Stop all airflow"
    ],
    lo: "081 01 01 03 04",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "A moment is a turning effect of a force about a reference point."
  },
  {
    id: 15,
    question: "Which factor can change the aerodynamic moment of an aerofoil?",
    options: ["Angle of attack", "Fuel colour", "Cabin lighting", "Radio frequency"],
    lo: "081 01 01 03 05",
    verb: "List",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Aerodynamic moment depends on aerodynamic state and geometry."
  },
  {
    id: 16,
    question: "A positively cambered aerofoil generally produces:",
    options: [
      "A different pitching-moment characteristic from a symmetrical aerofoil",
      "Exactly zero moment at every angle of attack",
      "No lift at positive angle of attack",
      "Only drag and no lift"
    ],
    lo: "081 01 01 03 07",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Camber changes pressure distribution and pitching moment."
  },
  {
    id: 17,
    question: "The thickness-to-chord ratio describes:",
    options: [
      "Aerofoil thickness relative to chord length",
      "Wing span relative to fuselage length",
      "Camber relative to sweep",
      "Root chord relative to tip chord"
    ],
    lo: "081 01 01 04 04",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Relative thickness is thickness divided by chord."
  },
  {
    id: 18,
    question: "Maximum thickness location identifies:",
    options: [
      "Where the aerofoil reaches its greatest thickness along the chord",
      "Where lift is always zero",
      "The wingtip position",
      "The CG position"
    ],
    lo: "081 01 01 04 05",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "It is the chordwise position of maximum section thickness."
  },
  {
    id: 19,
    question: "Nose radius primarily describes:",
    options: [
      "The curvature/size of the leading-edge nose region",
      "The wing span",
      "The tail moment arm",
      "The fuselage diameter"
    ],
    lo: "081 01 01 04 08",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Nose radius characterises leading-edge curvature."
  },
  {
    id: 20,
    question: "An asymmetrical aerofoil differs from a symmetrical aerofoil mainly in its:",
    options: ["Camber distribution", "Number of engines", "Wing span", "Landing-gear arrangement"],
    lo: "081 01 01 04 09",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Asymmetry normally refers to non-zero camber."
  },
  {
    id: 21,
    question: "Aspect ratio is related to:",
    options: [
      "Wing span squared divided by wing area",
      "Wing area divided by aircraft mass",
      "Chord divided by sweep angle",
      "Weight divided by span"
    ],
    lo: "081 01 01 05 08",
    verb: "Describe",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "For a conventional wing, AR=b²/S."
  },
  {
    id: 22,
    question: "Mean aerodynamic chord is important because it provides:",
    options: [
      "A representative chord for aerodynamic and CG calculations",
      "The propeller diameter",
      "The fuselage pressure",
      "The maximum flap speed"
    ],
    lo: "081 01 01 05 07",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "MAC is a representative aerodynamic chord."
  },
  {
    id: 23,
    question: "Angle of incidence is defined for the Part-FCL examination as the angle between:",
    options: [
      "Aircraft longitudinal axis and wing-root chord line",
      "Chord line and relative airflow",
      "Wing span and horizon",
      "Thrust line and runway"
    ],
    lo: "081 01 01 05 12",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "This is the stated Part-FCL convention."
  },
  {
    id: 24,
    question: "Upwash ahead of a lifting wing is associated with:",
    options: [
      "The wing's influence on the surrounding airflow before the wing",
      "Only engine exhaust",
      "Ground effect alone",
      "A shock wave at all speeds"
    ],
    lo: "081 01 02 01 03",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "A lifting wing changes the flow field upstream and downstream."
  },
  {
    id: 25,
    question: "As angle of attack changes, the stagnation point on an aerofoil generally:",
    options: [
      "Moves around the leading-edge region",
      "Remains fixed for all conditions",
      "Moves to the wingtip",
      "Moves to the CG"
    ],
    lo: "081 01 02 02 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The stagnation point location changes with incidence/AoA."
  },
  {
    id: 26,
    question: "At a stagnation point, static pressure is generally:",
    options: [
      "High relative to nearby accelerated flow",
      "Minimum",
      "Exactly zero",
      "Equal to dynamic pressure only"
    ],
    lo: "081 01 02 02 01",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Flow velocity is low and static pressure is relatively high."
  },
  {
    id: 27,
    question: "At a fixed angle of attack, increasing positive camber generally shifts the CL–α relationship toward:",
    options: [
      "Higher lift coefficient for the same α",
      "Lower lift at all α",
      "Zero lift at every α",
      "No change in pressure distribution"
    ],
    lo: "081 01 02 03 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Positive camber generally increases lift at a given AoA."
  },
  {
    id: 28,
    question: "The centre of pressure is the point through which:",
    options: [
      "The resultant aerodynamic force can be considered to act",
      "The aircraft weight always acts",
      "Thrust must act",
      "The static pressure is zero"
    ],
    lo: "081 01 02 04 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "CP is the point where the resultant aerodynamic force has no pitching moment about it."
  },
  {
    id: 29,
    question: "The aerodynamic centre is a point about which:",
    options: [
      "The aerodynamic pitching moment is approximately independent of angle of attack in the relevant regime",
      "Lift is always zero",
      "Drag is always zero",
      "Weight is balanced"
    ],
    lo: "081 01 02 04 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The aerodynamic centre is defined by its near-constant moment characteristic."
  },
  {
    id: 30,
    question: "Skin-friction drag is primarily caused by:",
    options: [
      "Viscous shear within the boundary layer",
      "Wing-tip vortices",
      "Weight",
      "Shock waves only"
    ],
    lo: "081 01 02 06 02",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Viscous shear produces skin-friction drag."
  },
  {
    id: 31,
    question: "Form drag is strongly influenced by:",
    options: [
      "Body shape and pressure distribution",
      "Fuel octane rating",
      "Pilot workload",
      "Radio altitude"
    ],
    lo: "081 01 02 06 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Pressure/form drag depends strongly on shape and flow separation."
  },
  {
    id: 32,
    question: "Interference drag arises where:",
    options: [
      "Flow fields around aircraft components interact",
      "The aircraft is exactly at zero AoA",
      "The engine is shut down",
      "The wing is perfectly isolated"
    ],
    lo: "081 01 05 02 03",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Junction flow interactions can increase drag."
  },
  {
    id: 33,
    question: "A wake represents a region where the flow has:",
    options: [
      "Lost momentum and been disturbed by the aircraft",
      "Become completely static everywhere",
      "Gained aircraft mass",
      "Become independent of the aircraft"
    ],
    lo: "081 01 02 06 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Drag is associated with momentum/energy loss in the wake."
  },
  {
    id: 34,
    question: "Why are aerodynamic coefficients useful?",
    options: [
      "They allow aerodynamic behaviour to be compared without carrying dimensional scale directly",
      "They eliminate all measurement errors",
      "They replace all aircraft limitations",
      "They are only used for engines"
    ],
    lo: "081 01 03 01 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Coefficients nondimensionalise aerodynamic relationships."
  },
  {
    id: 35,
    question: "For lift, increasing dynamic pressure while CL, S remain constant causes lift to:",
    options: ["Increase", "Decrease", "Remain zero", "Reverse direction"],
    lo: "081 01 03 02 01",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "L=½ρV²SCL, so lift is proportional to dynamic pressure."
  },
  {
    id: 36,
    question: "If wing area is doubled while q and CL remain constant, lift becomes:",
    options: ["Twice as large", "Half as large", "Four times as large", "Unchanged"],
    lo: "081 01 03 02 01",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Lift is directly proportional to wing area."
  },
  {
    id: 37,
    question: "If CL is doubled with q and S unchanged, lift becomes:",
    options: ["Twice as large", "Half as large", "Four times as large", "Unchanged"],
    lo: "081 01 03 02 01",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Lift is directly proportional to CL."
  },
  {
    id: 38,
    question: "For a given aerofoil, the CL–α curve reaches CLMAX at:",
    options: [
      "The maximum lift coefficient before the post-stall decrease",
      "Zero angle of attack only",
      "The maximum Mach number",
      "The minimum drag point"
    ],
    lo: "081 01 03 02 04",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "CLMAX is the peak of the lift curve."
  },
  {
    id: 39,
    question: "A negatively cambered aerofoil generally has a CL–α curve shifted so that:",
    options: [
      "Its zero-lift condition occurs at a more positive angle than a positively cambered section",
      "It always produces positive lift at zero α",
      "It cannot produce drag",
      "It has no stall"
    ],
    lo: "081 01 03 02 02",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Hard",
    explanation: "Negative camber changes the lift-curve intercept."
  },
  {
    id: 40,
    question: "The induced-drag coefficient is approximately proportional to:",
    options: [
      "CL² divided by aspect ratio",
      "CL divided by speed only",
      "Wing weight divided by area",
      "Mach number squared at all speeds"
    ],
    lo: "081 01 04 03 11",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Hard",
    explanation: "The parabolic approximation gives CDi≈kCL², with k related inversely to aspect ratio."
  },
  {
    id: 41,
    question: "At the same lift coefficient, increasing aspect ratio generally:",
    options: [
      "Reduces induced drag coefficient",
      "Increases induced drag coefficient",
      "Eliminates parasite drag",
      "Has no aerodynamic effect"
    ],
    lo: "081 01 04 03 05",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Higher aspect ratio reduces induced drag for a given CL."
  },
  {
    id: 42,
    question: "At a given IAS in level flight, increasing mass generally requires higher CL and therefore:",
    options: ["Higher induced drag", "Lower induced drag", "No change in lift requirement", "Zero drag"],
    lo: "081 01 04 03 04",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "More mass requires more lift; at the same speed this means higher CL and induced drag."
  },
  {
    id: 43,
    question: "A winglet can reduce induced drag primarily by:",
    options: [
      "Reducing the strength/effect of wingtip vortices",
      "Increasing fuselage skin friction",
      "Increasing aircraft weight deliberately",
      "Increasing shock strength"
    ],
    lo: "081 01 04 03 05",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Winglets modify the tip flow and reduce induced losses."
  },
  {
    id: 44,
    question: "The CL–CD graph is commonly called the:",
    options: ["Aerodynamic polar", "V-n diagram", "Mach envelope", "Gust chart"],
    lo: "081 01 04 03 13",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The CL–CD relationship is the aerodynamic polar."
  },
  {
    id: 45,
    question: "The local speed of sound in air is primarily governed by:",
    options: ["Temperature", "Aircraft mass", "Wing area", "Fuel quantity"],
    lo: "081 02 01 01 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Speed of sound depends strongly on absolute temperature."
  },
  {
    id: 46,
    question: "In a standard atmosphere, the speed of sound generally decreases with altitude through the troposphere because:",
    options: ["Temperature decreases", "Pressure becomes zero", "Mass disappears", "Mach number becomes zero"],
    lo: "081 02 01 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The local speed of sound follows temperature."
  },
  {
    id: 47,
    question: "At constant TAS, if local speed of sound decreases, Mach number:",
    options: ["Increases", "Decreases", "Remains zero", "Becomes equal to IAS"],
    lo: "081 02 01 02 01",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "M=TAS/a."
  },
  {
    id: 48,
    question: "During a climb at constant Mach in a region where speed of sound decreases, TAS tends to:",
    options: ["Decrease", "Increase", "Remain constant", "Become zero"],
    lo: "081 02 01 03 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "At constant M, TAS=M×a."
  },
  {
    id: 49,
    question: "During a descent at constant Mach into warmer air, TAS tends to:",
    options: ["Increase", "Decrease", "Remain constant", "Become independent of temperature"],
    lo: "081 02 01 03 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Higher temperature means higher local speed of sound and therefore higher TAS at constant M."
  },
  {
    id: 50,
    question: "When descending at constant Mach, the aircraft can approach VMO because:",
    options: [
      "TAS can increase as speed of sound increases with temperature/altitude change",
      "Weight becomes zero",
      "Drag becomes zero",
      "Mach becomes zero"
    ],
    lo: "081 02 01 03 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Constant Mach does not guarantee constant IAS/TAS or protection from VMO."
  },
  {
    id: 51,
    question: "When climbing at constant IAS, Mach can increase because:",
    options: [
      "The local speed of sound can decrease while TAS changes with altitude",
      "The aircraft loses all lift",
      "Pressure becomes constant everywhere",
      "IAS becomes Mach"
    ],
    lo: "081 02 01 03 03",
    verb: "Explain",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "At altitude, TAS/Mach relationships change and MMO can become limiting."
  },
  {
    id: 52,
    question: "Compressibility means that:",
    options: [
      "Density can change along a streamline",
      "Pressure is always constant",
      "Air has no viscosity",
      "Velocity must be zero"
    ],
    lo: "081 02 01 04 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Compressible flow permits density changes."
  },
  {
    id: 53,
    question: "For this syllabus, significant compressibility effects begin in high subsonic flow from approximately:",
    options: ["Mach 0.4", "Mach 0.04", "Mach 2.0", "Mach 10"],
    lo: "081 02 01 04 01",
    verb: "State",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The CAAT syllabus identifies high-subsonic compressibility from about M0.4."
  },
  {
    id: 54,
    question: "A normal shock wave is oriented approximately:",
    options: [
      "Normal to the local flow direction",
      "Parallel to all streamlines",
      "Only along the fuselage centreline",
      "Perpendicular to the Earth's surface"
    ],
    lo: "081 02 02 02 02",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "A normal shock is normal to the local flow."
  },
  {
    id: 55,
    question: "Across a normal shock, static pressure generally:",
    options: ["Increases", "Decreases to zero", "Remains exactly constant", "Becomes equal to Mach number"],
    lo: "081 02 02 02 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "A normal shock produces a rise in static pressure."
  },
  {
    id: 56,
    question: "As Mach number increases at positive lift, the normal shock on a transonic wing generally becomes:",
    options: ["Stronger", "Weaker to zero", "Unrelated to flow", "A subsonic wake only"],
    lo: "081 02 02 02 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher upstream Mach strengthens the shock."
  },
  {
    id: 57,
    question: "At constant Mach, increasing wing angle of attack can make a local shock:",
    options: [
      "Stronger and move in position",
      "Disappear regardless of Mach",
      "Have no effect on pressure",
      "Turn into engine thrust"
    ],
    lo: "081 02 02 02 04",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Higher loading changes local flow and shock strength/location."
  },
  {
    id: 58,
    question: "Increasing angle of attack generally tends to reduce MCRIT because:",
    options: [
      "Local flow accelerates more strongly over the wing",
      "The wing becomes thinner",
      "The aircraft loses all lift",
      "The speed of sound becomes infinite"
    ],
    lo: "081 02 03 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Hard",
    explanation: "Higher AoA increases local acceleration and can cause sonic flow at lower free-stream Mach."
  },
  {
    id: 59,
    question: "At constant α, exceeding MCRIT can cause CL to:",
    options: [
      "Change due to compressibility and shock effects",
      "Become permanently zero",
      "Become equal to weight",
      "Remain exactly unchanged in all regimes"
    ],
    lo: "081 02 03 02 01",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Transonic pressure distribution changes can alter CL."
  },
  {
    id: 60,
    question: "Wave drag is primarily associated with:",
    options: [
      "Shock-wave/compressibility effects",
      "Static pressure alone at zero speed",
      "Landing-gear weight",
      "Fuel flow"
    ],
    lo: "081 02 03 03 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Wave drag arises from compressibility and shock waves."
  },
  {
    id: 61,
    question: "Drag divergence is important because it marks a region of:",
    options: [
      "Rapid increase in drag with Mach number",
      "Zero drag",
      "Constant lift with no pressure change",
      "No compressibility"
    ],
    lo: "081 02 03 03 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Drag rise can become rapid beyond drag-divergence Mach."
  },
  {
    id: 62,
    question: "A supercritical aerofoil is designed mainly to:",
    options: [
      "Improve transonic drag characteristics and delay severe drag rise",
      "Maximise low-speed stall speed",
      "Eliminate all wave drag",
      "Remove the need for high-lift devices"
    ],
    lo: "081 02 05 02 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Supercritical sections optimise pressure distribution in transonic flight."
  },
  {
    id: 63,
    question: "Increasing wing sweep generally:",
    options: [
      "Increases MCRIT by reducing the velocity component normal to the leading edge",
      "Decreases MCRIT by increasing normal velocity",
      "Eliminates all induced drag",
      "Prevents every stall"
    ],
    lo: "081 02 05 01 01",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Sweep reduces the normal component of freestream velocity."
  },
  {
    id: 64,
    question: "A consequence of sweepback at low speed can be:",
    options: [
      "Reduced CLMAX and greater reliance on high-lift devices",
      "Higher CLMAX with no trade-off",
      "No change to stall behaviour",
      "Elimination of spanwise flow"
    ],
    lo: "081 02 05 01 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Swept wings have low-speed aerodynamic penalties including stall behaviour."
  },
  {
    id: 65,
    question: "A boundary layer is the region where:",
    options: [
      "Viscous effects cause velocity to change from the surface condition toward the external flow",
      "Mach number is always one",
      "Pressure is zero",
      "Air density is zero"
    ],
    lo: "081 03 01 01 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The boundary layer is the near-surface viscous flow region."
  },
  {
    id: 66,
    question: "Compared with a turbulent boundary layer, a laminar boundary layer is generally:",
    options: [
      "Less resistant to separation but has lower skin-friction drag",
      "More resistant to separation and higher drag",
      "Always thicker at the leading edge",
      "Independent of surface condition"
    ],
    lo: "081 03 01 01 03",
    verb: "Compare",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Laminar flow has lower skin friction but less momentum near the wall."
  },
  {
    id: 67,
    question: "The transition point is where:",
    options: [
      "The boundary layer changes from laminar toward turbulent flow",
      "The wing reaches M=1",
      "Lift becomes zero",
      "The propeller feathers"
    ],
    lo: "081 03 01 01 05",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Transition marks change in boundary-layer character."
  },
  {
    id: 68,
    question: "A turbulent boundary layer resists adverse pressure gradients better mainly because it:",
    options: [
      "Mixes higher-energy outer-flow air toward the wall",
      "Has zero friction",
      "Eliminates pressure gradients",
      "Stops all flow"
    ],
    lo: "081 03 01 01 06",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Mixing gives the near-wall flow more momentum."
  },
  {
    id: 69,
    question: "As α increases toward stall, separation generally:",
    options: [
      "Moves forward over the upper surface",
      "Moves permanently behind the aircraft",
      "Disappears",
      "Occurs only on the underside"
    ],
    lo: "081 03 01 01 08",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Increasing AoA strengthens adverse pressure gradients and moves separation forward."
  },
  {
    id: 70,
    question: "The separation point is the location where boundary-layer flow:",
    options: [
      "Can no longer remain attached to the surface",
      "Reaches maximum Mach only",
      "Becomes exactly sonic",
      "Has maximum pressure by definition"
    ],
    lo: "081 03 01 01 08",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Separation is loss of attached flow."
  },
  {
    id: 71,
    question: "αCRIT is the angle of attack at which:",
    options: [
      "The aerofoil reaches its critical/stalling condition",
      "Drag is always zero",
      "Mach is one",
      "Thrust equals weight"
    ],
    lo: "081 03 01 01 09",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Critical AoA marks onset of aerodynamic stall."
  },
  {
    id: 72,
    question: "Close to stall, continued aft control input can cause:",
    options: [
      "Further separation and loss of lift",
      "Guaranteed recovery",
      "Lower AoA",
      "Zero drag"
    ],
    lo: "081 03 01 01 14",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Increasing AoA beyond critical worsens separation."
  },
  {
    id: 73,
    question: "Natural pre-stall buffet can provide:",
    options: [
      "An aerodynamic warning of approaching separated flow",
      "A guarantee of full control authority",
      "A signal of engine failure",
      "A speed-limit certification"
    ],
    lo: "081 03 01 01 11",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Buffet can result from unsteady separated flow."
  },
  {
    id: 74,
    question: "VS0 is associated with:",
    options: [
      "Stall speed in the landing configuration",
      "Clean maximum-speed limitation",
      "Minimum control speed on the ground",
      "Maximum Mach"
    ],
    lo: "081 03 01 02 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VS0 is the stall speed/reference in landing configuration."
  },
  {
    id: 75,
    question: "VS1 is generally associated with:",
    options: [
      "Stall speed in a specified configuration other than landing",
      "Never-exceed speed",
      "Minimum power speed",
      "Best glide angle only"
    ],
    lo: "081 03 01 02 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VS1 is a stall speed in a specified configuration."
  },
  {
    id: 76,
    question: "VSR is a reference speed associated with:",
    options: [
      "A reference stall speed defined by certification criteria",
      "The maximum flap speed",
      "The critical Mach number",
      "The maximum propeller RPM"
    ],
    lo: "081 03 01 02 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VSR is a reference stall speed used in certification contexts."
  },
  {
    id: 77,
    question: "If CL is increased for a given weight and speed in the lift equation, the required lift capability:",
    options: ["Increases", "Decreases", "Becomes zero", "Becomes negative"],
    lo: "081 03 01 02 02",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Lift is proportional to CL."
  },
  {
    id: 78,
    question: "A forward CG can influence stall speed because it can require:",
    options: [
      "A different tail force and therefore a different wing lift requirement",
      "No tail force",
      "Zero lift from the wing",
      "A higher Mach number only"
    ],
    lo: "081 03 01 02 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "CG changes pitching moments and tail force, affecting wing loading/lift requirement."
  },
  {
    id: 79,
    question: "A positive thrust component along the flight path can reduce the wing lift required for:",
    options: [
      "A given aircraft weight in some flight conditions",
      "Every flight condition to zero",
      "Only a parked aircraft",
      "Only a stalled aircraft"
    ],
    lo: "081 03 01 02 03",
    verb: "Explain",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Thrust vectoring can contribute to force balance and alter required lift."
  },
  {
    id: 80,
    question: "Wing loading is:",
    options: [
      "Aircraft weight divided by wing area",
      "Wing area divided by weight",
      "Lift divided by drag",
      "Speed divided by area"
    ],
    lo: "081 03 01 02 03",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Wing loading is W/S."
  },
  {
    id: 81,
    question: "An increase in wing loading generally causes stall speed to:",
    options: ["Increase", "Decrease", "Remain unchanged", "Become zero"],
    lo: "081 03 01 02 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher W/S requires higher speed for the same CLmax."
  },
  {
    id: 82,
    question: "An accelerated stall is a stall occurring at:",
    options: [
      "A load factor greater than 1, so it can occur at an airspeed above the 1g stall speed",
      "Only the published VS0",
      "Only below 1g",
      "Only at Mach 1"
    ],
    lo: "081 03 01 02 08",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher load factor raises stall speed."
  },
  {
    id: 83,
    question: "At 2.25g, stall speed is approximately what multiple of 1g stall speed?",
    options: ["1.5", "2.25", "1.125", "0.667"],
    lo: "081 03 01 02 09",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Calculate √2.25=1.5."
  },
  {
    id: 84,
    question: "At a 60° bank angle in a level coordinated turn, load factor is approximately:",
    options: ["2 g", "1 g", "0.5 g", "4 g"],
    lo: "081 03 01 02 10",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Calculate n=1/cos60°=2."
  },
  {
    id: 85,
    question: "If 1g stall speed is 80 kt, the approximate stall speed at 2.25g is:",
    options: ["120 kt", "90 kt", "160 kt", "180 kt"],
    lo: "081 03 01 02 09",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Calculate 80×√2.25=120 kt."
  },
  {
    id: 86,
    question: "If gross mass increases by 21%, with other relevant factors unchanged, stall speed changes by approximately:",
    options: [
      "The square root of 1.21, or about 10% increase",
      "21% decrease",
      "21% increase exactly",
      "No change"
    ],
    lo: "081 03 01 02 11",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Hard",
    explanation: "Calculate Vs is proportional to √W, so √1.21=1.10."
  },
  {
    id: 87,
    question: "An elliptical wing planform is associated with a spanwise lift distribution that is:",
    options: [
      "Close to the ideal elliptical distribution",
      "Uniform at every span station",
      "Zero at the root",
      "Independent of lift"
    ],
    lo: "081 03 01 03 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The elliptical planform approximates an efficient elliptical lift distribution."
  },
  {
    id: 88,
    question: "A highly tapered wing may have a tendency for:",
    options: [
      "Outboard sections to reach critical conditions earlier unless design features control the stall progression",
      "The root always to stall first regardless of design",
      "No spanwise stall pattern",
      "No wingtip flow"
    ],
    lo: "081 03 01 03 01",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Taper affects loading and stall progression."
  },
  {
    id: 89,
    question: "Wing fences and vortilons are used primarily to:",
    options: [
      "Control spanwise flow and help maintain attached flow/aileron effectiveness",
      "Increase aircraft weight",
      "Eliminate all induced drag",
      "Increase cabin pressure"
    ],
    lo: "081 03 01 03 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "They manage spanwise flow and separation."
  },
  {
    id: 90,
    question: "A stall strip is intended to:",
    options: [
      "Promote predictable early separation in a selected wing region",
      "Increase engine thrust",
      "Prevent all stalls",
      "Reduce aircraft mass"
    ],
    lo: "081 03 01 04 04",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Stall strips deliberately modify local flow/stall progression."
  },
  {
    id: 91,
    question: "A stick shaker is an example of:",
    options: [
      "An artificial stall-warning device",
      "A primary flight control",
      "A thrust reverser",
      "A structural load limiter"
    ],
    lo: "081 03 01 04 04",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The stick shaker provides tactile stall warning."
  },
  {
    id: 92,
    question: "A stick pusher is designed to:",
    options: [
      "Automatically apply a nose-down input to reduce angle of attack when the system commands it",
      "Increase angle of attack",
      "Increase bank angle",
      "Increase engine thrust only"
    ],
    lo: "081 03 01 05 06",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "A stick pusher is intended to reduce AoA and prevent/depart a stall."
  },
  {
    id: 93,
    question: "Compared with a power-off stall, a power-on stall can have:",
    options: [
      "Different pitch/yaw characteristics because thrust and propeller effects alter the flow and moments",
      "Exactly identical dynamics",
      "No effect from thrust",
      "No possibility of yaw"
    ],
    lo: "081 03 01 05 02",
    verb: "Compare",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Power changes alter forces, moments and propeller effects."
  },
  {
    id: 94,
    question: "In a climbing turn near stall, increasing bank can be especially hazardous because:",
    options: [
      "Load factor and stall speed can increase while energy margin decreases",
      "Load factor becomes zero",
      "Stall speed decreases to zero",
      "Lift is no longer required"
    ],
    lo: "081 03 01 05 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Bank and climb can combine to increase AoA/load factor demands."
  },
  {
    id: 95,
    question: "Pitch-up on a swept wing near stall refers to:",
    options: [
      "A tendency for the nose to pitch up as spanwise flow and separation change the pitching moment",
      "A reduction in all pitching moments",
      "A guaranteed nose-down response",
      "A propeller effect only"
    ],
    lo: "081 03 01 05 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Swept-wing stall behaviour can include pitch-up tendencies."
  },
  {
    id: 96,
    question: "A T-tail aircraft can experience superstall when:",
    options: [
      "The tailplane becomes immersed in the wing wake and pitch control becomes ineffective",
      "The fin produces too much lift",
      "The landing gear is retracted",
      "The engine produces maximum thrust"
    ],
    lo: "081 03 01 05 05",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Deep/superstall involves loss of tail effectiveness in separated wake."
  },
  {
    id: 97,
    question: "One factor that can contribute to spin development is:",
    options: [
      "A sustained stalled condition with yaw asymmetry",
      "High speed with coordinated flight",
      "Zero AoA",
      "Symmetric lift with no yaw"
    ],
    lo: "081 03 01 06 02",
    verb: "List",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Spin development requires an aggravated asymmetric stall condition."
  },
  {
    id: 98,
    question: "An incipient spin is best described as:",
    options: [
      "The developing autorotative motion before a fully developed spin",
      "A normal coordinated turn",
      "A straight climb",
      "A high-speed cruise condition"
    ],
    lo: "081 03 01 06 03",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Incipient spin is the developing stage."
  },
  {
    id: 99,
    question: "With a forward CG, spin recovery/attitude characteristics generally differ because:",
    options: [
      "Greater longitudinal stability and elevator authority can influence the spin behaviour",
      "CG has no aerodynamic effect",
      "The aircraft becomes massless",
      "Yaw disappears"
    ],
    lo: "081 03 01 06 04",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "CG position changes pitch stability/control and spin characteristics."
  },
  {
    id: 100,
    question: "Heavy, clean and slow is the combination associated with:",
    options: [
      "Strong wake vortices",
      "Weakest wake vortices",
      "No wake",
      "Only propeller slipstream"
    ],
    lo: "081 03 03 01 02",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "High lift generation by a heavy, clean, slow aircraft produces strong vortices."
  },
  {
    id: 101,
    question: "Positive static stability means that after a disturbance the aircraft initially:",
    options: [
      "Develops a restoring tendency toward equilibrium",
      "Moves farther away immediately",
      "Has no response",
      "Changes mass"
    ],
    lo: "081 04 01 01 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Positive static stability is a restoring initial tendency."
  },
  {
    id: 102,
    question: "Neutral static stability means that after displacement the aircraft:",
    options: [
      "Has no initial restoring or diverging tendency",
      "Always returns rapidly",
      "Always diverges rapidly",
      "Loses lift completely"
    ],
    lo: "081 04 01 01 01",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Neutral static stability has no initial tendency."
  },
  {
    id: 103,
    question: "Greater static stability generally tends to reduce:",
    options: [
      "Manoeuvrability/control responsiveness",
      "Aircraft weight",
      "Air density",
      "Engine thrust"
    ],
    lo: "081 04 01 01 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Stability and manoeuvrability involve a design trade-off."
  },
  {
    id: 104,
    question: "A dynamically stable oscillation will generally:",
    options: [
      "Decrease in amplitude with time",
      "Increase without limit",
      "Remain exactly constant forever",
      "Have no motion"
    ],
    lo: "081 04 01 01 04",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Positive dynamic stability is damping."
  },
  {
    id: 105,
    question: "A periodic motion is one that:",
    options: [
      "Repeats its motion in a regular cycle",
      "Never changes",
      "Occurs only once",
      "Has zero frequency"
    ],
    lo: "081 04 01 01 04",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Periodic motion repeats."
  },
  {
    id: 106,
    question: "For static stability to be assessed, the aircraft must initially be in:",
    options: [
      "An equilibrium condition",
      "A maximum-speed dive",
      "A stalled spin",
      "A zero-pressure state"
    ],
    lo: "081 04 01 02 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Static stability concerns displacement from equilibrium."
  },
  {
    id: 107,
    question: "A non-zero sum of pitching moments causes:",
    options: [
      "Angular acceleration about the lateral axis",
      "No rotational effect",
      "Only a change in mass",
      "Only a change in density"
    ],
    lo: "081 04 01 04 02",
    verb: "Analyse",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Unbalanced moment produces angular acceleration."
  },
  {
    id: 108,
    question: "The stabiliser primarily provides a balancing moment about the:",
    options: ["Lateral axis", "Longitudinal axis", "Normal axis", "Wingtip axis"],
    lo: "081 04 03 01 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "The stabiliser/elevator affects pitching moment."
  },
  {
    id: 109,
    question: "If the wing CP moves aft relative to the CG, the required stabiliser balancing force may:",
    options: [
      "Change in magnitude and direction",
      "Always become zero",
      "Always equal aircraft weight",
      "Become independent of speed"
    ],
    lo: "081 04 03 01 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "CP/CG geometry determines the balancing moment."
  },
  {
    id: 110,
    question: "At higher IAS, the stabiliser force needed for a given moment generally changes because:",
    options: [
      "Dynamic pressure and tail aerodynamic force change",
      "Gravity disappears",
      "The tail loses all area",
      "CG automatically moves"
    ],
    lo: "081 04 03 01 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Tail force depends on dynamic pressure and required moment."
  },
  {
    id: 111,
    question: "A nose-up elevator deflection on a conventional aircraft generally:",
    options: [
      "Increases tail download or changes tail force to create a nose-up pitching moment",
      "Always produces nose-down pitch",
      "Only changes yaw",
      "Only changes roll"
    ],
    lo: "081 04 03 01 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Elevator changes tail force and pitching moment."
  },
  {
    id: 112,
    question: "A thrust-line change can require elevator/stabiliser adjustment because:",
    options: [
      "Engine thrust can create a pitching moment when its line does not pass through the CG",
      "Thrust has no line of action",
      "Weight changes direction",
      "Lift disappears"
    ],
    lo: "081 04 03 01 05",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Thrust offset from CG creates a moment."
  },
  {
    id: 113,
    question: "The neutral point is the CG location at which:",
    options: [
      "Longitudinal static stability is neutral",
      "The aircraft has maximum drag",
      "The aircraft cannot fly",
      "Lift is zero"
    ],
    lo: "081 04 03 03 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Neutral point is the neutral-stability CG location."
  },
  {
    id: 114,
    question: "The neutral point is primarily determined by:",
    options: [
      "Aerodynamic design of the aircraft",
      "Fuel price",
      "Pilot weight only",
      "Runway length"
    ],
    lo: "081 04 03 03 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Neutral point is an aerodynamic/design property."
  },
  {
    id: 115,
    question: "Static margin is commonly the distance between:",
    options: [
      "Neutral point and CG expressed relative to a reference such as MAC",
      "CG and runway centreline",
      "CP and wingtip only",
      "Engine and propeller"
    ],
    lo: "081 04 03 05 03",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Static margin quantifies longitudinal stability margin."
  },
  {
    id: 116,
    question: "Moving CG forward generally increases:",
    options: ["Static margin", "Mach number", "Drag coefficient to infinity", "VMC automatically"],
    lo: "081 04 03 05 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Forward CG increases the distance from neutral point."
  },
  {
    id: 117,
    question: "On a Cm–α graph, a negative slope generally indicates:",
    options: [
      "Positive longitudinal static stability",
      "Negative stability",
      "No pitching moment",
      "Zero lift"
    ],
    lo: "081 04 03 06 01",
    verb: "Interpret",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "For the usual sign convention, negative dCm/dα indicates static stability."
  },
  {
    id: 118,
    question: "Moving the CG aft generally shifts the Cm–α characteristic toward:",
    options: [
      "Reduced static stability",
      "Increased static stability",
      "No possible change",
      "Zero slope in every case"
    ],
    lo: "081 04 03 07 01",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Aft CG reduces longitudinal static margin."
  },
  {
    id: 119,
    question: "A stable stick-force-versus-speed characteristic means that increasing speed generally requires:",
    options: [
      "An appropriate change in stick force consistent with positive speed stability",
      "No force change in every aircraft",
      "Full elevator deflection",
      "Zero thrust"
    ],
    lo: "081 04 03 10 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Stable longitudinal characteristics provide restoring control-force cues."
  },
  {
    id: 120,
    question: "Stick force per g describes:",
    options: [
      "The change in control force associated with a change in load factor",
      "The force needed to move the landing gear",
      "Engine thrust per g",
      "Weight per unit wing area"
    ],
    lo: "081 04 03 12 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Stick force per g is a manoeuvring stability measure."
  },
  {
    id: 121,
    question: "If stick force per g is positive, increasing g normally requires:",
    options: [
      "Increasing pilot control force",
      "Decreasing force to zero",
      "No control force",
      "A rudder input only"
    ],
    lo: "081 04 03 12 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Positive stick-force-per-g gives increasing force with g."
  },
  {
    id: 122,
    question: "Phugoid motion primarily exchanges:",
    options: [
      "Kinetic and potential energy with relatively small α changes",
      "Yaw and roll at high frequency",
      "Fuel and oil",
      "Engine torque and cabin pressure"
    ],
    lo: "081 04 03 16 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The phugoid is a long-period speed/altitude mode."
  },
  {
    id: 123,
    question: "Short-period motion is generally more hazardous than phugoid because it involves:",
    options: [
      "Rapid changes in α and pitch attitude",
      "Only slow altitude changes",
      "No change in AoA",
      "Only fuel flow"
    ],
    lo: "081 04 03 16 02",
    verb: "Explain",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Short-period dynamics can produce rapid AoA/pitch excursions."
  },
  {
    id: 124,
    question: "Pilot-induced oscillation occurs when:",
    options: [
      "Pilot inputs and aircraft response interact to reinforce an oscillation",
      "The aircraft has no controls",
      "The engine is shut down",
      "The CG is exactly at the neutral point only"
    ],
    lo: "081 04 03 16 03",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "PIO is an unwanted pilot-aircraft control-loop interaction."
  },
  {
    id: 125,
    question: "The symbol β is commonly used for:",
    options: ["Sideslip angle", "Angle of attack", "Bank angle", "Pitch angle"],
    lo: "081 04 04 02 02",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "β denotes sideslip angle."
  },
  {
    id: 126,
    question: "For a statically directionally stable aircraft, increasing sideslip should create a restoring:",
    options: [
      "Yawing moment toward reducing the sideslip",
      "Pitching moment that increases sideslip",
      "Roll moment only with no yaw",
      "Thrust increase"
    ],
    lo: "081 04 04 04 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Directional stability provides a restoring yawing moment."
  },
  {
    id: 127,
    question: "The lateral axis runs approximately:",
    options: [
      "Wingtip to wingtip through the aircraft",
      "Nose to tail",
      "Vertically through the aircraft",
      "Along the runway only"
    ],
    lo: "081 05 01 01 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The lateral axis is approximately spanwise."
  },
  {
    id: 128,
    question: "Pitch is rotation about the:",
    options: ["Lateral axis", "Longitudinal axis", "Normal axis", "Vertical tail only"],
    lo: "081 05 01 01 03",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Pitch is rotation about the lateral axis."
  },
  {
    id: 129,
    question: "A control-surface deflection changes local camber and therefore can change:",
    options: [
      "Local lift and moment",
      "Aircraft mass",
      "Fuel density",
      "Cabin pressure"
    ],
    lo: "081 05 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Control surfaces alter local aerodynamic characteristics."
  },
  {
    id: 130,
    question: "Downwash from the wing affects tailplane angle of attack by:",
    options: [
      "Changing the local airflow direction seen by the tail",
      "Changing tail mass",
      "Stopping tail airflow",
      "Changing the runway slope"
    ],
    lo: "081 05 02 02 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Tail AoA depends on the local flow including downwash."
  },
  {
    id: 131,
    question: "A forward CG generally requires greater elevator authority because:",
    options: [
      "The pitching moment arm and trim requirement change",
      "The wing disappears",
      "Thrust becomes zero",
      "The rudder becomes ineffective"
    ],
    lo: "081 05 02 04 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Forward CG increases longitudinal control/trim demands."
  },
  {
    id: 132,
    question: "For an engine mounted above the CG, increasing thrust can create a pitching moment whose direction depends on:",
    options: [
      "The thrust-line position relative to the CG",
      "Only air temperature",
      "Only wing area",
      "Radio altitude"
    ],
    lo: "081 05 02 05 01",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Moment direction depends on thrust-line geometry."
  },
  {
    id: 133,
    question: "A rudder deflection primarily changes:",
    options: [
      "Yawing moment about the normal axis",
      "Pitch about the lateral axis",
      "Roll about the longitudinal axis only",
      "Aircraft weight"
    ],
    lo: "081 05 03 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Rudder is the primary yaw control."
  },
  {
    id: 134,
    question: "Rudder deflection can create side force on the fin and therefore:",
    options: [
      "A yawing moment about the CG",
      "Only a lift increase",
      "No aerodynamic moment",
      "A reduction in mass"
    ],
    lo: "081 05 03 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Fin side force acts with a moment arm from the CG."
  },
  {
    id: 135,
    question: "Rudder limiting on transport aircraft is used mainly to:",
    options: [
      "Prevent excessive structural loads and control forces",
      "Increase maximum speed",
      "Eliminate yaw control",
      "Increase stall speed"
    ],
    lo: "081 05 03 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Large rudder inputs can create high loads, so limits protect the aircraft."
  },
  {
    id: 136,
    question: "Roll rate is the:",
    options: [
      "Rate of change of bank angle with time",
      "Rate of change of altitude only",
      "Rate of yaw only",
      "Rate of speed change"
    ],
    lo: "081 05 04 01 06",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Roll rate describes change of bank angle per unit time."
  },
  {
    id: 137,
    question: "A factor affecting roll rate is:",
    options: [
      "Aileron effectiveness and aerodynamic damping",
      "Cabin temperature only",
      "Fuel colour",
      "Radio frequency"
    ],
    lo: "081 05 04 01 07",
    verb: "List",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Roll rate depends on control power, inertia, damping and flight condition."
  },
  {
    id: 138,
    question: "Outboard ailerons may be locked at high speed to reduce risk of:",
    options: [
      "Over-control, structural exceedance and aeroelastic effects",
      "Low-speed stall only",
      "Engine failure",
      "Cabin decompression"
    ],
    lo: "081 05 04 01 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "High-speed aileron inputs can create excessive loads/aeroelastic effects."
  },
  {
    id: 139,
    question: "A flaperon combines functions of:",
    options: ["Flap and aileron", "Rudder and elevator", "Spoiler and rudder only", "Trim and landing gear"],
    lo: "081 05 04 01 08",
    verb: "Identify",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "A flaperon combines lift augmentation and roll control."
  },
  {
    id: 140,
    question: "A roll spoiler produces roll by:",
    options: [
      "Reducing lift on one wing",
      "Increasing lift equally on both wings",
      "Changing engine thrust",
      "Changing rudder trim only"
    ],
    lo: "081 05 04 03 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Spoilers reduce lift on the selected wing."
  },
  {
    id: 141,
    question: "A Frise aileron reduces adverse yaw partly by:",
    options: [
      "Creating additional drag on the up-going aileron side",
      "Removing all drag",
      "Increasing engine thrust",
      "Moving the CG"
    ],
    lo: "081 05 04 05 01",
    verb: "Explain",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Frise geometry helps balance aileron-induced drag."
  },
  {
    id: 142,
    question: "A balance tab is intended primarily to:",
    options: [
      "Reduce pilot/control-surface force",
      "Increase aircraft weight",
      "Increase stall speed",
      "Control cabin pressure"
    ],
    lo: "081 05 06 01 04",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Balance tabs reduce control forces."
  },
  {
    id: 143,
    question: "Flutter is best classified as:",
    options: [
      "An aeroelastic self-excited oscillation",
      "A low-speed aerodynamic stall",
      "An engine compressor surge",
      "A hydraulic failure"
    ],
    lo: "081 06 01 01 01",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Flutter is an aeroelastic oscillation."
  },
  {
    id: 144,
    question: "Increasing IAS can increase flutter risk because:",
    options: [
      "Aerodynamic forces and dynamic pressure increase",
      "Air density becomes zero",
      "Mass disappears",
      "Control surfaces become frictionless"
    ],
    lo: "081 06 01 01 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher dynamic pressure can reduce flutter margin."
  },
  {
    id: 145,
    question: "Mass balance of a control surface helps flutter prevention by:",
    options: [
      "Controlling the distribution of mass relative to the hinge axis",
      "Increasing wing loading",
      "Increasing speed",
      "Removing all aerodynamic forces"
    ],
    lo: "081 06 01 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Mass balance alters inertia and aeroelastic characteristics."
  },
  {
    id: 146,
    question: "The flutter-free envelope is the region in which:",
    options: [
      "The aircraft is cleared to operate without encountering the specified flutter condition",
      "The aircraft must always be stalled",
      "The aircraft has zero drag",
      "The engine is feathered"
    ],
    lo: "081 06 01 01 03",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "It is the operating region free from the identified flutter hazard."
  },
  {
    id: 147,
    question: "VLO is associated with the maximum speed for:",
    options: [
      "Operating the landing gear",
      "Flying with flaps extended",
      "Maximum Mach",
      "Best glide"
    ],
    lo: "081 06 01 03 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VLO is landing gear operating speed."
  },
  {
    id: 148,
    question: "VLE is associated with the maximum speed for:",
    options: [
      "Flight with the landing gear extended",
      "Operating the flaps",
      "Minimum control",
      "Best range"
    ],
    lo: "081 06 01 03 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VLE is maximum speed with gear extended."
  },
  {
    id: 149,
    question: "A difference between VLO and VLE can exist because:",
    options: [
      "Gear extension/retraction loads and extended-gear flight loads may have different limits",
      "They are always identical by definition",
      "VLE is an engine speed",
      "VLO is a Mach number"
    ],
    lo: "081 06 01 03 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Operation and flight with gear down can have different structural limits."
  },
  {
    id: 150,
    question: "VFE limits:",
    options: [
      "Speed with a specified flap configuration extended",
      "Speed with gear extended only",
      "Minimum speed in a turn",
      "Maximum Mach only"
    ],
    lo: "081 06 01 03 03",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VFE is flap extension/configuration speed."
  },
  {
    id: 151,
    question: "VMO is a maximum operating:",
    options: [
      "Speed expressed as an airspeed limit",
      "Mach number only",
      "Flap angle",
      "Load factor"
    ],
    lo: "081 06 01 04 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VMO is a maximum operating speed expressed in airspeed."
  },
  {
    id: 152,
    question: "VNE is the speed that must:",
    options: ["Not be exceeded", "Always be maintained", "Only be used for take-off", "Be used for best glide"],
    lo: "081 06 01 04 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VNE means never exceed speed."
  },
  {
    id: 153,
    question: "MMO is a limiting:",
    options: ["Mach number", "Airspeed in knots only", "Load factor", "Wing area"],
    lo: "081 06 01 05 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "MMO is maximum operating Mach number."
  },
  {
    id: 154,
    question: "The manoeuvring envelope relates:",
    options: [
      "Speed to permissible load factor",
      "Altitude to fuel flow",
      "Mach to cabin pressure",
      "Engine RPM to oil pressure"
    ],
    lo: "081 06 02 01 01",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "The V-n diagram plots load factor versus speed."
  },
  {
    id: 155,
    question: "Limit load factor is:",
    options: [
      "The maximum load factor for which the structure is designed to operate within the specified limit",
      "The load factor at which the engine stops",
      "Always equal to ultimate load factor",
      "A minimum speed"
    ],
    lo: "081 06 02 01 02",
    verb: "Define",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Limit load is the specified structural operating limit."
  },
  {
    id: 156,
    question: "Ultimate load factor is important because:",
    options: [
      "Structural failure may occur if the ultimate load is exceeded",
      "It is always below the limit load",
      "It defines VFE",
      "It defines VMC"
    ],
    lo: "081 06 02 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Ultimate load is the higher structural design/failure reference."
  },
  {
    id: 157,
    question: "Propeller solidity is related to:",
    options: [
      "Blade area relative to the disc area",
      "Aircraft weight relative to wing area",
      "Engine pressure ratio",
      "Propeller diameter only"
    ],
    lo: "081 07 03 03 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Solidity is a measure of blade area relative to disc area."
  },
  {
    id: 158,
    question: "Increasing the number of propeller blades can allow:",
    options: [
      "Greater power absorption within practical diameter limits",
      "Zero drag",
      "Zero torque",
      "No change in blade loading"
    ],
    lo: "081 07 03 03 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "More blades can absorb more power without increasing diameter as much."
  },
  {
    id: 159,
    question: "A reason for restricting propeller diameter is:",
    options: [
      "Tip speed, ground clearance and structural/aerodynamic constraints",
      "Cabin pressure",
      "Fuel temperature only",
      "Radio interference"
    ],
    lo: "081 07 03 02 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Diameter is limited by several practical constraints."
  },
  {
    id: 160,
    question: "Propeller noise can be reduced by:",
    options: [
      "Managing tip speed and blade loading/design",
      "Increasing all tip speeds",
      "Increasing blade vibration",
      "Ignoring blade geometry"
    ],
    lo: "081 07 03 04 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Noise depends strongly on blade tip speed/loading and design."
  },
  {
    id: 161,
    question: "Engine/propeller torque reaction produces:",
    options: [
      "A rolling tendency opposite to propeller rotational acceleration/reaction",
      "Only yaw",
      "Only pitch",
      "No aircraft effect"
    ],
    lo: "081 07 04 01 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Torque reaction produces an opposing roll tendency."
  },
  {
    id: 162,
    question: "Contra-rotating propellers can reduce:",
    options: [
      "Net propeller torque reaction",
      "Aircraft weight",
      "Wing lift",
      "Static pressure"
    ],
    lo: "081 07 04 01 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Opposite rotating systems can cancel torque effects."
  },
  {
    id: 163,
    question: "Gyroscopic precession occurs because:",
    options: [
      "A gyroscopic moment responds to an applied moment approximately 90° later in the direction of rotation",
      "Propellers have no angular momentum",
      "The aircraft has zero inertia",
      "Lift becomes zero"
    ],
    lo: "081 07 04 02 01",
    verb: "Describe",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Gyroscopic precession is a property of rotating masses."
  },
  {
    id: 164,
    question: "A rapid pitch change on a high-power propeller aircraft can create:",
    options: [
      "A gyroscopic pitching/yawing effect depending on propeller rotation direction",
      "Only a drag reduction",
      "No moment",
      "Only cabin pressure change"
    ],
    lo: "081 07 04 02 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Gyroscopic effects depend on rotation direction and aircraft manoeuvre."
  },
  {
    id: 165,
    question: "Propeller slipstream can cause:",
    options: [
      "Local changes in airflow and asymmetric effects over the tail/wing",
      "Only a reduction in weight",
      "Zero yaw",
      "No effect beyond the propeller"
    ],
    lo: "081 07 04 03 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Rotating slipstream alters local flow."
  },
  {
    id: 166,
    question: "P-factor is associated with:",
    options: [
      "Asymmetric blade loading at high angle of attack/power",
      "Uniform blade loading at all conditions",
      "Gear extension",
      "Wingtip vortices only"
    ],
    lo: "081 07 04 04 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Asymmetric blade effect is commonly called P-factor."
  },
  {
    id: 167,
    question: "During take-off, propeller effects can alter controllability because:",
    options: [
      "Torque, slipstream and asymmetric blade effects combine with low speed/high power",
      "The aircraft has no aerodynamic forces",
      "The rudder is never effective",
      "Weight becomes zero"
    ],
    lo: "081 07 04 05 01",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "High power and low speed amplify propeller effects."
  },
  {
    id: 168,
    question: "During go-around, increasing power can make propeller effects more pronounced because:",
    options: [
      "Higher power increases torque/slipstream/P-factor effects",
      "Power reduces all aerodynamic moments",
      "The aircraft becomes weightless",
      "The propeller stops rotating"
    ],
    lo: "081 07 04 05 02",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Power changes can strongly change propeller-induced moments."
  },
  {
    id: 169,
    question: "A crosswind during a propeller-aircraft go-around can affect controllability because:",
    options: [
      "It changes the relative airflow and required directional control while propeller effects are present",
      "It removes all yaw moments",
      "It reduces aircraft mass",
      "It guarantees coordinated flight"
    ],
    lo: "081 07 04 05 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Crosswind changes the airflow/side-force and control requirement."
  },
  {
    id: 170,
    question: "High flap setting during a go-around can interact with propeller effects because:",
    options: [
      "It changes lift, drag, pitch attitude and available control margins",
      "It eliminates drag",
      "It eliminates asymmetric thrust",
      "It fixes VMC"
    ],
    lo: "081 07 04 05 03",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Configuration changes alter the aircraft's aerodynamic/control state."
  },
  {
    id: 171,
    question: "In steady level flight, the lift vector is primarily:",
    options: [
      "Vertical and equal to weight in the simplified force balance",
      "Horizontal and equal to drag",
      "Zero",
      "Equal to thrust"
    ],
    lo: "081 08 01 01 01",
    verb: "Describe",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Steady level flight has L=W in the basic balance."
  },
  {
    id: 172,
    question: "The four basic external forces are:",
    options: [
      "Lift, weight, thrust and drag",
      "Lift, torque, power and pressure",
      "Weight, density, Mach and drag",
      "Thrust, fuel, gravity and temperature"
    ],
    lo: "081 08 01 01 02",
    verb: "List",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "These are the four fundamental forces."
  },
  {
    id: 173,
    question: "The tailplane contributes to equilibrium mainly by:",
    options: [
      "Providing a balancing pitching moment/force",
      "Producing engine thrust",
      "Controlling yaw only",
      "Changing aircraft mass"
    ],
    lo: "081 08 01 01 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Tail force balances pitching moments."
  },
  {
    id: 174,
    question: "Flight-path angle γ is the angle between:",
    options: [
      "The flight path and the horizontal reference",
      "The chord and airflow",
      "The wing and fuselage",
      "The propeller and engine"
    ],
    lo: "081 08 01 02 01",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "γ defines the flight-path inclination."
  },
  {
    id: 175,
    question: "In a steady climb, the component of weight along the flight path acts:",
    options: [
      "Opposite the direction of motion",
      "In the same direction as thrust",
      "Perpendicular to the flight path",
      "Vertically upward along the path"
    ],
    lo: "081 08 01 02 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Weight has a component opposing climb motion."
  },
  {
    id: 176,
    question: "For a steady climb, the parallel force balance is:",
    options: [
      "T = D + W sin γ",
      "T = D − W sin γ",
      "L = W sin γ",
      "T = W + L"
    ],
    lo: "081 08 01 02 04",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Thrust balances drag plus the downhill component of weight."
  },
  {
    id: 177,
    question: "For a steady climb, lift is approximately:",
    options: [
      "L = W cos γ",
      "L = W sin γ",
      "L = T + D",
      "L = W/cos γ"
    ],
    lo: "081 08 01 02 04",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Perpendicular force balance gives L=W cosγ."
  },
  {
    id: 178,
    question: "In a steady climb, thrust is greater than drag because:",
    options: [
      "Thrust must also overcome the component of weight along the flight path",
      "Lift is zero",
      "Weight disappears",
      "Drag becomes negative"
    ],
    lo: "081 08 01 02 05",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The additional thrust component supports climbing."
  },
  {
    id: 179,
    question: "In a steady descent, the component of weight along the flight path assists motion, so:",
    options: [
      "Thrust can be less than drag",
      "Thrust must exceed drag",
      "Lift is zero",
      "Weight is zero"
    ],
    lo: "081 08 01 03 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Weight contributes a forward component in descent."
  },
  {
    id: 180,
    question: "For a steady descent at flight-path angle γ, the parallel force balance is:",
    options: [
      "T = D − W sin γ",
      "T = D + W sin γ",
      "L = W sin γ",
      "D = T + W"
    ],
    lo: "081 08 01 03 02",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "The downhill weight component reduces required thrust."
  },
  {
    id: 181,
    question: "For a steady descent, lift is approximately:",
    options: [
      "L = W cos γ",
      "L = W sin γ",
      "L = W/cos γ",
      "L = T + D"
    ],
    lo: "081 08 01 03 02",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Perpendicular force balance gives L=W cosγ."
  },
  {
    id: 182,
    question: "In a glide with negligible thrust, drag is balanced by:",
    options: [
      "The component of weight along the flight path",
      "Lift",
      "Thrust",
      "The vertical component of lift only"
    ],
    lo: "081 08 01 04 02",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "In a glide, gravity supplies the force component balancing drag."
  },
  {
    id: 183,
    question: "For a steady glide, the parallel force relationship is:",
    options: [
      "D = W sin γ",
      "D = W cos γ",
      "L = W sin γ",
      "T = W sin γ"
    ],
    lo: "081 08 01 04 02",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "The component of weight along the glide path balances drag."
  },
  {
    id: 184,
    question: "For a steady glide, the perpendicular force relationship is:",
    options: [
      "L = W cos γ",
      "L = W sin γ",
      "D = W cos γ",
      "T = W cos γ"
    ],
    lo: "081 08 01 04 02",
    verb: "Apply",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "The perpendicular component of weight is balanced by lift."
  },
  {
    id: 185,
    question: "If L/D increases while height loss is fixed in still air, glide range generally:",
    options: ["Increases", "Decreases", "Becomes zero", "Is unrelated to L/D"],
    lo: "081 08 01 04 03",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher L/D gives a shallower glide and greater range."
  },
  {
    id: 186,
    question: "For a simple small-angle glide with height 3000 ft and L/D=15, approximate still-air horizontal range is:",
    options: ["45,000 ft", "200 ft", "3,015 ft", "15,000 ft"],
    lo: "081 08 01 04 03",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "For small angles, range ≈ height×L/D."
  },
  {
    id: 187,
    question: "VMD is the speed associated with:",
    options: [
      "Minimum drag",
      "Minimum power",
      "Maximum Mach",
      "Maximum load factor"
    ],
    lo: "081 08 01 04 04",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VMD is speed for minimum drag."
  },
  {
    id: 188,
    question: "At VMD, α is generally:",
    options: [
      "Higher than at a faster speed because more CL is required",
      "Lower than at all speeds",
      "Exactly zero",
      "Equal to critical Mach"
    ],
    lo: "081 08 01 04 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Lower speed in level flight requires higher CL and AoA."
  },
  {
    id: 189,
    question: "A headwind during a glide generally causes ground range to:",
    options: [
      "Decrease for a given airspeed and height",
      "Increase",
      "Remain exactly unchanged",
      "Become infinite"
    ],
    lo: "081 08 01 04 05",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Headwind reduces groundspeed."
  },
  {
    id: 190,
    question: "A tailwind during a glide generally causes ground range to:",
    options: [
      "Increase for a given airspeed and height",
      "Decrease to zero",
      "Remain unchanged",
      "Reverse direction"
    ],
    lo: "081 08 01 04 05",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Medium",
    explanation: "Tailwind increases groundspeed."
  },
  {
    id: 191,
    question: "At the same airspeed, increasing mass generally affects glide performance by:",
    options: [
      "Changing the lift coefficient and required flight condition, while the glide angle for a given configuration is primarily governed by L/D",
      "Making L/D infinite",
      "Eliminating drag",
      "Making the aircraft hover"
    ],
    lo: "081 08 01 04 06",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Mass changes speed/energy/time characteristics; glide angle depends primarily on L/D."
  },
  {
    id: 192,
    question: "VMP is the speed for:",
    options: [
      "Minimum power required",
      "Minimum drag",
      "Maximum Mach",
      "Maximum lift coefficient"
    ],
    lo: "081 08 01 04 09",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "VMP is minimum-power speed."
  },
  {
    id: 193,
    question: "Minimum rate of descent in a glide occurs approximately at:",
    options: ["VMP", "VMD", "VNE", "VMC"],
    lo: "081 08 01 04 09",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Minimum power required corresponds to minimum sink in the idealised glide."
  },
  {
    id: 194,
    question: "A pilot might choose a speed different from still-air optimum glide speed because:",
    options: [
      "Wind, speed stability, or operational priorities change the optimum",
      "The laws of aerodynamics stop applying",
      "Lift becomes zero",
      "Drag disappears"
    ],
    lo: "081 08 01 04 10",
    verb: "Analyse",
    cognitive: "ANALYSE",
    difficulty: "Hard",
    explanation: "Operational conditions can favour different speeds."
  },
  {
    id: 195,
    question: "In a coordinated level turn, the vertical component of lift must:",
    options: ["Balance weight", "Balance drag", "Equal thrust", "Become zero"],
    lo: "081 08 01 05 01",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Easy",
    explanation: "Vertical lift component supports weight."
  },
  {
    id: 196,
    question: "The relationship tanφ=V²/(gR) shows that for fixed bank angle, increasing TAS causes turn radius to:",
    options: ["Increase", "Decrease", "Remain fixed", "Become zero"],
    lo: "081 08 01 05 05",
    verb: "Calculate",
    cognitive: "APPLY",
    difficulty: "Medium",
    explanation: "Calculate R=V²/(g tanφ)."
  },
  {
    id: 197,
    question: "For a given TAS and turn radius, bank angle is independent of:",
    options: ["Aircraft mass", "Gravity", "TAS", "Turn radius"],
    lo: "081 08 01 05 04",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "The basic relation contains V, g and R, not mass."
  },
  {
    id: 198,
    question: "Angular velocity in a turn is:",
    options: [
      "Rate of change of heading angle with time",
      "Rate of climb",
      "Rate of roll only",
      "Rate of descent"
    ],
    lo: "081 08 01 05 08",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Angular velocity is angular displacement per unit time."
  },
  {
    id: 199,
    question: "A rate-1 turn is a standardised:",
    options: [
      "Rate of turn used for instrument/flight references",
      "Stall speed",
      "Climb gradient",
      "Propeller speed"
    ],
    lo: "081 08 01 05 09",
    verb: "Define",
    cognitive: "KNOW",
    difficulty: "Easy",
    explanation: "Rate-1 is a standard rate of turn."
  },
  {
    id: 200,
    question: "For the same bank angle, increasing TAS generally causes rate of turn to:",
    options: ["Decrease", "Increase", "Remain unchanged", "Become infinite"],
    lo: "081 08 01 05 10",
    verb: "Explain",
    cognitive: "UNDERSTAND",
    difficulty: "Medium",
    explanation: "Higher speed means lower angular rate for the same bank."
  }
];

// Enrich with topic metadata and correct answer text
const formattedQuestions = rawQuestions.map(q => {
  const topicInfo = getTopicInfo(q.id);
  return {
    id: q.id,
    topic: topicInfo.topicCode,
    topicName: topicInfo.topicName,
    question: q.question,
    options: q.options,
    correct: q.options[0], // In the source answer key, Option A is the correct answer
    LO: q.lo,
    difficulty: q.difficulty,
    cognitive: q.cognitive,
    verb: q.verb,
    explanation: q.explanation
  };
});

console.log(`Loaded ${formattedQuestions.length} questions.`);
fs.writeFileSync('questions_data.json', JSON.stringify(formattedQuestions, null, 2), 'utf-8');
console.log('Saved questions_data.json successfully.');
