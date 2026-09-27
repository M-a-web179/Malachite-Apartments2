# Malachite Apartments Enquiry API

This Express API validates apartment enquiries and stores them in MongoDB. The static GitHub Pages site sends form submissions to this service.

## Install and configure

From the repository root:

```sh
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set these values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database-name>?retryWrites=true&w=majority
CLIENT_URL=https://m-a-web179.github.io
```

`CLIENT_URL` is the site origin, not the repository path. Keep `.env` private; it is excluded from Git.

## Run locally

From the `server` directory, start the API:

```sh
npm start
```

For automatic restarts during development:

```sh
npm run dev
```

The server connects to MongoDB before listening on the configured port.

To test the Pages frontend locally, temporarily set `CLIENT_URL=http://localhost:8080`, run the backend with `npm start`, and serve the site from the repository root in a second terminal:

```sh
cd ..
python3 -m http.server 8080
```

Open `http://localhost:8080`. Restore the GitHub Pages origin in `CLIENT_URL` before deploying the API.

## Test the health endpoint

With the server running in another terminal:

```sh
curl http://localhost:3000/api/health
```

Expected response:

```json
{"success":true,"message":"API is running"}
```

## Connect MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user.
2. In Atlas Network Access, allow the IP addresses that need to connect. For a first local test, allow your current IP; for Render, configure access according to your Atlas security policy.
3. Select **Connect**, choose **Drivers**, and copy the Node.js connection string.
4. Replace `<username>`, `<password>`, `<cluster-host>`, and `<database-name>` in `MONGODB_URI`. URL-encode special characters in the password.
5. Put the completed URI in `server/.env` for local development or in the Render environment settings for deployment.

## Deploy the API to Render

1. Push this repository to GitHub.
2. In Render, create a **New Web Service** and connect the repository.
3. Set **Root Directory** to `server`, **Build Command** to `npm install`, and **Start Command** to `npm start`.
4. Add environment variables `MONGODB_URI` and `CLIENT_URL` in the Render service settings. Set `CLIENT_URL` to `https://m-a-web179.github.io`. Render supplies `PORT` automatically; it is also fine to set it to `3000` for local use.
5. Deploy the service and copy its public URL, for example `https://malachite-enquiries.onrender.com`.
6. Test `https://<your-render-service>.onrender.com/api/health` and confirm the JSON health response.

## Point GitHub Pages at the deployed API

There is no GitHub Actions Pages workflow in this repository. Its root-level `index.html` and `main` branch are consistent with branch-based Pages publishing, which these instructions assume; confirm the **Build and deployment** setting in GitHub Pages if needed. After deploying the API, edit the `API_BASE_URL` constant near the top of `main.js`:

```js
const API_BASE_URL = 'https://<your-render-service>.onrender.com';
```

Commit and push the updated `main.js`. GitHub Pages will publish it from the branch. Keep the API URL origin-only, with no trailing slash or `/api` suffix. The API's `CLIENT_URL` must continue to match the GitHub Pages origin exactly.