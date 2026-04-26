CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  kegiatan TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_certificates_hash ON public.certificates(hash);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view certificates"
  ON public.certificates FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (true);