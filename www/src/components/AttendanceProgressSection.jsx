import React, { useState } from 'react';
import { TrendingUp, Flower2, Calendar, CheckCircle2, Star, ListFilter, X, ShieldCheck } from 'lucide-react';
import { loadStorage, DEFAULT_ATTENDANCE_LOGS } from '../utils/storage';

export default function AttendanceProgressSection({ user, attendanceLogs = [], lang = 'en' }) {
  const [showLogsModal, setShowLogsModal] = useState(false);
  const logs = attendanceLogs && attendanceLogs.length > 0 
    ? attendanceLogs 
    : loadStorage('nithya_attendance', DEFAULT_ATTENDANCE_LOGS);

  const weeklyData = [
    { day: 'Mon', h1: 45, h2: 25 },
    { day: 'Tue', h1: 65, h2: 40 },
    { day: 'Wed', h1: 30, h2: 20 },
    { day: 'Thu', h1: 85, h2: 60 },
    { day: 'Fri', h1: 50, h2: 35 },
    { day: 'Sat', h1: 70, h2: 55 },
    { day: 'Sun', h1: 90, h2: 75 }
  ];

  return (
    <div className="dashboard-card progress-dashboard-card">
      {/* Header */}
      <div className="card-header-block flex justify-between items-start">
        <div>
          <h3 className="card-title-main">
            <TrendingUp size={18} className="text-violet" />
            <span>{lang === 'ta' ? 'முன்னேற்றம் மற்றும் வருகை' : 'Progress & Attendance'}</span>
          </h3>
          <p className="card-sub-motto">
            {lang === 'ta' ? 'உங்கள் பயணத்தைக் கண்காணித்து வளர்ச்சியைக் கொண்டாடுங்கள்.' : 'Track your journey and celebrate your growth.'}
          </p>
        </div>

        <button
          type="button"
          className="btn-logs-pill text-xs flex items-center gap-1 px-2 py-1 rounded bg-subtle hover-accent cursor-pointer"
          onClick={() => setShowLogsModal(true)}
          title="View Verified Attendance Records"
        >
          <Calendar size={13} />
          <span>{lang === 'ta' ? 'வருகை வரலாறு' : 'Attendance Log'}</span>
        </button>
      </div>

      {/* 4 Stat Boxes Row */}
      <div className="progress-metrics-4row">
        {/* Metric 1 */}
        <div className="prog-metric-tile tile-purple">
          <div className="prog-tile-top">
            <Flower2 size={16} className="text-purple" />
          </div>
          <span className="prog-metric-label">
            {lang === 'ta' ? 'கலந்துகொண்ட வகுப்புகள்' : 'Classes Attended'}
          </span>
          <strong className="prog-metric-val">{user?.classesAttended || logs.length || 12}</strong>
          <small className="prog-metric-sub">{lang === 'ta' ? 'இந்த மாதம்' : 'This month'}</small>
        </div>

        {/* Metric 2 */}
        <div className="prog-metric-tile tile-blue">
          <div className="prog-tile-top">
            <Calendar size={16} className="text-blue" />
          </div>
          <span className="prog-metric-label">
            {lang === 'ta' ? 'வருகை விகிதம்' : 'Attendance Rate'}
          </span>
          <strong className="prog-metric-val">{user?.attendanceRate || 85}%</strong>
          <small className="prog-metric-sub text-green">{lang === 'ta' ? '+5% முந்தைய மாதம்' : '+5% than last month'}</small>
        </div>

        {/* Metric 3 */}
        <div className="prog-metric-tile tile-green">
          <div className="prog-tile-top">
            <CheckCircle2 size={16} className="text-green" />
          </div>
          <span className="prog-metric-label">
            {lang === 'ta' ? 'நினைவூட்டல்கள் முடிந்தது' : 'Reminder Completed'}
          </span>
          <strong className="prog-metric-val">18</strong>
          <small className="prog-metric-sub text-green">{lang === 'ta' ? '+3 முந்தைய வாரம்' : '+3 than last week'}</small>
        </div>

        {/* Metric 4 */}
        <div className="prog-metric-tile tile-pink">
          <div className="prog-tile-top">
            <Star size={16} className="text-pink" />
          </div>
          <span className="prog-metric-label">
            {lang === 'ta' ? 'யோகா முன்னேற்றம்' : 'Yoga Progress'}
          </span>
          <strong className="prog-metric-val">{lang === 'ta' ? 'நன்று' : 'Good'}</strong>
          <small className="prog-metric-sub">{lang === 'ta' ? 'தொடருங்கள்!' : 'Keep going!'}</small>
        </div>
      </div>

      {/* Split Charts: Weekly Activity (Left) + Reminder Completion Donut (Right) */}
      <div className="charts-split-grid">
        {/* Weekly Activity Bar Chart */}
        <div className="chart-box-card">
          <h4 className="chart-title-sub">
            {lang === 'ta' ? 'வாராந்திர செயல்பாடு' : 'Weekly Activity'}
          </h4>
          <div className="bar-chart-visual-container">
            {weeklyData.map((d) => (
              <div key={d.day} className="bar-chart-column">
                <div className="bars-stacked">
                  <div 
                    className="bar-fill-violet" 
                    style={{ height: `${d.h1}%` }}
                    title={`${d.day}: ${d.h1} mins`}
                  ></div>
                  <div 
                    className="bar-fill-cyan" 
                    style={{ height: `${d.h2}%` }}
                  ></div>
                </div>
                <span className="bar-day-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Completion Donut Chart */}
        <div className="chart-box-card">
          <h4 className="chart-title-sub">
            {lang === 'ta' ? 'நினைவூட்டல் நிறைவு' : 'Reminder Completion'}
          </h4>

          <div className="donut-chart-flex">
            {/* SVG Donut */}
            <div className="donut-circle-wrap">
              <svg viewBox="0 0 100 100" className="donut-svg">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="donut-bg-ring"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="donut-accent-ring"
                  strokeDasharray="238.76"
                  strokeDashoffset="47.75"
                />
              </svg>
              <div className="donut-center-text">
                <strong>80%</strong>
              </div>
            </div>

            {/* Legend & Counts */}
            <div className="donut-legend-list">
              <div className="donut-legend-row">
                <span className="dot-color dot-blue">●</span>
                <span className="leg-name">{lang === 'ta' ? 'தண்ணீர்' : 'Water'}</span>
                <span className="leg-val">3/3</span>
              </div>

              <div className="donut-legend-row">
                <span className="dot-color dot-yellow">●</span>
                <span className="leg-name">{lang === 'ta' ? 'உணவு' : 'Meal'}</span>
                <span className="leg-val">2/2</span>
              </div>

              <div className="donut-legend-row">
                <span className="dot-color dot-green">●</span>
                <span className="leg-name">{lang === 'ta' ? 'அழைப்பு' : 'Call'}</span>
                <span className="leg-val">2/3</span>
              </div>

              <div className="donut-legend-row">
                <span className="dot-color dot-purple">●</span>
                <span className="leg-name">{lang === 'ta' ? 'மற்றவை' : 'Other'}</span>
                <span className="leg-val">5/7</span>
              </div>
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
