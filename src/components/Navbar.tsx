import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(motion.h2)`
  color: ${props => props.scrolled ? '#2d3436' : '#fff'};
  margin: 0;
  font-size: 1.8rem;
  transition: color 0.3s ease;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  a {
    color: ${props => props.scrolled ? '#2d3436' : '#fff'};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: #e17055;
      transition: width 0.3s ease;
    }

    &:hover:after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  return (
    <Nav
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <NavContent>
        <Link href="/">
          <Logo scrolled={scrolled}>Restaurant Tunisien</Logo>
        </Link>
        <NavLinks scrolled={scrolled}>
          <motion.a
            href="#menu"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Menu
          </motion.a>
          <motion.a
            href="#horaires"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Horaires
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Contact
          </motion.a>
        </NavLinks>
      </NavContent>
    </Nav>
  );
};

export default Navbar;
