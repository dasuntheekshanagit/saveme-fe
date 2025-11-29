import React from 'react';

const AlertFilters = ({ filters, setFilters }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="severity"
          value={filters.severity}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="flood">Flood</option>
          <option value="landslide">Landslide</option>
          <option value="traped">Trapped</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleInputChange}
          placeholder="Filter by city..."
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
};

export default AlertFilters;
