"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const galleryItem = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const transitionConfig = {
  duration: 1.2,
  ease: [0.43, 0.13, 0.23, 0.96]
};

export default function Home() {
  const [heroRef, heroInView] = useInView({ 
    triggerOnce: false,
    threshold: 0.1
  });
  const [menuRef, menuInView] = useInView({ 
    triggerOnce: false,
    threshold: 0.2
  });
  const [aboutRef, aboutInView] = useInView({ 
    triggerOnce: false,
    threshold: 0.3
  });
  const [galleryRef, galleryInView] = useInView({ 
    triggerOnce: false,
    threshold: 0.1
  });
  const [contactRef, contactInView] = useInView({ 
    triggerOnce: false,
    threshold: 0.3
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setMenuLoading(true);
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setMenuError(error.message);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.3]);

  const menuAnimation = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const galleryAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1E3D59] to-[#2D3B4E] relative overflow-hidden">
      {/* Fixed Background */}
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none -z-10"
        style={{ y: backgroundY }}
      >
        <Image
          src="/hero-image.jpg"
          alt="Background pattern"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3D59]/90 via-[#2D3B4E]/80 to-[#1E3D59]/90 mix-blend-multiply" />
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef}>
        <Hero />
      </section>

      {/* Menu Section */}
      <motion.section
        ref={menuRef}
        initial="hidden"
        animate={menuInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              ...transitionConfig,
              staggerChildren: 0.2
            }
          }
        }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-[#1E3D59]/30 to-transparent backdrop-blur-sm"
      >
        <motion.div variants={fadeIn}>
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#4FC1E9] via-[#F7F9FC] to-[#4FC1E9] text-transparent bg-clip-text">
            Nos Spécialités
          </h2>
        </motion.div>
        
        {menuLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4FC1E9]"></div>
          </div>
        ) : menuError ? (
          <div className="text-center text-red-400 py-8">
            <p>{menuError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-[#4FC1E9] text-white rounded-md hover:bg-[#3BAFDC] transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menuItems.map((item, index) => (
              <motion.div
                key={item._id}
                variants={menuAnimation}
                className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={`http://localhost:5000/${item.image}`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-food.jpg';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-semibold text-[#F7F9FC]">{item.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.isAvailable 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.isAvailable ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  <p className="text-[#4FC1E9] font-bold text-xl">{item.price.toFixed(2)} $</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        ref={galleryRef}
        initial="hidden"
        animate={galleryInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              ...transitionConfig,
              staggerChildren: 0.15,
              delayChildren: 0.1
            }
          }
        }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-[#2D3B4E]/40 to-transparent backdrop-blur-sm"
      >
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#4FC1E9] via-[#F7F9FC] to-[#4FC1E9] text-transparent bg-clip-text"
          variants={fadeIn}
        >
          Notre Galerie
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[
            { src: "/gallery1.jpg", alt: "Plat délicieux" },
            { src: "/gallery2.jpg", alt: "Ingrédients frais" },
            { src: "/gallery3.jpg", alt: "Cuisine traditionnelle" },
            { src: "/gallery4.jpg", alt: "Ambiance du restaurant" },
            { src: "/gallery5.jpg", alt: "Plat spécial" },
            { src: "/gallery6.jpg", alt: "Création du chef" },
          ].map((img, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(img.src)}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3D59]/80 via-[#1E3D59]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={false}
                >
                  <motion.div
                    className="bg-[#4FC1E9]/20 backdrop-blur-sm p-4 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-[#F7F9FC]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div 
          className="fixed inset-0 bg-[#1E3D59]/95 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
          onClick={() => setSelectedImage(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Selected image"
                width={1920}
                height={1080}
                className="object-contain rounded-lg max-h-[90vh] w-auto h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
              <motion.button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-[#F7F9FC] bg-black/50 rounded-full p-2.5 hover:bg-black/70 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* About Section */}
      <motion.section
        ref={aboutRef}
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: transitionConfig
          }
        }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-[#1E3D59]/30 to-transparent backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-bold mb-12 bg-gradient-to-r from-[#4FC1E9] via-[#F7F9FC] to-[#4FC1E9] text-transparent bg-clip-text"
            variants={fadeIn}
          >
            Notre Histoire
          </motion.h2>
          <motion.p 
            className="text-xl leading-relaxed text-[#F7F9FC]/80 font-light"
            variants={fadeIn}
          >
            Découvrez l'authenticité de la cuisine tunisienne au cœur de Québec. 
            Nos recettes traditionnelles sont préparées avec passion, 
            préservant l'héritage culinaire de la Tunisie. Chaque plat est 
            créé avec soin, utilisant des épices authentiques et des 
            méthodes de cuisson traditionnelles.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        ref={contactRef}
        initial="hidden"
        animate={contactInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: transitionConfig
          }
        }}
        className="py-20 px-8 bg-gradient-to-b from-transparent via-[#2D3B4E]/40 to-transparent backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-5xl font-bold mb-12 bg-gradient-to-r from-[#4FC1E9] via-[#F7F9FC] to-[#4FC1E9] text-transparent bg-clip-text"
            variants={fadeIn}
          >
            Visitez-nous
          </motion.h2>
          <motion.div variants={fadeIn}>
            <p className="text-xl mb-4 text-[#F7F9FC]/80">123 Rue Saint-Jean, Québec</p>
            <p className="text-xl mb-4 text-[#F7F9FC]/80">Ouvert du Mardi au Dimanche</p>
            <p className="text-xl text-[#F7F9FC]/80">11h30 - 22h00</p>
            <div className="mt-12 space-x-6">
              <motion.a 
                href="tel:+1234567890"
                className="inline-block bg-[#4FC1E9]/10 backdrop-blur-md text-[#F7F9FC] px-10 py-4 rounded-full transition-all duration-300 font-medium shadow-lg border border-[#4FC1E9]/20 hover:border-[#4FC1E9]/40"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(79, 193, 233, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Appelez-nous
              </motion.a>
              <motion.a 
                href="#"
                className="inline-block bg-[#FF6B6B]/10 backdrop-blur-md border border-[#FF6B6B]/20 hover:border-[#FF6B6B]/40 text-[#F7F9FC] px-10 py-4 rounded-full transition-all duration-300 shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255, 107, 107, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Réservation
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
