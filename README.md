# MyIAM Next.js Samples

[MyIAM](https://myiam.io) is a cloud-based identity and access management service. It provides authentication features such as login, signup, and token management for your applications.

This repository contains sample Next.js apps that demonstrate how to integrate MyIAM into a Next.js project.

| Sample | Description |
| --- | --- |
| [1-quickstart](./1-quickstart) | A minimal example built by following the [Next.js Quickstart](https://myiam.io/docs/quickstart/nextjs) guide |
| [2-basic](./2-basic) | A more complete example with session management, token refresh, and API proxy |

## Getting Started

1. Navigate to a sample directory:

```bash
cd 1-quickstart
```

2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

4. Start the dev server:

```bash
npm run dev
```
