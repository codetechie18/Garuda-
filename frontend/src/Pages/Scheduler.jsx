import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, SearchCodeIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/Scheduler.css';

// Clean, minimal Scheduler component
export default function Scheduler() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('hashtag');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [scheduleDateTime, setScheduleDateTime] = useState(null);
  const [timeInput, setTimeInput] = useState(''); // hh:mm (12-hour)
  const [ampm, setAmpm] = useState('AM');

  useEffect(() => {
    if (!scheduleDateTime) { setTimeInput(''); setAmpm('AM'); return; }
    const d = new Date(scheduleDateTime);
    const h = d.getHours();
    const m = d.getMinutes();
    const displayH = h % 12 === 0 ? 12 : h % 12;
    setTimeInput(`${String(displayH).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
    setAmpm(h >= 12 ? 'PM' : 'AM');
  }, [scheduleDateTime]);

  const handleSetAmpm = (val) => {
    setAmpm(val);
    const trimmed = (timeInput || '').trim();
    if (!trimmed) return;
    const parts = trimmed.split(':');
    if (parts.length !== 2) return;
    let hh = Number(parts[0]);
    let mm = Number(parts[1]);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
    if (val === 'PM' && hh < 12) hh = hh + 12;
    if (val === 'AM' && hh === 12) hh = 0;
    const base = scheduleDateTime ? new Date(scheduleDateTime) : new Date();
    const d = new Date(base);
    d.setHours(hh, mm, 0, 0);
    setScheduleDateTime(d);
  };

  const sampleReports = useMemo(() => [
    { id: 1, platform: 'Facebook', post: 'Sample A', user: { name: 'Satish' }, reportedAt: '2025-01-05T10:30:00Z' },
    { id: 2, platform: 'Twitter', post: 'Sample B', user: { name: 'Harish' }, reportedAt: '2025-01-05T14:15:00Z' },
    { id: 3, platform: 'Instagram', post: 'Sample C', user: { name: 'Ramesh' }, reportedAt: '2025-01-05T16:45:00Z' }
  ], []);

  const platformOptions = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Instagram', label: 'Instagram' }
  ];

  const statusOptions = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' }
  ];

 
  const [scheduledReports] = useState(sampleReports.map((r, i) => ({ ...r, id: i + 1, date: new Date().toISOString(), status: ['Scheduled','In Progress','Completed'][i % 3] })));

  const filteredScheduledReports = useMemo(() => {
    let f = [...scheduledReports];
    if (query.trim()) {
      const s = query.toLowerCase();
      f = f.filter(rr => rr.user.name.toLowerCase().includes(s) || rr.status.toLowerCase().includes(s) || rr.platform.toLowerCase().includes(s));
    }
    if (selectedPlatform) f = f.filter(rr => rr.platform.toLowerCase() === selectedPlatform.value.toLowerCase());
    if (selectedStatus) f = f.filter(rr => rr.status.toLowerCase() === selectedStatus.value.toLowerCase());
    if (location.trim()) f = f.filter(rr => rr.location && rr.location.toString().toLowerCase().includes(location.toLowerCase()));
    if (startDate || endDate) f = f.filter(rr => { const d = new Date(rr.date); const s = startDate ? new Date(startDate) : null; const e = endDate ? new Date(endDate) : null; if (s && d < s) return false; if (e && d > e) return false; return true; });
    return f;
  }, [scheduledReports, query, selectedPlatform, selectedStatus, location, startDate, endDate]);

  const [scheduledCurrentPage, setScheduledCurrentPage] = useState(1);
  const [scheduledItemsPerPage, setScheduledItemsPerPage] = useState(5);
  const scheduledTotalItems = filteredScheduledReports.length;
  const scheduledTotalPages = Math.max(1, Math.ceil(scheduledTotalItems / scheduledItemsPerPage));
  const scheduledStartIndex = (scheduledCurrentPage - 1) * scheduledItemsPerPage;
  const scheduledEndIndex = scheduledStartIndex + scheduledItemsPerPage;
  const scheduledCurrentReports = filteredScheduledReports.slice(scheduledStartIndex, scheduledEndIndex);

  const saveSchedule = () => {
    if (!scheduleDateTime || filteredScheduledReports.length === 0) return;
    const toSchedule = filteredScheduledReports.map(r => r.id);
    console.log('Scheduling visible reports:', toSchedule, 'for:', scheduleDateTime);
    alert(`Successfully scheduled ${toSchedule.length} report${toSchedule.length !== 1 ? 's' : ''} for ${scheduleDateTime.toLocaleString()}`);
  };

  return (
    <div className="scrape-page">
      <div className="scrape-container">
        <div className="security-reports__header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="security-reports__title">Scheduler</h1>
            <p className="security-reports__subtitle">Manage scheduled follow-ups and create new schedules from reports</p>
          </div>
        </div>
      </div>

      <div className="search-filter-container">
        <div className="search-section-compact">
          <div className="search-inputs-row">
            <div className="search-input-group">
              <label className="compact-label">Hashtag</label>
              <input className="form-input-compact" placeholder="#cybersecurity" value={type === 'hashtag' ? query : ''} onChange={(e) => { setQuery(e.target.value); setType('hashtag'); }} />
            </div>
            <div className="search-input-group">
              <label className="compact-label">Username</label>
              <input className="form-input-compact" placeholder="@username" value={type === 'username' ? query : ''} onChange={(e) => { setQuery(e.target.value); setType('username'); }} />
            </div>
            <div className="search-input-group">
              <label className="compact-label">Location</label>
              <input className="form-input-compact" placeholder="City, police station, or coords" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <button className="btn btn-primary compact-search-btn" type="button" disabled={!query}><SearchCodeIcon size={14} /> Search</button>
          </div>
        </div>

        <div className="filter-section-compact">
          <div className="filter-inputs-row">
            <div className="filter-input-group">
              <label className="compact-label">Platform</label>
              <Select className="react-select-container" classNamePrefix="react-select" options={platformOptions} value={selectedPlatform} onChange={setSelectedPlatform} isClearable placeholder="All Platforms" />
            </div>
            <div className="filter-input-group">
              <label className="compact-label">Status</label>
              <Select className="react-select-container" classNamePrefix="react-select" options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} isClearable placeholder="All Statuses" />
            </div>
            <div className="filter-input-group">
              <label className="compact-label">Start Date</label>
              <DatePicker selected={startDate ? new Date(startDate) : null} onChange={(d) => setStartDate(d ? d.toISOString().slice(0, 10) : '')} className="filter-input-compact" placeholderText="Select start date" dateFormat="yyyy-MM-dd" isClearable />
            </div>
            <div className="filter-input-group">
              <label className="compact-label">End Date</label>
              <DatePicker selected={endDate ? new Date(endDate) : null} onChange={(d) => setEndDate(d ? d.toISOString().slice(0, 10) : '')} className="filter-input-compact" placeholderText="Select end date" dateFormat="yyyy-MM-dd" isClearable />
            </div>

            <button type="button" className="btn btn-outline clear-filters-btn-compact" onClick={() => { setSelectedPlatform(null); setSelectedStatus(null); setQuery(''); setLocation(''); setStartDate(''); setEndDate(''); }} disabled={!(selectedPlatform || selectedStatus || query || location || startDate || endDate)}>Clear Filters</button>
          </div>
        </div>
      </div>

      
  <div className="inline-scheduler-container">
    <div className="inline-scheduler">
          <div className="inline-scheduler-row">
            <div className="inline-scheduler-item">
              <label className="compact-label">Date</label>
              <DatePicker
                selected={scheduleDateTime}
                onChange={(date) => {
                  if (!date) { setScheduleDateTime(null); return; }
                  const base = scheduleDateTime ? new Date(scheduleDateTime) : new Date();
                  const newDate = new Date(date);
                  if (scheduleDateTime) newDate.setHours(base.getHours(), base.getMinutes(), 0, 0);
                  setScheduleDateTime(newDate);
                }}
                dateFormat="MMM d, yyyy"
                className="filter-input-compact date-input"
                placeholderText="Choose date"
                minDate={new Date()}
                showPopperArrow={false}
              />
            </div>

            <div className="inline-scheduler-item">
              <label className="compact-label">Time</label>
              <div className="time-row">
                <input
                  type="text"
                  className="time-input"
                  placeholder="12:00"
                  maxLength={5}
                  value={timeInput}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9:]/g, '');
                    const colonCount = (val.match(/:/g) || []).length;
                    if (colonCount > 1) val = val.replace(/:(?=.*:)/g, '');
                    if (/^\d{3,}$/.test(val) && val[2] !== ':') val = val.slice(0, 2) + ':' + val.slice(2, 4);
                    if (val.length > 5) val = val.slice(0, 5);
                    setTimeInput(val);
                    if (!/^([0]?[1-9]|1[0-2]):[0-5][0-9]$/.test(val)) { setScheduleDateTime(null); return; }
                    const [hhStr, mmStr] = val.split(':');
                    let hh = Number(hhStr); let mm = Number(mmStr);
                    if (Number.isNaN(hh) || Number.isNaN(mm)) return;
                    if (ampm === 'PM' && hh < 12) hh = hh + 12;
                    if (ampm === 'AM' && hh === 12) hh = 0;
                    const base = scheduleDateTime ? new Date(scheduleDateTime) : new Date();
                    const d = new Date(base);
                    d.setHours(hh, mm, 0, 0);
                    setScheduleDateTime(d);
                  }}
                />

                <div className="ampm-toggle">
                  <button type="button" className={`period-btn ${ampm === 'AM' ? 'active' : ''}`} onClick={() => handleSetAmpm('AM')}>AM</button>
                  <button type="button" className={`period-btn ${ampm === 'PM' ? 'active' : ''}`} onClick={() => handleSetAmpm('PM')}>PM</button>
                </div>
              </div>
            </div>

            <div className="inline-scheduler-item">
              <button className="btn btn-primary" disabled={!scheduleDateTime || filteredScheduledReports.length === 0} onClick={saveSchedule}>
                <CalendarIcon size={14} /> Schedule ({filteredScheduledReports.length})
              </button>
            </div>
          </div>
    </div>
  </div>

        <div className="scheduled-reports-section">
          <div className="scheduled-reports-header"><h2 className="scheduled-reports-title">Scheduled Reports</h2></div>
        <div className="scheduled-reports-table-container">
          <table className="scheduled-reports-table">
            <thead>
              <tr>
                <th className="sr-no-header">Sr. No.</th>
                <th className="date-header">Date Scheduled</th>
                <th className="user-header">User Name</th>
                <th className="filters-header">Applied Filters</th>
                <th className="status-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduledCurrentReports.map((report, index) => (
                <tr key={report.id} className="scheduled-report-row">
                  <td className="sr-no-cell">{scheduledStartIndex + index + 1}</td>
                  <td className="date-cell">
                    <div className="date-main">{new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    <div className="date-time">{new Date(report.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="user-cell"><div className="user-name">{report.user.name}</div></td>
                  <td className="filters-cell"><div className="filter-chips-simple">{report.platform && (<span className="filter-chip platform">{report.platform}</span>)}</div></td>
                  <td className="status-cell"><span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span></td>
                </tr>
              ))}

              {scheduledCurrentReports.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-results">
                    <div className="no-results-content">
                      <p className="no-results-text">{scheduledReports.length === 0 ? 'No scheduled reports' : 'No matching reports'}</p>
                      {scheduledReports.length > 0 && scheduledCurrentReports.length === 0 && (
                        <button onClick={() => { setSelectedPlatform(null); setSelectedStatus(null); setQuery(''); setLocation(''); setStartDate(''); setEndDate(''); }} className="clear-search-btn">Clear Filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {scheduledTotalItems > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span>Showing {scheduledStartIndex + 1}-{Math.min(scheduledEndIndex, scheduledTotalItems)} of {scheduledTotalItems}</span>
              <select value={scheduledItemsPerPage} onChange={e => { setScheduledItemsPerPage(Number(e.target.value)); setScheduledCurrentPage(1); }} className="items-per-page">
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </select>
            </div>

            <div className="pagination-controls">
              <button onClick={() => setScheduledCurrentPage(1)} disabled={scheduledCurrentPage === 1} className="pagination-btn">«</button>
              <button onClick={() => setScheduledCurrentPage(p => Math.max(1, p - 1))} disabled={scheduledCurrentPage === 1} className="pagination-btn">‹</button>
              <div className="pagination-numbers">
                {Array.from({ length: scheduledTotalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === scheduledTotalPages || Math.abs(page - scheduledCurrentPage) <= 1)
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (<span className="pagination-ellipsis">...</span>)}
                      <button className={`pagination-btn ${scheduledCurrentPage === page ? 'active' : ''}`} onClick={() => setScheduledCurrentPage(page)}>{page}</button>
                    </React.Fragment>
                  ))}
              </div>
              <button onClick={() => setScheduledCurrentPage(p => Math.min(scheduledTotalPages, p + 1))} disabled={scheduledCurrentPage === scheduledTotalPages} className="pagination-btn">›</button>
              <button onClick={() => setScheduledCurrentPage(scheduledTotalPages)} disabled={scheduledCurrentPage === scheduledTotalPages} className="pagination-btn">»</button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
