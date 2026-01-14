'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

export default function BetaJobSeekerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('skills');
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);

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
        setSkills(data.skills || []);
      }
      if (expRes.ok) {
        const data = await expRes.json();
        setExperiences(data.experiences || []);
      }
      if (eduRes.ok) {
        const data = await eduRes.json();
        setEducations(data.educations || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="container mx-auto py-10">Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Job Seeker Profile</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/beta/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <Button 
          variant={activeTab === 'skills' ? 'default' : 'outline'}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </Button>
        <Button 
          variant={activeTab === 'experience' ? 'default' : 'outline'}
          onClick={() => setActiveTab('experience')}
        >
          Experience
        </Button>
        <Button 
          variant={activeTab === 'education' ? 'default' : 'outline'}
          onClick={() => setActiveTab('education')}
        >
          Education
        </Button>
      </div>

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Skill</CardTitle>
              <CardDescription>Add skills to showcase your expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSkill} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="skillName" className="text-sm font-medium">
                      Skill Name
                    </label>
                    <Input
                      id="skillName"
                      type="text"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="e.g., JavaScript, Python"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="skillLevel" className="text-sm font-medium">
                      Level
                    </label>
                    <select
                      id="skillLevel"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
                <Button type="submit">Add Skill</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>Manage your skill set</CardDescription>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No skills added yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                    >
                      <span className="font-medium">{skill.name}</span>
                      {skill.level && (
                        <span className="text-xs text-muted-foreground">({skill.level})</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Experience Tab */}
      {activeTab === 'experience' && (
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Your professional work history</CardDescription>
          </CardHeader>
          <CardContent>
            {experiences.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No work experience added yet
              </p>
            ) : (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-lg">{exp.position}</h4>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exp.startDate).toLocaleDateString()} - {
                          exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''
                        }
                      </p>
                      {exp.description && (
                        <p className="mt-2 text-sm">{exp.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Your educational background</CardDescription>
          </CardHeader>
          <CardContent>
            {educations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No education records added yet
              </p>
            ) : (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-lg">{edu.degree}</h4>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {new Date(edu.startDate).toLocaleDateString()} - {
                          edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : ''
                        }
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
