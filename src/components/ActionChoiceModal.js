import React from 'react';

const ActionChoiceModal = ({ onChoose, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-xl font-bold mb-6">What would you like to report?</h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onChoose('alert')}
            className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
          >
            Incident / Alert
          </button>
          <button
            onClick={() => onChoose('food')}
            className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700"
          >
            Food Request
          </button>
        </div>
        <button onClick={onCancel} className="mt-6 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ActionChoiceModal;
