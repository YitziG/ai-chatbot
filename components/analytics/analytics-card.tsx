import React from 'react';

const AnalyticsCard = ({ title, data }: { title: string; data: any }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-800 p-4">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {data && data.length > 0 ? (
        <div className="flex flex-col gap-2">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-1 rounded-md bg-zinc-700 p-3"
            >
              {Object.keys(item).map((key, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-400">{key}:</span>
                  <span className="text-white">{item[key]}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No data available.</p>
      )}
    </div>
  );
};

export default AnalyticsCard;