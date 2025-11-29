import React, { useState } from 'react';

const NotificationForm = () => {
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
    affectedYoung: '',
    affectedAdults: '',
    comments: '',
    waterLevel: '',
    type: 'other',
  });
  const [photos, setPhotos] = useState([]);

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
      const response = await fetch('/api/notifications', {
        method: 'POST',
        body: submission,
      });

      if (response.ok) {
        alert('Notification submitted successfully!');
        // Reset form
        setFormData({
            reporterName: '',
            telephoneNumbers: '',
            latitude: '',
            longitude: '',
            severity: 'LOW',
            isRoadBlocked: false,
            location: '',
            affectedPeople: '',
            affectedChildren: '',
            affectedYoung: '',
            affectedAdults: '',
            comments: '',
            waterLevel: '',
            type: 'other',
        });
        setPhotos([]);
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting notification:', error);
      alert('An error occurred while submitting the notification.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded" required />
      <input type="text" name="telephoneNumbers" value={formData.telephoneNumbers} onChange={handleChange} placeholder="Contact Numbers (comma-separated)" className="w-full p-2 border rounded" />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="w-full p-2 border rounded" required />
        <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="w-full p-2 border rounded" required />
      </div>
      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location Description" className="w-full p-2 border rounded" />
      <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="other">Other</option>
        <option value="flood">Flood</option>
        <option value="landslide">Landslide</option>
      </select>
      <select name="severity" value={formData.severity} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      {formData.type === 'flood' && (
        <input type="number" name="waterLevel" value={formData.waterLevel} onChange={handleChange} placeholder="Water Level (meters)" className="w-full p-2 border rounded" />
      )}
      <div className="flex items-center">
        <input type="checkbox" name="isRoadBlocked" checked={formData.isRoadBlocked} onChange={handleChange} className="mr-2" />
        <label>Is the road blocked?</label>
      </div>
      <h3 className="font-bold">Affected People</h3>
      <div className="grid grid-cols-3 gap-4">
        <input type="number" name="affectedChildren" value={formData.affectedChildren} onChange={handleChange} placeholder="Children" className="w-full p-2 border rounded" />
        <input type="number" name="affectedYoung" value={formData.affectedYoung} onChange={handleChange} placeholder="Young" className="w-full p-2 border rounded" />
        <input type="number" name="affectedAdults" value={formData.affectedAdults} onChange={handleChange} placeholder="Adults" className="w-full p-2 border rounded" />
      </div>
      <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Additional Comments" className="w-full p-2 border rounded"></textarea>
      <div>
        <label className="block mb-2 font-medium">Upload Photos (Optional)</label>
        <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">Submit Report</button>
    </form>
  );
};

export default NotificationForm;
