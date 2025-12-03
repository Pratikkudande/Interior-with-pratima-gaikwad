## Interior with Pratima Gaikwad – Website

Node + Express + EJS + MongoDB website for an interior design and home architecture studio.

### Tech stack

- Node.js, Express
- EJS views
- MongoDB via Mongoose

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root with:
   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/interior_with_pratima
   PORT=3000
   ```
3. Make sure MongoDB is running locally or change `MONGO_URI` to your MongoDB connection string.

### Run

- Development with auto-restart:
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

Open `http://localhost:3000` in your browser.



