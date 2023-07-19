import { useState } from "react";
import axios from "axios";
import backgroundDesktop from "./images/pattern-bg-desktop.png";

export default function App() {
  const [ipAddress, setIPAddress] = useState("");
  const [location, setLocation] = useState({ city: "", country: "", postalCode: "" });
  const [timezone, setTimezone] = useState("");
  const [isp, setISP] = useState("");

  const IP_KEY = "at_aSCLjzTBebBZs8XxWlucojphVaPjr";

  const searchIPAddress = async () => {
    try {
      const response = await axios.get(
        `https://geo.ipify.org/api/v1?apiKey=${IP_KEY}&ipAddress=${ipAddress}`
      );

      const { ip, location, timezone, isp } = response.data;

      setIPAddress(ip);
      setLocation(location);
      setTimezone(location.timezone);
      setISP(isp);
    } catch (error) {
      console.error(error);
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
            className="w-96 h-10 rounded-l-lg px-4"
            value={ipAddress}
            onChange={(e) => setIPAddress(e.target.value)}
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
        <div className="absolute top-[90%] bg-white p-3 rounded-md overflow-hidden">
          <div className="flex gap-10">
            <div className="flex flex-col gap-2">
              <div className="text-gray-500 text-xs font-bold">IP ADDRESS</div>
              <div className="text-xl text-black">{ipAddress}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-500 text-xs font-semibold">LOCATION</div>
              <div className="text-xl text-black">
                {location.city} {location.country} {location.postalCode}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-500 text-xs font-semibold">TIMEZONE</div>
              <div className="text-xl text-black">
                {timezone && `UTC${timezone}`}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-500 text-xs font-semibold">ISP</div>
              <div className="text-xl text-black">{isp}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full bg-green-500"></div>
    </div>
  );
}