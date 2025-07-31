import React from 'react';
import { ASTRONOMY_LINKS } from '../constants';

const MoonPhase: React.FC = () => {
  // In a real app, this would be dynamic. Here we use a static representation.
  const phaseName = "Waning Gibbous";
  return (
    <div className="text-center">
      <div className="text-5xl mb-2">🌖</div>
      <h4 className="font-semibold text-slate-200">{phaseName}</h4>
      <p className="text-sm text-slate-400">Current Moon Phase</p>
    </div>
  );
};


const ResourcesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Resources</h2>
        <p className="mt-2 text-lg text-slate-300">Tools and links for the avid astronomer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Moon & Links */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400 text-center">Moon Status</h3>
            <MoonPhase />
          </div>
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Useful Links</h3>
            <ul className="space-y-3">
              {ASTRONOMY_LINKS.map(link => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-200 hover:text-cyan-400 transition-colors duration-200 flex items-center">
                    {link.name}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Meteoblue Widgets */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Astronomical Seeing Forecast</h3>
            <p className="text-slate-400 mb-4 text-sm">Provided by Meteoblue. Location set to a default. A real app could make this dynamic.</p>
            <iframe 
                src="https://www.meteoblue.com/en/weather/widget/seeing/new-york_united-states_5128581?geoloc=fixed&days=7&tempunit=FAHRENHEIT&windunit=MILE_PER_HOUR&turbulence=2&highcloud=0&lowcloud=0&seeing=0&features=Astro,Clouds&bg=dark"  
                frameBorder="0" 
                scrolling="no" 
                allowTransparency={true}
                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox" 
                className="w-full h-[370px]"
                title="Meteoblue Seeing Widget"
            ></iframe>
          </div>
           <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-cyan-400">Cloud Cover Map</h3>
            <iframe 
                src="https://www.meteoblue.com/en/weather/widget/map/new-york_united-states_5128581?geoloc=fixed&map_type=cloud" 
                frameBorder="0" 
                scrolling="no" 
                allowTransparency={true} 
                sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox" 
                className="w-full h-[450px]"
                title="Meteoblue Cloud Map"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
