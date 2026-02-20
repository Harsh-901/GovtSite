import React, { useState, useEffect } from 'react';
import {
    Home,
    UserPlus,
    Activity,
    Phone,
    Menu,
    X,
    Download,
    Globe,
    ChevronRight,
    FileText,
    LogOut
} from 'lucide-react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import DocumentUpload from './components/DocumentUpload';

// Emblem URL (public domain)
const EMBLEM_URL = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDocumentForm, setShowDocumentForm] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setShowDocumentForm(false)
    }

    const handleAuthSuccess = (user) => {
        setUser(user)
        setShowDocumentForm(true)
    }

    const handleDocumentComplete = () => {
        setShowDocumentForm(false)
        alert('Your application has been submitted successfully!')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user) {
        return <Auth onAuthSuccess={handleAuthSuccess} />
    }

    if (showDocumentForm) {
        return <DocumentUpload user={user} onComplete={handleDocumentComplete} />
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
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

                            {user && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.full_name || user.email}</span>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}

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
                    <span className="flex items-center">
                        <span className="bg-red-600 text-xs px-2 py-0.5 rounded mr-2 uppercase font-bold animate-pulse">New</span> 
                        eKYC is mandatory for PM Kisan registered farmers. Please complete eKYC via OTP or Biometric.
                    </span>
                    <span className="flex items-center">PM-KISAN 16th Installment released on 28th Feb 2024.</span>
                    <span className="flex items-center">Farmers can check their status using "Know Your Status" module.</span>
                    <span className="flex items-center">
                        <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded mr-2 uppercase font-bold">Important</span> 
                        Ensure your bank account is Aadhaar linked.
                    </span>
                </div>
            </div>

            {/* Breadcrumb / Nav Strip (Desktop) */}
            <div className="bg-orange-50 border-b border-orange-100 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 py-2 text-sm text-gray-600 flex items-center">
                    <span className="hover:underline cursor-pointer">Home</span>
                    <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                    <span className="font-semibold text-orange-700">Dashboard</span>
                </div>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-12 px-4 sm:px-6 lg:px-8">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:transform-none md:shadow-none md:w-64 md:mr-8 md:bg-transparent md:block
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="h-full bg-white md:bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 bg-blue-50 border-b border-blue-100 md:hidden flex justify-between items-center">
                            <span className="font-bold text-blue-900">Menu</span>
                            <button onClick={() => setSidebarOpen(false)}>
                                <X className="w-5 h-5 text-blue-700" />
                            </button>
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
                                    <button 
                                        onClick={() => setShowDocumentForm(true)}
                                        className="flex items-center px-4 py-3 bg-blue-50 text-blue-800 rounded-md border-l-4 border-blue-600 shadow-sm w-full text-left"
                                    >
                                        <UserPlus className="w-5 h-5 mr-3 text-blue-600" />
                                        <span className="font-bold">New Registration</span>
                                    </button>
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

                {/* Main Content */}
                <main className="flex-1 bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center">
                            <UserPlus className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PM Kisan Portal</h2>
                            <p className="text-gray-600 mb-8">
                                You are successfully logged in. Click on "New Registration" to start your farmer registration process.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                    <UserPlus className="h-8 w-8 text-blue-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">New Registration</h3>
                                    <p className="text-sm text-gray-600 mb-4">Complete your farmer registration with all required documents</p>
                                    <button 
                                        onClick={() => setShowDocumentForm(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Start Registration
                                    </button>
                                </div>
                                
                                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                    <Activity className="h-8 w-8 text-green-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Check Status</h3>
                                    <p className="text-sm text-gray-600 mb-4">Track your application status and payment history</p>
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                        Check Status
                                    </button>
                                </div>
                                
                                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                                    <FileText className="h-8 w-8 text-orange-600 mb-3" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                                    <p className="text-sm text-gray-600 mb-4">Download certificates and important documents</p>
                                    <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors">
                                        View Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App