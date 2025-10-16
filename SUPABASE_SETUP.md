# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 설정에서 URL과 API 키를 확인합니다.

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 환경 변수 찾는 방법:

1. Supabase 대시보드 → Settings → API
2. Project URL과 anon/public key를 복사
3. `.env.local` 파일에 붙여넣기

## 3. 데이터베이스 스키마 설정

1. Supabase 대시보드 → SQL Editor로 이동
2. `database-schema.sql` 파일의 내용을 복사해서 실행
3. 또는 다음 명령어로 테이블을 생성:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  agent_id UUID REFERENCES agents(id),
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL,
  sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'agent')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Row Level Security (RLS) 설정

보안을 위해 RLS 정책을 설정해야 합니다. SQL Editor에서 다음을 실행:

```sql
-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access for demo)
CREATE POLICY "Allow all operations for demo" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all operations for demo" ON chats FOR ALL USING (true);
CREATE POLICY "Allow all operations for demo" ON messages FOR ALL USING (true);
```

## 5. 샘플 데이터 추가

테스트를 위해 샘플 상담사 데이터를 추가:

```sql
INSERT INTO agents (name, email, is_online) VALUES 
  ('김민수', 'kim@example.com', true),
  ('이영희', 'lee@example.com', true),
  ('박상담', 'park@example.com', false);
```

## 6. 실시간 기능 활성화

Supabase 대시보드에서:
1. Database → Replication
2. Real-time을 활성화
3. `chats`와 `messages` 테이블에 대해 real-time을 활성화

## 7. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 문제 해결

### 연결 오류가 발생하는 경우:
1. `.env.local` 파일이 올바른 위치에 있는지 확인
2. Supabase URL과 키가 정확한지 확인
3. 네트워크 연결 상태 확인

### 실시간 기능이 작동하지 않는 경우:
1. Supabase 대시보드에서 Replication 설정 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
