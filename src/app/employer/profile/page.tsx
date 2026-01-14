'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CompanyProfile {
  id?: number;
  companyName: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  description?: string;
  founded?: number;
}

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: '',
    logo: '',
    website: '',
    industry: '',
    size: '',
    description: '',
    founded: undefined
  });
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/employers/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/employers/profile', {
        method: profile.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      const data = await res.json();
      setProfile(data.profile);
      toast.success('Company profile saved successfully');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <button
          onClick={() => router.push('/dashboard/employer')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              required
              placeholder="Enter your company name"
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo URL
            </label>
            <input
              type="url"
              value={profile.logo || ''}
              onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              placeholder="https://example.com/logo.png"
            />
            {profile.logo && (
              <div className="mt-2">
                <img
                  src={profile.logo}
                  alt="Company Logo Preview"
                  className="h-20 w-20 object-contain border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Website
            </label>
            <input
              type="url"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              placeholder="https://www.example.com"
            />
          </div>

          {/* Industry and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={profile.industry || ''}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Construction">Construction</option>
                <option value="Marketing">Marketing</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                value={profile.size || ''}
                onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001+">1001+ employees</option>
              </select>
            </div>
          </div>

          {/* Founded Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Founded Year
            </label>
            <input
              type="number"
              value={profile.founded || ''}
              onChange={(e) => setProfile({ ...profile, founded: parseInt(e.target.value) || undefined })}
              className="w-full border rounded-md px-4 py-2"
              placeholder="e.g., 2010"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            <textarea
              value={profile.description || ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="w-full border rounded-md px-4 py-2"
              rows={5}
              placeholder="Tell job seekers about your company..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/employer')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Profile Preview */}
      {profile.id && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
          <div className="space-y-4">
            {profile.logo && (
              <div>
                <img
                  src={profile.logo}
                  alt="Company Logo"
                  className="h-24 w-24 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold">{profile.companyName}</h3>
              {profile.industry && <p className="text-gray-600">{profile.industry}</p>}
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              {profile.size && <span>👥 {profile.size} employees</span>}
              {profile.founded && <span>📅 Founded {profile.founded}</span>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  🌐 Website
                </a>
              )}
            </div>
            {profile.description && (
              <div>
                <h4 className="font-semibold mb-2">About Us</h4>
                <p className="text-gray-700 whitespace-pre-line">{profile.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
