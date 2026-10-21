import React, { useState } from 'react';
import { TrendingUp, Flower2, Calendar, CheckCircle2, Star, ListFilter, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { loadStorage, DEFAULT_ATTENDANCE_LOGS } from '../utils/storage';

export default function AttendanceProgressSection({ user, attendanceLogs = [], lang = 'en' }) {
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  const logs = attendanceLogs && attendanceLogs.length > 0 
    ? attendanceLogs 
    : loadStorage('nithya_attendance', DEFAULT_ATTENDANCE_LOGS);

  const weeklyBars = [
    { day: 'Mon', hours: 2.5, heightPct: 42, color: '#B89EFA' },
    { day: 'Tue', hours: 4.2, heightPct: 70, color: '#F8B4C8' },
    { day: 'Wed', hours: 3.0, heightPct: 50, color: '#FCD385' },
    { day: 'Thu', hours: 5.5, heightPct: 92, color: '#A8E090' },
    { day: 'Fri', hours: 3.8, heightPct: 63, color: '#88D49E' },
    { day: 'Sat', hours: 4.8, heightPct: 80, color: '#8ECCFA' },
    { day: 'Sun', hours: 4.0, heightPct: 66, color: '#9B7AE8' }
  ];

  const focusAreas = [
    { name: lang === 'ta' ? 'ஆசனங்கள்' : 'Asanas', pct: '45%', color: '#9B7AE8' },
    { name: lang === 'ta' ? 'பிராணாயாமம்' : 'Pranayama', pct: '25%', color: '#F8B4C8' },
    { name: lang === 'ta' ? 'தியானம்' : 'Meditation', pct: '15%', color: '#FCD385' },
    { name: lang === 'ta' ? 'ரிலாக்சேஷன்' : 'Relaxation', pct: '10%', color: '#A8E090' },
    { name: lang === 'ta' ? 'மற்றவை' : 'Other', pct: '5%', color: '#8ECCFA' }
  ];

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

            <div className="attendance-history-table-wrapper max-h-60 overflow-y-auto">
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
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-subtle">
                      <td className="py-2 px-1 font-semibold">{log.className}</td>
                      <td className="py-2 px-1 text-muted">{log.instructor}</td>
                      <td className="py-2 px-1">{log.date}</td>
                      <td className="py-2 px-1">{log.durationMinutes} mins</td>
                      <td className="py-2 px-1">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-green-subtle text-green font-medium">
                          ✓ {log.status || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
