import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import L from "leaflet";
import { toast } from "react-hot-toast";

import backgroundDesktop from "./images/pattern-bg-desktop.png";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

export default function App() {
  const [input, setInput] = useState("");
  const [ipAddress, setIPAddress] = useState("");
  const [location, setLocation] = useState({ city: "", country: "", postalCode: "" });
  const [timezone, setTimezone] = useState("");
  const [isp, setISP] = useState("");
  const mapRef = useRef(null);

  const searchIPAddress = async () => {
    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v1?apiKey=at_aSCLjzTBebBZs8XxWlucojphVaPjr&ipAddress=${input}`
      );

      const { ip, location, timezone, isp } = response.data;

      setIPAddress(ip);
      setLocation(location);
      setTimezone(location.timezone);
      setISP(isp);

      const { lat, lng } = location;

      const mapContainer = mapRef.current;

      // If the map has not been initialized yet, create it
      if (!mapContainer.hasChildNodes()) {
        const myMap = L.map(mapContainer).setView([lat, lng], 13);
        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(myMap);

        mapRef.current = myMap; // Update the mapRef.current to hold the Leaflet map instance
      } else {
        // If the map has already been initialized, just set the view to the new location
        mapRef.current.setView([lat, lng], 13);
      }

      // Clear previous markers
      mapRef.current.leafletElement.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.leafletElement.removeLayer(layer);
        }
      });

      // Add a marker at the selected location
      L.marker([lat, lng]).addTo(mapRef.current.leafletElement);

      toast.success("Success");
    } catch (error) {
      console.error(error);
      toast.error("Error");
    }
  };

  return (
    <div className="w-screen font-rubik h-screen overflow-hidden flex flex-col justify-center items-center">
      <div className="h-[75%] flex flex-col gap-10 justify-center items-center w-full relative">
        <img
          src={backgroundDesktop}
          alt=""
          className="absolute z-[-1] w-full h-full top-0 left-0 object-cover"
        />
        <div className="text-xl font-semibold text-white">IP Address Tracker</div>
        <div className="flex mb-12">
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            className="w-96 h-10 rounded-l-lg px-4 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="h-10 w-10 rounded-r-lg bg-black flex justify-center items-center text-white"
            onClick={searchIPAddress}
          >
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
        <div className="absolute top-[80%] bg-white h-24 w-[50%] p-3 rounded-md overflow-hidden">
          <div className="flex w-full h-full justify-between">
            <div className="flex flex-col gap-2 w-full px-5 h-full">
              <div className="text-gray-500 text-xs">IP ADDRESS</div>
              <div className="text-lg text-black">{ipAddress}</div>
            </div>
            <div className="flex flex-col gap-2 w-full px-5 h-full border-l-[2px] border-gray-200">
              <div className="text-gray-500 text-xs">LOCATION</div>
              <div className="text-lg text-black">
                {location.city} {location.country} {location.postalCode}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full px-5 h-full border-l-[2px] border-gray-200">
              <div className="text-gray-500 text-xs">TIMEZONE</div>
              <div className="text-lg text-black">
                {timezone && `UTC${timezone}`}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full px-5 h-full border-l-[2px] border-gray-200">
              <div className="text-gray-500 text-xs">ISP</div>
              <div className="text-lg text-black">{isp}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="leaflet-map" ref={mapRef} className="h-full w-full bg-green-500"></div>
    </div>
  );
}
