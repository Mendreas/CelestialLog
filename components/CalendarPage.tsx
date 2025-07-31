import React, { useState, useMemo } from 'react';
import { AstroEvent, Observation } from '../types';
import { ASTRO_EVENTS } from '../constants';

interface CalendarPageProps {
  observations: Observation[];
}

const DayDetailsModal: React.FC<{
  date: string;
  event: AstroEvent | undefined;
  observations: Observation[];
  onClose: () => void;
}> = ({ date, event, observations, onClose }) => {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors z-10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">{formattedDate}</h3>
            <div className="space-y-4">
                {event && (
                    <div>
                        <h4 className="font-semibold text-lg text-purple-400">Celestial Event</h4>
                        <p className="font-bold text-slate-100">{event.name}</p>
                        <p className="text-sm text-slate-300">{event.description}</p>
                    </div>
                )}
                {observations.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-lg text-cyan-400">Your Observations</h4>
                        <ul className="space-y-2 mt-2">
                        {observations.map(obs => (
                            <li key={obs.id} className="text-sm text-slate-200 p-2 bg-slate-700/50 rounded-md">
                                <span className="font-bold">{obs.objectName}</span> ({obs.type})
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};


const CalendarPage: React.FC<CalendarPageProps> = ({ observations }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const observationDates = useMemo(() => {
    const dates = new Set<string>();
    observations.forEach(obs => {
      const yyyy = obs.observationDate.slice(4, 8);
      const mm = obs.observationDate.slice(2, 4);
      const dd = obs.observationDate.slice(0, 2);
      dates.add(`${yyyy}-${mm}-${dd}`);
    });
    return dates;
  }, [observations]);

  const eventDates = useMemo(() => {
    const dateMap = new Map<string, AstroEvent>();
    ASTRO_EVENTS.forEach(event => {
        dateMap.set(event.date, event);
    });
    return dateMap;
  }, []);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fourMonthsFromNow = new Date(today);
    fourMonthsFromNow.setMonth(today.getMonth() + 4);

    return ASTRO_EVENTS.filter(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return eventDate >= today && eventDate <= fourMonthsFromNow;
    });
  }, []);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };
  
  const handleDayClick = (dateStr: string) => {
    const hasEvent = eventDates.has(dateStr);
    const hasObservation = observationDates.has(dateStr);
    if(hasEvent || hasObservation) {
        setSelectedDate(dateStr);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Celestial Calendar</h2>
        <p className="mt-2 text-lg text-slate-300">Track major events and your observation history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar View */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&lt;</button>
            <h3 className="text-xl font-semibold text-cyan-400">{currentDate.toLocaleString('default', { month: 'long' })} {year}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekDays.map(day => <div key={day} className="font-bold text-slate-400 text-sm">{day}</div>)}
            {blanks.map(i => <div key={`blank-${i}`}></div>)}
            {days.map(day => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isObservationDay = observationDates.has(dateStr);
              const event = eventDates.get(dateStr);
              
              let dayClass = "h-16 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer";
              if (isObservationDay && event) {
                dayClass += " bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold ring-2 ring-white";
              } else if (isObservationDay) {
                dayClass += " bg-cyan-600/70 hover:bg-cyan-500 text-white font-semibold";
              } else if (event) {
                dayClass += " bg-purple-600/70 hover:bg-purple-500 text-white font-semibold";
              } else {
                 dayClass += " bg-slate-700/50 hover:bg-slate-700 cursor-default";
              }

              return (
                <div key={day} className={dayClass} title={event?.name} onClick={() => handleDayClick(dateStr)}>
                  {day}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-cyan-600/70"></span>Observation</div>
            <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-purple-600/70"></span>Event</div>
             <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-cyan-500"></span>Both</div>
          </div>
        </div>
        
        {/* Upcoming Events List */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Upcoming Events</h3>
          <ul className="space-y-4">
            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
              <li key={event.name} className="border-l-4 border-purple-500 pl-4">
                <p className="font-bold text-slate-100">{event.name}</p>
                <p className="text-sm text-slate-400">{new Date(event.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-sm text-slate-300 mt-1">{event.description}</p>
              </li>
            )) : (
              <li className="text-slate-400">No major events in the next four months.</li>
            )}
          </ul>
        </div>
      </div>
      {selectedDate && (
        <DayDetailsModal
            date={selectedDate}
            event={eventDates.get(selectedDate)}
            observations={observations.filter(obs => {
                const yyyy = obs.observationDate.slice(4, 8);
                const mm = obs.observationDate.slice(2, 4);
                const dd = obs.observationDate.slice(0, 2);
                return `${yyyy}-${mm}-${dd}` === selectedDate;
            })}
            onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default CalendarPage;