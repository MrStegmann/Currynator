import { describe, it, expect } from '@jest/globals';
import { ResumeSchema, BasicsSchema } from '../../shared/schema/resumeSchema.js';

describe('ResumeSchema Validation', () => {
  it('should pass validation with valid required fields', () => {
    const validData = {
      basics: {
        name: 'John Doe',
        label: 'Programmer',
        email: 'john@example.com'
      }
    };
    
    const result = ResumeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation when name is missing', () => {
    const invalidData = {
      basics: {
        label: 'Programmer',
        email: 'john@example.com'
      }
    };
    
    const result = ResumeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should fail validation when email is invalid', () => {
    const invalidData = {
      basics: {
        name: 'John Doe',
        label: 'Programmer',
        email: 'not-an-email'
      }
    };
    
    const result = ResumeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should pass validation with optional fields included', () => {
    const validData = {
      basics: {
        name: 'John Doe',
        label: 'Programmer',
        email: 'john@example.com',
        phone: '123-456-7890',
        url: 'https://example.com',
        summary: 'A summary',
        location: {
          city: 'New York',
          countryCode: 'US'
        },
        profiles: [
          {
            network: 'Twitter',
            username: 'johndoe',
            url: 'https://twitter.com/johndoe'
          }
        ]
      }
    };
    
    const result = ResumeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
