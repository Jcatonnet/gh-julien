# SFE take-home exercise

Application content :

Products page
i. List all products grouped and sorted by category.
ii.Products can be added to a new order

b. Cart/Order view
i. List thofe products added to a given order
ii. User can change quantity of products
iii. User can proceed with payment of the order

c. Confirmation
i. If payment is successful, user is shown a confirmation

For the exercice purpose, we decided to tigger the order creation when the user clicks on "See my order".
We decided to do so because the API currently does not handle Order Patch with new product. It only updates quantity of existing products in order. That is why we went with this implementation.

Due to time constraint, we do not handle the following edge case :

-   A user add products to cart/order, remove all of them and go back shopping to add more products in cart

## Project Structure

1. pages/
   Contains the main application pages and API routes.
   index.tsx: The homepage where products are listed.
   cart.tsx: The shopping cart page where users can view and manage their cart.
   api/: Directory for API routes that interact with external APIs.
   products.ts: Handles fetching product data.
   orders.ts: Handles creating new orders.
   orders/[id].ts: Handles retrieving and updating specific orders.
   orders/[id]/buy.ts: Handles purchasing an order.
2. components/
   Contains reusable React components.
   Cart/: Components related to the shopping cart.
   Cart.tsx: The main cart component that displays the cart items and summary.
   CartItem.tsx: Displays individual cart items.
   CartSummary.tsx: Shows the order summary, including total price.
   EmptyCart.tsx: Displays when the cart is empty.
   Product/: Components related to product listing and details.
   ProductList.tsx: The main component for listing products.
   ProductItem.tsx: Displays individual product details and "Add to Cart" button.
3. context/
   Provides React Context for managing global state.
   CartContext.tsx: Manages the cart state, including adding/removing items and order management.
   ProductContext.tsx: Manages the state related to products, including fetching and storing product data.
4. services/
   Contains business logic and helper functions.
   cartService.ts: Handles logic for grouping items, processing purchases, and fetching orders.
   productService.ts: Handles logic for fetching and setting product data.
5. utils/
   Utility functions and API calls.
   api.ts: Handles API calls for fetching products, creating orders, updating orders, and purchasing orders.
6. types/
   Contains TypeScript type definitions.
   types.ts: Defines types for products, cart items, and other structures used throughout the project.
7. tests/
   Contains unit tests for components and logic.
   sample.test.tsx: Example test file covering core functionality.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
