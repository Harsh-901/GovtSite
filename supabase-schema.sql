-- Create farmer_profiles table
CREATE TABLE farmer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Personal Details
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    father_name TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    category TEXT CHECK (category IN ('general', 'obc', 'sc', 'st')),
    
    -- Contact Details
    phone TEXT,
    email TEXT,
    address TEXT,
    pincode TEXT,
    
    -- Location Details
    state TEXT,
    district TEXT,
    tehsil TEXT,
    village TEXT,
    
    -- Land Details
    total_land_area DECIMAL(10,2),
    cultivable_land_area DECIMAL(10,2),
    land_type TEXT,
    survey_number TEXT,
    khasra_number TEXT,
    
    -- Crop Details
    primary_crop TEXT,
    secondary_crop TEXT,
    cropping_season TEXT CHECK (cropping_season IN ('kharif', 'rabi', 'zaid', 'perennial')),
    irrigation_source TEXT,
    
    -- Bank Details
    bank_name TEXT,
    branch_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    
    -- Family Details
    family_members INTEGER,
    dependents INTEGER,
    annual_income DECIMAL(12,2),
    
    -- Additional Info
    has_kisan_credit_card BOOLEAN DEFAULT FALSE,
    has_crop_insurance BOOLEAN DEFAULT FALSE,
    belongs_to_fpo BOOLEAN DEFAULT FALSE,
    fpo_name TEXT,
    
    -- Documents and Status
    documents JSONB,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected', 'approved')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create policy for authenticated users to upload their own documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for authenticated users to view their own documents
CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy for users to manage their own farmer profiles
CREATE POLICY "Users can manage their own farmer profiles" ON farmer_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Enable RLS
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_farmer_profiles_updated_at 
    BEFORE UPDATE ON farmer_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();