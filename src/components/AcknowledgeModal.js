import React, { useState } from 'react';
import api from '../api/api';

const AcknowledgeModal = ({ notification, closeModal }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!notification) return null;

  const handleVote = async (voteType) => {
    try {
      await api.post(`/api/notifications/${notification.id}/${voteType}`);
      alert('Vote submitted!');
      closeModal();
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit vote.');
    }
  };

  const handleAcknowledge = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number.');
      return;
    }
    try {
      await api.post(`/api/notifications/${notification.id}/acknowledge`, { phoneNumber });
      alert('You have acknowledged this alert.');
      setPhoneNumber('');
      closeModal();
    } catch (error) {
      console.error('Error acknowledging:', error);
      alert('Failed to acknowledge.');
    }
  };

  const handleCloseAlert = async () => {
    try {
      await api.post(`/api/notifications/${notification.id}/close`);
      alert('Alert closed successfully.');
      closeModal();
    } catch (error) {
      console.error('Error closing alert:', error);
      alert('An error occurred while closing the alert.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{notification.locationDescription}</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        
        <div className="space-y-4">
            {/* Details Section */}
            <div>
                <p><span className="font-semibold">Severity:</span> {notification.severity}</p>
                <p><span className="font-semibold">Status:</span> {notification.open ? 'Open' : 'Closed'}</p>
                <p><span className="font-semibold">Comments:</span> {notification.comments}</p>
                <p><span className="font-semibold">Reported By:</span> {notification.reporterName}</p>
                {notification.reporterContacts && notification.reporterContacts.length > 0 && (
                    <p><span className="font-semibold">Reporter Contacts:</span> {notification.reporterContacts.map(c => c.phoneNumber).join(', ')}</p>
                )}
                <p><span className="font-semibold">True Reports:</span> {notification.trueReports}</p>
                <p><span className="font-semibold">Spam Reports:</span> {notification.spamReports}</p>
            </div>

            {/* Responders Section */}
            {notification.acknowledgements && notification.acknowledgements.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2">Responded:</h3>
                    <div className="flex flex-wrap gap-2">
                        {notification.acknowledgements.map(ack => (
                            <span key={ack.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">{ack.phoneNumber}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Photos Section */}
            {notification.photos && notification.photos.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Photos:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {notification.photos.map(photo => (
                    <img key={photo.id} src={`${process.env.REACT_APP_BACKEND_URL}${photo.url}`} alt="Incident" className="rounded-lg object-cover w-full h-32" />
                  ))}
                </div>
              </div>
            )}

            {/* Actions Section */}
            {notification.open && (
                <div className="space-y-4 pt-4 border-t">
                    <div>
                        <h3 className="font-semibold mb-2">Is this report accurate?</h3>
                        <div className="flex space-x-4">
                            <button onClick={() => handleVote('vote-true')} className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600">Report as True</button>
                            <button onClick={() => handleVote('vote-spam')} className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600">Report as Spam</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Acknowledge / Respond</h3>
                        <div className="flex space-x-2">
                            <input 
                                type="text" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number"
                                className="flex-grow p-2 border rounded"
                            />
                            <button onClick={handleAcknowledge} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Acknowledge</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Close this Alert</h3>
                        <button onClick={handleCloseAlert} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Mark as Resolved</button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AcknowledgeModal;
