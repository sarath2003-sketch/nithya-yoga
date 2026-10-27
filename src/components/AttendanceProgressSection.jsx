import React, { useState } from 'react';
import { TrendingUp, Flower2, Calendar, CheckCircle2, Star, ListFilter, X, ShieldCheck, ChevronDown, Search } from 'lucide-react';
import { loadStorage, DEFAULT_ATTENDANCE_LOGS } from '../utils/storage';

export default function AttendanceProgressSection({ user, attendanceLogs = [], lang = 'en' }) {
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const logs = Array.isArray(attendanceLogs) && attendanceLogs.length > 0 
    ? attendanceLogs 
    : loadStorage('nithya_attendance', DEFAULT_ATTENDANCE_LOGS);

  // Compute actual daily hours from real attendance logs
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayTotals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  let totalHoursSum = 0;

  const categoryMinutes = {
    Asanas: 0,
    Pranayama: 0,
    Meditation: 0,
    Relaxation: 0,
    Other: 0
  };

  logs.forEach(l => {
    try {
      const d = l.joinedAt ? new Date(l.joinedAt) : (l.date ? new Date(l.date) : new Date());
      const dayName = dayNames[d.getDay()] || 'Mon';
      const durationMins = l.durationMinutes || Math.round((l.durationSeconds || 0) / 60) || 45;
      const hours = durationMins / 60;
      if (dayTotals[dayName] !== undefined) {
        dayTotals[dayName] += hours;
        totalHoursSum += hours;
      }

      const title = (l.className || l.classTitle || '').toLowerCase();
      if (title.includes('pranayama') || title.includes('breath') || title.includes('shodhana')) {
        categoryMinutes.Pranayama += durationMins;
      } else if (title.includes('meditation') || title.includes('chakra') || title.includes('yin') || title.includes('dhyana')) {
        categoryMinutes.Meditation += durationMins;
      } else if (title.includes('relax') || title.includes('sleep') || title.includes('nidra')) {
        categoryMinutes.Relaxation += durationMins;
      } else {
        categoryMinutes.Asanas += durationMins;
      }
    } catch (_) {}
  });

  const maxDaily = Math.max(2, ...Object.values(dayTotals));
  const weeklyBars = [
    { day: 'Mon', hours: parseFloat(dayTotals.Mon.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Mon / maxDaily) * 90))), color: '#B89EFA' },
    { day: 'Tue', hours: parseFloat(dayTotals.Tue.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Tue / maxDaily) * 90))), color: '#F8B4C8' },
    { day: 'Wed', hours: parseFloat(dayTotals.Wed.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Wed / maxDaily) * 90))), color: '#FCD385' },
    { day: 'Thu', hours: parseFloat(dayTotals.Thu.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Thu / maxDaily) * 90))), color: '#A8E090' },
    { day: 'Fri', hours: parseFloat(dayTotals.Fri.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Fri / maxDaily) * 90))), color: '#88D49E' },
    { day: 'Sat', hours: parseFloat(dayTotals.Sat.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Sat / maxDaily) * 90))), color: '#8ECCFA' },
    { day: 'Sun', hours: parseFloat(dayTotals.Sun.toFixed(1)), heightPct: Math.min(100, Math.max(12, Math.round((dayTotals.Sun / maxDaily) * 90))), color: '#9B7AE8' }
  ];

  const totalCatMins = Object.values(categoryMinutes).reduce((a, b) => a + b, 0) || 1;
  const focusAreas = [
    { name: lang === 'ta' ? 'ஆசனங்கள்' : 'Asanas', pct: `${Math.round((categoryMinutes.Asanas / totalCatMins) * 100)}%`, color: '#9B7AE8' },
    { name: lang === 'ta' ? 'பிராணாயாமம்' : 'Pranayama', pct: `${Math.round((categoryMinutes.Pranayama / totalCatMins) * 100)}%`, color: '#F8B4C8' },
    { name: lang === 'ta' ? 'தியானம்' : 'Meditation', pct: `${Math.round((categoryMinutes.Meditation / totalCatMins) * 100)}%`, color: '#FCD385' },
    { name: lang === 'ta' ? 'ரிலாக்சேஷன்' : 'Relaxation', pct: `${Math.round((categoryMinutes.Relaxation / totalCatMins) * 100)}%`, color: '#A8E090' },
    { name: lang === 'ta' ? 'மற்றவை' : 'Other', pct: `${Math.round((categoryMinutes.Other / totalCatMins) * 100)}%`, color: '#8ECCFA' }
  ];

  const filteredLogs = logs.filter(log => {
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchName = (log.className || log.classTitle || '').toLowerCase().includes(q);
      const matchTeacher = (log.instructor || '').toLowerCase().includes(q);
      if (!matchName && !matchTeacher) return false;
    }
    if (dateFilter && log.date && !log.date.includes(dateFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="attendance-progress-wrapper">
      {/* 2-Card Split Grid matching Master Reference */}
      <div className="charts-split-grid">
        {/* Card 1: Practice Overview Bar Chart (Mon-Sun) */}
        <div className="dashboard-card chart-box-card">
          <div className="chart-header-row">
            <div>
              <h4 className="chart-title-main">
                {lang === 'ta' ? 'பயிற்சி கண்ணோட்டம்' : 'Practice Overview'}
              </h4>
              <span className="chart-subtitle-text">
                {lang === 'ta' ? 'வாராந்திர யோகா நேரம்' : 'Weekly mindful practice hours'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="time-select-pill">
                <span>{lang === 'ta' ? 'இந்த வாரம்' : selectedWeek}</span>
                <ChevronDown size={14} className="text-muted" />
              </div>

              <button
                type="button"
                className="btn-logs-pill"
                onClick={() => setShowLogsModal(true)}
                title="View Verified Attendance Records"
              >
                <Calendar size={13} />
                <span>{lang === 'ta' ? 'பதிவேடு' : 'Log'}</span>
              </button>
            </div>
          </div>

          {/* Bar Chart Visual with Y-Axis */}
          <div className="bar-chart-visual-container">
            {/* Y-Axis scale */}
            <div className="chart-y-axis-labels">
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>0</span>
            </div>

            {/* Columns */}
            <div className="bar-chart-columns-flex">
              {weeklyBars.map((d) => (
                <div key={d.day} className="bar-chart-column-item">
                  <div className="bar-track-backdrop">
                    <div 
                      className="bar-3d-capsule" 
                      style={{ 
                        height: `${d.heightPct}%`,
                        backgroundColor: d.color
                      }}
                      title={`${d.day}: ${d.hours} hrs`}
                    ></div>
                  </div>
                  <span className="bar-day-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Focus Areas Donut Chart */}
        <div className="dashboard-card chart-box-card">
          <div className="chart-header-row">
            <div>
              <h4 className="chart-title-main">
                {lang === 'ta' ? 'முக்கியப் பகுதிகள்' : 'Yoga Focus Areas'}
              </h4>
              <span className="chart-subtitle-text">
                {lang === 'ta' ? 'பயிற்சி பிரிவுகள் பகிர்வு' : 'Distribution across practice types'}
              </span>
            </div>
          </div>

          <div className="donut-chart-flex">
            {/* SVG Donut with segmented pastel strokes */}
            <div className="donut-circle-wrap">
              <svg viewBox="0 0 100 100" className="donut-svg">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-bg-ring"
                />
                {/* Asanas: 45% (offset 0) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-slice slice-purple"
                  strokeDasharray="101.78 124.4"
                  strokeDashoffset="0"
                />
                {/* Pranayama: 25% (offset -101.78) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-slice slice-pink"
                  strokeDasharray="56.55 169.64"
                  strokeDashoffset="-101.78"
                />
                {/* Meditation: 15% (offset -158.33) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-slice slice-yellow"
                  strokeDasharray="33.93 192.26"
                  strokeDashoffset="-158.33"
                />
                {/* Relaxation: 10% (offset -192.26) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-slice slice-green"
                  strokeDasharray="22.62 203.57"
                  strokeDashoffset="-192.26"
                />
                {/* Other: 5% (offset -214.88) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="donut-slice slice-blue"
                  strokeDasharray="11.31 214.88"
                  strokeDashoffset="-214.88"
                />
              </svg>
              <div className="donut-center-text">
                <span className="donut-center-pct">80%</span>
                <span className="donut-center-sub">{lang === 'ta' ? 'முழுமை' : 'Active'}</span>
              </div>
            </div>

            {/* Legend with Colored Dots */}
            <div className="donut-legend-list">
              {focusAreas.map((item, idx) => (
                <div key={idx} className="donut-legend-row">
                  <span 
                    className="dot-color-round" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="leg-name">{item.name}</span>
                  <span className="leg-val">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Logs Modal */}
      {showLogsModal && (
        <div className="modal-backdrop-scrim" onClick={() => setShowLogsModal(false)}>
          <div className="modal-bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle"></div>

            <div className="modal-header-bar">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green" />
                <h3 className="modal-title-bold">
                  {lang === 'ta' ? 'சரிபார்க்கப்பட்ட வருகைப் பதிவு' : 'Verified Attendance Records'}
                </h3>
              </div>
              <button type="button" className="btn-modal-close" onClick={() => setShowLogsModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-2 mb-3 pt-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-2.5 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder={lang === 'ta' ? 'வகுப்பு அல்லது ஆசிரியர் பெயர் தேட...' : 'Search class or instructor...'}
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-subtle bg-card outline-none"
                />
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-subtle bg-card outline-none text-muted"
                title="Filter by date"
              />
              {(logSearchQuery || dateFilter) && (
                <button
                  type="button"
                  onClick={() => { setLogSearchQuery(''); setDateFilter(''); }}
                  className="text-xs px-2 py-1 text-primary font-bold cursor-pointer hover:underline"
                >
                  {lang === 'ta' ? 'அழி' : 'Clear'}
                </button>
              )}
            </div>

            <div className="attendance-history-table-wrapper max-h-64 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted">
                  {lang === 'ta' ? 'பொருந்தும் வருகைப் பதிவுகள் எதுவும் இல்லை.' : 'No matching attendance logs found.'}
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-subtle text-muted">
                      <th className="py-2 px-1">{lang === 'ta' ? 'வகுப்பு' : 'Class'}</th>
                      <th className="py-2 px-1">{lang === 'ta' ? 'ஆசிரியர்' : 'Teacher'}</th>
                      <th className="py-2 px-1">{lang === 'ta' ? 'தேதி' : 'Date'}</th>
                      <th className="py-2 px-1">{lang === 'ta' ? 'நேரம்' : 'Duration'}</th>
                      <th className="py-2 px-1">{lang === 'ta' ? 'நிலை' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-subtle">
                        <td className="py-2 px-1 font-semibold">{log.className || log.classTitle}</td>
                        <td className="py-2 px-1 text-muted">{log.instructor || 'NITHYA Master'}</td>
                        <td className="py-2 px-1">{log.date || log.session_date || 'Today'}</td>
                        <td className="py-2 px-1">{log.durationMinutes || Math.round((log.durationSeconds || 0) / 60)} mins</td>
                        <td className="py-2 px-1">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-green-subtle text-green font-medium">
                            ✓ {log.status || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="modal-actions-bar mt-4">
              <button type="button" className="btn-modal-cancel" onClick={() => setShowLogsModal(false)}>
                {lang === 'ta' ? 'மூடு' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
