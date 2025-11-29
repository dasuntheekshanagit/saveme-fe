import React, { useState } from 'react';

const HighSeverityPanel = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(true);

  const highSeverityAlerts = notifications.filter(
    (n) => n.severity === 'CRITICAL' || n.severity === 'HIGH'
  );

  return (
    <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg w-80 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-200 p-2 font-bold text-left"
      >
        High Severity Alerts ({highSeverityAlerts.length})
      </button>
      {isOpen && (
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="space-y-3">
            {highSeverityAlerts.length > 0 ? (
              highSeverityAlerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-red-500 pl-3">
                  <p className="font-semibold">{alert.locationDescription}</p>
                  <p className="text-sm text-gray-600">{alert.comments}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No high severity alerts at the moment.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HighSeverityPanel;
