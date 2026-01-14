'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

export default function BetaEmployerProfilePage() {
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

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Company Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/beta/dashboard/employer')}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium">
                Company Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="companyName"
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Website
              </label>
              <Input
                id="website"
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm font-medium">
                Industry
              </label>
              <Input
                id="industry"
                type="text"
                value={profile.industry || ''}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                placeholder="e.g., Technology, Finance"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="size" className="text-sm font-medium">
                Company Size
              </label>
              <select
                id="size"
                value={profile.size || ''}
                onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="founded" className="text-sm font-medium">
                Founded Year
              </label>
              <Input
                id="founded"
                type="number"
                value={profile.founded || ''}
                onChange={(e) => setProfile({ ...profile, founded: parseInt(e.target.value) })}
                placeholder="e.g., 2020"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Company Description
              </label>
              <textarea
                id="description"
                value={profile.description || ''}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe your company..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/beta/dashboard/employer')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
