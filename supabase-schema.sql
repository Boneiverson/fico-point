-- Create tables for FastLoan app

-- Users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique,
  phone_number text unique,
  first_name text,
  last_name text,
  profile_image text,
  gender text,
  marital_status text,
  employment_status text,
  id_document text,
  created_at timestamp with time zone default now()
);

-- Loans table
create table public.loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  amount numeric not null,
  purpose text,
  duration integer not null,
  status text not null check (status in ('pending', 'approved', 'rejected', 'active', 'completed')),
  created_at timestamp with time zone default now(),
  approved_at timestamp with time zone,
  due_date timestamp with time zone
);

-- Guarantors table
create table public.guarantors (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans not null,
  full_name text not null,
  phone_number text not null,
  email text,
  relationship text not null,
  created_at timestamp with time zone default now()
);

-- Account details table
create table public.account_details (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans not null,
  mobile_money_number text not null,
  account_name text not null,
  provider text not null,
  created_at timestamp with time zone default now()
);

-- Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans not null,
  amount numeric not null,
  date timestamp with time zone default now(),
  provider text not null,
  transaction_id text not null,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.loans enable row level security;
alter table public.guarantors enable row level security;
alter table public.account_details enable row level security;
alter table public.payments enable row level security;

-- Users table policies
create policy "Users can view their own data" on users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on users
  for update using (auth.uid() = id);

create policy "Users can insert their own data" on users
  for insert with check (auth.uid() = id);

-- Loans table policies
create policy "Users can view their own loans" on loans
  for select using (auth.uid() = user_id);

create policy "Users can create loans" on loans
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own loans" on loans
  for update using (auth.uid() = user_id);

-- Guarantors table policies
create policy "Users can view guarantors for their loans" on guarantors
  for select using (
    auth.uid() in (
      select user_id from loans where id = guarantors.loan_id
    )
  );

create policy "Users can create guarantors for their loans" on guarantors
  for insert with check (
    auth.uid() in (
      select user_id from loans where id = guarantors.loan_id
    )
  );

create policy "Users can update guarantors for their loans" on guarantors
  for update using (
    auth.uid() in (
      select user_id from loans where id = guarantors.loan_id
    )
  );

-- Account details table policies
create policy "Users can view account details for their loans" on account_details
  for select using (
    auth.uid() in (
      select user_id from loans where id = account_details.loan_id
    )
  );

create policy "Users can create account details for their loans" on account_details
  for insert with check (
    auth.uid() in (
      select user_id from loans where id = account_details.loan_id
    )
  );

create policy "Users can update account details for their loans" on account_details
  for update using (
    auth.uid() in (
      select user_id from loans where id = account_details.loan_id
    )
  );

-- Payments table policies
create policy "Users can view payments for their loans" on payments
  for select using (
    auth.uid() in (
      select user_id from loans where id = payments.loan_id
    )
  );

create policy "Users can create payments for their loans" on payments
  for insert with check (
    auth.uid() in (
      select user_id from loans where id = payments.loan_id
    )
  );

-- Create functions for admin operations (to be used in the admin panel)
create or replace function approve_loan(loan_id uuid)
returns void as $$
begin
  update loans
  set status = 'approved',
      approved_at = now()
  where id = loan_id;
end;
$$ language plpgsql;