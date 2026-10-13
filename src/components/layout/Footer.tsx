import { site } from "@/data/pria";
import { TopoPattern } from "@/components/pria/TopoPattern";

export function Footer() {
  const line = site.closingLine.toUpperCase();
  return (
    <footer className="relative mt-16 overflow-hidden border-t bg-card">
      <TopoPattern className="text-[hsl(var(--topo-stroke))] opacity-[0.07]" />
      <style>{`
        .paindabad-stage { perspective: 900px; }
        .paindabad-card {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.45rem 0.9rem 0.45rem 0.45rem;
          border-radius: 1rem;
          background: linear-gradient(155deg, #fffef8 0%, #f4fff8 48%, #e4f6ee 100%);
          transform-style: preserve-3d;
          animation: paindabad-float 4.8s ease-in-out infinite;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.95),
            0 7px 0 #01411c,
            0 11px 0 #c9a227,
            0 15px 0 #0e7490,
            0 20px 22px rgba(1, 65, 28, 0.28);
        }
        .paindabad-card::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 1.15rem;
          padding: 3px;
          background: linear-gradient(120deg, #01411c, #ffffff, #c9a227, #0e7490, #01411c);
          background-size: 280% 280%;
          animation: paindabad-border 5.5s linear infinite;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .paindabad-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(110deg, transparent 32%, rgba(255, 255, 255, 0.72) 50%, transparent 68%);
          background-size: 220% 100%;
          animation: paindabad-sheen 3.4s ease-in-out infinite;
          pointer-events: none;
        }
        .paindabad-flag {
          position: relative;
          z-index: 1;
          display: block;
          width: 54px;
          height: 36px;
          flex: none;
          border-radius: 4px;
          box-shadow: 0 2px 0 rgba(1, 65, 28, 0.35);
          transform-origin: left center;
          animation: paindabad-wave 2.6s ease-in-out infinite;
        }
        .paindabad-word {
          position: relative;
          z-index: 1;
          font-family: var(--font-jakarta), ui-sans-serif, sans-serif;
          font-weight: 800;
          font-size: clamp(0.78rem, 2.2vw, 1.05rem);
          letter-spacing: 0.08em;
          line-height: 1.15;
          white-space: nowrap;
          color: #fffdf6;
          -webkit-text-stroke: 1.35px #01411c;
          paint-order: stroke fill;
          text-shadow:
            1px 1px 0 #0b5d3b,
            2px 2px 0 #12805a,
            3px 3px 0 #c9a227,
            4px 4px 0 #0e7490;
        }
        @keyframes paindabad-float {
          0%, 100% { transform: rotateX(7deg) rotateY(-7deg) translateY(0); }
          50% { transform: rotateX(2deg) rotateY(8deg) translateY(-5px); }
        }
        @keyframes paindabad-border {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes paindabad-sheen {
          0% { background-position: 130% 0; }
          100% { background-position: -130% 0; }
        }
        @keyframes paindabad-wave {
          0%, 100% { transform: perspective(180px) rotateY(0deg); }
          50% { transform: perspective(180px) rotateY(16deg); }
        }
      `}</style>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pb-14 pt-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{site.organisation}</span>
          <span aria-hidden="true"> · </span>
          <span className="block sm:inline">
            {site.name} ({site.shortName})
          </span>
        </p>
        <div className="paindabad-stage">
          <div className="paindabad-card">
            <svg className="paindabad-flag" viewBox="0 0 120 80" role="img" aria-label="Flag of Pakistan">
              <rect width="120" height="80" fill="#01411C" />
              <rect width="30" height="80" fill="#FFFFFF" />
              <circle cx="57" cy="40" r="15" fill="#FFFFFF" />
              <circle cx="63.5" cy="37.5" r="12.4" fill="#01411C" />
              <polygon
                fill="#FFFFFF"
                points="91.12,30.50 88.50,34.07 90.91,37.78 86.70,36.40 83.92,39.84 83.94,35.41 79.80,33.82 84.02,32.47 84.25,28.05 86.84,31.65"
              />
            </svg>
            <p className="paindabad-word">{line}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
