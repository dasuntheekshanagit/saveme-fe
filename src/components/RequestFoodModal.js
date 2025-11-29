import React, { useState, useEffect } from 'react';

const RequestFoodModal = ({ closeModal, locationFromMap }) => {
  const [formData, setFormData] = useState({
    reporterName: '',
    telephoneNumbers: '',
    latitude: '',
    longitude: '',
    location: '',
    affectedPeople: '',
    comments: '',
    type: 'food_request',
    severity: 'LOW', // Default severity for food requests
  });

  useEffect(() => {
    if (locationFromMap) {
      setFormData(prev => ({
        ...prev,
        latitude: locationFromMap.lat,
        longitude: locationFromMap.lng,
      }));
    }
  }, [locationFromMap]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      telephoneNumbers: formData.telephoneNumbers.split(',').map(s => s.trim()),
    };

    const submission = new FormData();
    submission.append('notification', new Blob([JSON.stringify(submissionData)], { type: 'application/json' }));

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        body: submission,
      });

      if (response.ok) {
        alert('Food request submitted successfully!');
        closeModal();
      } else {
        const error = await response.json();
        alert(`Submission failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred while submitting the request.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Request Food Supplies</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location Description" className="w-full p-2 border rounded" required />
          <input type="number" name="affectedPeople" value={formData.affectedPeople} onChange={handleChange} placeholder="Number of People Needing Food" className="w-full p-2 border rounded" required />
          <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded" required />
          <input type="text" name="telephoneNumbers" value={formData.telephoneNumbers} onChange={handleChange} placeholder="Contact Number" className="w-full p-2 border rounded" required />
          <textarea name="comments" value={formData.comments} onChange={handleChange} placeholder="Additional details (e.g., need baby food)" className="w-full p-2 border rounded"></textarea>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestFoodModal;
