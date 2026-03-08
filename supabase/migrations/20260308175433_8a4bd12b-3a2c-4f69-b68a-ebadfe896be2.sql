
-- Add one-time secret and read tracking columns to messages
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_one_time boolean DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS opened_at timestamp with time zone DEFAULT null;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_expired boolean DEFAULT false;

-- Create message_reactions table
CREATE TABLE public.message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  reaction text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add reactions" ON public.message_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read reactions" ON public.message_reactions FOR SELECT USING (true);
