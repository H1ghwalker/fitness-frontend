'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import toast from 'react-hot-toast';
import { TextField } from '@/components/ui/textfield';
import { useApi } from '@/hooks/useApi';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

export default function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const { makeRequest } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await makeRequest('clients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      onClose();
      onClientAdded?.();
      toast.success('Client added successfully');
      // Сбрасываем форму
      setFormData({ name: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('An error occurred while adding the client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', notes: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4 min-w-[24rem]">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-primary mb-2">
            Notes
          </label>
          <TextField
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any notes about the client..."
            rows={3}
          />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="danger" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Adding...' : 'Add Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 