import React, { useState, useEffect } from 'react';

const SummaryHighlights = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch('/api/notifications/summary');
                const data = await response.json();
                setSummary(data);
            } catch (error) {
                console.error("Failed to fetch summary:", error);
            }
        };
        fetchSummary();
    }, []);

    if (!summary) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{summary.criticalAlerts}</p>
                <p>Critical Alerts</p>
            </div>
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{summary.openAlerts}</p>
                <p>Open Alerts</p>
            </div>
            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{summary.closedAlerts}</p>
                <p>Closed Alerts</p>
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{summary.savedPeople}</p>
                <p>People Saved</p>
            </div>
        </div>
    );
};

export default SummaryHighlights;
