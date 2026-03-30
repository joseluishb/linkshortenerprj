---
description: This file provides instructions for fetching data in the project.
---

# Data Fetching Instructions

This document outlines the best practices and guidelines for fetching data in our Next.js application. Adhering to these instructions will help ensure that our data fetching is efficient, maintainable, and consistent across the project.

## 1. Use Server Components for Data Fetching

In Next.js, ALWAYS using SERVER COMPONENTS for data fetching. NEVER use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database interactions.
