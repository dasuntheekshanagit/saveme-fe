import React, { useState, useEffect, useCallback } from 'react';
import AcknowledgeModal from '../components/AcknowledgeModal';

const FoodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      // Filter for open food requests
      setRequests(data.filter(n => n.open && n.incidentType === 'food_request'));
    } catch (error) {
      console.error("Failed to fetch food requests:", error);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleModalClose = () => {
    setSelectedRequest(null);
    fetchRequests();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Active Food Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold">{request.locationDescription}</h2>
              <p className="text-sm text-gray-600">Requested at: {new Date(request.incidentTime).toLocaleString()}</p>
              <p className="mt-2"><strong>People needing food:</strong> {request.affectedPeople}</p>
              <p className="mt-2 text-gray-700">{request.comments}</p>
              <button
                onClick={() => setSelectedRequest(request)}
                className="mt-4 w-full bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700"
              >
                View Details & Respond
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedRequest && (
        <AcknowledgeModal
          notification={selectedRequest}
          closeModal={handleModalClose}
        />
      )}
    </div>
  );
};

export default FoodRequestsPage;
