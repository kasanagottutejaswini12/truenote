
-- Create messages table (public, no auth required to create or view)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  sender_name TEXT DEFAULT '',
  recipient_name TEXT DEFAULT '',
  occasion TEXT DEFAULT 'custom',
  theme TEXT DEFAULT 'minimal',
  reveal_style TEXT DEFAULT 'tap',
  animation_effect TEXT DEFAULT 'none',
  font_style TEXT DEFAULT 'Quicksand',
  accent_color TEXT DEFAULT '#d4627a',
  background_color TEXT DEFAULT '#fef7f7',
  password TEXT DEFAULT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  countdown_enabled BOOLEAN DEFAULT false,
  enable_music BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read messages (needed for shared links)
CREATE POLICY "Anyone can read messages" ON public.messages
  FOR SELECT USING (true);

-- Anyone can create messages (no auth required for this app)
CREATE POLICY "Anyone can create messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- Anyone can update messages (by slug)
CREATE POLICY "Anyone can update messages" ON public.messages
  FOR UPDATE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for slug lookups
CREATE INDEX idx_messages_slug ON public.messages(slug);
