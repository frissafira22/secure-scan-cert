import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Search, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const searchSchema = z.object({
  hash: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/verify")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Verifikasi Sertifikat — CertChain" },
      {
        name: "description",
        content: "Verifikasi keaslian sertifikat digital dengan hash atau scan QR code.",
      },
    ],
  }),
  component: VerifyPage,
});

type Status = "idle" | "checking" | "valid" | "invalid";

interface CertRecord {
  nama: string;
  kegiatan: string;
  tanggal: string;
  hash: string;
  created_at: string;
}

function VerifyPage() {
  const { hash: initialHash } = Route.useSearch();
  const [hashInput, setHashInput] = useState(initialHash);
  const [status, setStatus] = useState<Status>("idle");
  const [record, setRecord] = useState<CertRecord | null>(null);

  async function verify(h: string) {
    const cleaned = h.trim().toLowerCase();
    if (!cleaned) return;
    setStatus("checking");
    setRecord(null);
    const { data, error } = await supabase
      .from("certificates")
      .select("nama, kegiatan, tanggal, hash, created_at")
      .eq("hash", cleaned)
      .maybeSingle();

    if (error) {
      console.error(error);
      setStatus("invalid");
      return;
    }
    if (data) {
      setRecord(data as CertRecord);
      setStatus("valid");
    } else {
      setStatus("invalid");
    }
  }

  useEffect(() => {
    if (initialHash) {
      verify(initialHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHash]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3 w-3" /> Public Verification
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Verifikasi Sertifikat
          </h1>
          <p className="mt-3 text-muted-foreground">
            Tempel hash atau scan QR code di sertifikat untuk memeriksa keaslian.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verify(hashInput);
          }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
        >
          <Label htmlFor="hash" className="font-mono text-xs uppercase tracking-widest">
            Hash Sertifikat
          </Label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Input
              id="hash"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Tempel 64-karakter hash di sini…"
              className="font-mono text-xs"
              maxLength={128}
            />
            <Button
              type="submit"
              disabled={status === "checking"}
              className="h-10 px-6 font-semibold glow-cyan"
            >
              {status === "checking" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cek…
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Verifikasi
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Result */}
        {status === "valid" && record && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-accent/50 bg-accent/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  Sertifikat Valid
                </p>
                <h3 className="mt-1 text-2xl font-bold">Asli & Terverifikasi</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hash cocok dengan record di database.
                </p>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Nama" value={record.nama} />
                  <Field label="Kegiatan" value={record.kegiatan} />
                  <Field label="Tanggal" value={record.tanggal} />
                  <Field
                    label="Diterbitkan"
                    value={new Date(record.created_at).toLocaleString("id-ID")}
                  />
                </dl>

                <div className="mt-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Hash Signature
                  </p>
                  <code className="mt-1 block break-all rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[10px]">
                    {record.hash}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-8 rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-destructive">
                  Tidak Valid
                </p>
                <h3 className="mt-1 text-2xl font-bold">Sertifikat Palsu</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hash tidak ditemukan di database. Sertifikat ini tidak dapat
                  diverifikasi atau telah dimodifikasi.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}