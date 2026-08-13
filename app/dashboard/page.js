"use client";

import React, { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";

const INITIAL_FLIGHTS = [
  { id: 1, airline: "Delta Air Lines", flight: "DL102", from: "JFK", to: "LHR", miles: 3450, segments: 1 },
  { id: 2, airline: "British Airways", flight: "BA284", from: "SFO", to: "LHR", miles: 5360, segments: 1 },
  { id: 3, airline: "Lufthansa", flight: "LH430", from: "ORD", to: "FRA", miles: 4330, segments: 1 },
  { id: 4, airline: "Delta Air Lines", flight: "DL045", from: "ATL", to: "CDG", miles: 4390, segments: 1 },
];

export default function Dashboard() {
  const [flights, setFlights] = useState(INITIAL_FLIGHTS);
  
  // Form states
  const [airline, setAirline] = useState("Delta Air Lines");
  const [flightNo, setFlightNo] = useState("");
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [miles, setMiles] = useState("");

  // Filters & Sorting
  const [filterAirline, setFilterAirline] = useState("All");
  const [sortBy, setSortBy] = useState("miles-desc");

  // Calculate stats
  const stats = useMemo(() => {
    const totalMiles = flights.reduce((sum, f) => sum + f.miles, 0);
    const totalSegments = flights.reduce((sum, f) => sum + f.segments, 0);
    
    // Tier threshold logic
    let tier = "General Member";
    let progress = 0;
    let nextTier = "Silver Medallion";
    let threshold = 25000;

    if (totalMiles >= 75000) {
      tier = "Platinum Elite";
      nextTier = "Diamond Elite";
      threshold = 100000;
      progress = Math.min(100, (totalMiles / threshold) * 100);
    } else if (totalMiles >= 50000) {
      tier = "Gold Medallion";
      nextTier = "Platinum Elite";
      threshold = 75000;
      progress = ((totalMiles - 50000) / 25000) * 100;
    } else if (totalMiles >= 25000) {
      tier = "Silver Medallion";
      nextTier = "Gold Medallion";
      threshold = 50000;
      progress = ((totalMiles - 25000) / 25000) * 100;
    } else {
      progress = (totalMiles / 25000) * 100;
    }

    return {
      totalMiles,
      totalSegments,
      tier,
      nextTier,
      progress: Math.round(progress),
      milesNeeded: Math.max(0, threshold - totalMiles),
    };
  }, [flights]);

  // Unique airlines for filter dropdown
  const airlineOptions = useMemo(() => {
    const set = new Set(flights.map(f => f.airline));
    return ["All", ...Array.from(set)];
  }, [flights]);

  // Filtered & Sorted flights list
  const filteredFlights = useMemo(() => {
    let result = [...flights];

    // Filter
    if (filterAirline !== "All") {
      result = result.filter(f => f.airline === filterAirline);
    }

    // Sort
    if (sortBy === "miles-desc") {
      result.sort((a, b) => b.miles - a.miles);
    } else if (sortBy === "miles-asc") {
      result.sort((a, b) => a.miles - b.miles);
    } else if (sortBy === "airline") {
      result.sort((a, b) => a.airline.localeCompare(b.airline));
    }

    return result;
  }, [flights, filterAirline, sortBy]);

  // Add flight handler
  const handleAddFlight = (e) => {
    e.preventDefault();
    if (!airline || !flightNo || !fromCode || !toCode || !miles) return;

    const newFlight = {
      id: Date.now(),
      airline,
      flight: flightNo.toUpperCase(),
      from: fromCode.toUpperCase(),
      to: toCode.toUpperCase(),
      miles: parseInt(miles) || 0,
      segments: 1,
    };

    setFlights([...flights, newFlight]);
    
    // Clear form
    setFlightNo("");
    setFromCode("");
    setToCode("");
    setMiles("");
  };

  // Delete flight handler
  const handleDeleteFlight = (id) => {
    setFlights(flights.filter(f => f.id !== id));
  };

  // Reset flights handler
  const handleResetFlights = () => {
    setFlights(INITIAL_FLIGHTS);
  };

  return (
    <div className="flex-grow flex flex-col">
      <PageHeader
        title="Flight Console"
        subtitle="Frequent Flyer Console"
        description="Compute status qualifications, track loyalty progress, and log segments interactively."
      />

      <Section variant="gradient">
        <Container className="flex flex-col gap-8">
          
          {/* Stats & Progress cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Status Tier */}
            <Card hoverable={false} className="border-l-4 border-l-secondary">
              <span className="text-xs uppercase tracking-wider text-text-secondary">Current Tier Level</span>
              <p className="text-2xl font-black text-white font-display mt-2 neon-text-gradient">
                {stats.tier}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-text-secondary">Next Tier: {stats.nextTier}</span>
                <span className="font-bold text-white">{stats.progress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </Card>

            {/* Total Miles */}
            <Card hoverable={false} className="border-l-4 border-l-primary">
              <span className="text-xs uppercase tracking-wider text-text-secondary">Total Qualification Miles</span>
              <p className="text-4xl font-extrabold text-white font-display mt-2">
                {stats.totalMiles.toLocaleString()}{" "}
                <span className="text-xs text-text-secondary font-medium">mi</span>
              </p>
              <p className="text-xs text-text-secondary mt-3">
                {stats.milesNeeded > 0 ? (
                  <span>Needed for next status: <strong className="text-white">{stats.milesNeeded.toLocaleString()}</strong> mi</span>
                ) : (
                  <span className="text-success font-semibold">Max tier milestones reached!</span>
                )}
              </p>
            </Card>

            {/* Total Segments */}
            <Card hoverable={false} className="border-l-4 border-l-accent">
              <span className="text-xs uppercase tracking-wider text-text-secondary">Total Segments Logged</span>
              <p className="text-4xl font-extrabold text-white font-display mt-2">
                {stats.totalSegments}{" "}
                <span className="text-xs text-text-secondary font-medium">segments</span>
              </p>
              <p className="text-xs text-text-secondary mt-3">
                Average segment distance:{" "}
                <strong className="text-white">
                  {stats.totalSegments > 0
                    ? Math.round(stats.totalMiles / stats.totalSegments).toLocaleString()
                    : 0}
                </strong>{" "}
                mi
              </p>
            </Card>
          </div>

          {/* Form & Table block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form column */}
            <div className="lg:col-span-1">
              <Card title="Log New Flight" subtitle="Add segment to calculator" hoverable={false}>
                <form onSubmit={handleAddFlight} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="airline-select" className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                      Airline Carrier
                    </label>
                    <select
                      id="airline-select"
                      value={airline}
                      onChange={(e) => setAirline(e.target.value)}
                      className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-secondary text-sm"
                    >
                      <option value="Delta Air Lines">Delta Air Lines</option>
                      <option value="British Airways">British Airways</option>
                      <option value="Lufthansa">Lufthansa</option>
                      <option value="United Airlines">United Airlines</option>
                      <option value="Singapore Airlines">Singapore Airlines</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="flight-no-input" className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                        Flight No.
                      </label>
                      <input
                        id="flight-no-input"
                        type="text"
                        placeholder="DL123"
                        required
                        value={flightNo}
                        onChange={(e) => setFlightNo(e.target.value)}
                        className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-secondary text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="miles-input" className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                        Miles
                      </label>
                      <input
                        id="miles-input"
                        type="number"
                        placeholder="3500"
                        required
                        min="1"
                        value={miles}
                        onChange={(e) => setMiles(e.target.value)}
                        className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-secondary text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="from-code-input" className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                        Departure (From)
                      </label>
                      <input
                        id="from-code-input"
                        type="text"
                        placeholder="JFK"
                        required
                        maxLength="3"
                        value={fromCode}
                        onChange={(e) => setFromCode(e.target.value)}
                        className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-secondary text-sm uppercase"
                      />
                    </div>
                    <div>
                      <label htmlFor="to-code-input" className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
                        Arrival (To)
                      </label>
                      <input
                        id="to-code-input"
                        type="text"
                        placeholder="LHR"
                        required
                        maxLength="3"
                        value={toCode}
                        onChange={(e) => setToCode(e.target.value)}
                        className="w-full bg-[#0d101c] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-secondary text-sm uppercase"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-2" variant="primary">
                    Add Flight Log
                  </Button>
                </form>
              </Card>
            </div>

            {/* Table column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold font-display text-white">
                  Logged Flight Segments ({filteredFlights.length})
                </h3>
                
                {/* Filter and Sort actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="filter-airline-select" className="text-xs text-text-secondary whitespace-nowrap">Filter:</label>
                    <select
                      id="filter-airline-select"
                      value={filterAirline}
                      onChange={(e) => setFilterAirline(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-secondary"
                    >
                      {airlineOptions.map(air => (
                        <option key={air} value={air}>{air}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="sort-by-select" className="text-xs text-text-secondary whitespace-nowrap">Sort:</label>
                    <select
                      id="sort-by-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-secondary"
                    >
                      <option value="miles-desc">Miles: High to Low</option>
                      <option value="miles-asc">Miles: Low to High</option>
                      <option value="airline">Airline A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table or Empty State */}
              {filteredFlights.length === 0 ? (
                <EmptyState
                  title="No matching segments found"
                  description="Try resetting the filters or adding your first custom flight log."
                  actionText="Reset Filters"
                  onAction={() => {
                    setFilterAirline("All");
                    setSortBy("miles-desc");
                  }}
                />
              ) : (
                <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-text-secondary border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-white font-semibold text-xs uppercase tracking-wider">
                          <th className="px-6 py-4">Airline / Flight</th>
                          <th className="px-6 py-4">Route</th>
                          <th className="px-6 py-4 text-right">Distance</th>
                          <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredFlights.map((flight) => (
                          <tr key={flight.id} className="hover:bg-white/2 transition-colors duration-150">
                            <td className="px-6 py-4">
                              <span className="font-semibold text-white block">{flight.airline}</span>
                              <span className="text-xs text-text-secondary font-mono">{flight.flight}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-xs font-semibold mr-1.5">
                                {flight.from}
                              </span>
                              <span className="text-gray-500">&rarr;</span>
                              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white font-mono text-xs font-semibold ml-1.5">
                                {flight.to}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-white font-mono">
                              {flight.miles.toLocaleString()} mi
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteFlight(flight.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded transition-all duration-200 text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {flights.length !== INITIAL_FLIGHTS.length && (
                    <div className="bg-white/3 border-t border-white/10 px-6 py-3 flex items-center justify-between text-xs">
                      <span>Custom modifications active</span>
                      <button onClick={handleResetFlights} className="text-secondary hover:text-secondary-hover font-semibold">
                        Reset Default List
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
