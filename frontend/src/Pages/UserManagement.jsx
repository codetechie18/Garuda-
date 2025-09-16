import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Filter,
  X,
  Save,
  UserPlus
} from 'lucide-react';
import '../Styles/UserManagement.css';

// Mock data
const initialUsers = [
  {
    id: 'EMP001',
    name: 'Sumit Kumar',
    email: 'sumit.kumar@company.com',
    position: 'Inspector of Police',
    sector: 'Hingna',
    role: 'User',
    status: 'Active',
    dateJoined: '2023-01-15',
    lastLogin: '2024-01-10 09:30:00'
  },
  {
    id: 'EMP002',
    name: 'Yashwant Singh',
    email: 'yashwant.singh@company.com',
    position: 'Inspector of Police',
    sector: 'Subhash Nagar',
    role: 'Admin',
    status: 'Active',
    dateJoined: '2022-11-20',
    lastLogin: '2024-01-11 14:22:00'
  },
  {
    id: 'EMP003',
    name: 'Sachin Patil',
    email: 'sachin.patil@company.com',
    position: 'Inspector of Police',
    sector: 'Dharampeth',
    role: 'User',
    status: 'Inactive',
    dateJoined: '2023-03-10',
    lastLogin: '2024-01-05 11:15:00'
  },
  {
    id: 'EMP004',
    name: 'amitabh singh',
    email: 'amitabh.singh@company.com',
    position: 'Inspector of Police',
    sector: 'IT',
    role: 'User',
    status: 'Active',
    dateJoined: '2023-08-01',
    lastLogin: '2024-01-11 16:45:00'
  },
  {
    id: 'EMP005',
    name: 'Purva Jain',
    email: 'purva.jain@company.com',
    position: 'Inspector of Police',
    sector: 'kasturchand park',
    role: 'Admin',
    status: 'Active',
    dateJoined: '2022-05-15',
    lastLogin: '2024-01-11 08:20:00'
  },
  {
    id: 'EMP006',
    name: 'Sayli Thompson',
    email: 'sayli.thompson@company.com',
    position: 'Inspector of Police',
    sector: 'Wadi',
    role: 'Guest',
    status: 'Active',
    dateJoined: '2023-12-01',
    lastLogin: '2024-01-10 13:10:00'
  },
  {
    id: 'EMP007',
    name: 'Subhash Garcia',
    email: 'subhash.garcia@company.com',
    position: 'Inspector of Police',
    sector: 'LAD',
    role: 'Admin',
    status: 'Active',
    dateJoined: '2021-09-20',
    lastLogin: '2024-01-11 17:30:00'
  },
  {
    id: 'EMP008',
    name: 'Nitin Reddy',
    email: 'nitin.reddy@company.com',
    position: 'Inspector of Police',
    sector: 'SitaBurdi',
    role: 'User',
    status: 'Active',
    dateJoined: '2023-02-28',
    lastLogin: '2024-01-09 12:45:00'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState({ role: 'Admin' }); // Mock current user as Admin
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    area: '',
    role: 'User',
    status: 'Active'
  });

  // Get unique values for filters
    
  const sectors = [...new Set(users.map(user => user.sector))];
  const roles = [...new Set(users.map(user => user.role))];
  const statuses = ['Active', 'Inactive'];

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ;
     
      const matchesStatus = !filterStatus || user.status === filterStatus;
      const matchesRole = !filterRole || user.role === filterRole;
      
      return matchesSearch  && matchesStatus && matchesRole;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, filterSector, filterStatus, filterRole, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // User actions
  const handleAddUser = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'Admin') return;
    
    const newUser = {
      ...formData,
      id: `EMP${String(users.length + 1).padStart(3, '0')}`,
      dateJoined: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (currentUser.role !== 'Admin') return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...formData }
        : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleDeleteUser = () => {
    if (currentUser.role !== 'Admin') return;
    
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      sector: '',
      role: 'User',
      status: 'Active'
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      position: user.position,
     
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Index', 'Name', 'Email', 'Position', 'ID', 'Sector', 'Role', 'Status', 'Date Joined', 'Last Login'];
    const csvData = filteredAndSortedUsers.map((user, index) => [
      index + 1,
      user.name,
      user.email,
      user.position,
      user.role,
      user.status,
      user.dateJoined,
      user.lastLogin
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'users.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isAdmin = currentUser.role === 'Admin';

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Manage users, roles, and permissions</p>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        {/* Search and Filters */}
        <div className="search-filters">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {/* <button
            onClick={exportToCSV}
            className="btn btn-secondary"
          >
            <Download size={18} />
            Export CSV
          </button>
           */}
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!isAdmin}
            className={`btn btn-primary ${!isAdmin ? 'btn-disabled' : ''}`}
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Index</th>
              {/* <th onClick={() => handleSort('name')} className="sortable">
                Name <ArrowUpDown size={14} />
              </th> */}
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
           <th>Role</th>
              {/* <th onClick={() => handleSort('status')} className="sortable">
                Status <ArrowUpDown size={14} />
              </th> */}
                 <th > Status </th> 
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{startIndex + index + 1}</td>   
                <td className="user-name">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.position}</td>
              
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                
                <td>{user.lastLogin}</td>
                <td>
                  <div className="action-buttons-cell">
                    {/* <button className="btn-icon btn-view" title="View">
                      <Eye size={16} />
                    </button> */}
                    <button
                      onClick={() => openEditModal(user)}
                      disabled={!isAdmin}
                      className={`btn-icon btn-edit ${!isAdmin ? 'btn-disabled' : ''}`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setUserToDelete(user);
                        setShowDeleteConfirm(true);
                      }}
                      disabled={!isAdmin}
                      className={`btn-icon btn-delete ${!isAdmin ? 'btn-disabled' : ''}`}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          <span>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} users
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="page-size-select"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
        
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-pagination"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
          
          <span className="page-numbers">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-pagination"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                />
              </div>
             
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Guest">Guest</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={18} />
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="btn-close">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sector</label>
               
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Guest">Guest</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-small">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete <strong>{userToDelete?.name}</strong>?</p>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="btn btn-danger">
                <Trash2 size={18} />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;