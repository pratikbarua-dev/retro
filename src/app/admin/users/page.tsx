'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Trash2, Plus, X, Mail, Building, Phone, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('Daffodil International University');
  const [department, setDepartment] = useState('Computer Science');
  const [batch, setBatch] = useState('2025');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) return;

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, role: newRole }),
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user account "${user.name}" (${user.email})?`)) return;

    const res = await fetch(`/api/admin/users?id=${user.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        institution,
        department,
        batch,
        role,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue">:: USER DIRECTORY ::</Badge>
            <span className="text-xs font-mono text-slate-400">TOTAL MAKERS: {users.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            USER ACCOUNTS & ROLES
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Registered makers, staff roles, access permissions, and institutional affiliations.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-mono font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search users by name, email, or university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">Loading user directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase bg-slate-900/60">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact Email</th>
                  <th className="py-3.5 px-4">Institution / Dept</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{u.phone || 'No Phone Registered'}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{u.institution}</div>
                      <div className="text-[10px] text-slate-500">{u.department} | Batch {u.batch}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={u.role === 'ADMIN' ? 'amber' : 'blue'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-colors flex items-center gap-1 ${
                            u.role === 'ADMIN'
                              ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                              : 'bg-blue-950 border-blue-800 text-blue-300 hover:bg-blue-900'
                          }`}
                        >
                          <Shield className="w-3.5 h-3.5" />
                          {u.role === 'ADMIN' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0066FF]" />
                CREATE USER ACCOUNT
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Tanvir Hossain"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="tanvir@diu.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">PHONE NUMBER</label>
                <input
                  type="text"
                  placeholder="+880 1812-345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">DEPARTMENT</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">ROLE</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0066FF] text-white rounded-xl font-bold hover:bg-blue-600"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
