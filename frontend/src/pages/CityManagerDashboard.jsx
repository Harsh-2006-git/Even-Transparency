import { useState } from 'react';
import { Users, Award, BookOpen, UserX, MapPin, Search } from 'lucide-react';

export default function CityManagerDashboard({ candidates }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  // Filter candidates based on manager inputs
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery);
    const matchesCity = cityFilter === 'All' || c.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  // Calculate statistics
  const totalCount = filteredCandidates.length;
  const convertedCount = filteredCandidates.filter(c => c.status === 'converted' || !c.status).length;
  const trainingStartedCount = filteredCandidates.filter(c => c.status === 'training started').length;
  const droppedCount = filteredCandidates.filter(c => c.status === 'dropped').length;

  // Group by city for dropdown filtering
  const uniqueCities = ['All', ...new Set(candidates.map(c => c.city))];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div id="overview">
        <h2 className="text-xl font-bold text-slate-800">City Performance Hub</h2>
        <p className="text-xs text-slate-500 mt-1">Monitor candidate suitability matrices, regional mobilization performance, and audit candidates details.</p>
      </div>

      {/* Metrics Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Candidates</span>
            <span className="text-2xl font-bold text-slate-800 mt-0.5 block">{totalCount}</span>
          </div>
          <span className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100">
            <Users className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Converted</span>
            <span className="text-2xl font-bold text-emerald-650 mt-0.5 block">{convertedCount}</span>
          </div>
          <span className="p-2.5 bg-emerald-50 text-emerald-650 rounded-xl border border-emerald-100">
            <Award className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Training Started</span>
            <span className="text-2xl font-bold text-amber-650 mt-0.5 block">{trainingStartedCount}</span>
          </div>
          <span className="p-2.5 bg-amber-50 text-amber-650 rounded-xl border border-amber-100">
            <BookOpen className="h-5 w-5" />
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Dropped</span>
            <span className="text-2xl font-bold text-rose-650 mt-0.5 block">{droppedCount}</span>
          </div>
          <span className="p-2.5 bg-rose-50 text-rose-650 rounded-xl border border-rose-100">
            <UserX className="h-5 w-5" />
          </span>
        </div>

      </section>

      {/* Analytics Charts & Pipeline ratios */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SVG suitabilities progress pipeline */}
        <div id="performance-hub" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm md:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Onboarding Pipeline Ratios</h3>
          
          <div className="space-y-4 bg-slate-50 border border-slate-150 p-5 rounded-2xl">
            {['Suitable', 'Requires Training', 'Unsuitable'].map(outcome => {
              const count = filteredCandidates.filter(c => c.outcome === outcome).length;
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={outcome} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{outcome}</span>
                    <span className="font-bold text-slate-655">{count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        outcome === 'Suitable' 
                          ? 'bg-emerald-500' 
                          : outcome === 'Requires Training'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City breakdowns */}
        <div id="regional-distribution" className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Regional Distribution</h3>
          
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3.5 text-xs text-slate-600">
            {uniqueCities.filter(c => c !== 'All').map(city => {
              const cityCount = candidates.filter(c => c.city.toLowerCase() === city.toLowerCase()).length;
              return (
                <div key={city} className="flex items-center justify-between font-medium">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="capitalize">{city}</span>
                  </span>
                  <span className="font-bold text-slate-800">{cityCount} Candidates</span>
                </div>
              );
            })}
            {uniqueCities.length <= 1 && (
              <div className="text-center text-slate-400 italic">No candidates to group.</div>
            )}
          </div>
        </div>

      </section>

      {/* Filter and Candidate spreadsheets */}
      <div id="pipeline-records" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Search Pipeline Records</h3>
            <p className="text-xs text-slate-500 mt-0.5">Filter candidate profiles by typing their name or selecting cities.</p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name..."
                className="pl-8 pr-4 py-2 border border-slate-350 bg-white rounded-lg text-slate-900 focus:outline-none focus:border-indigo-650"
              />
            </div>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-350 bg-white rounded-lg text-slate-900 focus:outline-none focus:border-indigo-655"
            >
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Spreadsheet grid */}
        {filteredCandidates.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150 text-xs">
            {filteredCandidates.map(c => (
              <div key={c.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-sm">{c.fullName}</span>
                    <span className="text-[10px] text-slate-450 font-mono">({c.age ? `${c.age} yrs` : 'No DOB'})</span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 font-semibold">
                      {c.city}, {c.state}
                    </span>
                  </div>
                  <div className="mt-1 text-slate-500">
                    <span>Phone: {c.phone}</span>
                    {c.notes && <span className="ml-4 italic text-slate-500">Feedback: "{c.notes}"</span>}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-450 uppercase tracking-wider block">Fitment Rating</span>
                    <span className="font-extrabold text-sm text-indigo-700">{c.score}%</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${
                    c.status === 'converted' || !c.status
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : c.status === 'training started'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {c.status || 'converted'}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                    c.outcome === 'Suitable'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : c.outcome === 'Requires Training'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {c.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs border border-slate-200 border-dashed rounded-xl">
            No candidates matched search criteria.
          </div>
        )}

      </div>

    </div>
  );
}
