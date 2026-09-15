import { describe, it, expect } from '@jest/globals';
import { JobApplicationSchema, JobApplicationStatusSchema } from '../../shared/schema/jobApplicationSchema.js';

describe('JobApplicationSchema Validation', () => {
  it('should default status to pending when status is not provided', () => {
    const data = {
      id: 'app-1',
      title: 'Frontend Developer',
      jobDescription: 'React and TS experience',
      jobRequirement: '3+ years React',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const parsed = JobApplicationSchema.parse(data);
    expect(parsed.status).toBe('pending');
  });

  it('should accept pending as a valid JobApplicationStatus', () => {
    const statusResult = JobApplicationStatusSchema.safeParse('pending');
    expect(statusResult.success).toBe(true);
  });

  it('should accept match_score and tailored_json_resume optional fields', () => {
    const data = {
      id: 'app-2',
      title: 'Senior Developer',
      jobDescription: 'Full stack development',
      jobRequirement: 'Node.js & React',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'pending',
      match_score: 88,
      tailored_json_resume: {
        basics: { name: 'John Doe' },
        skills: [{ name: 'Frontend', keywords: ['React', 'TS'] }]
      }
    };

    const parsed = JobApplicationSchema.parse(data);
    expect(parsed.match_score).toBe(88);
    expect(parsed.tailored_json_resume).toBeDefined();
    expect((parsed.tailored_json_resume as any)?.basics?.name).toBe('John Doe');
  });

  it('should reject match_score below 0 or above 100', () => {
    const invalidLow = {
      id: 'app-3',
      title: 'Dev',
      jobDescription: 'Desc',
      jobRequirement: 'Req',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      match_score: -5
    };
    expect(JobApplicationSchema.safeParse(invalidLow).success).toBe(false);

    const invalidHigh = {
      ...invalidLow,
      match_score: 105
    };
    expect(JobApplicationSchema.safeParse(invalidHigh).success).toBe(false);
  });
});
