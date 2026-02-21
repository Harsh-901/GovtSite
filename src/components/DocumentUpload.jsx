import React, { useState } from 'react'
import { Upload, FileText, Check, X, Calendar, MapPin, User, Banknote } from 'lucide-react'
import { supabase } from '../lib/supabase'
import UploadDebug from './UploadDebug'

const DOCUMENT_TYPES = {
  aadhaar: { name: 'Aadhaar Card', icon: User, required: true },
  pan: { name: 'PAN Card', icon: Banknote, required: true },
  seven_twelve: { name: '7/12 Extract', icon: FileText, required: true },
  eight_a: { name: '8A Document', icon: FileText, required: true },
  passbook: { name: 'Bank Passbook', icon: Banknote, required: true },
  land_records: { name: 'Land Records/Revenue Records', icon: FileText, required: false },
  caste_certificate: { name: 'Caste Certificate', icon: FileText, required: false },
  income_certificate: { name: 'Income Certificate', icon: FileText, required: false },
  farmer_certificate: { name: 'Farmer Certificate', icon: FileText, required: false },
  photo: { name: 'Passport Size Photo', icon: User, required: true }
}

const CROP_TYPES = [
  'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Soybean', 'Maize', 'Bajra', 'Jowar',
  'Groundnut', 'Sunflower', 'Onion', 'Potato', 'Tomato', 'Chilli', 'Turmeric',
  'Coconut', 'Banana', 'Mango', 'Grapes', 'Pomegranate', 'Other'
]

const LAND_TYPES = [
  'Irrigated', 'Rain-fed', 'Dry Land', 'Wetland', 'Garden Land', 'Orchard'
]

