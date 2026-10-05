import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { 
  Users, 
  Heart, 
  FileText, 
  Image as ImageIcon, 
  Database, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Save, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  FolderOpen,
  Briefcase,
  GraduationCap,
  Calendar,
  Building,
  Mail,
  Phone,
  MapPin,
  Check
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'volunteers' | 'donations' | 'contacts' | 'media' | 'database'>('volunteers');
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);

  // Volunteers State
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVol, setSelectedVol] = useState<any | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  // Donations & Contacts
  const [donations, setDonations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [bulkOrders, setBulkOrders] = useState<any[]>([]);

  // Media Manager
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [editingMedia, setEditingMedia] = useState<{ [key: string]: string }>({});
  const [mediaSaveSuccess, setMediaSaveSuccess] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [st, vols, dons, cnts, ords, mAssets] = await Promise.all([
        ApiService.getOverviewStats(),
        ApiService.getVolunteers({ roleType: roleFilter, status: statusFilter, search: searchQuery }),
        ApiService.getDonations(),
        ApiService.getContacts(),
        ApiService.getBulkOrders(),
        ApiService.getMediaAssets()
      ]);

      setStats(st);
      setVolunteers(vols);
      setDonations(dons);
      setContacts(cnts);
      setBulkOrders(ords);
      setMediaAssets(mAssets);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ApiService.getVolunteers({ roleType: roleFilter, status: statusFilter, search: searchQuery }).then(setVolunteers);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    await ApiService.updateVolunteer(id, { status: newStatus });
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    if (selectedVol && selectedVol.id === id) {
      setSelectedVol({ ...selectedVol, status: newStatus });
    }
  };

  const handleSaveNotes = async (id: string) => {
    await ApiService.updateVolunteer(id, { adminNotes: editingNotes });
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, adminNotes: editingNotes } : v));
    if (selectedVol && selectedVol.id === id) {
      setSelectedVol({ ...selectedVol, adminNotes: editingNotes });
    }
    alert('Coordinator notes saved successfully!');
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (confirm('Are you sure you want to remove this applicant record?')) {
      await ApiService.deleteVolunteer(id);
      setVolunteers(prev => prev.filter(v => v.id !== id));
      if (selectedVol?.id === id) setSelectedVol(null);
    }
  };

  const handleSaveMedia = async (key: string, section: string, title: string, category: string) => {
    const newUrl = editingMedia[key];
    if (!newUrl) return;

    await ApiService.saveMediaAsset({
      id: `media-${key}`,
      key,
      section,
      title,
      url: newUrl,
      category
    });

    setMediaSaveSuccess(key);
    setTimeout(() => setMediaSaveSuccess(null), 3000);
    fetchAllData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="admin"
        sections={{
          // Top Header & Overview
          header: (
            <div className="bg-[#143D2B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 text-[#D99B26] text-xs font-bold uppercase tracking-wider border border-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Samajbandh Admin & Data Console</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-white">
                  Grassroots Operations & Content Manager
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80">
                  Easily manage volunteer applications, 80G tax donations, pad inventory inquiries, and site images/documents.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/api/volunteers/export"
                  download
                  className="px-4 py-2.5 rounded-xl bg-white text-[#143D2B] text-xs font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#143D2B]" />
                  <span>Export Volunteers (CSV)</span>
                </a>

                <a
                  href="/api/admin/backup"
                  download
                  className="px-4 py-2.5 rounded-xl bg-emerald-800/80 border border-emerald-600 text-emerald-100 text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-[#D99B26]" />
                  <span>Backup DB (JSON)</span>
                </a>

                <button
                  onClick={fetchAllData}
                  className="p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700 text-emerald-200 hover:text-white transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          ),

          // Metrics Bar
          metrics:
            stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6760] uppercase block">Total Volunteers</span>
                  <span className="text-2xl font-serif-heading font-bold text-[#143D2B]">{stats.totalVolunteers || 0}</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Pending Reviews</span>
                  <span className="text-2xl font-serif-heading font-bold text-amber-900">{stats.pendingVolunteers || 0}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6760] uppercase block">Active Interns</span>
                  <span className="text-2xl font-serif-heading font-bold text-[#C85A32]">{stats.activeInterns || 0}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6760] uppercase block">Total Donations</span>
                  <span className="text-2xl font-serif-heading font-bold text-emerald-700">₹{(stats.totalDonated || 0).toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6760] uppercase block">New Inquiries</span>
                  <span className="text-2xl font-serif-heading font-bold text-[#1F2421]">{stats.newContacts || 0}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5DFC5] shadow-xs">
                  <span className="text-[11px] font-bold text-[#5C6760] uppercase block">Bulk Orders</span>
                  <span className="text-2xl font-serif-heading font-bold text-indigo-700">{stats.pendingOrders || 0}</span>
                </div>
              </div>
            ),

          // Main Tab Navigation
          tabNav: (
            <div className="flex flex-wrap gap-2 border-b border-[#E5DFC5] pb-3">
              {[
                { id: 'volunteers', label: 'Volunteers & Interns Database', icon: <Users className="w-4 h-4" />, count: volunteers.length },
                { id: 'donations', label: 'Donations & 80G Receipts', icon: <Heart className="w-4 h-4" />, count: donations.length },
                { id: 'contacts', label: 'Inquiries & Bulk Orders', icon: <FileText className="w-4 h-4" />, count: contacts.length + bulkOrders.length },
                { id: 'media', label: 'Images & Documents Manager', icon: <ImageIcon className="w-4 h-4" /> },
                { id: 'database', label: 'Database & System Files', icon: <Database className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#143D2B] text-white shadow-md'
                      : 'bg-white text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      activeTab === tab.id ? 'bg-[#D99B26] text-[#143D2B]' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ),

          // TAB 1: VOLUNTEER DATABASE
          volunteersTab:
            activeTab === 'volunteers' && (
              <div className="space-y-6">
          
                {/* Filter and Search Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5DFC5] shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, city, college..."
                        className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#143D2B] text-white text-xs font-bold rounded-xl hover:bg-[#1E533B]"
                    >
                      Search
                    </button>
                  </form>

                  {/* Role and Status Dropdowns */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#5C6760]">Role:</span>
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-1.5 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl font-medium text-xs focus:outline-hidden"
                      >
                        <option value="all">All Roles</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="intern">Intern</option>
                        <option value="fellow">Fellow</option>
                        <option value="donate-cloth">Cloth Donor</option>
                        <option value="csr">CSR</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-bold text-[#5C6760]">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl font-medium text-xs focus:outline-hidden"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Volunteers Table */}
                <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FBF9F5] border-b border-[#E5DFC5] text-[#5C6760] font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-4">Applicant</th>
                          <th className="py-3.5 px-4">Role & Duration</th>
                          <th className="py-3.5 px-4">Location / Mode</th>
                          <th className="py-3.5 px-4">College / Org</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Applied</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5DFC5]">
                        {volunteers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No volunteer records found matching current criteria.
                            </td>
                          </tr>
                        ) : (
                          volunteers.map((vol) => (
                            <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-[#1F2421] text-sm">{vol.name}</div>
                                <div className="text-[11px] text-[#5C6760] flex items-center gap-2">
                                  <span>{vol.email}</span> • <span>{vol.phone}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                                  vol.roleType === 'intern' ? 'bg-amber-100 text-amber-800' :
                                  vol.roleType === 'fellow' ? 'bg-purple-100 text-purple-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {vol.roleType}
                                </span>
                                <div className="text-[#5C6760] text-[11px] font-medium mt-0.5">{vol.duration}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-medium text-[#1F2421]">{vol.city || 'Maharashtra'}</div>
                                <div className="text-[11px] text-[#87986A] capitalize">{vol.mode || 'on-ground'}</div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="text-[#5C6760] line-clamp-1">{vol.collegeOrOrg || 'Individual'}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={vol.status || 'pending'}
                                  onChange={(e) => handleUpdateStatus(vol.id, e.target.value)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                    vol.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                    vol.status === 'contacted' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                    vol.status === 'reviewed' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                                    'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="reviewed">Reviewed</option>
                                  <option value="approved">Approved</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                {new Date(vol.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedVol(vol);
                                      setEditingNotes(vol.adminNotes || '');
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#143D2B] text-white text-[11px] font-bold hover:bg-[#1E533B]"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVolunteer(vol.id)}
                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Volunteer Detail Modal */}
                {selectedVol && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-[#E5DFC5] shadow-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase text-[#C85A32]">Applicant Details</span>
                          <h3 className="text-2xl font-serif-heading font-bold text-[#143D2B]">{selectedVol.name}</h3>
                        </div>
                        <button
                          onClick={() => setSelectedVol(null)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs bg-[#FBF9F5] p-4 rounded-2xl border border-[#E5DFC5]">
                        <div>
                          <span className="text-[#5C6760] font-bold block">Email:</span>
                          <a href={`mailto:${selectedVol.email}`} className="text-[#143D2B] font-medium hover:underline">{selectedVol.email}</a>
                        </div>
                        <div>
                          <span className="text-[#5C6760] font-bold block">Phone / WhatsApp:</span>
                          <a href={`tel:${selectedVol.phone}`} className="text-[#143D2B] font-medium hover:underline">{selectedVol.phone}</a>
                        </div>
                        <div>
                          <span className="text-[#5C6760] font-bold block">Role & Duration:</span>
                          <span className="font-bold text-[#C85A32]">{selectedVol.roleType?.toUpperCase()} ({selectedVol.duration})</span>
                        </div>
                        <div>
                          <span className="text-[#5C6760] font-bold block">Mode & Location:</span>
                          <span>{selectedVol.mode} • {selectedVol.city}</span>
                        </div>
                        {selectedVol.startDate && (
                          <div>
                            <span className="text-[#5C6760] font-bold block">Start Date:</span>
                            <span>{selectedVol.startDate}</span>
                          </div>
                        )}
                        {selectedVol.endDate && (
                          <div>
                            <span className="text-[#5C6760] font-bold block">End Date:</span>
                            <span>{selectedVol.endDate}</span>
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="text-[#5C6760] font-bold block">College / University / Company:</span>
                          <span className="text-slate-900 font-medium">{selectedVol.collegeOrOrg || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#1F2421] block">Selected Domains:</span>
                        <div className="flex flex-wrap gap-2">
                          {(selectedVol.domains || []).map((d: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedVol.message && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-[#1F2421] block">Statement of Purpose / Notes from Applicant:</span>
                          <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#5C6760] leading-relaxed">
                            {selectedVol.message}
                          </p>
                        </div>
                      )}

                      {/* Coordinator Notes */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold text-[#143D2B] uppercase">
                          Internal Coordinator Notes (Interview remarks, assignment location)
                        </label>
                        <textarea
                          rows={3}
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="e.g. Verified MSW student; interviewed on 18th; assigned to Junnar tribal school camp..."
                          className="w-full p-3 text-xs bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                        />
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(selectedVol.id)}
                            className="px-4 py-2 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Coordinator Notes</span>
                          </button>
                          <span className="text-[11px] text-slate-400">ID: {selectedVol.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ),

          // TAB 2: DONATIONS & 80G RECEIPTS
          donationsTab:
            activeTab === 'donations' && (
              <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm overflow-hidden space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-serif-heading text-[#143D2B]">80G Tax Deductible Donations Log</h3>
                    <p className="text-xs text-[#5C6760]">All contributions are eligible for 50% deduction under Section 80G of the Income Tax Act.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FBF9F5] border-b border-[#E5DFC5] text-[#5C6760] font-bold uppercase">
                        <th className="py-3 px-4">Donor Name</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Receipt #</th>
                        <th className="py-3 px-4">PAN Number</th>
                        <th className="py-3 px-4">Purpose</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DFC5]">
                      {donations.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#1F2421]">{d.fullName}</div>
                            <div className="text-[11px] text-slate-500">{d.email} • {d.phone}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-800 text-sm">
                            ₹{d.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                            {d.receiptNumber}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] uppercase">
                            {d.panNumber || 'Not provided'}
                          </td>
                          <td className="py-3 px-4 text-[#5C6760] max-w-xs truncate">
                            {d.purpose || 'Menstrual Dignity'}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800 uppercase">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),

          // TAB 3: CONTACTS & BULK ORDERS
          contactsTab:
            activeTab === 'contacts' && (
              <div className="space-y-8">
                {/* Contact Inquiries */}
                <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm p-6 space-y-4">
                  <h3 className="text-xl font-bold font-serif-heading text-[#143D2B]">Recent Inquiries & Partnerships</h3>
                  <div className="space-y-3">
                    {contacts.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-sm text-[#1F2421]">{c.name}</span>
                            {c.organization && <span className="text-xs text-[#87986A] ml-2">({c.organization})</span>}
                          </div>
                          <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-[#5C6760]">
                          <strong className="text-slate-900">Subject:</strong> {c.subject}
                        </div>
                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-[#E5DFC5]">
                          {c.message}
                        </p>
                        <div className="text-[11px] text-[#143D2B] font-semibold flex items-center gap-4">
                          <span>Email: {c.email}</span>
                          <span>Phone: {c.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bulk Orders */}
                <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm p-6 space-y-4">
                  <h3 className="text-xl font-bold font-serif-heading text-[#143D2B]">Institutional Pad Orders & Distribution Inquiries</h3>
                  <div className="space-y-3">
                    {bulkOrders.map((o) => (
                      <div key={o.id} className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-indigo-950">{o.product} — {o.quantity} Units</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-800">{o.status}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          <strong>Organization:</strong> {o.organization} • <strong>Contact:</strong> {o.name} ({o.phone}, {o.email})
                        </div>
                        {o.deliveryAddress && (
                          <div className="text-xs text-slate-500">
                            <strong>Delivery Destination:</strong> {o.deliveryAddress}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),

          // TAB 4: MEDIA & DOCUMENTS MANAGER FOR NON-TECHNICAL ADMIN
          mediaTab:
            activeTab === 'media' && (
              <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm p-6 sm:p-8 space-y-8">
          
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                    <FolderOpen className="w-5 h-5 text-[#143D2B]" />
                    <span>Easy Non-Technical Image & Document Customizer</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    To update images on the site, you can either paste a new photo web link below and click <strong>"Save Asset"</strong>, or place your image inside the dedicated folder: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-[11px]">/public/images/</code> or documents in <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-[11px]">/public/docs/</code>.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
                  {/* Slot 1: Hero Banner */}
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#143D2B]">Homepage Main Hero Banner</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">hero_main</span>
                    </div>
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative">
                      <img
                        src={editingMedia['hero_main'] || '/images/fellowship/arogya-samwadak-session.jpg'}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Image URL or Local Path (/images/hero/...)</label>
                      <input
                        type="text"
                        defaultValue="/images/fellowship/arogya-samwadak-session.jpg"
                        onChange={(e) => setEditingMedia({ ...editingMedia, hero_main: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveMedia('hero_main', 'Hero Banner', 'Women Artisans at Pune Micro-Center', 'hero')}
                      className="w-full py-2 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] flex items-center justify-center gap-2"
                    >
                      {mediaSaveSuccess === 'hero_main' ? <Check className="w-4 h-4 text-[#D99B26]" /> : <Save className="w-4 h-4" />}
                      <span>{mediaSaveSuccess === 'hero_main' ? 'Saved Successfully!' : 'Save Asset'}</span>
                    </button>
                  </div>

                  {/* Slot 2: Product Image */}
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#143D2B]">Asha Reusable Pad Kit Photo</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">asha_pad_box</span>
                    </div>
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative">
                      <img
                        src={editingMedia['asha_pad_box'] || '/images/products/asha-menstrual-kit.jpg'}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Image URL or Local Path (/images/products/...)</label>
                      <input
                        type="text"
                        defaultValue="/images/products/asha-menstrual-kit.jpg"
                        onChange={(e) => setEditingMedia({ ...editingMedia, asha_pad_box: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveMedia('asha_pad_box', 'Products', 'Asha Reusable Cotton Pad Kit', 'product')}
                      className="w-full py-2 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] flex items-center justify-center gap-2"
                    >
                      {mediaSaveSuccess === 'asha_pad_box' ? <Check className="w-4 h-4 text-[#D99B26]" /> : <Save className="w-4 h-4" />}
                      <span>{mediaSaveSuccess === 'asha_pad_box' ? 'Saved Successfully!' : 'Save Asset'}</span>
                    </button>
                  </div>

                  {/* Slot 3: Founder Photo */}
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#143D2B]">Founder Sachin Asha Subhash Portrait</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">founder_sachin</span>
                    </div>
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative">
                      <img
                        src={editingMedia['founder_sachin'] || '/images/team/founder-trustee-sachin.jpg'}
                        alt="Founder Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Image URL or Local Path (/images/team/...)</label>
                      <input
                        type="text"
                        defaultValue="/images/team/founder-trustee-sachin.jpg"
                        onChange={(e) => setEditingMedia({ ...editingMedia, founder_sachin: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveMedia('founder_sachin', 'Team', 'Sachin Asha Subhash Portrait', 'team')}
                      className="w-full py-2 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] flex items-center justify-center gap-2"
                    >
                      {mediaSaveSuccess === 'founder_sachin' ? <Check className="w-4 h-4 text-[#D99B26]" /> : <Save className="w-4 h-4" />}
                      <span>{mediaSaveSuccess === 'founder_sachin' ? 'Saved Successfully!' : 'Save Asset'}</span>
                    </button>
                  </div>

                  {/* Slot 4: 80G Certificate Document */}
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#143D2B]">Official 80G Tax Exemption PDF</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">doc_80g</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#E5DFC5] text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">Current Download Target:</span>
                      <span className="font-mono text-[11px] text-[#143D2B]">/public/docs/transparency/80G_certificate_samajbandh.pdf</span>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">PDF File Path or Cloud Document Link</label>
                      <input
                        type="text"
                        defaultValue="/public/docs/transparency/80G_certificate_samajbandh.pdf"
                        onChange={(e) => setEditingMedia({ ...editingMedia, doc_80g: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                      />
                    </div>
                    <button
                      onClick={() => handleSaveMedia('doc_80g', 'Documents', '80G Certificate PDF', 'document')}
                      className="w-full py-2 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] flex items-center justify-center gap-2"
                    >
                      {mediaSaveSuccess === 'doc_80g' ? <Check className="w-4 h-4 text-[#D99B26]" /> : <Save className="w-4 h-4" />}
                      <span>{mediaSaveSuccess === 'doc_80g' ? 'Saved Successfully!' : 'Save Asset'}</span>
                    </button>
                  </div>

                </div>
              </div>
            ),

          // TAB 5: DATABASE & SYSTEM ARCHITECTURE
          systemTab:
            activeTab === 'database' && (
              <div className="bg-white rounded-3xl border border-[#E5DFC5] shadow-sm p-6 sm:p-8 space-y-6">
                <h3 className="text-xl font-bold font-serif-heading text-[#143D2B]">Project Architecture & Storage Layout</h3>
          
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-3">
                    <span className="font-bold text-[#143D2B] uppercase tracking-wider block text-sm">📁 Separated Directory Architecture</span>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`samajbandh-app/
├── server/                     # Backend Express Architecture
│   ├── db/
│   │   └── database.ts        # Structured DB Engine & Seed Data
│   └── routes/
│       └── api.ts             # REST API for Volunteers, Donations, Media
├── data/
│   └── samajbandh_db.json     # Auto-synced Persistent Database Store
├── public/
│   ├── images/
│   │   ├── hero/              # Hero banners & sliders
│   │   ├── products/          # Asha pads, travel kits
│   │   ├── team/              # Trustees & coordinators
│   │   └── gallery/           # Field camp photos
│   ├── docs/
│   │   ├── transparency/      # 80G, 12A, CSR-1, Audits
│   │   └── volunteer/         # Internship handbooks
│   └── content/
│       └── media-config.json  # Central media mapping
├── src/                       # Frontend React Application
│   ├── pages/                 # UI pages (Home, About, Get Involved, Admin)
│   ├── components/            # Reusable UI widgets & modals
│   ├── services/api.ts        # Client API SDK
│   └── config/mediaAssets.ts  # Media wrappers
└── server.ts                  # Server entry & Vite integration`}
              </pre>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                      <span className="font-bold text-[#143D2B] block text-sm">Database Collections & Records</span>
                      <p className="text-[#5C6760]">
                        The backend stores all incoming submissions automatically in structured collections with atomic file-syncing.
                      </p>
                      <div className="space-y-1.5 pt-2 font-mono text-[11px] text-slate-700">
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                          <span>Volunteers & Interns:</span>
                          <strong className="text-[#143D2B]">{volunteers.length} Records</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                          <span>80G Donations:</span>
                          <strong className="text-emerald-700">{donations.length} Records</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                          <span>Contact Queries:</span>
                          <strong className="text-slate-900">{contacts.length} Records</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                          <span>Bulk Pad Orders:</span>
                          <strong className="text-indigo-700">{bulkOrders.length} Records</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <span className="font-bold text-amber-950 block text-sm">Non-Technical Change Instructions</span>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        Anyone on the team can replace images simply by saving new files with matching names in <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px]">/public/images/</code> or using the Media Manager tab above. For full documentation, refer to <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px]">README_MEDIA_GUIDE.md</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ),
        }}
      />

    </div>
  );
};
