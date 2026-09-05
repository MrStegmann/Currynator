import { z } from 'zod';
export const BasicsSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    label: z.string().min(1, 'Label is required'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    image: z.string().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional().or(z.literal('')),
    summary: z.string().optional(),
    location: z.object({
        address: z.string().optional(),
        postalCode: z.string().optional(),
        city: z.string().optional(),
        countryCode: z.string().optional(),
        region: z.string().optional()
    }).optional(),
    profiles: z.array(z.object({
        network: z.string(),
        username: z.string(),
        url: z.string().url()
    })).optional()
});
export const ResumeSchema = z.object({
    basics: BasicsSchema,
    // Other properties like work, education, etc. can be added here later
    work: z.array(z.any()).optional(),
    volunteer: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    awards: z.array(z.any()).optional(),
    certificates: z.array(z.any()).optional(),
    publications: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    interests: z.array(z.any()).optional(),
    references: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional()
});