export default function DocumentUpload({ user, onComplete }) {
  const [formData, setFormData] = useState({
    // Personal Details
    first_name: user?.user_metadata?.full_name?.split(' ')[0] || '',
    last_name: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
    father_name: '',
    date_of_birth: '',
    gender: '',
    category: '',
    
    // Contact Details
    phone: user?.user_metadata?.phone || '',
    email: user?.email || '',
    address: '',
    pincode: '',
    
    // Location Details
    state: '',
    district: '',
    tehsil: '',
    village: '',
    
    // Land Details
    total_land_area: '',
    cultivable_land_area: '',
    land_type: '',
    survey_number: '',
    khasra_number: '',
    
    // Crop Details
    primary_crop: '',
    secondary_crop: '',
    cropping_season: '',
    irrigation_source: '',
    
    // Bank Details
    bank_name: '',
    branch_name: '',
    account_number: '',
    ifsc_code: '',
    
    // Family Details
    family_members: '',
    dependents: '',
    annual_income: '',
    
    // Additional Info
    has_kisan_credit_card: false,
    has_crop_insurance: false,
    belongs_to_fpo: false,
    fpo_name: ''
  })

  const [documents, setDocuments] = useState({})
  const [uploading, setUploading] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (docType, file) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, JPG, JPEG, or PNG files')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(prev => ({ ...prev, [docType]: true }))

    try {
      const fileExt = file.name.split('.').pop().toLowerCase()
      const timestamp = Date.now()
      const fileName = `${user.id}/${docType}_${timestamp}.${fileExt}`
      
      console.log('Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type)
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        })

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      console.log('Upload successful:', data)

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      setDocuments(prev => ({
        ...prev,
        [docType]: {
          file_path: data.path,
          file_name: file.name,
          public_url: urlData.publicUrl,
          uploaded_at: new Date().toISOString(),
          file_size: file.size,
          file_type: file.type
        }
      }))

      alert(`${DOCUMENT_TYPES[docType].name} uploaded successfully!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Error uploading ${DOCUMENT_TYPES[docType].name}: ${error.message}`)
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if all required documents are uploaded
      const requiredDocs = Object.keys(DOCUMENT_TYPES).filter(key => DOCUMENT_TYPES[key].required)
      const missingDocs = requiredDocs.filter(doc => !documents[doc])
      
      if (missingDocs.length > 0) {
        alert(`Please upload the following required documents:\n${missingDocs.map(doc => `• ${DOCUMENT_TYPES[doc].name}`).join('\n')}`)
        setLoading(false)
        return
      }

      // Validate required form fields
      const requiredFields = [
        'first_name', 'last_name', 'father_name', 'date_of_birth', 'gender',
        'address', 'pincode', 'total_land_area', 'primary_crop',
        'bank_name', 'branch_name', 'account_number', 'ifsc_code'
      ]
      
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '')
      
      if (missingFields.length > 0) {
        alert(`Please fill in all required fields:\n${missingFields.map(field => `• ${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}`)
        setLoading(false)
        return
      }

      console.log('Submitting farmer profile:', { ...formData, documents })

      // Save farmer profile
      const { data, error } = await supabase
        .from('farmer_profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          full_name: `${formData.first_name} ${formData.last_name}`.trim(),
          documents: documents,
          status: 'pending_verification',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Profile saved successfully:', data)
      
      alert('🎉 Application submitted successfully!\n\nYour farmer registration has been submitted for verification. You will receive updates on your registered email and phone number.\n\nApplication Status: Pending Verification')
      onComplete()
    } catch (error) {
      console.error('Submission error:', error)
      alert(`❌ Error submitting application:\n\n${error.message}\n\nPlease try again or contact support if the problem persists.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Farmer Registration Form</h2>
        <p className="text-gray-600">Please fill all details accurately and upload required documents</p>
      </div>

      {/* Debug Component - Remove in production */}
      <UploadDebug user={user} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="father_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter father's name"
                value={formData.father_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name/Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your surname"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                <option value="general">General</option>
                <option value="obc">OBC</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
              </select>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            Contact & Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tehsil/Block
                </label>
                <input
                  type="text"
                  name="tehsil"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tehsil}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Land Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Land Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Land Area (Hectares) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_land_area"
                required
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.total_land_area}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cultivable Land Area (Hectares)
              </label>
              <input
                type="number"
                name="cultivable_land_area"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.cultivable_land_area}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Land Type
              </label>
              <select
                name="land_type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.land_type}
                onChange={handleInputChange}
              >
                <option value="">Select Land Type</option>
                {LAND_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Survey Number
              </label>
              <input
                type="text"
                name="survey_number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.survey_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khasra Number
              </label>
              <input
                type="text"
                name="khasra_number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.khasra_number}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Crop Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Crop <span className="text-red-500">*</span>
              </label>
              <select
                name="primary_crop"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.primary_crop}
                onChange={handleInputChange}
              >
                <option value="">Select Primary Crop</option>
                {CROP_TYPES.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Crop
              </label>
              <select
                name="secondary_crop"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.secondary_crop}
                onChange={handleInputChange}
              >
                <option value="">Select Secondary Crop</option>
                {CROP_TYPES.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cropping Season
              </label>
              <select
                name="cropping_season"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.cropping_season}
                onChange={handleInputChange}
              >
                <option value="">Select Season</option>
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
                <option value="perennial">Perennial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Irrigation Source
              </label>
              <select
                name="irrigation_source"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.irrigation_source}
                onChange={handleInputChange}
              >
                <option value="">Select Source</option>
                <option value="borewell">Borewell</option>
                <option value="canal">Canal</option>
                <option value="river">River</option>
                <option value="pond">Pond</option>
                <option value="rainwater">Rainwater</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
              </select>
            </div>
          </div>
        </section>

        {/* Bank Details */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Banknote className="mr-2 h-5 w-5 text-blue-600" />
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bank_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.bank_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="branch_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.branch_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account_number"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.account_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ifsc_code"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.ifsc_code}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Members
              </label>
              <input
                type="number"
                name="family_members"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.family_members}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dependents
              </label>
              <input
                type="number"
                name="dependents"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.dependents}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income (₹)
              </label>
              <input
                type="number"
                name="annual_income"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.annual_income}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_kisan_credit_card"
                className="mr-2"
                checked={formData.has_kisan_credit_card}
                onChange={handleInputChange}
              />
              <span className="text-sm text-gray-700">I have a Kisan Credit Card</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="has_crop_insurance"
                className="mr-2"
                checked={formData.has_crop_insurance}
                onChange={handleInputChange}
              />
              <span className="text-sm text-gray-700">I have Crop Insurance</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="belongs_to_fpo"
                className="mr-2"
                checked={formData.belongs_to_fpo}
                onChange={handleInputChange}
              />
              <span className="text-sm text-gray-700">I belong to a Farmer Producer Organization (FPO)</span>
            </label>
            {formData.belongs_to_fpo && (
              <div className="ml-6">
                <input
                  type="text"
                  name="fpo_name"
                  placeholder="FPO Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fpo_name}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </section>

        {/* Document Upload Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="mr-2 h-5 w-5 text-blue-600" />
            Document Upload
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Please upload clear, readable documents in PDF, JPG, JPEG, or PNG format. Maximum file size: 5MB per document.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(DOCUMENT_TYPES).map(([key, doc]) => {
              const Icon = doc.icon
              const isUploaded = documents[key]
              const isUploading = uploading[key]
              
              return (
                <div key={key} className={`border rounded-lg p-4 transition-colors ${
                  isUploaded ? 'border-green-300 bg-green-50' : 
                  doc.required ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon className={`h-4 w-4 mr-2 ${
                        isUploaded ? 'text-green-600' : 'text-gray-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700">
                        {doc.name}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>
                    {isUploaded && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                  
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(key, e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    disabled={isUploading}
                  />
                  
                  {isUploading && (
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                  
                  {isUploaded && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Uploaded: {isUploaded.file_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Size: {(isUploaded.file_size / 1024).toFixed(1)} KB | 
                        Type: {isUploaded.file_type}
                      </div>
                      {isUploaded.public_url && (
                        <a 
                          href={isUploaded.public_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Upload Guidelines:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Ensure documents are clear and all text is readable</li>
              <li>• Upload original documents, not photocopies when possible</li>
              <li>• File formats: PDF (preferred), JPG, JPEG, PNG</li>
              <li>• Maximum file size: 5MB per document</li>
              <li>• Required documents must be uploaded before submission</li>
            </ul>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Submit Application
          </button>
        </div>
      </form>
    </div>
  )
}