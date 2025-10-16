import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Chat {
  id: string
  user_id: string
  agent_id?: string
  status: 'waiting' | 'active' | 'resolved'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  sender_type: 'user' | 'agent'
  content: string
  created_at: string
  is_read: boolean
}

export interface Agent {
  id: string
  name: string
  email: string
  is_online: boolean
  created_at: string
}
