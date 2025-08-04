'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClientById, getSessionsByMonth, updateClient } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { User, Mail, Phone, MapPin, Crown, Calendar, Clock, Activity, FileText, Check, X, Pencil, TrendingUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const getPlanColor = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'Standard Weekly':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'Single Session':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const getPlanIcon = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return <Crown className="h-4 w-4" />;
    case 'Standard Weekly':
      return <Calendar className="h-4 w-4" />;
    case 'Single Session':
      return <Clock className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const statusColorMap: Record<string, string> = {
  scheduled: 'bg-gray-300',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-yellow-400',
};
const statusLabelMap: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
};

function InlineEditField({
  value,
  placeholder,
  type = 'text',
  options,
  onSave,
  className = '',
}: {
  value: string | number | undefined;
  placeholder: string;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  onSave: (newValue: any) => Promise<void>;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  const handleSave = async () => {
    setLoading(true);
    await onSave(inputValue);
    setLoading(false);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className={className}>
        {type === 'select' && options ? (
          <select
            className="border rounded px-2 py-1 text-sm"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={loading}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            className="border rounded px-2 py-1 text-sm"
            type={type}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={loading}
            autoFocus
          />
        )}
        <button onClick={handleSave} className="ml-2 text-green-600" disabled={loading}><Check size={16} /></button>
        <button onClick={() => setEditing(false)} className="ml-1 text-gray-400"><X size={16} /></button>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 group cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') setEditing(true); }}
    >
      {value !== undefined && value !== '' ? (
        <span>{value}</span>
      ) : (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      <Pencil size={14} className="opacity-60 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer" />
    </span>
  );
}

function EditableSection({
  fields,
  values,
  labels,
  types,
  options,
  onSave,
  sectionTitle,
  icon,
  className = '',
}: {
  fields: string[];
  values: Record<string, any>;
  labels: Record<string, string>;
  types?: Record<string, 'text' | 'number' | 'select'>;
  options?: Record<string, { value: string; label: string }[]>;
  onSave: (newValues: Record<string, any>) => Promise<void>;
  sectionTitle: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(fields.reduce((acc, f) => ({ ...acc, [f]: values[f] ?? '' }), {}));
  }, [values, fields]);

  const handleChange = (f: string, v: any) => {
    setForm(prev => ({ ...prev, [f]: v }));
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
    setEditing(false);
  };

  return (
    <section className={`border border-gray-100 bg-white rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {icon}
          {sectionTitle}
        </h3>
        {!editing && (
          <button className="text-violet-600 hover:underline text-xs flex items-center gap-1 cursor-pointer" onClick={() => setEditing(true)}>
            <Pencil size={14} className="opacity-60 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer" /> Edit
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1.5 text-gray-700">
        {fields.map(f => (
          <div key={f} className="flex items-center gap-2">
            <span className="min-w-[70px] font-medium text-sm">{labels[f]}:</span>
            {editing ? (
              types && types[f] === 'select' && options && options[f] ? (
                <Select
                  id={f}
                  name={f}
                  value={form[f]}
                  onChange={e => handleChange(f, e.target.value)}
                  className="pr-10"
                  disabled={loading}
                >
                  <option value="">—</option>
                  {options[f].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={f}
                  name={f}
                  type={types && types[f] ? types[f] : 'text'}
                  value={form[f]}
                  onChange={e => handleChange(f, e.target.value)}
                  disabled={loading}
                />
              )
            ) : (
              <span className={form[f] ? '' : 'text-gray-400 italic'}>
                {form[f] ? form[f] : `Add ${labels[f].toLowerCase()}`}
              </span>
            )}
          </div>
        ))}
      </div>
      {editing && (
        <div className="flex gap-2 pt-3">
          <Button type="button" variant="success" onClick={handleSave} disabled={loading} size="sm">
            Save
          </Button>
          <Button type="button" variant="danger" onClick={() => setEditing(false)} disabled={loading} size="sm">
            Cancel
          </Button>
        </div>
      )}
    </section>
  );
}

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = Number(params.id);
  const [client, setClient] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions'>('overview');

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      getClientById(clientId),
      getSessionsByMonth(new Date().getFullYear(), new Date().getMonth() + 1)
    ])
      .then(([clientData, sessionsData]) => {
        setClient(clientData);
        setSessions(sessionsData.filter((s: any) => s.clientId === clientId));
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  // Функция для обновления нескольких полей клиента
  const handleSectionSave = async (fields: string[], newValues: Record<string, any>) => {
    // Собираем только изменяемые поля в плоском формате
    const updateData: Record<string, any> = {};
            fields.forEach((f: any) => {
      if (newValues[f] !== undefined) updateData[f] = newValues[f];
    });
    await updateClient(client.id, updateData);
    // После успешного обновления — повторно получить клиента с сервера
    const freshClient = await getClientById(client.id);
    setClient(freshClient);
    toast.success('Changes saved');
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!client) return <div className="text-center py-10">Client not found</div>;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          name={client.User?.name || 'No Name'}
          photoUrl={client.profile}
          size="w-16 h-16"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{client.User?.name}</h2>
          <div className="text-gray-600 text-base">{client.User?.email}</div>
        </div>
      </div>

      {/* Plan */}
      <div className="mb-6 flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getPlanColor(client.plan)}`}>
          {getPlanIcon(client.plan)}
          {client.plan || 'No plan'}
        </span>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/progress?client=${clientId}`)}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            View Progress
          </Button>
          <Button
            onClick={() => router.push(`/progress?client=${clientId}&tab=measurements&add=true`)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Measurement
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'sessions', label: 'Sessions', icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Contact Info */}
            <EditableSection
              fields={['email', 'phone', 'address']}
              values={{
                email: client.User?.email,
                phone: client.phone,
                address: client.address,
              }}
              labels={{
                email: 'Email',
                phone: 'Phone',
                address: 'Address',
              }}
              onSave={vals => handleSectionSave(['email', 'phone', 'address'], vals)}
              sectionTitle="Contact Information"
              icon={<User className="h-5 w-5 text-violet-500" />}
            />
            {/* Main Info */}
            <div className="lg:col-span-2">
              <EditableSection
                fields={['goal', 'plan', 'age', 'height', 'weight', 'targetWeight']}
                values={{
                  goal: client.goal,
                  plan: client.plan,
                  age: client.age,
                  height: client.height,
                  weight: client.weight,
                  targetWeight: client.targetWeight,
                }}
                labels={{
                  goal: 'Goal',
                  plan: 'Plan',
                  age: 'Age',
                  height: 'Height',
                  weight: 'Weight',
                  targetWeight: 'Target Weight',
                }}
                types={{
                  plan: 'select',
                  age: 'number',
                  height: 'number',
                  weight: 'number',
                  targetWeight: 'number',
                }}
                options={{
                  plan: [
                    { value: 'Premium Monthly', label: 'Premium Monthly' },
                    { value: 'Standard Weekly', label: 'Standard Weekly' },
                    { value: 'Single Session', label: 'Single Session' },
                  ],
                }}
                onSave={vals => handleSectionSave(['goal', 'plan', 'age', 'height', 'weight', 'targetWeight'], vals)}
                sectionTitle="Main Information"
              />
            </div>
          </div>
        )}
        {activeTab === 'sessions' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-500" />
                Sessions
            </h3>
            {sessions.length === 0 ? (
              <div className="text-gray-500 text-sm">No sessions found for this client.</div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="border border-gray-100 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between bg-white">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                      <span className={`w-2 h-2 rounded-full ${statusColorMap[session.status || 'scheduled']}`}></span>
                      <span className="font-medium text-sm">{statusLabelMap[session.status || 'scheduled']}</span>
                      <span className="text-gray-500 text-xs">{session.date?.slice(0, 10)}</span>
                      {session.duration && <span className="text-gray-500 text-xs">{session.duration} min</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {session.WorkoutTemplate?.name && (
                        <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-xs font-medium">
                          {session.WorkoutTemplate.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
} 