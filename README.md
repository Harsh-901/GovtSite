# PM Kisan Portal with Supabase Authentication

A comprehensive farmer registration portal with document upload functionality using React, Vite, Tailwind CSS, and Supabase.

## Features

- **Supabase Authentication**: Email/password and phone OTP authentication
- **Comprehensive Farmer Registration**: Detailed form with all necessary fields
- **Document Upload**: Support for multiple document types with file validation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live status updates and notifications

## Document Types Supported

### Required Documents:
- Aadhaar Card
- PAN Card  
- 7/12 Extract (Land Records)
- 8A Document
- Bank Passbook
- Passport Size Photo

### Optional Documents:
- Land Records/Revenue Records
- Caste Certificate
- Income Certificate
- Farmer Certificate

## Additional Fields Included

### Personal Information:
- Full Name, Father's Name, Date of Birth, Gender, Category
- Complete Address, PIN Code, Phone, Email

### Location Details:
- State, District, Tehsil/Block, Village

### Land Information:
- Total Land Area, Cultivable Land Area, Land Type
- Survey Number, Khasra Number
- Irrigation Source

### Crop Details:
- Primary & Secondary Crops
- Cropping Season (Kharif/Rabi/Zaid/Perennial)
- Irrigation Method

### Bank Details:
- Bank Name, Branch, Account Number, IFSC Code

### Family & Economic Details:
- Family Members, Dependents, Annual Income
- Kisan Credit Card Status
- Crop Insurance Status
- FPO Membership

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase Project
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL commands from `supabase-schema.sql`

### 4. Configure Storage
1. Go to Storage in your Supabase dashboard
2. The `documents` bucket should be created automatically
3. Verify the RLS policies are in place

### 5. Run the Application
```bash
npm run dev
```

## Suggested Additional Fields

Based on agricultural requirements, consider adding:

### Livestock Information:
- Number of cattle, buffaloes, goats, poultry
- Dairy production details

### Equipment & Infrastructure:
- Farm equipment owned
- Storage facilities
- Processing units

### Certification & Training:
- Organic certification status
- Training programs attended
- Skill development courses

### Market Information:
- Preferred selling channels
- Contract farming agreements
- Export activities

### Environmental Data:
- Water source details
- Soil health card information
- Climate adaptation measures

### Financial Information:
- Loan details
- Insurance policies
- Government scheme participation

## Technology Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **Icons**: Lucide React

## File Structure

```
src/
├── components/
│   ├── Auth.jsx              # Authentication component
│   └── DocumentUpload.jsx    # Main registration form
├── lib/
│   └── supabase.js          # Supabase client configuration
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
└── index.css               # Global styles
```

## Security Features

- Row Level Security (RLS) enabled
- Users can only access their own data
- Secure file upload with user-specific folders
- Input validation and sanitization
- Protected API routes

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
3. Ensure environment variables are set in production

## Support

For issues and questions, please refer to the documentation or create an issue in the repository.