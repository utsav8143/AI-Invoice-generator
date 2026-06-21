import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext";


const Hero = () => {
    const {isAuthenticated}=useAuth();
  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05]" style={{ backgroundSize: '60px 60px' }}></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">AI-Powered Invoicing, Made Effortless</h1>
            <p className="text-xl sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">Let our AI create invoices from simple text, generate payment reminders, and provide smart insights to help you manage your finances.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated?(
                    <Link to="/dashboard" className="bg-linear-to-r from-blue-950  text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">Go to Dashboard</Link>
                ):(
                    <Link to="/login" className="bg-linear-to-r from-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 hover:shadow-2xl transform">Get Started for free</Link>
                )}
                <a href="#features" className="border-2 border-black text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all hover:scale-105 transform hover:shadow-2xl">Learn More</a>
            </div>
        </div>
      
      
    </div>
    </section>
  )
}

export default Hero
