import { forwardRef } from "react";

interface CertificateProps {
  nama: string;
  kegiatan: string;
  tanggal: string;
  hash: string;
  qrDataUrl?: string;
}

export const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ nama, kegiatan, tanggal, hash, qrDataUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-3xl aspect-[1.414/1] overflow-hidden rounded-2xl border border-primary/30 bg-card p-10 shadow-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 0%, oklch(0.82 0.16 195 / 0.18), transparent 50%), radial-gradient(circle at 100% 100%, oklch(0.78 0.17 160 / 0.15), transparent 55%)",
        }}
      >
        {/* Decorative corners */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-4 left-4 h-12 w-12 border-l-2 border-t-2 border-primary" />
          <div className="absolute top-4 right-4 h-12 w-12 border-r-2 border-t-2 border-primary" />
          <div className="absolute bottom-4 left-4 h-12 w-12 border-l-2 border-b-2 border-accent" />
          <div className="absolute bottom-4 right-4 h-12 w-12 border-r-2 border-b-2 border-accent" />
        </div>

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Blockchain Verified
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                SHA-256 · Anti-Tamper
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Certificate ID
              </p>
              <p className="font-mono text-[10px] text-foreground/80">
                {hash.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Certificate of Achievement
            </p>
            <h2 className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              Diberikan kepada
            </h2>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {nama || "—"}
            </h1>
            <div className="mt-4 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              atas partisipasi dan keberhasilannya dalam kegiatan
            </p>
            <p className="mt-2 text-xl font-semibold text-primary">
              {kegiatan || "—"}
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {tanggal || "—"}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div className="max-w-[60%]">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Hash Signature
              </p>
              <p className="mt-1 break-all font-mono text-[9px] leading-tight text-foreground/70">
                {hash}
              </p>
            </div>
            {qrDataUrl ? (
              <div className="rounded-lg border border-primary/40 bg-background p-1.5">
                <img
                  src={qrDataUrl}
                  alt="QR verifikasi"
                  className="h-20 w-20"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-lg border border-dashed border-muted-foreground/30" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = "Certificate";