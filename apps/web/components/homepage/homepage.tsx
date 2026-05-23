import { Header } from './header';
import { HeroSection } from './hero-section';
import { VideoSection } from './video-section';

export function Homepage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <VideoSection />
    </div>
  );
}
