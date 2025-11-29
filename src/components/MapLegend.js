import React from 'react';

const legendItems = [
  { color: 'blue', label: 'Flood', url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
  { color: 'green', label: 'Landslide', url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" },
  { color: 'red', label: 'Trapped', url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" },
  { color: 'yellow', label: 'Other', url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" },
];

const MapLegend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
      <h4 className="font-bold text-md mb-2">Legend</h4>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center">
            <img src={item.url} alt={item.label} className="w-4 h-4 mr-2" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
