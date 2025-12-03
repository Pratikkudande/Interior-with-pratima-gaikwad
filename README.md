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
2. Drop your logo image (PNG/JPG) into `public/img/logo.png` – matching the round PG logo shared on Instagram.
3. Create a `.env` file in the project root with:
   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/interior_with_pratima
   PORT=3000
   ```
4. Make sure MongoDB is running locally or change `MONGO_URI` to your MongoDB connection string.

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

---

## Deploy to Render

### Prerequisites

1. **GitHub Account** – Your code needs to be in a GitHub repository
2. **MongoDB Atlas Account** (free tier works) – For cloud database
3. **Render Account** – Sign up at [render.com](https://render.com)

### Step-by-Step Deployment

#### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Interior with Pratima Gaikwad website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 2. Set Up MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (choose free tier)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Username: `pratima-admin` (or your choice)
   - Password: Generate a strong password (save it!)
5. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (or add Render's IPs)
6. Get connection string:
   - Go to **Database** → **Connect** → **Connect your application**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `...mongodb.net/interior_with_pratima?retryWrites=true&w=majority`

#### 3. Deploy on Render

1. **Log in to Render:**
   - Go to [render.com](https://render.com)
   - Sign up/Log in with GitHub

2. **Create New Web Service:**
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select the repository you just pushed

3. **Configure the Service:**
   - **Name:** `interior-with-pratima` (or your choice)
   - **Region:** Choose closest to your users (e.g., Singapore, Mumbai)
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or `.` if needed)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if you want)

4. **Add Environment Variables:**
   Click **Environment** tab and add:
   - `MONGO_URI` = Your MongoDB Atlas connection string (from step 2)
   - `NODE_ENV` = `production`
   - `PORT` = Leave empty (Render sets this automatically)

5. **Deploy:**
   - Click **Create Web Service**
   - Render will build and deploy your app
   - Wait 2-5 minutes for first deployment
   - Your site will be live at: `https://your-app-name.onrender.com`

#### 4. Verify Deployment

- Visit your Render URL
- Test the contact form (check MongoDB Atlas to see if inquiries are saved)
- Check logs in Render dashboard if anything fails

### Important Notes

- **Free tier limitations:** Render free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.
- **MongoDB Atlas free tier:** 512MB storage, sufficient for small projects
- **Environment variables:** Never commit `.env` file to GitHub (it's in `.gitignore`)
- **Logo image:** Make sure `public/img/logo.png` is committed to your repo

### Troubleshooting

- **Build fails:** Check Render logs → check if all dependencies are in `package.json`
- **Database connection error:** Verify `MONGO_URI` in Render environment variables
- **404 errors:** Check that static files are in `public/` folder
- **App crashes:** Check Render logs for error messages

### Custom Domain (Optional)

1. In Render dashboard → **Settings** → **Custom Domains**
2. Add your domain (e.g., `www.interiorwithpratima.com`)
3. Follow DNS instructions to point your domain to Render



