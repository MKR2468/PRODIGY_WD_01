import React, { useState, useEffect } from 'react';
import { Car, Menu, X, Search } from 'lucide-react';
import axios from 'axios';

interface CarModel {
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  cylinders: number;
  transmission: string;
}

const AVAILABLE_MAKES = ['BMW', 'Audi', 'Mercedes', 'Porsche', 'Ferrari', 'Lamborghini', 'Toyota', 'Honda', 'Ford', 'Chevrolet'];

// Model-specific images from diverse sources
const getModelImage = (make: string, model: string): string => {
  const modelKey = `${make} ${model}`.toLowerCase();
  
  const MODEL_IMAGES: { [key: string]: string } = {
    // BMW Models
    'bmw m3': 'https://media.ed.edmunds-media.com/bmw/m3/2024/oem/2024_bmw_m3_sedan_competition_fq_oem_1_1600.jpg',
    'bmw m4': 'https://hips.hearstapps.com/hmg-prod/images/2024-bmw-m4-competition-coupe-101-1665505029.jpg',
    'bmw m5': 'https://www.motortrend.com/uploads/2024/01/2025-BMW-M5-exterior-8.jpg',
    'bmw x5': 'https://www.bmwusa.com/content/dam/bmw/common/all-vehicles/x-series/x5/2024/gallery/BMW-MY24-X5-Gallery-01.jpg',
    'bmw 3 series': 'https://www.motortrend.com/uploads/2023/07/2024-BMW-330i-M-Sport-24.jpg',
    'bmw 5 series': 'https://www.bmwusa.com/content/dam/bmw/common/all-vehicles/5-series/sedan/2024/gallery/BMW-MY24-5-Series-Gallery-Exterior-06.jpg',
    
    // Audi Models
    'audi rs6': 'https://media.ed.edmunds-media.com/audi/rs-6/2024/oem/2024_audi_rs-6_wagon_avant-performance_fq_oem_1_1600.jpg',
    'audi rs7': 'https://media.ed.edmunds-media.com/audi/rs-7/2024/oem/2024_audi_rs-7_sedan_performance_fq_oem_1_1600.jpg',
    'audi q8': 'https://media.ed.edmunds-media.com/audi/q8/2024/oem/2024_audi_q8_4dr-suv_prestige_fq_oem_1_1600.jpg',
    'audi e-tron gt': 'https://media.ed.edmunds-media.com/audi/e-tron-gt/2024/oem/2024_audi_e-tron-gt_sedan_rs_fq_oem_1_1600.jpg',
    
    // Mercedes Models
    'mercedes amg gt': 'https://media.ed.edmunds-media.com/mercedes-benz/amg-gt/2024/oem/2024_mercedes-benz_amg-gt_coupe_53_fq_oem_1_1600.jpg',
    'mercedes c-class': 'https://media.ed.edmunds-media.com/mercedes-benz/c-class/2024/oem/2024_mercedes-benz_c-class_sedan_amg-c-43_fq_oem_1_1600.jpg',
    'mercedes s-class': 'https://media.ed.edmunds-media.com/mercedes-benz/s-class/2024/oem/2024_mercedes-benz_s-class_sedan_s-500_fq_oem_1_1600.jpg',
    'mercedes eqs': 'https://media.ed.edmunds-media.com/mercedes-benz/eqs/2024/oem/2024_mercedes-benz_eqs_sedan_450-plus_fq_oem_1_1600.jpg',
    
    // Porsche Models
    'porsche 911': 'https://media.ed.edmunds-media.com/porsche/911/2024/oem/2024_porsche_911_coupe_carrera-t_fq_oem_1_1600.jpg',
    'porsche cayenne': 'https://media.ed.edmunds-media.com/porsche/cayenne/2024/oem/2024_porsche_cayenne_4dr-suv_base_fq_oem_1_1600.jpg',
    'porsche panamera': 'https://media.ed.edmunds-media.com/porsche/panamera/2024/oem/2024_porsche_panamera_sedan_4-executive_fq_oem_1_1600.jpg',
    'porsche taycan': 'https://media.ed.edmunds-media.com/porsche/taycan/2024/oem/2024_porsche_taycan_sedan_turbo-s_fq_oem_1_1600.jpg',
    
    // Ferrari Models
    'ferrari f8': 'https://cdn.motor1.com/images/mgl/kJm1l/s1/ferrari-f8-tributo.jpg',
    'ferrari sf90': 'https://cdn.motor1.com/images/mgl/JOxvRg/s1/ferrari-sf90-xx-stradale.jpg',
    'ferrari roma': 'https://cdn.motor1.com/images/mgl/qkqvR/s1/ferrari-roma.jpg',
    'ferrari 296': 'https://cdn.motor1.com/images/mgl/P33J0A/s1/ferrari-296-gtb.jpg',
    
    // Lamborghini Models
    'lamborghini huracan': 'https://media.ed.edmunds-media.com/lamborghini/huracan/2024/oem/2024_lamborghini_huracan_coupe_sterrato_fq_oem_1_1600.jpg',
    'lamborghini urus': 'https://media.ed.edmunds-media.com/lamborghini/urus/2024/oem/2024_lamborghini_urus_4dr-suv_performante_fq_oem_1_1600.jpg',
    'lamborghini revuelto': 'https://cdn.motor1.com/images/mgl/P3Y0Ry/s1/lamborghini-revuelto.jpg',
    
    // Toyota Models
    'toyota supra': 'https://media.ed.edmunds-media.com/toyota/gr-supra/2024/oem/2024_toyota_gr-supra_coupe_30-premium_fq_oem_1_1600.jpg',
    'toyota camry': 'https://media.ed.edmunds-media.com/toyota/camry/2024/oem/2024_toyota_camry_sedan_xse_fq_oem_1_1600.jpg',
    'toyota gr86': 'https://media.ed.edmunds-media.com/toyota/gr86/2024/oem/2024_toyota_gr86_coupe_premium_fq_oem_1_1600.jpg',
    'toyota crown': 'https://media.ed.edmunds-media.com/toyota/crown/2024/oem/2024_toyota_crown_sedan_platinum_fq_oem_1_1600.jpg',
    
    // Honda Models
    'honda civic': 'https://media.ed.edmunds-media.com/honda/civic/2024/oem/2024_honda_civic_sedan_sport_fq_oem_1_1600.jpg',
    'honda accord': 'https://media.ed.edmunds-media.com/honda/accord/2024/oem/2024_honda_accord_sedan_touring_fq_oem_1_1600.jpg',
    'honda cr-v': 'https://media.ed.edmunds-media.com/honda/cr-v/2024/oem/2024_honda_cr-v_4dr-suv_sport-touring_fq_oem_1_1600.jpg',
    'honda pilot': 'https://media.ed.edmunds-media.com/honda/pilot/2024/oem/2024_honda_pilot_4dr-suv_elite_fq_oem_1_1600.jpg',
    
    // Ford Models
    'ford mustang': 'https://media.ed.edmunds-media.com/ford/mustang/2024/oem/2024_ford_mustang_coupe_gt_fq_oem_1_1600.jpg',
    'ford f-150': 'https://media.ed.edmunds-media.com/ford/f-150/2024/oem/2024_ford_f-150_crew-cab-pickup_raptor_fq_oem_1_1600.jpg',
    'ford bronco': 'https://media.ed.edmunds-media.com/ford/bronco/2024/oem/2024_ford_bronco_2dr-suv_wildtrak_fq_oem_1_1600.jpg',
    'ford explorer': 'https://media.ed.edmunds-media.com/ford/explorer/2024/oem/2024_ford_explorer_4dr-suv_st_fq_oem_1_1600.jpg',
    
    // Chevrolet Models
    'chevrolet corvette': 'https://media.ed.edmunds-media.com/chevrolet/corvette/2024/oem/2024_chevrolet_corvette_coupe_z06_fq_oem_1_1600.jpg',
    'chevrolet camaro': 'https://media.ed.edmunds-media.com/chevrolet/camaro/2024/oem/2024_chevrolet_camaro_coupe_zl1_fq_oem_1_1600.jpg',
    'chevrolet blazer': 'https://media.ed.edmunds-media.com/chevrolet/blazer/2024/oem/2024_chevrolet_blazer_4dr-suv_rs_fq_oem_1_1600.jpg',
    'chevrolet tahoe': 'https://media.ed.edmunds-media.com/chevrolet/tahoe/2024/oem/2024_chevrolet_tahoe_4dr-suv_high-country_fq_oem_1_1600.jpg'
  };

  // Try to find an exact match for the model
  const exactMatch = MODEL_IMAGES[modelKey];
  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, try to find a partial match
  const partialMatch = Object.entries(MODEL_IMAGES).find(([key]) => 
    modelKey.includes(key) || key.includes(modelKey)
  );
  
  if (partialMatch) {
    return partialMatch[1];
  }

  // Fallback images for each make if no model match is found
  const MAKE_FALLBACKS: { [key: string]: string } = {
    'bmw': 'https://media.ed.edmunds-media.com/bmw/7-series/2024/oem/2024_bmw_7-series_sedan_i7-m70_fq_oem_1_1600.jpg',
    'audi': 'https://media.ed.edmunds-media.com/audi/s8/2024/oem/2024_audi_s8_sedan_base_fq_oem_1_1600.jpg',
    'mercedes': 'https://media.ed.edmunds-media.com/mercedes-benz/eqs-suv/2024/oem/2024_mercedes-benz_eqs-suv_4dr-suv_450-plus_fq_oem_1_1600.jpg',
    'porsche': 'https://media.ed.edmunds-media.com/porsche/macan/2024/oem/2024_porsche_macan_4dr-suv_t_fq_oem_1_1600.jpg',
    'ferrari': 'https://cdn.motor1.com/images/mgl/kxBEA/s1/ferrari-purosangue.jpg',
    'lamborghini': 'https://cdn.motor1.com/images/mgl/2NLZ9R/s1/2024-lamborghini-huracan-sterrato.jpg',
    'toyota': 'https://media.ed.edmunds-media.com/toyota/gr-corolla/2024/oem/2024_toyota_gr-corolla_4dr-hatchback_circuit_fq_oem_1_1600.jpg',
    'honda': 'https://media.ed.edmunds-media.com/honda/type-r/2024/oem/2024_honda_type-r_4dr-hatchback_touring_fq_oem_1_1600.jpg',
    'ford': 'https://media.ed.edmunds-media.com/ford/mustang-mach-e/2024/oem/2024_ford_mustang-mach-e_4dr-suv_gt_fq_oem_1_1600.jpg',
    'chevrolet': 'https://media.ed.edmunds-media.com/chevrolet/silverado-1500/2024/oem/2024_chevrolet_silverado-1500_crew-cab-pickup_high-country_fq_oem_1_1600.jpg'
  };

  return MAKE_FALLBACKS[make.toLowerCase()] || 'https://media.ed.edmunds-media.com/generic/new/2024/oem/2024_generic_new_4dr-sedan_base_fq_oem_1_1600.jpg';
};

