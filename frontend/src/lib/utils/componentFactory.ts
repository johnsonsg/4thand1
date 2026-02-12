import Hero from '@/components/Hero';
import PromoCard from '@/components/PromoCard';
import FeatureList from '@/components/FeatureList';
import NavSpacer from '@/components/rendering/NavSpacer';

import { Navbar } from '@/components/header/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsBar } from '@/components/sections/StatsBar';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { RosterSpotlight } from '@/components/sections/RosterSpotlight';
import { NewsSection } from '@/components/sections/NewsSection';
import { ResultsSection } from '@/components/sections/ResultsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/footer/Footer';
import { FourthAndOneContent } from '@/components/sections/FourthAndOneContent';
import { RosterTable } from '@/components/sections/RosterTable';
import { RosterPage } from '@/components/sections/RosterPage';

export function getComponent(componentName: string) {
  switch (componentName) {
    case 'Navbar':
      return Navbar;
    case 'HeroSection':
      return HeroSection;
    case 'StatsBar':
      return StatsBar;
    case 'ScheduleSection':
      return ScheduleSection;
    case 'RosterSpotlight':
      return RosterSpotlight;
    case 'RosterTable':
      return RosterTable
    case 'NewsSection':
      return NewsSection;
    case 'ResultsSection':
      return ResultsSection;
    case 'ContactSection':
      return ContactSection;
    case 'Footer':
      return Footer;
    case 'FourthAndOne':
      return FourthAndOneContent;
    case 'NavSpacer':
      return NavSpacer;
    case 'Hero':
      return Hero;
    case 'PromoCard':
      return PromoCard;
    case 'FeatureList':
      return FeatureList;
    case 'RosterPage':
      return RosterPage;
    default:
      return null;
  }
}
