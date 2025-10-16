import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key configured:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})

// Database types - 기존 테이블 구조에 맞춤
export interface Room {
  id: string
  name?: string
  status?: 'waiting' | 'active' | 'resolved'
  agent_id?: string
  created_at: string
  updated_at?: string
  messages?: Message[]
}

export interface Message {
  id: string
  room_id: string
  sender_name: string
  content: string
  sender_type?: 'user' | 'agent'
  is_read?: boolean
  created_at: string
}

export interface RoomParticipant {
  id: string
  room_id: string
  user_name: string
  user_type: string
  joined_at?: string
}

export interface Agent {
  id: string
  name: string
  email: string
  is_online: boolean
  created_at: string
}