// Get current year
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 5; // Show cars from last 5 years

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cars, setCars] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMake, setSearchMake] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCars = async (make?: string) => {
    const searchTerm = make || searchMake;
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setSearchMake(searchTerm);
    
    try {
      // Fetch cars for each year in the range
      const allCars: CarModel[] = [];
      
      for (let year = CURRENT_YEAR; year >= MIN_YEAR; year--) {
        const response = await axios.get('https://api.api-ninjas.com/v1/cars', {
          params: { 
            make: searchTerm.toLowerCase(),
            year: year
          },
          headers: { 'X-Api-Key': 'LG3T9XXicdR+DZDh+C5zbQ==kYhwbTqCvyukhhUZ' }
        });
        
        if (response.data.length > 0) {
          allCars.push(...response.data);
        }
      }
      
      // Remove duplicates based on model name
      const uniqueCars = allCars.filter((car, index, self) =>
        index === self.findIndex((c) => c.model === car.model)
      );
      
      setCars(uniqueCars);
      
      if (uniqueCars.length === 0) {
        setError('No recent models found for this make.');
      }
    } catch (err) {
      setError('Failed to fetch car data. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeSearchURL = (car: CarModel) => {
    const searchQuery = `${car.year} ${car.make} ${car.model} review`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchCars();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">APEX</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button className="hover:text-red-500 transition-colors duration-300">
                  Models
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-black/90 rounded-lg shadow-lg py-2 hidden group-hover:block">
                  {AVAILABLE_MAKES.map((make) => (
                    <button
                      key={make}
                      onClick={() => fetchCars(make)}
                      className="block w-full text-left px-4 py-2 hover:bg-red-500 transition-colors duration-300"
                    >
                      {make}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="pt-4 pb-3 space-y-3">
              {AVAILABLE_MAKES.map((make) => (
                <button
                  key={make}
                  onClick={() => {
                    fetchCars(make);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left hover:text-red-500 transition-colors duration-300 py-2"
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Experience Pure
            <span className="text-red-500"> Performance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the perfect blend of power, precision, and luxury in our latest collection of high-performance vehicles.
          </p>
          <button 
            onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full text-lg transition-colors duration-300"
          >
            Explore Models
          </button>
        </div>
      </section>

      {/* Car Models Explorer Section */}
      <section id="models" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Explore Our Models</h2>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter car make (e.g., BMW, Audi, Mercedes)"
                  value={searchMake}
                  onChange={(e) => setSearchMake(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-3 rounded-full bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-red-500"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              </div>
              <button
                onClick={() => fetchCars()}
                disabled={loading}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <div
                key={index}
                className="bg-zinc-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={getModelImage(car.make, car.model)}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {car.make} {car.model}
                  </h3>
                  <div className="space-y-2 text-zinc-300">
                    <p>Year: {car.year}</p>
                    <p>Fuel Type: {car.fuel_type}</p>
                    <p>Cylinders: {car.cylinders}</p>
                    <p>Transmission: {car.transmission}</p>
                  </div>
                  <a
                    href={getYouTubeSearchURL(car)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-colors duration-300 inline-block text-center"
                  >
                    Watch Reviews
                  </a>
                </div>
              </div>
            ))}
          </div>

          {cars.length === 0 && !loading && searchMake && (
            <p className="text-center text-zinc-400 mt-8">
              No cars found. Try searching for a different make.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;