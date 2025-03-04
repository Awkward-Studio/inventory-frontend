import React from "react";

export default function DetailsCard({ title, icon, dataHead, data }: any) {
  return (
    <div className="flex flex-col min-h-[175px] h-fit min-w-[420px] w-fit border-2 border-gray-200 rounded-lg shadow-sm p-4">
      <div className="mb-5">{title}</div>
      <div className="flex flex-row">
        <div className="border-2 rounded-full p-4 w-fit mb-6 bg-gray-200 shadow-sm mr-8">
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-2xl">{dataHead}</div>
          {Object.keys(data).map((keyName, index) => (
            <div className="font-semibold text-gray-500" key={index}>
              {data[keyName]}
            </div>
          ))}
        </div>
      </div>

      {/* <div className="text-sm text-gray-500">{desc}</div>
      <div className="text-4xl font-semibold">{value}</div> */}
    </div>
  );
}
