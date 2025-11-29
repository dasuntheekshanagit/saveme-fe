import React, { useState, useEffect } from 'react';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center">Loading incidents...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No incidents reported yet.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">{notification.location}</h3>
            <p className="text-sm text-gray-600">Reported at: {new Date(notification.incidentTime).toLocaleString()}</p>
            <div className="mt-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-full text-white ${
                    notification.severity === 'CRITICAL' ? 'bg-red-600' :
                    notification.severity === 'HIGH' ? 'bg-orange-500' :
                    notification.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                    {notification.severity}
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-bold rounded-full text-white bg-gray-700 capitalize">
                    {notification.incidentType}
                </span>
            </div>
            <p className="mt-2">{notification.comments}</p>
            {notification.roadBlocked && <p className="font-bold text-red-500 mt-1">Road is Blocked</p>}
            <div className="text-sm mt-2">
                <p><strong>Affected:</strong> {notification.affectedPeople} people ({notification.affectedChildren} children, {notification.affectedYoung} young, {notification.affectedAdults} adults)</p>
                {notification.waterLevel > 0 && <p><strong>Water Level:</strong> {notification.waterLevel} meters</p>}
            </div>
            {notification.photos && notification.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {notification.photos.map(photo => (
                  <img key={photo.id} src={photo.url} alt="Incident" className="rounded-lg object-cover h-24 w-full" />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
