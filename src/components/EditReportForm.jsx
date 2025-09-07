import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EditReportForm = ({ report, onSubmit }) => {
  const [formData, setFormData] = useState({
    ...report,
    affectedSystems: report.affectedSystems?.join(', ') || '',
    recommendations: report.recommendations?.join('\n') || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value, field) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      affectedSystems: formData.affectedSystems.split(',').map(s => s.trim()).filter(s => s),
      recommendations: formData.recommendations.split('\n').map(r => r.trim()).filter(r => r)
    };
    
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Report Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter report title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange(value, 'category')}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Network Security">Network Security</SelectItem>
              <SelectItem value="Malware">Malware</SelectItem>
              <SelectItem value="Access Control">Access Control</SelectItem>
              <SelectItem value="Data Protection">Data Protection</SelectItem>
              <SelectItem value="Social Engineering">Social Engineering</SelectItem>
              <SelectItem value="Physical Security">Physical Security</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select value={formData.severity} onValueChange={(value) => handleSelectChange(value, 'severity')}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange(value, 'status')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief description of the security incident"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Full Description</Label>
        <Textarea
          id="fullDescription"
          name="fullDescription"
          value={formData.fullDescription}
          onChange={handleInputChange}
          placeholder="Detailed description of the incident"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="affectedSystems">Affected Systems</Label>
        <Input
          id="affectedSystems"
          name="affectedSystems"
          value={formData.affectedSystems}
          onChange={handleInputChange}
          placeholder="System 1, System 2, System 3 (comma-separated)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recommendations">Recommendations</Label>
        <Textarea
          id="recommendations"
          name="recommendations"
          value={formData.recommendations}
          onChange={handleInputChange}
          placeholder="Enter each recommendation on a new line"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-hover">
          Update Report
        </Button>
      </div>
    </form>
  );
};

export default EditReportForm;