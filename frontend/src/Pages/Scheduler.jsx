import React, { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, SearchCheckIcon, SearchCodeIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/ReportTable.css';
import '../Styles/Scrape.css';
import '../Styles/Scheduler.css';
import { truncateText, openGoogleMaps } from '../utils.js';



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

// const severityOptions = [
// 	{ value: 'High', label: 'High' },
// 	{ value: 'Medium', label: 'Medium' },
// 	{ value: 'Low', label: 'Low' },
// ];

const Scheduler = () => {
	// Filters
	const [selectedPlatform, setSelectedPlatform] = useState(null);
	// const [selectedSeverity, setSelectedSeverity] = useState(null);
	const [query, setQuery] = useState('');
	const [type, setType] = useState('hashtag');
	const [location, setLocation] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);

	// Scheduling
	const [selectedReports, setSelectedReports] = useState([]);
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [scheduleDateTime, setScheduleDateTime] = useState(null);




	const hasActiveFilters = (selectedPlatform && selectedPlatform.value) || /* (selectedSeverity && selectedSeverity.value) || */ query || location || startDate || endDate;

	const clearFilters = () => { setSelectedPlatform(null); /* setSelectedSeverity(null); */ setQuery(''); setLocation(''); setStartDate(''); setEndDate(''); setCurrentPage(1); };

	// Schedule handlers
	const roundToNextQuarter = (date) => {
		const d = new Date(date);
		d.setSeconds(0, 0);
		const minutes = d.getMinutes();
		const rounded = Math.ceil(minutes / 15) * 15;
		d.setMinutes(rounded);
		return d;
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
		return matchesQuery && matchesPlatform /* && matchesSeverity */ && matchesLocation && matchesStart && matchesEnd;
	}), [query, type, selectedPlatform, location, startDate, endDate]);

	useEffect(() => { const tp = Math.max(1, Math.ceil(filteredReports.length / itemsPerPage)); if (currentPage > tp) setCurrentPage(tp); }, [filteredReports.length, itemsPerPage, currentPage]);

	const totalItems = filteredReports.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentReports = filteredReports.slice(startIndex, endIndex);



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
							{/* <label className="compact-label">Severity</label>
							<Select className="react-select-container" classNamePrefix="react-select" options={severityOptions} value={selectedSeverity} onChange={setSelectedSeverity} isClearable placeholder="All Severities" /> */}
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

			{/* Results summary */}
			<div className="security-reports__summary">
				<span className="results-count">{hasActiveFilters ? <>Showing {totalItems} of {sampleReports.length} reports</> : <>Total {totalItems} reports</>}</span>
			</div>

			{/* Reports table for scheduling */}
			<div className="security-reports__content">
				<div className="reports-table-wrapper">
					<table className="reports-table">
						<thead>
							<tr>
								<th>
									<input 
										type="checkbox" 
										onChange={(e) => {
											if (e.target.checked) {
												setSelectedReports(currentReports.map(r => r.id));
											} else {
												setSelectedReports([]);
											}
										}}
										checked={selectedReports.length === currentReports.length && currentReports.length > 0}
									/>
								</th>
								<th>Platform</th>
								<th>Content</th>
								{/* <th>User</th>
								<th>Severity</th> */}
								<th>Toxicity Score</th>
								<th>Coordinates</th>
								<th>Police Station</th>
							</tr>
						</thead>
						<tbody>
							{currentReports.length ? currentReports.map(report => (
								<tr key={report.id} className="reports-table__row">
									<td>
										<input 
											type="checkbox" 
											checked={selectedReports.includes(report.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedReports(prev => [...prev, report.id]);
												} else {
													setSelectedReports(prev => prev.filter(id => id !== report.id));
												}
											}}
										/>
									</td>
									<td>
										<span className={`platform-badge platform-badge--${report.platform.toLowerCase()}`}>
											{report.platform}
										</span>
									</td>
									
									<td className="content-cell">
										<div className="content-preview-static" title={report.post}>
											{truncateText(report.post, 60)}
										</div>
									</td>

									{/* <td className="user-cell">
										<div className="user-info">
											<div className="user-name">{report.user.name}</div>
											<div className="user-handle">{report.user.username}</div>
										</div>
									</td>

									<td>
										<span className={`severity-badge severity-${report.toxicitySeverity.toLowerCase()}`}>
											{report.toxicitySeverity}
										</span>
									</td> */}

									<td className="toxicity-cell">
										<div className="toxicity-score">{report.toxicityScore}/10</div>
										<div className="toxicity-tags">
											{report.toxicityTags.slice(0, 2).map((tag, index) => (
												<span key={index} className="tag">
													{tag}
												</span>
											))}
										</div>
									</td>

									<td className="coordinates-cell">
										<button
											className="coordinates-btn"
											onClick={() => openGoogleMaps(report.location.lat, report.location.lng)}
											title="Click to view on map"
										>
											<div className="coordinates-lat">Lat: {report.location.lat.toFixed(4)}</div>
											<div className="coordinates-lng">Lng: {report.location.lng.toFixed(4)}</div>
										</button>
									</td>

									<td className="station-cell">
										{truncateText(report.policeStation, 20)}
									</td>
								</tr>
							)) : (
								<tr>
									<td colSpan="6" className="no-results">
										<div className="no-results-content">
											<p>No reports found matching your criteria</p>
											{hasActiveFilters && (
												<button onClick={clearFilters} className="btn btn-outline">
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
							<h3><CalendarIcon size={16}/> Schedule Reports</h3>
							<button className="scheduler-icon-btn" onClick={closeScheduleModal}>✕</button>
						</div>
						<div className="scheduler-modal-body">
							<div className="selected-reports-info">
								<p>Scheduling <strong>{selectedReports.length}</strong> selected report{selectedReports.length !== 1 ? 's' : ''}</p>
							</div>
							
							<div className="datetime-picker">
								<div className="datetime-section">
									<label className="compact-label">Select Date & Time</label>
									<div className="date-input-wrapper">
										<CalendarIcon size={16} className="date-icon" />
										<DatePicker
											selected={scheduleDateTime}
											onChange={(date) => setScheduleDateTime(date)}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="MMM d, yyyy h:mm aa"
											className="filter-input-compact date-input"
											placeholderText="Choose date and time"
											minDate={new Date()}
											showPopperArrow={false}
										/>
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
											d.setHours(9, 0, 0, 0);
											setScheduleDateTime(d);
										}}>
											<CalendarIcon size={12} />Tomorrow 9 AM
										</button>
										<button type="button" className="preset-chip" onClick={() => {
											const d = new Date();
											const day = d.getDay();
											const diff = (8 - day) % 7 || 7;
											d.setDate(d.getDate() + diff);
											d.setHours(9, 0, 0, 0);
											setScheduleDateTime(d);
										}}>
											<CalendarIcon size={12} />Next Monday 9 AM
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="scheduler-modal-footer">
							<button className="btn btn-outline" onClick={closeScheduleModal}>Cancel</button>
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

