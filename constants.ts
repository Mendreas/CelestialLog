import { Observation, ObjectType, DistanceUnit, Tab, AstroEvent } from './types';

export const TABS: Tab[] = [Tab.Home, Tab.Objects, Tab.Resources, Tab.Calendar, Tab.Settings];

export const OBJECT_TYPES: ObjectType[] = Object.values(ObjectType);
export const DISTANCE_UNITS: DistanceUnit[] = Object.values(DistanceUnit);

export const INITIAL_OBSERVATIONS: Observation[] = [
  {
    id: "1",
    objectName: "Andromeda Galaxy",
    type: ObjectType.Galaxy,
    observationDate: "15102023",
    location: "Atacama Desert, Chile",
    ra: "00h 42m 44s",
    dec: "+41° 16′ 9″",
    magnitude: "3.44",
    distanceValue: "2.537",
    distanceUnit: DistanceUnit.MillionLightYears,
    description: "Visible as a faint smudge to the naked eye. Stunning spiral arms visible through the telescope.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1024px-Andromeda_Galaxy_%28with_h-alpha%29.jpg",
    isFavorite: true,
  },
  {
    id: "2",
    objectName: "Jupiter",
    type: ObjectType.Planet,
    observationDate: "20112023",
    location: "Mauna Kea, Hawaii",
    ra: "01h 55m 40s",
    dec: "+11° 44′ 28″",
    magnitude: "-2.8",
    distanceValue: "4.15",
    distanceUnit: DistanceUnit.AU,
    description: "Great Red Spot was clearly visible. Four Galilean moons were aligned to one side.",
    isFavorite: true,
  }
];

export const ASTRONOMICAL_CATALOGS = ["Messier", "NGC", "Caldwell", "Solar System"];

export const ASTRONOMY_LINKS = [
    { name: "NASA", url: "https://www.nasa.gov/" },
    { name: "Sky & Telescope", url: "https://skyandtelescope.org/" },
    { name: "Heavens-Above", url: "https://www.heavens-above.com/" },
    { name: "Astronomy Picture of the Day", url: "https://apod.nasa.gov/apod/" },
];

const generateAnnualEvents = (year: number): AstroEvent[] => {
  return [
    { date: `${year}-01-04`, name: `Quadrantids Meteor Shower`, description: "Peak of the Quadrantids meteor shower." },
    { date: `${year}-03-20`, name: `March Equinox`, description: `The start of spring in the Northern Hemisphere.` },
    { date: `${year}-04-22`, name: `Lyrids Meteor Shower`, description: "Peak of the Lyrids meteor shower." },
    { date: `${year}-05-06`, name: `Eta Aquariids Meteor Shower`, description: "Peak of the Eta Aquariids, best seen from the Southern Hemisphere." },
    { date: `${year}-06-21`, name: `June Solstice`, description: `The longest day of the year in the Northern Hemisphere.` },
    { date: `${year}-07-30`, name: `Delta Aquariids Meteor Shower`, description: "Peak of the Delta Aquariids meteor shower." },
    { date: `${year}-08-12`, name: `Perseids Meteor Shower`, description: "One of the best meteor showers of the year." },
    { date: `${year}-09-22`, name: `September Equinox`, description: `The start of autumn in the Northern Hemisphere.` },
    { date: `${year}-10-21`, name: `Orionids Meteor Shower`, description: "Peak of the Orionids, produced by dust from Halley's Comet." },
    { date: `${year}-11-18`, name: `Leonids Meteor Shower`, description: "Peak of the Leonids meteor shower." },
    { date: `${year}-12-14`, name: `Geminids Meteor Shower`, description: "Often the strongest meteor shower of the year." },
    { date: `${year}-12-21`, name: `December Solstice`, description: `The shortest day of the year in the Northern Hemisphere.` },
  ];
};

const currentYear = new Date().getFullYear();
const allEvents: AstroEvent[] = [
    ...generateAnnualEvents(currentYear),
    ...generateAnnualEvents(currentYear + 1),
    // Add specific, non-recurring events for the near future
    { date: "2025-03-29", name: "Partial Solar Eclipse", description: "Visible from Europe, northern Africa, and northern Asia." },
    { date: "2025-09-21", name: "Partial Solar Eclipse", description: "Visible from southern Africa, Antarctica." },
    { date: "2026-02-17", name: "Annular Solar Eclipse", description: "Visible from Antarctica." },
    { date: "2026-08-12", name: "Total Solar Eclipse", description: "Visible from Greenland, Iceland, and Spain." },
];

// Use a Map to ensure unique events by date, then sort them chronologically.
const uniqueEvents = Array.from(new Map(allEvents.map(event => [event.date, event])).values());
uniqueEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const ASTRO_EVENTS: AstroEvent[] = uniqueEvents;