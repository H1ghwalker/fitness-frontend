"use client";

import { useEffect, useState } from 'react';
import ClientCard from '@/components/ClientCard';
import AddClientModal from '@/components/AddClientModal';
import EditClientModal from '@/components/EditClientModal';
import { Client } from '@/types/types';
import { getClients, deleteClient } from '@/utils/api/api';
import { Search, Users, Calendar, Dumbbell, Plus, Filter } from 'lucide-react';

export default function ClientsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Subscription' | 'Single Session'>('All');

  const [editingClientId, setEditingClientId] = useState<number | null>(null);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const applyFilters = (query: string, filterType: typeof filter) => {
    let result = clients;
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(client =>
        client.User?.name?.toLowerCase().includes(lowerQuery) ||
        client.User?.email?.toLowerCase().includes(lowerQuery)
      );
    }

    if (filterType !== 'All') {
      result = result.filter(client =>
        filterType === 'Subscription'
          ? client.plan === 'Premium Monthly' || client.plan === 'Standard Weekly'
          : client.plan === 'Single Session'
      );
    }

    setFilteredClients(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, filter);
  };

  const handleFilterChange = (filterType: typeof filter) => {
    setFilter(filterType);
    applyFilters(searchQuery, filterType);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilter('All');
    applyFilters('', 'All');
  };

  const handleAddClient = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
      setFilteredClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Error deleting client');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44] mb-2">Clients</h1>
            <p className="text-sm text-[#6B7280]">Manage your client list and details</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#059669] transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add New Client
          </button>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
          </div>

          <div className="flex gap-2">
            {(['All', 'Subscription', 'Single Session'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  filter === type
                    ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]'
                    : 'bg-gray-200 text-[#1F2A44] hover:bg-gray-300'
                }`}
              >
                {type === 'All' && <Users className="h-5 w-5" />}
                {type === 'Subscription' && <Calendar className="h-5 w-5" />}
                {type === 'Single Session' && <Dumbbell className="h-5 w-5" />}
                {type}
              </button>
            ))}
            <button
              onClick={handleResetFilters}
              className="p-2 bg-gray-200 text-[#1F2A44] rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={() => handleDeleteClient(client.id)}
              onEdit={(id) => setEditingClientId(id)}
            />
          ))}
        </div>
      </div>

      {/* Добавление клиента */}
      <AddClientModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onClientAdded={handleAddClient}
      />

      {/* Модалка редактирования клиента */}
      {editingClientId !== null && (
        <EditClientModal
          clientId={editingClientId}
          onClose={() => setEditingClientId(null)}
          onUpdated={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
    </main>
  );
}
