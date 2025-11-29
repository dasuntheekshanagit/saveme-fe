import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AcknowledgeModal from '../components/AcknowledgeModal';
import SummaryHighlights from '../components/SummaryHighlights';
import FilterBar from '../components/FilterBar';

const AlertsPage = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filters, setFilters] = useState({
    severity: 'HIGH', // Default to show high and critical severity alerts
    type: '',
    city: ''
  });

  const fetchNotifications = useCallback(async () => {
    try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setAllNotifications(data.filter(n => n.open));
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(n => {
      const severityMatch = filters.severity ? (n.severity === filters.severity || (filters.severity === 'HIGH' && n.severity === 'CRITICAL')) : true;
      const typeMatch = filters.type ? n.incidentType === filters.type : true;
      const cityMatch = filters.city ? n.locationDescription.toLowerCase().includes(filters.city.toLowerCase()) : true;
      return severityMatch && typeMatch && cityMatch;
    });
  }, [allNotifications, filters]);

  const handleModalClose = () => {
    setSelectedNotification(null);
    fetchNotifications();
  };

  return (
    <div className="container mx-auto p-4">
      <SummaryHighlights />
      <h1 className="text-3xl font-bold mb-6">Active Incident Alerts</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {notification.photos && notification.photos.length > 0 && (
                <img src={notification.photos[0].url} alt="Incident" className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold">{notification.locationDescription}</h2>
                <p className="text-sm text-gray-600">{new Date(notification.incidentTime).toLocaleString()}</p>
                {notification.reporterContacts && notification.reporterContacts.length > 0 && (
                    <p className="text-sm text-gray-500">by {notification.reporterName} ({notification.reporterContacts[0].phoneNumber})</p>
                )}
                <div className="mt-2 flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${
                      notification.severity === 'CRITICAL' ? 'bg-red-600' :
                      notification.severity === 'HIGH' ? 'bg-orange-500' :
                      notification.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                      {notification.severity}
                  </span>
                  <div className="flex space-x-2 text-sm">
                      <span className="text-green-600 font-semibold">True: {notification.trueReports}</span>
                      <span className="text-red-600 font-semibold">Spam: {notification.spamReports}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{notification.comments}</p>
                <button
                  onClick={() => setSelectedNotification(notification)}
                  className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
                >
                  View Details & Acknowledge
                </button>
              </div>
            </div>
          ))
        ) : (
            <p className="text-center col-span-full text-gray-500">No alerts match the current filters.</p>
        )}
      </div>
      {selectedNotification && (
        <AcknowledgeModal
          notification={selectedNotification}
          closeModal={handleModalClose}
        />
      )}
    </div>
  );
};

export default AlertsPage;
