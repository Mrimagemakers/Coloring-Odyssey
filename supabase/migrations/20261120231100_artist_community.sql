create table public.artist_profiles(
 id uuid primary key references auth.users on delete cascade,
 name text not null check(char_length(trim(name)) between 2 and 60),
 bio text not null default '' check(char_length(bio)<=450)
);
create table public.artist_groups(
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.artist_profiles on delete cascade,
 name text not null check(char_length(trim(name)) between 2 and 65),
 description text not null default '' check(char_length(description)<=450),
 created_at timestamptz not null default now()
);
create table public.artist_group_members(
 group_id uuid references public.artist_groups on delete cascade,
 artist_id uuid references public.artist_profiles on delete cascade,
 primary key(group_id,artist_id)
);
create table public.artist_posts(
 id uuid primary key default gen_random_uuid(), author_id uuid not null references public.artist_profiles on delete cascade,
 group_id uuid references public.artist_groups on delete cascade,
 kind text not null check(kind in ('art','blog')),
 title text not null check(char_length(trim(title)) between 2 and 95),
 body text not null check(char_length(body)<=5000),
 image text check(image is null or (char_length(image)<=450000 and image like 'data:image/jpeg;base64,%')),
 created_at timestamptz not null default now(),
 check(kind='blog' or image is not null)
);
create table public.artist_reactions(
 post_id uuid references public.artist_posts on delete cascade,
 artist_id uuid references public.artist_profiles on delete cascade,
 primary key(post_id,artist_id)
);
alter table public.artist_profiles enable row level security;
alter table public.artist_groups enable row level security;
alter table public.artist_group_members enable row level security;
alter table public.artist_posts enable row level security;
alter table public.artist_reactions enable row level security;
grant select on public.artist_profiles,public.artist_groups,public.artist_group_members,public.artist_posts,public.artist_reactions to anon,authenticated;
grant insert,update on public.artist_profiles to authenticated;
grant insert on public.artist_groups to authenticated;
grant insert,delete on public.artist_group_members,public.artist_posts,public.artist_reactions to authenticated;
create policy profile_read on public.artist_profiles for select using(true);
create policy profile_add on public.artist_profiles for insert to authenticated with check(id=(select auth.uid()));
create policy profile_edit on public.artist_profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy group_read on public.artist_groups for select using(true);
create policy group_add on public.artist_groups for insert to authenticated with check(owner_id=(select auth.uid()));
create policy membership_read on public.artist_group_members for select using(true);
create policy membership_add on public.artist_group_members for insert to authenticated with check(artist_id=(select auth.uid()));
create policy membership_remove on public.artist_group_members for delete to authenticated using(artist_id=(select auth.uid()));
create policy post_read on public.artist_posts for select using(true);
create policy post_add on public.artist_posts for insert to authenticated with check(
 author_id=(select auth.uid()) and
 (group_id is null or exists(select 1 from public.artist_group_members m where m.group_id=artist_posts.group_id and m.artist_id=(select auth.uid())) or
 exists(select 1 from public.artist_groups g where g.id=artist_posts.group_id and g.owner_id=(select auth.uid())))
);
create policy post_remove on public.artist_posts for delete to authenticated using(author_id=(select auth.uid()));
create policy reaction_read on public.artist_reactions for select using(true);
create policy reaction_add on public.artist_reactions for insert to authenticated with check(artist_id=(select auth.uid()));
create policy reaction_remove on public.artist_reactions for delete to authenticated using(artist_id=(select auth.uid()));
create index artist_posts_kind_date on public.artist_posts (kind,created_at desc);
create index artist_posts_group_date on public.artist_posts (group_id,created_at desc);