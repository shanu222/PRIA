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
          isolation: isolate;
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.55rem 1.05rem 0.55rem 0.55rem;
          border-radius: 1rem;
          background: linear-gradient(155deg, #fffef8 0%, #f4fff8 48%, #e4f6ee 100%);
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
          z-index: 0;
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
        .paindabad-flag {
          position: relative;
          z-index: 1;
          display: block;
          width: 78px;
          height: 52px;
          flex: none;
          overflow: hidden;
          border-radius: 6px;
          border: 2px solid #fff;
          box-shadow: 0 0 0 2px #01411c, 0 3px 0 rgba(1, 65, 28, 0.35);
          animation: paindabad-wave 2.6s ease-in-out infinite;
        }
        .paindabad-flag svg {
          display: block;
          width: 100%;
          height: 100%;
        }
        .paindabad-word {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: var(--font-jakarta), ui-sans-serif, sans-serif;
          font-weight: 800;
          font-size: clamp(1rem, 2.5vw, 1.35rem);
          letter-spacing: 0.06em;
          line-height: 1;
          white-space: nowrap;
          color: #013318;
          text-shadow:
            -1px -1px 0 #ffffff,
            1px -1px 0 #ffffff,
            -1px 1px 0 #ffffff,
            1px 1px 0 #ffffff,
            2px 3px 0 #c9a227,
            3px 4px 0 #0e7490;
        }
        @keyframes paindabad-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes paindabad-border {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes paindabad-wave {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
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
            <span className="paindabad-flag">
              <svg viewBox="0 0 120 80" width="78" height="52" role="img" aria-label="Flag of Pakistan">
                <rect width="120" height="80" fill="#01411C" />
                <rect width="30" height="80" fill="#FFFFFF" />
                <circle cx="62" cy="40" r="18" fill="#FFFFFF" />
                <circle cx="69" cy="36" r="15" fill="#01411C" />
                <polygon
                  fill="#FFFFFF"
                  points="96.8,31.8 93.2,36.3 96.1,41.2 90.7,39.1 86.9,43.4 87.3,37.7 82.0,35.4 87.6,33.9 88.1,28.2 91.2,33.0"
                />
              </svg>
            </span>
            <p className="paindabad-word">{line}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
