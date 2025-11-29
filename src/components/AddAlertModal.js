import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AddAlertModal = ({ closeModal, locationFromMap }) => {
  const [formData, setFormData] = useState({
    reporterName: '',
    telephoneNumbers: '',
    latitude: '',
    longitude: '',
    severity: 'LOW',
    isRoadBlocked: false,
    location: '',
    affectedPeople: '',
    affectedChildren: '',
    affectedInjured: '',
    affectedAdults: '',
    comments: '',
    waterLevel: '',
    type: 'other',
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (locationFromMap) {
      setFormData(prev => ({
        ...prev,
        latitude: locationFromMap.lat,
        longitude: locationFromMap.lng,
      }));
    }
  }, [locationFromMap]);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notificationData = {
      ...formData,
      telephoneNumbers: formData.telephoneNumbers.split(',').map(s => s.trim()),
    };

    const submission = new FormData();
    submission.append('notification', new Blob([JSON.stringify(notificationData)], { type: 'application/json' }));
    photos.forEach(photo => {
      submission.append('photos', photo);
    });

    try {
      await api.postMultipart('/api/notifications', submission);
      alert('Notification submitted successfully!');
      closeModal();
    } catch (error) {
      console.error('Error submitting notification:', error);
      alert('An error occurred while submitting the notification.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Report a New Incident</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="w-full p-2 border rounded" required />
            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="w-full p-2 border rounded" required />
          </div>
          <button type="button" onClick={handleUseMyLocation} className="w-full p-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Use My Location</button>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location Description (e.g., Near Galle Face)" className="w-full p-2 border rounded" />
          
          <div className="grid grid-cols-2 gap-4">
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="other">Other</option>
                <option value="flood">Flood</option>
                <option value="landslide">Landslide</option>
                <option value="traped">Trapped</option>
            </select>
            <select name="severity" value={formData.severity} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded" required />
          <input type="text" name="telephoneNumbers" value={formData.telephoneNumbers} onChange={handleChange} placeholder="Contact Numbers (comma-separated)" className="w-full p-2 border rounded" />
          
          {formData.type === 'flood' && (
            <input type="number" step="any" name="waterLevel" value={formData.waterLevel} onChange={handleChange} placeholder="Water Level (meters)" className="w-full p-2 border rounded" />
          )}
          {formData.type === 'traped' && (
            <div>
                <h3 className="font-bold">Affected People</h3>
                <div className="grid grid-cols-3 gap-4">
                    <input type="number" name="affectedChildren" value={formData.affectedChildren} onChange={handleChange} placeholder="Children" className="w-full p-2 border rounded" />
                    <input type="number" name="affectedInjured" value={formData.affectedInjured} onChange={handleChange} placeholder="Injured" className="w-full p-2 border rounded" />
                    <input type="number" name="affectedAdults" value={formData.affectedAdults} onChange={handleChange} placeholder="Adults" className="w-full p-2 border rounded" />
                </div>
            </div>
          )}
          <div className="flex items-center">
            <input type="checkbox" name="isRoadBlocked" checked={formData.isRoadBlocked} onChange={handleChange} className="mr-2" />
            <label>Is the road blocked?</label>
          </div>
          <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Additional Comments" className="w-full p-2 border rounded"></textarea>
          <div>
            <label className="block mb-2 font-medium">Upload Photos (Optional)</label>
            <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Submit Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlertModal;
