import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, SearchCodeIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/ReportTable.css';
import '../Styles/Scrape.css';
import '../Styles/Scheduler.css';
// utils not currently used in this file



const sampleReports = [
	{
		id: 1,
		platform: 'Facebook',
		post: 'This is absolutely disgusting behavior from these people. They should all be banned and removed from our community immediately. This kind of hate speech cannot be tolerated.',
		user: { name: 'Satish Kumar', username: '@satish_kumar' },
		toxicitySeverity: 'High',
		toxicityScore: 8.7,
		toxicityTags: ['hate', 'harassment'],
		postLink: 'https://facebook.com/posts/123456789',
		location: { lat: 12.9715987, lng: 77.5945627 },
		policeStation: 'Hingna Police Station',
		reportedAt: '2025-01-05T10:30:00Z'
	},
	{
		id: 2,
		platform: 'Twitter',
		post: 'Another spam message trying to sell fake products. These scammers are getting more creative with their approaches and targeting vulnerable users.',
		user: { name: 'Harish', username: '@harish_2024' },
		toxicitySeverity: 'Medium',
		toxicityScore: 6.2,
		toxicityTags: ['spam', 'scam'],
		postLink: 'https://twitter.com/user/status/987654321',
		location: { lat: 40.7128, lng: -74.0060 },
		policeStation: 'NYPD 1st Precinct',
		reportedAt: '2025-01-05T14:15:00Z'
	},
	{
		id: 3,
		platform: 'Instagram',
		post: 'Mild inappropriate content that violates community guidelines but is not severely harmful.',
		user: { name: 'Ramesh Gade', username: '@ramesh_gade' },
		toxicitySeverity: 'Low',
		toxicityScore: 3.4,
		toxicityTags: ['inappropriate'],
		postLink: 'https://instagram.com/p/ABC123DEF',
		location: { lat: 34.0522, lng: -118.2437 },
		policeStation: 'Nagpur Central Division',
		reportedAt: '2025-01-05T16:45:00Z'
	},
	{
		id: 4,
		platform: 'TikTok',
		post: 'Extremely concerning content promoting dangerous activities. This could seriously harm young viewers who might attempt to replicate these dangerous stunts.',
		user: { name: 'Nazim Ansari', username: '@nazim_ansari_2024' },
		toxicitySeverity: 'High',
		toxicityScore: 9.1,
		toxicityTags: ['dangerous', 'harmful'],
		postLink: 'https://tiktok.com/@user/video/123456789',
		location: { lat: 51.5074, lng: -0.1278 },
		policeStation: 'Metropolitan Police - Westminster',
		reportedAt: '2025-01-05T11:20:00Z'
	},
	{
		id: 5,
		platform: 'YouTube',
		post: 'Video contains moderate levels of abusive language and personal attacks against specific individuals in the community.',
		user: { name: 'Omen', username: '@omen_yt' },
		toxicitySeverity: 'Medium',
		toxicityScore: 5.8,
		toxicityTags: ['abuse', 'personal attack'],
		postLink: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
		location: { lat: 37.7749, lng: -122.4194 },
		policeStation: 'SFPD Central Station',
		reportedAt: '2025-01-05T13:10:00Z'
	}
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


const statusOptions = [
	{ value: 'Scheduled', label: 'Scheduled' },
	{ value: 'In Progress', label: 'In Progress' },
	{ value: 'Completed', label: 'Completed' },
	{ value: 'Failed', label: 'Failed' },
];


const Scheduler = () => {
	// Filters
	const [selectedPlatform, setSelectedPlatform] = useState(null);
	// const [selectedSeverity, setSelectedSeverity] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [query, setQuery] = useState('');
	const [type, setType] = useState('hashtag');
	const [location, setLocation] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(5);

	// Scheduling
	const [selectedReports, setSelectedReports] = useState([]);
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [scheduleDateTime, setScheduleDateTime] = useState(null);

	// controlled time input state (hh:mm in 12-hour) and AM/PM
	const [timeInput, setTimeInput] = useState('');
	const [ampm, setAmpm] = useState('AM');

	// Derived display helpers for time input
	// keep timeInput and ampm in sync with scheduleDateTime
	useEffect(() => {
		if (!scheduleDateTime) {
			setTimeInput('');
			setAmpm('AM');
			return;
		}
		const d = new Date(scheduleDateTime);
		let h = d.getHours();
		const m = d.getMinutes();
		const displayH = h % 12 === 0 ? 12 : h % 12;
		setTimeInput(`${String(displayH).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
		setAmpm(h >= 12 ? 'PM' : 'AM');
	}, [scheduleDateTime]);

	// Scheduled reports state
	const [scheduledReports] = useState([
		{
			id: 1,
			date: '2025-10-02T09:30:00Z',
			userName: 'John Doe',
			filters: {
				platform: 'Twitter',
				severity: 'High',
				hashtag: '#cybersecurity',
				location: 'Mumbai',
				dateRange: '2025-09-01 to 2025-09-30'
			},
			status: 'Scheduled'
		},
		{
			id: 2,
			date: '2025-10-02T11:15:00Z',
			userName: 'Jane Smith',
			filters: {
				platform: 'Facebook',
				severity: 'Medium',
				username: '@security_expert',
				location: 'Delhi',
				dateRange: '2025-09-15 to 2025-10-02'
			},
			status: 'In Progress'
		},
		{
			id: 3,
			date: '2025-10-01T16:45:00Z',
			userName: 'Mike Johnson',
			filters: {
				platform: 'Instagram',
				severity: 'Low',
				hashtag: '#staysafe',
				location: 'Bangalore',
				dateRange: '2025-09-20 to 2025-09-30'
			},
			status: 'Completed'
		},
		{
			id: 4,
			date: '2025-10-02T14:20:00Z',
			userName: 'Sarah Wilson',
			filters: {
				platform: 'LinkedIn',
				severity: 'High',
				hashtag: '#datasecurity',
				location: 'Pune',
				dateRange: '2025-09-25 to 2025-10-02'
			},
			status: 'Failed'
		},
		{
			id: 5,
			date: '2025-10-02T08:00:00Z',
			userName: 'Alex Kumar',
			filters: {
				platform: 'Twitter',
				severity: 'Medium',
				username: '@techsafety',
				location: 'Hyderabad',
				dateRange: '2025-09-28 to 2025-10-02'
			},
			status: 'Scheduled'
		}
	]);





	const hasActiveFilters = (selectedPlatform && selectedPlatform.value) || /* (selectedSeverity && selectedSeverity.value) || */ (selectedStatus && selectedStatus.value) || query || location || startDate || endDate;

	const clearFilters = () => {
		setSelectedPlatform(null);
		/* setSelectedSeverity(null); */
		setSelectedStatus(null);
		setQuery('');
		setLocation('');
		setStartDate('');
		setEndDate('');
		setCurrentPage(1);
	};

	// Schedule handlers
	const roundToNextQuarter = (date) => {
		const d = new Date(date);
		d.setSeconds(0, 0);
		const minutes = d.getMinutes();
		const rounded = Math.ceil(minutes / 15) * 15;
		d.setMinutes(rounded);
		return d;
	};

	// Set AM/PM using controlled timeInput (keeps scheduleDateTime in sync)
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

	const closeScheduleModal = () => {
		setScheduleModalOpen(false);
		setScheduleDateTime(null);
	};

	const saveSchedule = () => {
		if (!scheduleDateTime || selectedReports.length === 0) return;
		
		// Here you would typically save to backend/localStorage
		console.log('Scheduling reports:', selectedReports, 'for:', scheduleDateTime);
		
		// Clear selections and close modal
		setSelectedReports([]);
		closeScheduleModal();
		
		// Show success message (you can implement toast notification)
		alert(`Successfully scheduled ${selectedReports.length} report${selectedReports.length !== 1 ? 's' : ''} for ${scheduleDateTime.toLocaleString()}`);
	};


	// Filtering logic (mirrors Reports)
	const filteredReports = useMemo(() => sampleReports.filter(report => {
		const matchesQuery = query === '' || (type === 'hashtag' && report.post.toLowerCase().includes(query.toLowerCase())) || (type === 'username' && (report.user.username.toLowerCase().includes(query.toLowerCase()) || report.user.name.toLowerCase().includes(query.toLowerCase())));
		const matchesPlatform = !selectedPlatform || (selectedPlatform.value && report.platform === selectedPlatform.value);
		// const matchesSeverity = !selectedSeverity || (selectedSeverity.value && report.toxicitySeverity === selectedSeverity.value);
		const matchesLocation = location === '' || report.policeStation.toLowerCase().includes(location.toLowerCase());
		const rDate = new Date(report.reportedAt);
		const matchesStart = startDate === '' || rDate >= new Date(startDate);
		const matchesEnd = endDate === '' || rDate <= new Date(endDate);
		// No status for sampleReports, so skip status filter here
		return matchesQuery && matchesPlatform /* && matchesSeverity */ && matchesLocation && matchesStart && matchesEnd;
	}), [query, type, selectedPlatform, location, startDate, endDate]);



	// Scheduled Reports filtering using existing search and filter states
	const filteredScheduledReports = useMemo(() => {
		let filtered = [...scheduledReports];
		if (query.trim()) {
			const searchTerm = query.toLowerCase();
			filtered = filtered.filter(report => 
				report.userName.toLowerCase().includes(searchTerm) ||
				report.status.toLowerCase().includes(searchTerm) ||
				Object.values(report.filters).some(filter => 
					filter && filter.toString().toLowerCase().includes(searchTerm)
				)
			);
		}
		if (selectedPlatform) {
			filtered = filtered.filter(report => 
				report.filters.platform && 
				report.filters.platform.toLowerCase() === selectedPlatform.label.toLowerCase()
			);
		}
		if (selectedStatus) {
			filtered = filtered.filter(report => 
				report.status && report.status.toLowerCase() === selectedStatus.value.toLowerCase()
			);
		}
		if (location.trim()) {
			const locationTerm = location.toLowerCase();
			filtered = filtered.filter(report => 
				report.filters.location && 
				report.filters.location.toLowerCase().includes(locationTerm)
			);
		}
		if (startDate || endDate) {
			filtered = filtered.filter(report => {
				const reportDate = new Date(report.date);
				const start = startDate ? new Date(startDate) : null;
				const end = endDate ? new Date(endDate) : null;
				if (start && reportDate < start) return false;
				if (end && reportDate > end) return false;
				return true;
			});
		}
		return filtered;
	}, [scheduledReports, query, selectedPlatform, selectedStatus, location, startDate, endDate]);

	// Pagination for scheduled reports
	const [scheduledCurrentPage, setScheduledCurrentPage] = useState(1);
	const [scheduledItemsPerPage, setScheduledItemsPerPage] = useState(5);
	const scheduledTotalItems = filteredScheduledReports.length;
	const scheduledTotalPages = Math.max(1, Math.ceil(scheduledTotalItems / scheduledItemsPerPage));
	const scheduledStartIndex = (scheduledCurrentPage - 1) * scheduledItemsPerPage;
	const scheduledEndIndex = scheduledStartIndex + scheduledItemsPerPage;
	const scheduledCurrentReports = filteredScheduledReports.slice(scheduledStartIndex, scheduledEndIndex);

	useEffect(() => { const tp = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage)); if (currentPage > tp) setCurrentPage(tp); }, [filteredReports.length, itemsPerPage, currentPage]);

	// Removed unused variable: totalItems
	// Removed unused variables: totalPages, startIndex, endIndex, currentReports



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
							<SearchCodeIcon size={14} /> Search
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
							<label className="compact-label">Status</label>
							<Select className="react-select-container" classNamePrefix="react-select" options={statusOptions} value={selectedStatus} onChange={setSelectedStatus} isClearable placeholder="All Statuses" />
						</div>
						<div className="filter-input-group">
							<label className="compact-label">Start Date</label>
							<DatePicker selected={startDate ? new Date(startDate) : null} onChange={(d)=> setStartDate(d ? d.toISOString().slice(0,10) : '')} className="filter-input-compact" placeholderText="Select start date" dateFormat="yyyy-MM-dd" isClearable />
						</div>
						<div className="filter-input-group">
							<label className="compact-label">End Date</label>
							<DatePicker selected={endDate ? new Date(endDate) : null} onChange={(d)=> setEndDate(d ? d.toISOString().slice(0,10) : '')} className="filter-input-compact" placeholderText="Select end date" dateFormat="yyyy-MM-dd" isClearable />
						</div>
						<button type="button" className="btn btn-outline clear-filters-btn-compact" onClick={clearFilters} disabled={!hasActiveFilters}>Clear Filters</button>
						<button 
							type="button"
							className="btn btn-primary"
							onClick={() => setScheduleModalOpen(true)}
							disabled={selectedReports.length === 0}
							title={`Schedule ${selectedReports.length} selected report${selectedReports.length !== 1 ? 's' : ''}`}
						>
							<CalendarIcon size={14} />
							Schedule ({selectedReports.length})
						</button>
					</div>
				</div>
			</div>






			{/* Scheduled Reports Table - Always visible with pagination and scheduling */} 
			<div className="scheduled-reports-section">
				<div className="scheduled-reports-header">
					<h2 className="scheduled-reports-title">
						Scheduled Reports
					</h2>
				</div>
				{/* Results Summary */}
				<div className="reports-filter-summary">
					<span className="results-count">
						Showing {scheduledTotalItems} of {scheduledReports.length} scheduled reports
					</span>
				</div>
				<div className="scheduled-reports-table-container">
					<table className="scheduled-reports-table">
						<thead>
							<tr>
								<th>
									<input
										type="checkbox"
										onChange={e => {
											if (e.target.checked) {
												setSelectedReports(scheduledCurrentReports.map(r => r.id));
											} else {
												setSelectedReports([]);
											}
										}}
										checked={selectedReports.length === scheduledCurrentReports.length && scheduledCurrentReports.length > 0}
									/>
								</th>
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
									<td>
										<input
											type="checkbox"
											checked={selectedReports.includes(report.id)}
											onChange={e => {
												if (e.target.checked) {
													setSelectedReports(prev => [...prev, report.id]);
												} else {
													setSelectedReports(prev => prev.filter(id => id !== report.id));
												}
											}}
										/>
									</td>
									<td className="sr-no-cell">{scheduledStartIndex + index + 1}</td>
									<td className="date-cell">
										<div className="date-main">
											{new Date(report.date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
										</div>
										<div className="date-time">
											{new Date(report.date).toLocaleTimeString('en-US', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</div>
									</td>
									<td className="user-cell">
										<div className="user-name">{report.userName}</div>
									</td>
									<td className="filters-cell">
										<div className="filter-chips-simple">
											{report.filters.platform && (
												<span className="filter-chip platform">
													{report.filters.platform}
												</span>
											)}
											{report.filters.severity && (
												<span className="filter-chip severity">
													{report.filters.severity}
												</span>
											)}
											{report.filters.hashtag && (
												<span className="filter-chip hashtag">
													{report.filters.hashtag}
												</span>
											)}
											{report.filters.username && (
												<span className="filter-chip username">
													{report.filters.username}
												</span>
											)}
											{report.filters.location && (
												<span className="filter-chip location">
													{report.filters.location}
												</span>
											)}
											{report.filters.dateRange && (
												<span className="filter-chip date">
													{report.filters.dateRange}
												</span>
											)}
										</div>
									</td>
									<td className="status-cell">
										<span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
											{report.status}
										</span>
									</td>
								</tr>
							))}
							{scheduledCurrentReports.length === 0 && (
								<tr>
									<td colSpan="6" className="no-results">
										<div className="no-results-content">
											<p className="no-results-text">
												{scheduledReports.length === 0
													? 'No scheduled reports'
													: 'No matching reports'}
											</p>
											{scheduledReports.length > 0 && scheduledCurrentReports.length === 0 && (
												<button
													onClick={clearFilters}
													className="clear-search-btn"
												>
													Clear Filters
												</button>
											)}
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{/* Pagination for scheduled reports */}
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
				{/* Removed Schedule Selected button as requested */}
			</div>

			{/* Schedule Modal */}
			{scheduleModalOpen && (
				<div className="scheduler-modal-backdrop" role="dialog" aria-modal>
					<div className="scheduler-modal-card compact">
						<div className="scheduler-modal-header">
							<h3><CalendarIcon size={16}/> Schedule Reports</h3>
							<button className="scheduler-icon-btn" onClick={closeScheduleModal}>✕</button>
						</div>
						<div className="scheduler-modal-body">
							<div className="selected-reports-info">
								<p>Scheduling <strong>{selectedReports.length}</strong> selected report{selectedReports.length !== 1 ? 's' : ''}</p>
							</div>

							<div className="datetime-picker">
								<div className="datetime-section">
									<div style={{marginBottom: '6px'}}>
										<span className="compact-label" style={{fontWeight:600}}>Date</span>
									</div>
									<div className="date-time-row">
										<div className="date-input-wrapper" style={{flex: 1}}>
											<CalendarIcon size={16} className="date-icon" />
											<DatePicker
												selected={scheduleDateTime}
												onChange={(date) => {
												if (!date) { setScheduleDateTime(null); return; }
												const base = scheduleDateTime ? new Date(scheduleDateTime) : new Date();
												const newDate = new Date(date);
												if (scheduleDateTime) {
													newDate.setHours(base.getHours(), base.getMinutes(), 0, 0);
												}
												setScheduleDateTime(newDate);
											}}
												dateFormat="MMM d, yyyy"
												className="filter-input-compact date-input"
												placeholderText="Choose date"
												minDate={new Date()}
												showPopperArrow={false}
											/>
										</div>
									</div>

									<div style={{marginTop: '12px', marginBottom: '6px'}}>
										<span className="compact-label" style={{fontWeight:600}}>Time</span>
									</div>
									<div className="time-row" style={{marginTop:0, display:'flex', alignItems:'center', gap:8}}>
										<div style={{display:'flex', alignItems:'center', gap:6, width:'fit-content', minWidth:0}}>
											<input
												type="text"
												className="time-input"
												placeholder="12:00"
												maxLength={5}
												value={timeInput}
												pattern="^(0[1-9]|1[0-2]):[0-5][0-9]$"
												onChange={(e) => {
													let val = e.target.value.replace(/[^0-9:]/g, '');
													// Only allow one colon
													const colonCount = (val.match(/:/g) || []).length;
													if (colonCount > 1) val = val.replace(/:(?=.*:)/g, '');
													// Auto-insert colon after 2 digits
													if (/^\d{3,}$/.test(val) && val[2] !== ':') {
														val = val.slice(0,2) + ':' + val.slice(2,4);
													}
													// Only allow up to 5 chars (hh:mm)
													if (val.length > 5) val = val.slice(0,5);
													setTimeInput(val);
													// Validate format
													if (!/^([0]?[1-9]|1[0-2]):[0-5][0-9]$/.test(val)) { setScheduleDateTime(null); return; }
													const [hhStr, mmStr] = val.split(':');
													let hh = Number(hhStr);
													let mm = Number(mmStr);
													if (Number.isNaN(hh) || Number.isNaN(mm)) return;
													// convert to 24-hour using ampm state
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
								</div>
							</div>

							<div className="quick-presets" aria-label="Quick schedule presets">
								<span className="presets-label">Quick Options:</span>
								<div className="presets-grid">
									<button type="button" className="preset-chip" onClick={() => {
										const d = roundToNextQuarter(new Date());
										d.setHours(d.getHours() + 1);
										setScheduleDateTime(d);
									}}>
										<CalendarIcon size={12} />In 1 hour
									</button>
									<button type="button" className="preset-chip" onClick={() => {
										const d = new Date();
										d.setDate(d.getDate() + 1);
										d.setHours(12, 0, 0, 0);
										setScheduleDateTime(d);
									}}>
										<CalendarIcon size={12} />Tomorrow 12 PM
									</button>
									<button type="button" className="preset-chip" onClick={() => {
										const d = new Date();
										const day = d.getDay();
										const diff = (8 - day) % 7 || 7;
										d.setDate(d.getDate() + diff);
										d.setHours(12, 0, 0, 0);
										setScheduleDateTime(d);
									}}>
										<CalendarIcon size={12} />Next Monday 12 PM
									</button>
								</div>
							</div>

						</div>
						<div className="scheduler-modal-footer">
							<button 
								className="btn btn-primary" 
								disabled={!scheduleDateTime} 
								onClick={saveSchedule}
							>
								<CalendarIcon size={14}/> 
								Schedule {selectedReports.length} Report{selectedReports.length !== 1 ? 's' : ''}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Scheduler;

