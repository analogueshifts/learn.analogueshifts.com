import StatisticsCard from "./statistics-card";
import Hero from "./hero";

const Landing = () => {
  return (
    <main className="h-max z-20 w-full bg-lightBlueGradient">
      {/* Hero Section */}
      <Hero />

      {/* Statistic Card section */}
      <StatisticsCard />
    </main>
  );
};

export default Landing;
