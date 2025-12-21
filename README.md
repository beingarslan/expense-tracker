# Expense Tracker

A comprehensive personal expense manager built with Laravel and React to help freelancers and individuals track their expenses, manage recurring payments, and gain insights into their spending habits.

## Features

### 📊 Dashboard
- Monthly and yearly balance overview
- Income vs expenses comparison
- Expenses breakdown by category
- Recent transactions list
- Upcoming recurring payments
- High-priority expenses tracker

### 💰 Expense Management
- Track all income and expenses
- Categorize transactions
- Set priority levels (High, Medium, Low)
- Add notes and descriptions
- Filter by category, type, priority, and date range
- Search functionality
- Pagination for large datasets

### 🏷️ Category System
- Create custom categories for expenses and income
- Color-coded categories for easy identification
- Pre-seeded with common categories:
  - Expenses: Food & Dining, Transportation, Shopping, Bills & Utilities, Entertainment, Healthcare, Housing, Education, Personal Care, Loans & Credit Cards, Insurance
  - Income: Salary, Freelance, Business, Investments

### 🔄 Recurring Payments
- Track subscriptions and recurring bills
- Set frequency (Daily, Weekly, Monthly, Yearly)
- View upcoming payments (next 30 days)
- Manage payment status (Active, Paused, Completed)
- Never miss a payment deadline

### 🔍 Advanced Features
- Search across all expenses
- Multi-criteria filtering
- Date range selection
- Priority-based organization
- Responsive design with dark mode support

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/beingarslan/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Setup database**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   php artisan db:seed --class=CategorySeeder
   ```

5. **Build frontend assets**
   ```bash
   npm run build
   # Or for development
   npm run dev
   ```

6. **Start the application**
   ```bash
   composer run dev
   ```

7. **Register an account** and start tracking your expenses!

## Usage Guide

### Adding an Expense
1. Click "Expenses" in the sidebar
2. Click "Add Expense" button
3. Fill in the details:
   - Title (e.g., "Grocery Shopping")
   - Amount
   - Type (Income or Expense)
   - Category
   - Date
   - Priority level
   - Optional notes
4. Click "Create Expense"

### Managing Categories
1. Navigate to "Categories" in the sidebar
2. View expense and income categories separately
3. Click "Add Category" to create new ones
4. Edit or delete existing categories

### Setting Up Recurring Payments
1. Go to "Recurring Payments" in the sidebar
2. Click "Add Recurring Payment"
3. Enter payment details:
   - Title (e.g., "Netflix Subscription")
   - Amount
   - Frequency (Monthly, Yearly, etc.)
   - Start date and next payment date
   - Optional end date
4. Track upcoming payments on the dashboard

### Filtering Expenses
Use the filter options on the Expenses page:
- **Search**: Find expenses by title or notes
- **Category**: Filter by specific category
- **Type**: Show only income or expenses
- **Priority**: View high-priority items first
- **Date Range**: Specify start and end dates

## Technology Stack

- **Backend**: Laravel 12
- **Frontend**: React 19 with TypeScript
- **UI Framework**: Tailwind CSS 4
- **SPA**: Inertia.js
- **Authentication**: Laravel Fortify
- **Database**: SQLite (easily switchable to MySQL/PostgreSQL)
- **Icons**: Lucide React

## Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - feel free to use this project for your own expense tracking needs!
