A full‑stack, production‑ready e‑commerce application that demonstrates real‑world portfolio experience. It includes JWT authentication, Redux Toolkit state management, Tailwind UI, Cloudinary image uploads, PayPal sandbox payments, and an admin dashboard.

✨ Features
User authentication – register / login with JWT, protected routes (checkout, admin).
Product catalog – filtering, sorting, pagination, and “new arrivals” / “best sellers”.
Shopping cart – guest‑cart (stored by guestId), merge on login, scrollable drawer with fixed checkout button.
Admin panel – CRUD for users, products, orders; sales stats dashboard.
Payments – PayPal sandbox integration (order creation → payment → order confirmation).
Image handling – Cloudinary upload for product images.
Responsive design – Tailwind CSS with mobile‑first utilities.
State management – Redux Toolkit slices for auth, products, cart, checkout, orders (including admin slices).
Seed script – seed.js populates the DB with >20 sample products & an admin user.

🛠️ Tech Stack
Layer	         Technology	                                            Purpose
Front‑end	     React, Vite, React Router, Tailwind CSS, React Icons	SPA UI
State	         Redux Toolkit, Redux Thunk	                            Global state, async API
Back‑end	     Node.js, Express, Mongoose	                            REST API & DB
Database	     MongoDB (Atlas)	                                    Data persistence
Auth	         JSON Web Token (JWT)	                                Stateless auth
Images	         Cloudinary	                                            Store product media
Payments	     PayPal Checkout (sandbox)	                            Process orders
Deployment	     Vercel (frontend) & Vercel/Node (backend)	            Free hosting

⚙️ Installation & Running Locally
Clone the repo

git clone https://github.com/your‑username/rabbit-ecommerce.git
cd rabbit-ecommerce
Backend

cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary creds, etc.
npm run dev          # runs server on http://localhost:9000
Seed the database (once, after env is set)

node seed.js

Frontend

cd ../frontend
npm install
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:9000
npm run dev          # Vite dev server at http://localhost:5173
Test the app

Visit http://localhost:5173
Log in with the admin credentials to access /admin.
Use the sandbox PayPal credentials (set in .env) for checkout.

📦 Environment Variables (.env)
Variable	                    Description
PORT	                        Backend port (default 9000)
MONGO_URI	                    MongoDB connection string
JWT_SECRET	                    Secret for signing JWTs (≥32 chars)
CLOUDINARY_CLOUD_NAME	        Cloudinary account name
CLOUDINARY_API_KEY	            Cloudinary API key
CLOUDINARY_API_SECRET	        Cloudinary secret
VITE_BACKEND_URL	            Front‑end URL to reach the API
VITE_PAYPAL_CLIENT_ID	        PayPal sandbox client ID

📜 Scripts
Script	                      What it does
npm run dev (backend)	     Starts Express with nodemon
node seed.js	             Clears collections & inserts sample data
npm start (frontend)	     Production build served by Vite
npm run build (frontend)	 Generates static files for Vercel deployment

🚀 Deployment (Vercel)
Backend – Create a Vercel project, point to backend/server.js, set all backend env vars.
Frontend – Create another Vercel project, select the frontend folder, add VITE_BACKEND_URL (the URL of the deployed backend) and VITE_PAYPAL_CLIENT_ID.
Domain – Connect a custom domain if desired; the app works out‑of‑the‑box with the provided URLs.

🧪 Testing & Debugging Tips
API – Use Postman or VS Code REST client to test /api/users, /api/products, /api/cart, etc.
Auth – Verify the Authorization: Bearer <token> header is sent on protected routes.
Cloudinary – Check the upload response ({ url: "..."} ) and ensure the URL is stored in images array.
PayPal – In the sandbox dashboard you’ll see orders appear under “Transactions”.


📄 License
Distributed under the MIT License. See LICENSE for details.
