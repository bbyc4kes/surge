# <p align="center">Surge</p>

![image](https://github.com/bbyc4kes/surge/assets/153362892/407a539f-e3e3-42ce-842b-39c15c24ca29)
### <p align="center">Surge is a SaaS website builder built using Next.js 14, Tailwind CSS, MySQL, Prisma, and Clerk for authentication. Surge offers its services at a fair price, integrated with Stripe to allow users to create and deploy their own SaaS websites with ease.</p>


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure authentication using Clerk.
- **Database Management**: Efficient data handling with MySQL and Prisma.
- **Responsive Design**: Tailwind CSS for a sleek and responsive user interface.
- **Payment Integration**: Seamless payment processing with Stripe.
- **Dynamic Routing**: Next.js 14 for optimized and dynamic routing.
- **SaaS Deployment**: Easy deployment of SaaS websites.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.dev/)
- **Payments**: [Stripe](https://stripe.com/)
- **Hosting**: [Vercel](https://vercel.com/) (recommended)

## Getting Started

### Prerequisites

- Node.js v14 or later
- MySQL database
- Stripe account
- Clerk account

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/surge.git
    cd surge
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup environment variables**:

    Create a `.env.local` file in the root directory and add the following:
    ```env
    DATABASE_URL=mysql://user:password@localhost:3306/database
    NEXT_PUBLIC_CLERK_FRONTEND_API=your-clerk-frontend-api
    CLERK_API_KEY=your-clerk-api-key
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your-stripe-public-key
    STRIPE_SECRET_KEY=your-stripe-secret-key
    NEXT_PUBLIC_DOMAIN=your-domain.com
    ```

4. **Run database migrations**:
    ```bash
    npx prisma migrate dev
    ```

### Running the Application

1. **Start the development server**:
    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Configuration

### Clerk Configuration

- Sign up at [Clerk](https://clerk.dev/).
- Create a new application and get your `CLERK_API_KEY` and `NEXT_PUBLIC_CLERK_FRONTEND_API`.
- Add these keys to your `.env.local` file.

### Stripe Configuration

- Sign up at [Stripe](https://stripe.com/).
- Create a new project and get your `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`.
- Add these keys to your `.env.local` file.

### Prisma Configuration

- Update your `DATABASE_URL` in the `.env.local` file with your MySQL connection string.

## Usage

- **Sign Up/Login**: Users can sign up or log in using the Clerk authentication system.
- **Create SaaS**: Users can create their own SaaS website using the intuitive builder interface.
- **Manage Content**: Users can manage their website content easily.
- **Payment Processing**: Users can set up Stripe for payment processing to monetize their SaaS offerings.

## Deployment

Deploy your project on [Vercel](https://vercel.com/):

1. **Connect your repository**: Follow Vercel’s guide to connect your GitHub repository.
2. **Set Environment Variables**: Add the environment variables from your `.env.local` to Vercel.
3. **Deploy**: Click on the deploy button in Vercel.

## Contributing

We welcome contributions to Surge! Here’s how you can help:

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b feature-branch`.
3. **Commit your changes**: `git commit -m 'Add new feature'`.
4. **Push to the branch**: `git push origin feature-branch`.
5. **Open a Pull Request**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using Surge! If you have any questions or feedback, please feel free to [open an issue](https://github.com/bbyc4kes/surge/issues).
