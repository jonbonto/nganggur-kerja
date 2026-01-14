'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Skill {
  id: number;
  name: string;
  level?: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export default function JobSeekerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('skills');
  
  // Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  
  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  
  // Education
  const [educations, setEducations] = useState<Education[]>([]);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, expRes, eduRes] = await Promise.all([
        fetch('/api/job-seekers/skills'),
        fetch('/api/job-seekers/experiences'),
        fetch('/api/job-seekers/educations')
      ]);

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data.skills);
      }
      if (expRes.ok) {
        const data = await expRes.json();
        setExperiences(data.experiences);
      }
      if (eduRes.ok) {
        const data = await eduRes.json();
        setEducations(data.educations);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Skills Functions
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return;

    try {
      const res = await fetch('/api/job-seekers/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill)
      });

      if (!res.ok) throw new Error('Failed to add skill');

      const data = await res.json();
      setSkills([...skills, data.skill]);
      setNewSkill({ name: '', level: '' });
      toast.success('Skill added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete this skill?')) return;

    try {
      const res = await fetch(`/api/job-seekers/skills?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete skill');

      setSkills(skills.filter(s => s.id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete skill');
    }
  };

  // Experience Functions
  const handleSaveExperience = async (exp: Partial<Experience>) => {
    try {
      const method = exp.id ? 'PUT' : 'POST';
      const res = await fetch('/api/job-seekers/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp)
      });

      if (!res.ok) throw new Error('Failed to save experience');

      const data = await res.json();
      if (exp.id) {
        setExperiences(experiences.map(e => e.id === exp.id ? data.experience : e));
      } else {
        setExperiences([...experiences, data.experience]);
      }
      setEditingExp(null);
      toast.success('Experience saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Delete this experience?')) return;

    try {
      const res = await fetch(`/api/job-seekers/experiences?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete experience');

      setExperiences(experiences.filter(e => e.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete experience');
    }
  };

  // Education Functions
  const handleSaveEducation = async (edu: Partial<Education>) => {
    try {
      const method = edu.id ? 'PUT' : 'POST';
      const res = await fetch('/api/job-seekers/educations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu)
      });

      if (!res.ok) throw new Error('Failed to save education');

      const data = await res.json();
      if (edu.id) {
        setEducations(educations.map(e => e.id === edu.id ? data.education : e));
      } else {
        setEducations([...educations, data.education]);
      }
      setEditingEdu(null);
      toast.success('Education saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save education');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Delete this education?')) return;

    try {
      const res = await fetch(`/api/job-seekers/educations?id=${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete education');

      setEducations(educations.filter(e => e.id !== id));
      toast.success('Education deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete education');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Build Your Profile</h1>
        <button
          onClick={() => router.push('/dashboard/freelancer')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['skills', 'experience', 'education'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Skill</h2>
            <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Skill name (e.g., JavaScript)"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="border rounded-md px-4 py-2"
                required
              />
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                className="border rounded-md px-4 py-2"
              >
                <option value="">Select level (optional)</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Add Skill
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
            {skills.length === 0 ? (
              <p className="text-gray-500">No skills added yet</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span>
                      {skill.name} {skill.level && `(${skill.level})`}
                    </span>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <button
            onClick={() => setEditingExp({
              id: 0,
              company: '',
              position: '',
              description: '',
              startDate: '',
              isCurrent: false
            })}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add Experience
          </button>

          {editingExp && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editingExp.id ? 'Edit' : 'Add'} Experience
              </h2>
              <ExperienceForm
                experience={editingExp}
                onSave={handleSaveExperience}
                onCancel={() => setEditingExp(null)}
              />
            </div>
          )}

          <div className="space-y-4">
            {experiences.map(exp => (
              <div key={exp.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                    {exp.description && <p className="mt-2 text-gray-700">{exp.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingExp(exp)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {experiences.length === 0 && !editingExp && (
              <p className="text-gray-500 text-center py-8">No experience added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <button
            onClick={() => setEditingEdu({
              id: 0,
              institution: '',
              degree: '',
              fieldOfStudy: '',
              startDate: '',
              isCurrent: false
            })}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add Education
          </button>

          {editingEdu && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editingEdu.id ? 'Edit' : 'Add'} Education
              </h2>
              <EducationForm
                education={editingEdu}
                onSave={handleSaveEducation}
                onCancel={() => setEditingEdu(null)}
              />
            </div>
          )}

          <div className="space-y-4">
            {educations.map(edu => (
              <div key={edu.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    {edu.fieldOfStudy && <p className="text-gray-600">{edu.fieldOfStudy}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEdu(edu)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {educations.length === 0 && !editingEdu && (
              <p className="text-gray-500 text-center py-8">No education added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Experience Form Component
function ExperienceForm({
  experience,
  onSave,
  onCancel
}: {
  experience: Partial<Experience>;
  onSave: (exp: Partial<Experience>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(experience);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Company"
        value={formData.company || ''}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
        required
      />
      <input
        type="text"
        placeholder="Position"
        value={formData.position || ''}
        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate ? formData.startDate.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate ? formData.endDate.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            disabled={formData.isCurrent}
          />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isCurrent || false}
          onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : formData.endDate })}
        />
        <span>I currently work here</span>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Education Form Component
function EducationForm({
  education,
  onSave,
  onCancel
}: {
  education: Partial<Education>;
  onSave: (edu: Partial<Education>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(education);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Institution"
        value={formData.institution || ''}
        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
        required
      />
      <input
        type="text"
        placeholder="Degree"
        value={formData.degree || ''}
        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
        required
      />
      <input
        type="text"
        placeholder="Field of Study (optional)"
        value={formData.fieldOfStudy || ''}
        onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
        className="w-full border rounded-md px-4 py-2"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate ? formData.startDate.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate ? formData.endDate.split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full border rounded-md px-4 py-2"
            disabled={formData.isCurrent}
          />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isCurrent || false}
          onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : formData.endDate })}
        />
        <span>I currently study here</span>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
