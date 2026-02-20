import React, { useState, useEffect } from 'react';
import {
    Home,
    UserPlus,
    Activity,
    Phone,
    Menu,
    X,
    CheckCircle,
    Download,
    HelpCircle,
    Globe,
    ChevronRight,
    Printer,
    FileText
} from 'lucide-react';

// Emblem URL (public domain)
const EMBLEM_URL = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function App() {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        state: '',
        district: '',
        village: '',
        land_size: '',
        primary_crop: '',
        aadhaar: ''
    });

    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetOTP = () => {
        if (!formData.phone || formData.phone.length < 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }
        setOtpLoading(true);
        // Simulate API call
        setTimeout(() => {
            setOtpLoading(false);
            setOtpSent(true);
            alert(`OTP sent to ${formData.phone}`);
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpSent) {
            alert("Please verify your mobile number with OTP first.");
            return;
        }

        // Generate Reference ID
        const refId = `PMK-2024-${Math.random().toString(36).substr(2, 4).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        setReferenceId(refId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            full_name: '',
            phone: '',
            state: '',
            district: '',
            village: '',
            land_size: '',
            primary_crop: '',
            aadhaar: ''
        });
        setOtpSent(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">

            {/* --- Header Section --- */}

            {/* Top Strip */}
            <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 h-1.5 w-full"></div>

            {/* Main Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Area */}
                        <div className="flex items-center space-x-4">
                            <img src={EMBLEM_URL} alt="Emblem of India" className="h-16 w-auto object-contain" />
                            <div className="hidden md:block">
                                <h1 className="text-xl md:text-2xl font-bold text-blue-900 leading-tight">
                                    PM Kisan Samman Nidhi
                                </h1>
                                <p className="text-sm text-gray-600 font-medium">
                                    Ministry of Agriculture & Farmers Welfare
                                </p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    Government of India
                                </p>
                            </div>
                        </div>

                        {/* Right Header Controls */}
                        <div className="flex items-center space-x-3 md:space-x-6">
                            <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-200 transition">
                                <Globe className="w-4 h-4 text-blue-700" />
                                <span>English</span>
                            </div>

                            <button className="md:hidden p-2 text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <X /> : <Menu />}
                            </button>

                            <div className="hidden md:flex items-center space-x-4">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/G20_India_2023_logo.svg/2560px-G20_India_2023_logo.svg.png" alt="G20" className="h-10 w-auto" />
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs text-gray-500">Helpline No.</p>
                                    <p className="text-sm font-bold text-blue-800">155261 / 011-24300606</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Marquee Section */}
            <div className="bg-blue-900 text-white py-2 overflow-hidden relative">
                <div className="whitespace-nowrap animate-marquee flex items-center space-x-8">
                    <span className="flex items-center"><span className="bg-red-600 text-xs px-2 py-0.5 rounded mr-2 uppercase font-bold animate-pulse">New</span> eKYC is mandatory for PM Kisan registered farmers. Please complete eKYC via OTP or Biometric.</span>
                    <span className="flex items-center">PM-KISAN 16th Installment released on 28th Feb 2024.</span>
                    <span className="flex items-center">Farmers can check their status using "Know Your Status" module.</span>
                    <span className="flex items-center"><span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded mr-2 uppercase font-bold">Important</span> Ensure your bank account is Aadhaar linked.</span>
                </div>
            </div>

            {/* Breadcrumb / Nav Strip (Desktop) */}
            <div className="bg-orange-50 border-b border-orange-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600 flex items-center">
                    <span className="hover:underline cursor-pointer">Home</span>
                    <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                    <span className="font-semibold text-orange-700">New Farmer Registration</span>
                </div>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-12 px-4 sm:px-6 lg:px-8">

                {/* --- Sidebar --- */}
                <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:transform-none md:shadow-none md:w-64 md:mr-8 md:bg-transparent md:block
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="h-full bg-white md:bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 bg-blue-50 border-b border-blue-100 md:hidden flex justify-between items-center">
                            <span className="font-bold text-blue-900">Menu</span>
                            <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-blue-700" /></button>
                        </div>

                        <nav className="flex-1 overflow-y-auto py-4">
                            <ul className="space-y-1 px-3">
                                <li>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors group">
                                        <Home className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-medium">Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-3 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-600 shadow-sm">
                                        <UserPlus className="w-5 h-5 mr-3 text-blue-600" />
                                        <span className="font-bold">New Registration</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors group">
                                        <Activity className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-medium">Status Check</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors group">
                                        <FileText className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-medium">Beneficiary List</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors group">
                                        <Phone className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="font-medium">Contact Us</span>
                                    </a>
                                </li>

                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Downloads</p>
                                    <li>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-700 group">
                                            <Download className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                                            PM-Kisan Letters
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-700 group">
                                            <Download className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                                            Guidelines
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1 bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden relative">

                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                <UserPlus className="w-6 h-6 mr-2 text-orange-500" />
                                New Farmer Registration Form
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Please fill in the details accurately. Fields marked with <span className="text-red-500">*</span> are mandatory.
                            </p>
                        </div>
                        <div className="hidden md:flex space-x-2">
                            <button className="text-gray-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50" title="Print Form">
                                <Printer className="w-5 h-5" />
                            </button>
                            <button className="text-gray-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50" title="Help">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Create Form */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section 1: Personal Details */}
                            <section>
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">1</span> Personal Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-1">
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                            Farmer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white transition-colors"
                                            placeholder="Enter Full Name as per Aadhaar"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Mobile Number & OTP */}
                                    <div className="space-y-1">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">
                                                +91
                                            </span>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                maxLength={10}
                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                                                placeholder="10-digit Mobile Number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleGetOTP}
                                                disabled={otpLoading || otpSent || formData.phone.length < 10}
                                                className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-32 justify-center transition-all ${otpSent
                                                        ? 'bg-green-600 hover:bg-green-700 cursor-default'
                                                        : 'bg-orange-500 hover:bg-orange-600'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {otpLoading ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : otpSent ? (
                                                    <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> Sent</span>
                                                ) : (
                                                    "Get OTP"
                                                )}
                                            </button>
                                        </div>
                                        {otpSent && <p className="text-xs text-green-600 mt-1">OTP sent successfully to your mobile.</p>}
                                    </div>

                                    {/* Aadhaar */}
                                    <div className="space-y-1">
                                        <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                                            Aadhaar Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="aadhaar"
                                            name="aadhaar"
                                            required
                                            maxLength={12}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white transition-colors"
                                            placeholder="12-digit Aadhaar Number"
                                            value={formData.aadhaar}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Location Details */}
                            <section>
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">2</span> Location Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="state"
                                            name="state"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select State</option>
                                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="district"
                                            name="district"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white"
                                            placeholder="Enter District"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                                            Village / Block <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="village"
                                            name="village"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white"
                                            placeholder="Enter Village Name"
                                            value={formData.village}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Land Details */}
                            <section>
                                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-2">3</span> Land & Crop Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label htmlFor="land_size" className="block text-sm font-medium text-gray-700">
                                            Land Holding Size (in Hectares) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="land_size"
                                            name="land_size"
                                            required
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white"
                                            placeholder="e.g. 1.5"
                                            value={formData.land_size}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-xs text-gray-500">Must be verifiable via land records.</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="primary_crop" className="block text-sm font-medium text-gray-700">
                                            Primary Crop <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="primary_crop"
                                            name="primary_crop"
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50 focus:bg-white"
                                            placeholder="e.g. Wheat, Rice, Cotton"
                                            value={formData.primary_crop}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Declaration & Submit */}
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-yellow-800">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p>
                                            I certify that the above information is true to the best of my knowledge. I understand that false information will lead to rejection of application and legal action.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="reset"
                                    onClick={() => setFormData({ full_name: '', phone: '', state: '', district: '', village: '', land_size: '', primary_crop: '', aadhaar: '' })}
                                    className="mr-4 px-6 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition hover:scale-105 active:scale-95"
                                >
                                    Submit Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* --- Footer --- */}
            <footer className="bg-gray-800 text-white mt-auto">
                <div className="bg-green-700 h-1.5 w-full"></div>
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-lg font-bold mb-4">PM Kisan Samman Nidhi</h4>
                            <p className="text-gray-300 text-sm">
                                Department of Agriculture and Farmers Welfare
                                <br />Ministry of Agriculture & Farmers Welfare
                                <br />Government of India
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
                                <li><a href="#" className="hover:text-white transition">Website Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-4">Contact</h4>
                            <p className="text-gray-300 text-sm mb-2">
                                <span className="font-semibold">Email:</span> pmkisan-ict@gov.in
                            </p>
                            <p className="text-gray-300 text-sm">
                                <span className="font-semibold">Helpline:</span> 155261 / 011-24300606
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>© 2024 PM Kisan Samman Nidhi. All Rights Reserved. Designed & Developed by NIC.</p>
                        <p className="mt-2 text-xs">Last Updated on: 28/02/2024</p>
                    </div>
                </div>
            </footer>

            {/* --- Success Modal --- */}
            {showModal && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal} aria-hidden="true"></div>

                        {/* Modal panel */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border-t-4 border-green-600">
                            <div>
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                                    <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                        Application Successfully Submitted
                                    </h3>
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-500 mb-1">Your Application Reference ID:</p>
                                        <p className="text-2xl font-mono font-bold text-blue-800 tracking-wider select-all">
                                            {referenceId}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600">
                                            Please save this Reference ID for future tracking. You will also receive an SMS confirmation shortly on your registered mobile number: <strong>{formData.phone}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                    onClick={closeModal}
                                >
                                    Close & Return to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
