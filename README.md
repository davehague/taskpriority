# Introduction
Got too many tasks and can't decide which one is top priority? Use a pairwise matrix to determine which one you should work on next!  Add tasks, delete tasks, activate or deactivate tasks, and compare tasks to each other.  Summarize which tasks have won the most head-to-head competitions and get to work!

## Technical details
- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). 
- This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.  
- It connects to [Supabase](https://supabase.com/) for persistent storage of user preferences.  It also uses a `taskpriority` schema.  Check out more on using schemas in Supabase in [this gist](https://gist.github.com/davehague/5f694889f466d18c5b48fda89ddfc14a).  Schema and table scripts are included in the `sql` folder.

## Get setup
Create an `.env.local` file with the following contents:

```
NEXT_PUBLIC_SUPABASE_URL=<your-sb-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-sb-anon-key>
```

## Getting Started

Run the development server:
```bash
npm run dev
```
