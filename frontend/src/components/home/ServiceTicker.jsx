const services = [
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "E-Commerce Development",
  "API Integration",
  "Database Solutions",
  "Cloud & Deployment",
  "Cybersecurity",
  "AI & Automation",
  "Technical Training",
  "Digital Solutions",
];

const serviceText = `${services.join(" · ")} · `;

export default function ServiceTicker() {
  return (
    <div
      role="marquee"
      aria-label="Services offered by KanuorieTech"
      className="group flex h-10 w-full overflow-hidden bg-[#C9A84C]"
    >
      <div className="flex min-w-max items-center animate-ticker group-hover:[animation-play-state:paused]">
        <span className="whitespace-nowrap px-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#0A1628]">
          {serviceText}
        </span>

        <span
          aria-hidden="true"
          className="whitespace-nowrap px-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#0A1628]"
        >
          {serviceText}
        </span>
      </div>
    </div>
  );
}
