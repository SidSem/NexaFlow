import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Plus,
  Search,
  Mail,
  Trash2,
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useTheme } from '../hooks/useTheme';
import { TeamMember } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const TeamPage: React.FC = () => {
  const { isDark } = useTheme();
  const { members, tasks, projects, createMember, deleteMember } =
    useWorkspaceStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'tasks' | 'workload'>('name');

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite member form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Engineer');
  const [inviteDepartment, setInviteDepartment] = useState('Engineering');
  const [inviteErrors, setInviteErrors] = useState<Record<string, string>>({});

  // Compute members with dynamic stats from tasks
  const membersWithStats = useMemo(() => {
    return members.map((m) => {
      const assignedTasks = tasks.filter((t) => t.assigneeId === m.id);
      const completedTasks = assignedTasks.filter((t) => t.status === 'done');
      const workloadScore = assignedTasks.length;
      const memberProjects = projects.filter((p) => p.memberIds.includes(m.id));

      return {
        ...m,
        assignedCount: assignedTasks.length,
        completedCount: completedTasks.length,
        workloadScore,
        memberProjects,
      };
    });
  }, [members, tasks, projects]);

  // Filtering & Sorting
  const filteredMembers = useMemo(() => {
    let result = [...membersWithStats];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q)
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((m) => m.department === roleFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'tasks') return b.assignedCount - a.assignedCount;
      if (sortBy === 'workload') return b.workloadScore - a.workloadScore;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [membersWithStats, search, roleFilter, sortBy]);

  // Workload Chart Data
  const workloadChartData = useMemo(() => {
    return membersWithStats.map((m) => ({
      name: m.name.split(' ')[0],
      assigned: m.assignedCount,
      completed: m.completedCount,
    }));
  }, [membersWithStats]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!inviteName.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!inviteEmail.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }

    createMember({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      department: inviteDepartment,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    });

    setInviteName('');
    setInviteEmail('');
    setInviteErrors({});
    setInviteModalOpen(false);
  };

  const selectedMemberTasks = useMemo(() => {
    if (!selectedMember) return [];
    return tasks.filter((t) => t.assigneeId === selectedMember.id);
  }, [selectedMember, tasks]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize members, track deliverables, balance team workload, and assign initiatives.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setInviteModalOpen(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* Team Workload Recharts Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Workload & Throughput
            </h3>
            <p className="text-xs text-slate-500">
              Active assigned deliverables vs completed deliverables
            </p>
          </div>
          <Badge variant="brand" size="sm">
            Capacity
          </Badge>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#1e293b' : '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="assigned" name="Assigned Tasks" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed Tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="w-full sm:w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            leftIcon={<Search className="w-4 h-4" />}
            className="h-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
            <option value="Quality">Quality</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="tasks">Sort by Tasks</option>
            <option value="workload">Sort by Workload</option>
          </select>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            hoverEffect
            onClick={() => setSelectedMember(member)}
            className="p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <Avatar
                  src={member.avatar}
                  name={member.name}
                  size="lg"
                  status="online"
                />

                <div className="flex items-center gap-1">
                  <Badge variant="brand" size="sm">
                    {member.department}
                  </Badge>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMemberToDelete(member);
                    }}
                    aria-label="Remove member"
                    title="Remove member"
                    className="p-1 rounded text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-xs text-slate-500 mb-1">{member.role}</p>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{member.email}</span>
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Tasks</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {member.completedCount} / {member.assignedCount} done
                </span>
              </div>

              <Progress
                value={
                  member.assignedCount > 0
                    ? (member.completedCount / member.assignedCount) * 100
                    : 0
                }
                size="sm"
              />

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span>{member.memberProjects.length} Projects</span>
                <span className="text-brand-600 dark:text-brand-400 font-medium">
                  View Profile →
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Member Profile Drawer */}
      <Drawer
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        size="md"
        title="Team Member Profile"
      >
        {selectedMember && (
          <div className="space-y-6 text-left">
            {/* Top Details */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Avatar
                src={selectedMember.avatar}
                name={selectedMember.name}
                size="xl"
                status="online"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedMember.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{selectedMember.role}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="brand" size="sm">
                    {selectedMember.department}
                  </Badge>
                  <span className="text-xs text-slate-400">{selectedMember.email}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Assigned Deliverables
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {selectedMemberTasks.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Completed
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {selectedMemberTasks.filter((t) => t.status === 'done').length}
                </span>
              </div>
            </div>

            {/* Assigned Tasks List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Current Assigned Tasks ({selectedMemberTasks.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedMemberTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium truncate mr-2">{t.title}</span>
                    <Badge variant={t.status === 'done' ? 'success' : 'neutral'} size="sm">
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        size="md"
        title="Invite New Team Member"
        description="Add a teammate to collaborate on workspace projects and assign tasks."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInvite}
            >
              Add Member
            </Button>
          </>
        }
      >
        <form onSubmit={handleInvite} className="space-y-4 text-left">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Jordan Rivera"
            value={inviteName}
            onChange={(e) => {
              setInviteName(e.target.value);
              if (inviteErrors.name) setInviteErrors((prev) => ({ ...prev, name: '' }));
            }}
            error={inviteErrors.name}
          />

          <Input
            label="Work Email"
            type="email"
            required
            placeholder="e.g. jordan.rivera@nexaflow.dev"
            value={inviteEmail}
            onChange={(e) => {
              setInviteEmail(e.target.value);
              if (inviteErrors.email) setInviteErrors((prev) => ({ ...prev, email: '' }));
            }}
            error={inviteErrors.email}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role Title"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              options={[
                { value: 'Staff Frontend Engineer', label: 'Staff Frontend Engineer' },
                { value: 'Senior UI Architect', label: 'Senior UI Architect' },
                { value: 'Principal Product Designer', label: 'Principal Product Designer' },
                { value: 'Group Product Manager', label: 'Group Product Manager' },
                { value: 'QA & Accessibility Lead', label: 'QA & Accessibility Lead' },
              ]}
            />

            <Select
              label="Department"
              value={inviteDepartment}
              onChange={(e) => setInviteDepartment(e.target.value)}
              options={[
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Design', label: 'Design' },
                { value: 'Product', label: 'Product' },
                { value: 'Quality', label: 'Quality' },
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Member Confirmation */}
      <ConfirmDialog
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (memberToDelete) {
            deleteMember(memberToDelete.id);
            setMemberToDelete(null);
          }
        }}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${memberToDelete?.name} from the workspace? Their assigned tasks will be unassigned.`}
        danger
      />
    </div>
  );
};
