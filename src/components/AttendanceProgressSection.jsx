import React from 'react';
import { TrendingUp, Flower2, Calendar, CheckCircle2, Star } from 'lucide-react';

export default function AttendanceProgressSection({ user, lang = 'en' }) {
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
      <div className="card-header-block">
        <h3 className="card-title-main">
          <TrendingUp size={18} className="text-violet" />
          <span>{lang === 'ta' ? 'முன்னேற்றம்' : 'Progress'}</span>
        </h3>
        <p className="card-sub-motto">
          {lang === 'ta' ? 'உங்கள் பயணத்தைக் கண்காணித்து வளர்ச்சியைக் கொண்டாடுங்கள்.' : 'Track your journey and celebrate your growth.'}
        </p>
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
          <strong className="prog-metric-val">{user?.classesAttended || 12}</strong>
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
                  strokeDashoffset="47.75" // 80%
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
    </div>
  );
}
