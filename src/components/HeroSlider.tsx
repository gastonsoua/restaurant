import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { Parallax } from 'react-parallax';
import Image from 'next/image';
import { theme } from '@/styles/theme';

const HeroSection = styled.section`
  position: relative;
  height: 90vh;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to top, ${theme.colors.background}, transparent);
    pointer-events: none;
    z-index: 2;
  }

  .slick-slider {
    height: 100%;
  }

  .slick-slide > div {
    height: 100%;
  }

  .slick-dots {
    bottom: 30px;
    z-index: 3;

    li button:before {
      color: ${theme.colors.primary};
      font-size: 12px;
      opacity: 0.5;
    }

    li.slick-active button:before {
      color: ${theme.colors.primary};
      opacity: 1;
    }
  }
`;

const SlideContent = styled(motion.div)`
  position: relative;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.light};
`;

const SlideTitle = styled(motion.h2)`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: ${theme.spacing.md};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SlideSubtitle = styled(motion.p)`
  font-family: ${theme.fonts.body};
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  font-weight: 300;
  max-width: 800px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  img {
    object-fit: cover;
    object-position: center;
  }
`;

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface HeroSliderProps {
  slides: Slide[];
}

export const defaultSlides: Slide[] = [
  {
    image: "/images/hero/tunisian-couscous.jpg",
    title: "Découvrez la Cuisine Tunisienne",
    subtitle: "Une expérience gastronomique authentique à Québec"
  },
  {
    image: "/images/hero/restaurant-interior.jpg",
    title: "Ambiance Chaleureuse",
    subtitle: "Un décor qui vous transporte en Tunisie"
  },
  {
    image: "/images/hero/tajine.jpg",
    title: "Spécialités Traditionnelles",
    subtitle: "Savourez nos plats préparés avec passion"
  }
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  fade: true,
  cssEase: "ease-in-out",
  arrows: false
};

const HeroSlider: React.FC<HeroSliderProps> = ({ slides = defaultSlides }) => {
  return (
    <HeroSection>
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <ImageWrapper>
              <Image
                src={slide.image}
                alt={`Hero slide ${index + 1} - ${slide.title || 'Restaurant showcase'}`}
                fill
                priority={index === 0}
                quality={90}
                className="object-cover"
              />
            </ImageWrapper>
            <SlideContent
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SlideTitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slide.title}
              </SlideTitle>
              <SlideSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {slide.subtitle}
              </SlideSubtitle>
            </SlideContent>
          </div>
        ))}
      </Slider>
    </HeroSection>
  );
};

export default HeroSlider;
