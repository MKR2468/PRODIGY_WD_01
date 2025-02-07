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
    'bmw z4': 'https://platform.cstatic-images.com/in/v2/stock_photos/1313c516-f8ed-4f63-a0d5-02872464db8c/cbeb1c65-a0e0-46e5-ad17-51ef940cf1c1.png',
    'bmw 430i coupe': 'https://mediapool.bmwgroup.com/cache/P9/202005/P90390041/P90390041-bmw-430i-coup-mineral-white-metallic-rim-19-y-spoke-06-2020-600px.jpg',
    'bmw m850i xdrive coupe': 'https://www.motortrend.com/uploads/sites/5/2019/03/2019-BMW-M850i-xDrive-front-three-quarter-in-motion-2.jpg',
    'bmw m8 competition coupe': 'https://www.infinity-group.in/wp-content/uploads/2024/04/BMW-M8-Coupe-Exterior-view.jpg',
    'bmw 750i xdrive': 'https://www.topgear.com/sites/default/files/images/cars-road-test/2019/08/4d2352886115db6b2662e488e9aebb1a/p90348944_highres.jpg',
    'bmw 230i coupe': 'https://editorial.pxcrush.net/carsales/general/editorial/221101_bmw_230i_01.jpg?width=1024&height=682',
    
    // Audi Models
    'audi rs 3': 'https://www.topgear.com/sites/default/files/2024/10/Audi_RS_3_Sportback_kyalamigreen_5419.jpg',
    'audi a3': 'https://media.ed.edmunds-media.com/audi/rs-7/2024/oem/2024_audi_rs-7_sedan_performance_fq_oem_1_1600.jpg',
    'audi r8 coupe': 'https://media.ed.edmunds-media.com/audi/q8/2024/oem/2024_audi_q8_4dr-suv_prestige_fq_oem_1_1600.jpg',
    'audi s7': 'https://hips.hearstapps.com/hmg-prod/images/2022-audi-s7-mmp-1-1623860448.jpg?crop=0.952xw:0.803xh;0.0240xw,0.135xh&resize=2048:*',
    'audi r8 awd': 'https://www.edmunds.com/assets/m/audi/r8/2020/oem/2020_audi_r8_coupe_performance_fq_oem_1_600.jpg',
    
    // Mercedes Models
    'mercedes-benz gle350': 'https://www.mercedes-benz.co.in/content/dam/hq/passengercars/cars/gle/gle-suv-v167-fl-pi/modeloverview/01-2023/images/mercedes-benz-gle-suv-v167-modeloverview-696x392-01-2023.png',
    'mercedes-benz glb250 4matic': 'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my25/glb-class/byo-options/2025-GLB-SUV-MP-006.jpg',
    'mercedes-benz a220 4matic': 'https://www.arrowheadmb.com/blog/wp-content/uploads/sites/177/2022/12/2022-Mercedes-Benz-A-220-B_o.jpg',
    'mercedes-benz amg gle53 4matic plus': 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/AMG-GLE-53/10874/1690455453333/front-left-side-47.jpg',
    
    // Porsche Models
    'porsche 911 carrera t': 'https://media.ed.edmunds-media.com/porsche/911/2024/oem/2024_porsche_911_coupe_carrera-t_fq_oem_1_1600.jpg',
    'porsche cayenne': 'https://media.ed.edmunds-media.com/porsche/cayenne/2024/oem/2024_porsche_cayenne_4dr-suv_base_fq_oem_1_1600.jpg',
    'porsche 911 turbo': 'https://www.topgear.com/sites/default/files/cars-car/image/2024/02/pcgb20_0589_fine.jpg',
    'porsche 718 boxster': 'https://pictures.porsche.com/rtt/iris?COSY-EU-100-1711coMvsi60AAt5FwcmBEgA4qP8iBUDxPE3Cb9pNXABuN9dMGF4tl3U0%25z8rMHIspbWvanYb%255y%25oq%25vSTmjMXD4qAZeoNBPUSfUx4RmHlCgI7Zl2dioCtRvQDcFGD6AYnfurnfeV6iTrF5zhRc21Gf8dXFikXPE3pUWFYRpwY4EhMyKx7Jv5mb3%25ZpjsLV',
    'porsche cayenne turbo': 'https://www.autoblog.com/.image/t_share/MjA5MDg5NjA3NjgzMjIxMTA0/2024-porsche-cayenne-turbo-e-hybrid.jpg',
    
    // Ferrari Models
    'ferrari 812 competizione': 'https://exclusivecarregistry.com/images/cars/preview/thumb_59976.jpg',
    'ferrari f8 tributo': 'https://www.carscoops.com/wp-content/uploads/2021/01/Novitec-Ferrari-F8-Tributo.jpg',
    'ferrari f8 spider': 'https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_580,q_75,w_906/fuyj37qng1l6rwtrfw9x.jpg',
    'ferrari 812 superfast': 'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/668/timestamped-1730178483559-1-2019-Ferrari-812-245747.jpg?width=3840&quality=75',
    'ferrari 488 pista': 'https://img.autocarpro.in/autocarpro/IMG/594/65594/ferrari-488-pista-6.jpg',
    
    // Lamborghini Models
    'lamborghini huracan spyder': 'https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20191004033048_Huracan_Evo-Spyder-fronty.jpg',
    'lamborghini huracan coupe': 'https://imgcdn.zigwheels.ph/large/gallery/exterior/51/478/lamborghini-huracan-front-angle-low-view-663613.jpg',
    'lamborghini huracan': 'https://gtaexotics.ca/wp-content/uploads/2021/09/performante_2-876x535.jpg',
    
    // Toyota Models
    'toyota gr supra': 'https://media.ed.edmunds-media.com/toyota/gr-supra/2024/oem/2024_toyota_gr-supra_coupe_30-premium_fq_oem_1_1600.jpg',
    'toyota gr 86': 'https://www.topgear.com/sites/default/files/2022/10/DSC03037.jpg',
    'toyota corolla': 'https://financialexpresswpcontent.s3.amazonaws.com/uploads/2018/04/toyota-corolla-plugin-hybrid-ev-2018-auto-china-main-image.jpg',
    
    // Honda Models
    'honda insight touring': 'https://cdni.autocarindia.com/Utils/ImageResizer.ashx?n=https://cdni.autocarindia.com/ExtraImages/20191108064231_Honda-Insight.jpg&w=700&c=1',
    'honda odyssey': 'https://www.honda.ca/-/media/Brands/Honda/Models/ODYSSEY/2025/Overview/08-Gallery/Exterior/MY25_Odyssey_1248x702_Desktop_OverviewGalleryExterior_10.png?h=702&iar=0&w=1248&rev=26882e91303a4fd08ebe924bbcf7b76e&hash=724C4681185031E1E868ABECC9FB7594',
    'honda hr-v awd': 'https://media.ed.edmunds-media.com/honda/hr-v/2025/oem/2025_honda_hr-v_4dr-suv_ex-l_fq_oem_1_1280.jpg',
    'honda pilot fwd': 'https://vehicle-images.dealerinspire.com/dbd5-110008034/5FNYG2H48SB020454/61b63dc67735a2be4a88717cd87530f6.jpg',
    'honda insight': 'https://di-honda-enrollment.s3.amazonaws.com/2021/model-pages/insight/insight_2021_template/trims/Honda+Insight+Touring.jpg',
    
    // Ford Models
    'ford mustang performance package': 'https://www.topgear.com/sites/default/files/images/cars-road-test/carousel/2018/05/44061cd9fc15160f7fe87cbfc343a51b/_v9i0001d.jpg',
    'ford f150 pickup 2wd': 'https://vehicle-images.dealerinspire.com/691d-110008765/1FTEW3K54RKD46357/5fcc034cfe878ac89d2973459466a137.jpg',
    'ford transit connect van fwd': 'https://media.ed.edmunds-media.com/ford/transit-connect/2019/oem/2019_ford_transit-connect_cargo-minivan_cargo-van-xlt-wrear-180-degree-doors-lwb_fq_oem_1_1600.jpg',
    'ford ecosport fwd': 'https://d2qldpouxvc097.cloudfront.net/image-by-path?bucket=a5-gallery-serverless-prod-chromebucket-1iz9ffi08lwxm&key=413733%2Ffront34%2Flg%2Fb27834',
    'ford transit connect van 2wd': 'https://hips.hearstapps.com/hmg-prod/images/2018-ford-transit-connect-1649918537.jpg?crop=0.573xw:0.489xh;0.293xw,0.362xh&resize=1200:*',
    
    // Chevrolet Models
    'chevrolet corvette': 'https://media.ed.edmunds-media.com/chevrolet/corvette/2024/oem/2024_chevrolet_corvette_coupe_z06_fq_oem_1_1600.jpg',
    'chevrolet trax': 'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/fUGead6lrWb56V7jXkuTiYnQ7cap4lPxP1Tzgu7V.jpg',
    'chevrolet trax fwd': 'https://autoimage.capitalone.com/cms/Auto/assets/images/2656-hero-2024-chevrolet-trax-front-quarter.jpg',
    'chevrolet trailblazer awd': 'https://media.ed.edmunds-media.com/chevrolet/trailblazer/2025/oem/2025_chevrolet_trailblazer_4dr-suv_activ_fq_oem_1_1600.jpg',
    'chevrolet malibu': 'https://hips.hearstapps.com/hmg-prod/images/2019-chevrolet-malibu-rs-114-1568289287.jpg?crop=0.808xw:0.807xh;0.0871xw,0.0871xh&resize=980:*'
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
