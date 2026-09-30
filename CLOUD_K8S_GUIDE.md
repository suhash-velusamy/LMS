# 🚀 Zero-Cost Cloud-Native, Kubernetes & CI/CD Guide for Laundry Management System

This guide explains how to use the newly implemented **Kubernetes (K8s)** manifests, **GitHub Actions CI/CD**, and **Free Cloud Hosting** for your Laundry Management System.

---

## 📁 What Was Added to Your Project

1. **Kubernetes Configuration (`k8s/`)**:
   - [`namespace.yaml`](./k8s/namespace.yaml): Creates an isolated `lms-system` namespace.
   - [`configmap.yaml`](./k8s/configmap.yaml): Environment variables for backend and frontend.
   - [`secret.yaml`](./k8s/secret.yaml): Secret values (Database URI, JWT secret).
   - [`mongodb.yaml`](./k8s/mongodb.yaml): PersistentVolumeClaim (PVC), Deployment, and Service for MongoDB.
   - [`backend.yaml`](./k8s/backend.yaml): 2-replica Deployment and ClusterIP Service for Node.js API.
   - [`frontend.yaml`](./k8s/frontend.yaml): 2-replica Deployment and NodePort Service for React UI.
   - [`ingress.yaml`](./k8s/ingress.yaml): URL path routing (`/api` -> backend, `/` -> frontend).
   - [`kustomization.yaml`](./k8s/kustomization.yaml): One-command deployment bundle.

2. **Automated CI/CD Pipeline (`.github/workflows/ci-cd.yml`)**:
   - Automatically runs linting, tests, and build validation on push/PR.
   - Builds Docker containers for backend and frontend.
   - Publishes containers for free to **GitHub Container Registry (GHCR)** (`ghcr.io`).
   - Validates all Kubernetes manifests.

3. **Backend Dockerization (`server/Dockerfile` & `server/.dockerignore`)**:
   - Production Alpine image with optimized dependency caching.

---

## 🛠️ 1. How to Run on Kubernetes for Free (Local Machine)

You can run Kubernetes on your local PC using **Docker Desktop Kubernetes**, **Minikube**, or **k3d**:

### Deploying to Local Kubernetes:
```bash
# Apply all Kubernetes manifests at once
kubectl apply -k ./k8s

# Check status of pods, services, and PVC
kubectl get all -n lms-system

# Forward frontend port to view in browser
kubectl port-forward svc/frontend-service -n lms-system 5173:5173

# Forward backend port
kubectl port-forward svc/backend-service -n lms-system 5000:5000
```
Open [http://localhost:5173](http://localhost:5173) to interact with the Kubernetes-hosted app!

To remove the resources:
```bash
kubectl delete -k ./k8s
```

---

## 🌐 2. 100% Free Cloud-Native Deployment Options

You can host your entire app live on the internet with zero hosting costs:

### Step A: Free Cloud Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a **Free Shared Cluster (M0)**.
2. In Database Access, create a database user and copy the connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/lms`).
3. Update `MONGO_URI` in [`k8s/secret.yaml`](./k8s/secret.yaml) or your cloud environment variables.

### Step B: Free Backend Hosting (Render / Koyeb / Fly.io)
1. Sign up on [Render.com](https://render.com) (free tier).
2. Click **New +** -> **Web Service** -> Connect your GitHub repository `full_stack_`.
3. Set root directory to `server` and build command `npm install`, start command `npm start`.
4. Add environment variables: `MONGO_URI`, `PORT=5000`, `CORS_ORIGIN=*`.

### Step C: Free Frontend Hosting (Vercel / Cloudflare Pages / Netlify)
1. Sign up on [Vercel](https://vercel.com) (free tier).
2. Import your GitHub repository.
3. Set **Root Directory** to `laundry_system-main`.
4. Set build command `npm run build` and output directory `dist`.
5. Add environment variable: `VITE_API_BASE=https://your-backend-url.onrender.com`.

---

## 🔄 3. Using the GitHub Actions CI/CD Pipeline

Once you push your code to GitHub:
```bash
git add .
git commit -m "Add Kubernetes manifests, CI/CD pipeline, and server Dockerfile"
git push origin main
```
1. Open your repository on GitHub and click the **Actions** tab.
2. You will see the **LMS CI/CD Pipeline** run automatically:
   - Validating frontend and backend builds.
   - Pushing your images to `ghcr.io/<your-github-username>/lms-backend` and `lms-frontend`.
