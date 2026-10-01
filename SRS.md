
## 1. Introduction & Scope

This document outlines the Software Requirements Specification (SRS) for the Multi-Vendor E-Commerce Platform. The system enables independent vendors to register, manage inventory, and sell products to customers through a unified storefront, while platform administrators oversee operations, dispute resolution, and payment disbursements.

## 2. System Roles & Access Control

| Role | Description | Core Capabilities |
| --- | --- | --- |
| **Customer** | End-users purchasing goods | Browse catalog, manage cart, process payments, leave reviews, chat with vendors, track orders. |
| **Vendor (Seller)** | Independent shop owners | Manage shop profile, perform CRUD on products, manage order fulfillment, track earnings, request payouts, chat with customers/admins. |
| **Administrator** | Platform operators | Approve/ban vendors, manage categories, view platform-wide analytics, resolve disputes, approve vendor payout requests. |

## 3. Functional Requirements

### Authentication & Authorization

* **User Registration/Login:** Secure email/password and OAuth (Google, Facebook, LinkedIn) authentication using Better Auth.
* **Role-Based Access Control (RBAC):** Restrict dashboard routes and API endpoints based on the `customer`, `vendor`, or `admin` role.
* **Vendor Onboarding:** Vendors must complete a shop profile setup before creating products.

### Product & Inventory Management

* **Catalog Browsing:** Customers can filter products by category, price range, and rating. Search functionality must support keyword matching.
* **Vendor Inventory:** Vendors can upload product images, set prices, define stock levels, and assign categories.
* **Stock Tracking:** The system must automatically decrement available stock upon successful order placement and block purchases if stock is insufficient.

### Order Processing & Financials

* **Multi-Vendor Cart:** The cart must visually group items by vendor and calculate total shipping/costs accordingly.
* **Checkout Gateway:** Integration with Stripe for secure credit card processing.
* **Vendor Ledger:** The system must track the internal balance of each vendor, deducting platform commissions from each sale.
* **Payout System:** Vendors can request withdrawals of their available balance; Admins must approve and execute these transfers.

### Real-Time Features & Engagement

* **Live Chat:** Socket.io integration to facilitate instant messaging between Customers and Vendors (for product inquiries) and Vendors and Admins (for platform support).
* **Review System:** Customers can leave 1-5 star ratings and text reviews on purchased products, automatically updating the product's aggregate rating.

## 4. Non-Functional Requirements & Architecture

* **Technology Stack:**
* **Frontend:** React.js, Vite, Tailwind CSS, shadcn/ui, React Router v7.
* **Backend:** Node.js, Express.js (ESM), Socket.io.
* **Database:** MongoDB via Mongoose ODM.
* **Authentication:** Better Auth (MongoDB Adapter).
* **Package Manager & Runtime:** Bun.


* **Performance:** The platform must utilize database indexing on frequently queried fields (e.g., `vendorId`, `categoryId`) to ensure sub-500ms API response times.
* **Security:** Enforce strict CORS policies (currently localized to `http://localhost:5173`), utilize HTTP-only cookies for session management, and sanitize all database inputs to prevent NoSQL injection.
* **Responsiveness:** All three user interfaces (Storefront, Vendor Dashboard, Admin Dashboard) must be fully mobile-responsive.
