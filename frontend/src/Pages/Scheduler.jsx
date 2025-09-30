import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Search, RefreshCw, Clock, Calendar as CalendarIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/ReportTable.css';
import '../Styles/Scrape.css';
import '../Styles/Scheduler.css';
import { truncateText, openGoogleMaps, formatDate } from '../utils.js';

// Simple Time Input Component
const SimpleTimeInput = ({ selectedTime, onChange }) => {
	const [timeInput, setTimeInput] = useState('');
	const [period, setPeriod] = useState('AM');
	
	// Initialize time input from selectedTime
	useEffect(() => {
		if (selectedTime) {
			const hours = selectedTime.getHours();
			const minutes = selectedTime.getMinutes();
			const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
			const displayMinute = minutes.toString().padStart(2, '0');
			setTimeInput(`${displayHour}:${displayMinute}`);
			setPeriod(hours >= 12 ? 'PM' : 'AM');
		} else {
			setTimeInput('9:00');
			setPeriod('AM');
		}
	}, [selectedTime]);
	
	const handleTimeChange = (newTimeInput, newPeriod = period) => {
		// Validate time format (H:MM or HH:MM)
		const timeRegex = /^(\d{1,2}):(\d{2})$/;
		const match = newTimeInput.match(timeRegex);
		
		if (match) {
			let hour = parseInt(match[1]);
			const minute = parseInt(match[2]);
			
			// Validate hour and minute ranges
			if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
				// Convert to 24-hour format
				if (newPeriod === 'PM' && hour !== 12) {
					hour += 12;
				} else if (newPeriod === 'AM' && hour === 12) {
					hour = 0;
				}
				
				const newDateTime = new Date(selectedTime || new Date());
				newDateTime.setHours(hour, minute, 0, 0);
				onChange(newDateTime);
			}
		}
	};
	
	const handleInputChange = (e) => {
		const value = e.target.value;
		setTimeInput(value);
		handleTimeChange(value, period);
	};
	
	const handlePeriodChange = (e) => {
		const newPeriod = e.target.value;
		setPeriod(newPeriod);
		if (timeInput) {
			handleTimeChange(timeInput, newPeriod);
		}
	};
	
	return (
		<div className="simple-time-input">
			<div className="time-input-group">
				<div className="time-field">
					<label className="time-label">Time</label>
					<input
						type="text"
						value={timeInput}
						onChange={handleInputChange}
						placeholder="9:00"
						className="time-text-input"
						maxLength="5"
					/>
					<small className="time-hint">Format: H:MM</small>
				</div>
				<div className="period-field">
					<label className="time-label">Period</label>
					<div className="period-toggle">
						<button
							type="button"
							className={`period-btn ${period === 'AM' ? 'active' : ''}`}
							onClick={() => handlePeriodChange({ target: { value: 'AM' } })}
						>
							AM
						</button>
						<button
							type="button"
							className={`period-btn ${period === 'PM' ? 'active' : ''}`}
							onClick={() => handlePeriodChange({ target: { value: 'PM' } })}
						>
							PM
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

SimpleTimeInput.propTypes = {
	selectedTime: PropTypes.instanceOf(Date),
	onChange: PropTypes.func.isRequired,
};

const sampleReports = [
	{ id: 1, platform: 'Facebook', post: 'Hate content example...', user: { name: 'Satish Kumar', username: '@satish_k' }, toxicitySeverity: 'High', toxicityScore: 8.7, toxicityTags: ['hate','harassment'], postLink: '#', location:{lat:12.97,lng:77.59}, policeStation:'Hingna Police Station', reportedAt:'2025-01-05T10:30:00Z' },
	{ id: 2, platform: 'Twitter', post: 'Spam/scam post...', user: { name: 'Harish', username: '@harish_2024' }, toxicitySeverity: 'Medium', toxicityScore: 6.2, toxicityTags: ['spam','scam'], postLink: '#', location:{lat:40.71,lng:-74.0}, policeStation:'NYPD 1st Precinct', reportedAt:'2025-01-05T14:15:00Z' },
	{ id: 3, platform: 'Instagram', post: 'Inappropriate content...', user: { name: 'Ramesh Gade', username: '@ramesh_gade' }, toxicitySeverity: 'Low', toxicityScore: 3.4, toxicityTags: ['inappropriate'], postLink: '#', location:{lat:34.05,lng:-118.24}, policeStation:'Nagpur Central Division', reportedAt:'2025-01-05T16:45:00Z' },
];

const platformOptions = [
	{ value: 'Facebook', label: 'Facebook' },
	{ value: 'Twitter', label: 'Twitter' },
	{ value: 'Instagram', label: 'Instagram' },
	{ value: 'TikTok', label: 'TikTok' },
	{ value: 'YouTube', label: 'YouTube' },
	{ value: 'LinkedIn', label: 'LinkedIn' },
	{ value: 'Reddit', label: 'Reddit' },
];

const severityOptions = [
	{ value: 'High', label: 'High' },
	{ value: 'Medium', label: 'Medium' },
	{ value: 'Low', label: 'Low' },
];

const Scheduler = () => {
	// Filters
	const [selectedPlatform, setSelectedPlatform] = useState(null);
	const [selectedSeverity, setSelectedSeverity] = useState(null);
	const [query, setQuery] = useState('');
	const [type, setType] = useState('hashtag');
	const [location, setLocation] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [isRefreshing, setIsRefreshing] = useState(false);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);

	// Scheduling
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState(null);
	const [scheduleDateTime, setScheduleDateTime] = useState(null);

	// Scheduled list
	const [scheduledItems, setScheduledItems] = useState(() => {
		try { const raw = localStorage.getItem('garudaScheduledReports'); return raw ? JSON.parse(raw) : []; } catch { return []; }
	});
	const [scheduledSearch, setScheduledSearch] = useState('');
	
	// Auto-remove completed scheduled items
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			setScheduledItems(prev => prev.filter(item => new Date(item.when) > now));
		}, 60000); // Check every minute
		return () => clearInterval(interval);
	}, []);
	
	useEffect(() => { localStorage.setItem('garudaScheduledReports', JSON.stringify(scheduledItems)); }, [scheduledItems]);

	const hasActiveFilters = (selectedPlatform && selectedPlatform.value) || (selectedSeverity && selectedSeverity.value) || query || location || startDate || endDate;

	const handleRefresh = async () => { setIsRefreshing(true); await new Promise(r => setTimeout(r, 600)); setIsRefreshing(false); };
	const clearFilters = () => { setSelectedPlatform(null); setSelectedSeverity(null); setQuery(''); setLocation(''); setStartDate(''); setEndDate(''); setCurrentPage(1); };

	// Filtering logic (mirrors Reports)
	const filteredReports = useMemo(() => sampleReports.filter(report => {
		const matchesQuery = query === '' || (type === 'hashtag' && report.post.toLowerCase().includes(query.toLowerCase())) || (type === 'username' && (report.user.username.toLowerCase().includes(query.toLowerCase()) || report.user.name.toLowerCase().includes(query.toLowerCase())));
		const matchesPlatform = !selectedPlatform || (selectedPlatform.value && report.platform === selectedPlatform.value);
		const matchesSeverity = !selectedSeverity || (selectedSeverity.value && report.toxicitySeverity === selectedSeverity.value);
		const matchesLocation = location === '' || report.policeStation.toLowerCase().includes(location.toLowerCase());
		const rDate = new Date(report.reportedAt);
		const matchesStart = startDate === '' || rDate >= new Date(startDate);
		const matchesEnd = endDate === '' || rDate <= new Date(endDate);
		return matchesQuery && matchesPlatform && matchesSeverity && matchesLocation && matchesStart && matchesEnd;
	}), [query, type, selectedPlatform, selectedSeverity, location, startDate, endDate]);

	useEffect(() => { const tp = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage)); if (currentPage > tp) setCurrentPage(tp); }, [filteredReports.length, itemsPerPage, currentPage]);

	const totalItems = filteredReports.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentReports = filteredReports.slice(startIndex, endIndex);

	// Schedule handlers
	const roundToNextQuarter = (date) => {
		const d = new Date(date);
		d.setSeconds(0, 0);
		const minutes = d.getMinutes();
		const rounded = Math.ceil(minutes / 15) * 15;
		d.setMinutes(rounded);
		return d;
	};

	const inHours = (hours) => { const d = roundToNextQuarter(new Date()); d.setHours(d.getHours() + hours); return d; };
	const tomorrowAt = (hour = 9, minute = 0) => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(hour, minute, 0, 0); return d; };
	const nextMondayAt = (hour = 9, minute = 0) => { const d = new Date(); const day = d.getDay(); const diff = (8 - day) % 7 || 7; d.setDate(d.getDate() + diff); d.setHours(hour, minute, 0, 0); return d; };
	const openScheduleModal = (report, existingDateTime = null) => { setSelectedReport(report); setScheduleDateTime(existingDateTime); setScheduleModalOpen(true); };
	const closeScheduleModal = () => { setScheduleModalOpen(false); setSelectedReport(null); setScheduleDateTime(null); };
	const saveSchedule = () => {
		if (!selectedReport || !scheduleDateTime) return;
		const newItem = { id: `${selectedReport.id}-${Date.now()}`, report: selectedReport, when: scheduleDateTime.toISOString(), status: 'scheduled' };
		setScheduledItems(prev => {
			const withoutSameReport = prev.filter(it => it.report?.id !== selectedReport.id);
			return [newItem, ...withoutSameReport].sort((a,b) => new Date(a.when) - new Date(b.when));
		});
		closeScheduleModal();
	};
	const removeScheduled = (id) => setScheduledItems(prev => prev.filter(it => it.id !== id));
	const filteredScheduled = useMemo(() => {
		if (!scheduledSearch) return scheduledItems;
		const q = scheduledSearch.toLowerCase();
		return scheduledItems.filter(it => it.report.user.name.toLowerCase().includes(q) || it.report.user.username.toLowerCase().includes(q) || it.report.platform.toLowerCase().includes(q) || it.report.policeStation.toLowerCase().includes(q) || it.report.post.toLowerCase().includes(q));
	}, [scheduledItems, scheduledSearch]);

	return (
		<div className="scheduler-page">
			<div className="security-reports__header">
				<div className="header-content">
					<div className="header-text">
						<h1 className="security-reports__title">Scheduler</h1>
						<p className="security-reports__subtitle">Manage scheduled follow-ups and create new schedules from reports</p>
					</div>
				</div>
			</div>

			{/* Search + Filter UI (like Reports) */}
			<div className="search-filter-container">
				<div className="search-section-compact">
					<div className="search-inputs-row">
						<div className="search-input-group">
							<label className="compact-label">Hashtag</label>
							<input className="form-input-compact hashtag-input" placeholder="#cybersecurity" value={type === 'hashtag' ? query : ''} onChange={(e)=>{setQuery(e.target.value); setType('hashtag'); }} />
						</div>
						<div className="search-input-group username-group">
							<label className="compact-label">Username</label>
							<input className="form-input-compact username-input" placeholder="@username" value={type === 'username' ? query : ''} onChange={(e)=>{setQuery(e.target.value); setType('username'); }} />
						</div>
						<div className="search-input-group location-group">
							<label className="compact-label">Location</label>
							<input className="form-input-compact location-input" placeholder="City, police station, or coords" value={location} onChange={(e)=> setLocation(e.target.value)} />
						</div>
						<button className="btn btn-primary compact-search-btn" type="button" disabled={!query}>
							<Search size={14} /> Search
						</button>
					</div>
				</div>
				<div className="filter-section-compact">
					<div className="filter-inputs-row">
						<div className="filter-input-group">
							<label className="compact-label">Platform</label>
							<Select className="react-select-container" classNamePrefix="react-select" options={platformOptions} value={selectedPlatform} onChange={setSelectedPlatform} isClearable placeholder="All Platforms" />
						</div>
						<div className="filter-input-group">
							<label className="compact-label">Severity</label>
							<Select className="react-select-container" classNamePrefix="react-select" options={severityOptions} value={selectedSeverity} onChange={setSelectedSeverity} isClearable placeholder="All Severities" />
						</div>
						<div className="filter-input-group">
							<label className="compact-label">Start Date</label>
							<DatePicker selected={startDate ? new Date(startDate) : null} onChange={(d)=> setStartDate(d ? d.toISOString().slice(0,10) : '')} className="filter-input-compact" placeholderText="Select start date" dateFormat="yyyy-MM-dd" isClearable />
						</div>
						<div className="filter-input-group">
							<label className="compact-label">End Date</label>
							<DatePicker selected={endDate ? new Date(endDate) : null} onChange={(d)=> setEndDate(d ? d.toISOString().slice(0,10) : '')} className="filter-input-compact" placeholderText="Select end date" dateFormat="yyyy-MM-dd" isClearable />
						</div>
						<div style={{display:'flex', gap:8}}>
							<button type="button" className="btn btn-outline clear-filters-btn-compact" onClick={clearFilters} disabled={!hasActiveFilters}>Clear Filters</button>
							<button onClick={handleRefresh} disabled={isRefreshing} className={`btn btn-outline refresh-btn-compact ${isRefreshing ? 'refreshing' : ''}`} title="Refresh data">
								<RefreshCw size={16} className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
								{isRefreshing ? 'Refreshing...' : 'Refresh'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Scheduled section after search/filter */}
			<div className="scheduled-card">
				<div className="scheduled-card__header">
					<h2 className="scheduled-card__title">
						<CalendarIcon size={18} />
						<span>Scheduled Reports</span>
						<span className="count-badge">{scheduledItems.length}</span>
					</h2>
					<div className="scheduled-actions">
						<input className="form-input-compact" placeholder="Search scheduled..." value={scheduledSearch} onChange={(e) => setScheduledSearch(e.target.value)} />
					</div>
				</div>
				<div className="reports-table-wrapper">
					<table className="reports-table">
						<thead>
							<tr>
								<th>When</th>
								<th>Report</th>
								<th>User</th>
								<th>Platform</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredScheduled.length ? filteredScheduled.map(item => (
								<tr key={item.id}>
									<td>
										<div className="when-chip"><Clock size={14}/> {formatDate(item.when)}</div>
									</td>
									<td className="content-cell">
										<div className="content-preview-static" title={item.report.post}>{truncateText(item.report.post, 80)}</div>
									</td>
									<td>
										<div className="user-info">
											<div className="user-name">{item.report.user.name}</div>
											<div className="user-handle">{item.report.user.username}</div>
										</div>
									</td>
									<td>
										<span className={`platform-badge platform-badge--${item.report.platform.toLowerCase()}`}>{item.report.platform}</span>
									</td>
									<td className="actions-cell">
										<div className="action-buttons-group">
											<button className="btn btn-outline btn-reschedule" onClick={() => openScheduleModal(item.report, new Date(item.when))}>Reschedule</button>
											<button className="btn btn-danger btn-cancel" onClick={() => removeScheduled(item.id)}>Cancel</button>
										</div>
									</td>
								</tr>
							)) : (
								<tr>
									<td colSpan="5" className="no-results">
										<div className="no-results-content"><p>No items scheduled</p></div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Results summary */}
			<div className="security-reports__summary">
				<span className="results-count">{hasActiveFilters ? <>Showing {totalItems} of {sampleReports.length} reports</> : <>Total {totalItems} reports</>}</span>
				{isRefreshing && (<span className="refresh-status">Refreshing data...</span>)}
			</div>

			{/* Reports table for scheduling */}
			<div className="security-reports__content">
				<div className="reports-table-wrapper">
					<table className="reports-table">
						<thead>
							<tr>
								<th>Platform</th>
								<th>Content</th>
								<th>User</th>
								<th>Severity</th>
								<th>Schedule</th>
							</tr>
						</thead>
						<tbody>
							{currentReports.length ? currentReports.map(report => (
								<tr key={report.id} className="reports-table__row">
									<td><span className={`platform-badge platform-badge--${report.platform.toLowerCase()}`}>{report.platform}</span></td>
									<td className="content-cell">
										<div className="content-preview-static" title={report.post}>{truncateText(report.post, 80)}</div>
										<div className="content-meta">
											<button className="link-btn" onClick={() => openGoogleMaps(report.location.lat, report.location.lng)}>View location</button>
											<span className="dot">•</span>
											<a className="link-btn" href={report.postLink} target="_blank" rel="noreferrer">Open post</a>
										</div>
									</td>
									<td className="user-cell"><div className="user-info"><div className="user-name">{report.user.name}</div><div className="user-handle">{report.user.username}</div></div></td>
									<td><span className={`severity-badge severity-${report.toxicitySeverity.toLowerCase()}`}>{report.toxicitySeverity}</span></td>
									<td className="actions-cell">
										<button className="btn btn-primary" onClick={() => openScheduleModal(report)}><Clock size={14}/> Schedule</button>
									</td>
								</tr>
							)) : (
								<tr>
									<td colSpan="5" className="no-results"><div className="no-results-content"><p>No reports found</p></div></td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalItems > 0 && (
					<div className="pagination-container">
						<div className="pagination-info">
							<span>Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}</span>
							<select value={itemsPerPage} onChange={(e)=>{ setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="items-per-page">
								<option value={5}>5 per page</option>
								<option value={10}>10 per page</option>
								<option value={20}>20 per page</option>
							</select>
						</div>
						<div className="pagination-controls">
							<button onClick={()=> setCurrentPage(1)} disabled={currentPage === 1} className="pagination-btn">«</button>
							<button onClick={()=> setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="pagination-btn">‹</button>
							<div className="pagination-numbers">
								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
														.map((page, index, array) => (
															<React.Fragment key={page}>
																{index > 0 && array[index - 1] !== page - 1 && (<span className="pagination-ellipsis">...</span>)}
																<button className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
															</React.Fragment>
														))}
							</div>
							<button onClick={()=> setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="pagination-btn">›</button>
							<button onClick={()=> setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="pagination-btn">»</button>
						</div>
					</div>
				)}
			</div>

			{/* Schedule Modal */}
			{scheduleModalOpen && (
				<div className="scheduler-modal-backdrop" role="dialog" aria-modal>
					<div className="scheduler-modal-card">
						<div className="scheduler-modal-header">
							<h3><Clock size={16}/> Schedule Follow-up</h3>
							<button className="scheduler-icon-btn" onClick={closeScheduleModal}>✕</button>
						</div>
						<div className="scheduler-modal-body">
							{selectedReport && (
								<div className="modal-report-preview">
									<div className="mb-8">
										<span className={`platform-badge platform-badge--${selectedReport.platform.toLowerCase()}`}>{selectedReport.platform}</span>
										<span className={`severity-badge severity-${selectedReport.toxicitySeverity.toLowerCase()}`} style={{ marginLeft: 8 }}>{selectedReport.toxicitySeverity}</span>
									</div>
									<p className="scheduler-modal-report-text">{truncateText(selectedReport.post, 140)}</p>
									<div className="scheduler-modal-report-meta">
										<span>{selectedReport.user.name} ({selectedReport.user.username})</span>
										<span className="dot">•</span>
										<a href={selectedReport.postLink} target="_blank" rel="noreferrer">Open post</a>
									</div>
								</div>
							)}
							<div className="datetime-picker">
								<div className="datetime-section">
									<label className="compact-label">Select Date</label>
									<div className="date-input-wrapper">
										<CalendarIcon size={16} className="date-icon" />
										<DatePicker
											selected={scheduleDateTime}
											onChange={(date) => {
												if (date) {
													const currentTime = scheduleDateTime || roundToNextQuarter(new Date());
													const newDateTime = new Date(date);
													newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
													setScheduleDateTime(newDateTime);
												} else {
													setScheduleDateTime(null);
												}
											}}
											dateFormat="MMM d, yyyy"
											className="filter-input-compact date-input"
											placeholderText="Choose date"
											minDate={new Date()}
											showPopperArrow={false}
										/>
									</div>
								</div>
								
								<div className="time-section">
									<label className="compact-label">Select Time</label>
									<SimpleTimeInput
										selectedTime={scheduleDateTime}
										onChange={setScheduleDateTime}
									/>
								</div>
								
								<div className="quick-presets" aria-label="Quick schedule presets">
									<span className="presets-label">Quick Options:</span>
									<div className="presets-grid">
										<button type="button" className="preset-chip" onClick={() => setScheduleDateTime(inHours(1))}>
											<Clock size={12} />In 1 hour
										</button>
										<button type="button" className="preset-chip" onClick={() => setScheduleDateTime(tomorrowAt(9,0))}>
											<CalendarIcon size={12} />Tomorrow 9 AM
										</button>
										<button type="button" className="preset-chip" onClick={() => setScheduleDateTime(nextMondayAt(9,0))}>
											<CalendarIcon size={12} />Next Monday 9 AM
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="scheduler-modal-footer">
							<button className="btn btn-outline" onClick={closeScheduleModal}>Close</button>
							<button className="btn btn-primary" disabled={!scheduleDateTime} onClick={saveSchedule}><Clock size={14}/> Schedule</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Scheduler;

