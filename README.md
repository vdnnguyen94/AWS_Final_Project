# RescueLink – Disaster Response System

This is the central repository for the COMP306: API Engineering & Cloud Computing final project by Seyeon, Van, and Ian.

## 1. Project Description

**RescueLink** is a cloud-native disaster response system designed to enable users in affected areas to report emergencies and request assistance in real time. The system centralizes incident reports on an interactive map, allowing emergency responders to visualize, prioritize, and coordinate rescue efforts.

This project features a fully separated frontend (React) and backend (ASP.NET Web API), leveraging a hybrid-database architecture on AWS.

## 2. Core Technologies

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | ASP.NET Core 8 Web API | The main API (3 controllers, 18 endpoints). |
| **Frontend** | React (Vite) | The client application (web client). |
| **Database 1**| AWS RDS (SQL Server) | Stores structured data (Users, Roles). |
| **Database 2**| AWS DynamoDB | Stores unstructured data (Incidents). |
| **Storage** | AWS S3 | Stores uploaded media (photos, videos). |
| **Deployment**| Docker, AWS ECR, AWS ECS | Containerizes and runs the API in the cloud. |
| **API Mgmt** | Google Apigee | Secures and manages the deployed API. |
| **Map** | Google Maps API | Displays incidents on the frontend client. |

## 3. Folder Structure

/RescueLink-Project/
├── .github/
│   └── workflows/          # CI/CD deployment pipelines
│
├── backend/
│   └── RescueLink/           # .NET Solution folder
│       ├── RescueLink.sln
│       └── RescueLink.Api/   # .NET Project folder
│           ├── Controllers/
│           ├── Models/
│           ├── Data/
│           ├── .env          <-- ❗ BACKEND .env file
│           └── Program.cs
│
├── frontend/
│   └── rescuelink-client/    # React project folder
│       ├── .env.local      <-- ❗ FRONTEND .env file
│       ├── package.json
│       └── src/
│
└── README.md                 # You are here

/RescueLink-Project/ 
├── .github/ │ └── workflows/ # CI/CD deployment pipelines │ ├── backend/ │ └── RescueLink/ # .NET Solution folder │ ├── RescueLink.sln │ └── RescueLink.Api/ # .NET Project folder │ ├── Controllers/ │ ├── Models/ │ ├── Data/ │ ├── .env <-- ❗ BACKEND .env file │ └── Program.cs │ ├── frontend/ │ └── rescuelink-client/ # React project folder │ ├── .env.local <-- ❗ FRONTEND .env file │ ├── package.json │ └── src/ │ └── README.md # You are here
## 4. How to Start the Servers (Local Development)

You must run both the backend API and the frontend client at the same time.

### Prerequisites
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* [Node.js v20.19+](https://nodejs.org/) (use `nvm` to manage versions)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be running)
* An AWS account with an **IAM User** (for local dev keys)
* A **Google Cloud Platform** account (for the Maps API key)

---

### A) Start the Backend (ASP.NET API)

1.  **Configure Environment (`.env`):**
    * Go to `backend/RescueLink/RescueLink.Api/`
    * Create a new file named `.env`
    * Paste and fill in the following template with the credentials you created in AWS:

    ```ini
    # IAM User Credentials (for S3/DynamoDB)
    AWS_ACCESS_KEY_ID=YOUR_IAM_USER_ACCESS_KEY
    AWS_SECRET_ACCESS_KEY=YOUR_IAM_USER_SECRET_KEY
    AWS_REGION=us-east-2

    # RDS Database
    RDS_HOST=YOUR_RDS_ENDPOINT_URL
    RDS_DB=RescueLinkDB
    RDS_USER=YOUR_RDS_MASTER_USERNAME
    RDS_PWD=YOUR_RDS_MASTER_PASSWORD

    # DynamoDB Table
    DYNAMODB_TABLE=Incidents

    # S3 Bucket
    S3_BUCKET=YOUR_UNIQUE_S3_BUCKET_NAME
    ```

2.  **Create Database Tables:**
    * Open `backend/RescueLink/RescueLink.sln` in Visual Studio.
    * Go to **Tools > NuGet Package Manager > Package Manager Console**.
    * Run `Update-Database`. This will connect to your RDS instance and create the Identity tables.

3.  **Seed Database Users:**
    * Run the `SeedUsers.sql` script (from our project files) in SSMS to add your 10 test users to the RDS database.

4.  **Run the Server:**
    * In Visual Studio, select **"Docker"** from the "Run" dropdown.
    * Press the green "Play" button.
    * This will build the Docker container and start your API, usually on `https://localhost:7123`.

---

### B) Start the Frontend (React Client)

1.  **Configure Environment (`.env.local`):**
    * Go to `frontend/rescuelink-client/`
    * Create a new file named `.env.local`
    * Paste and fill in the following template:

    ```ini
    # The URL your local backend API is running on
    VITE_API_BASE_URL=https://localhost:7123

    # Your Google Maps API Key
    VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY_HERE
    ```

2.  **Run the Server:**
    * Open a new terminal.
    * Navigate to the client folder: `cd frontend/rescuelink-client`
    * Install packages (only needed once): `npm install`
    * Start the app: `npm run dev`
    * Open your browser to `http://localhost:5173` (or whatever URL the terminal shows).

## 5. How to Commit (Git Workflow)

To avoid merge conflicts, please **do not** commit directly to the `main` branch.

1.  **Get Latest Changes:** Always start by getting the latest code from the team.
    ```bash
    git pull origin main
    ```

2.  **Create a New Branch:** Create a branch for your specific task (e.g., `feat/user-login`, `fix/map-bug`).
    ```bash
    git checkout -b feat/user-login
    ```

3.  **Do Your Work:** Make your code changes in your new branch.

4.  **Commit and Push:**
    ```bash
    git add .
    git commit -m "feat: implemented user login endpoint"
    git push origin feat/user-login
    ```

5.  **Create a Pull Request:**
    * Go to our GitHub repository.
    * Click the "Pull Requests" tab.
    * Click "New Pull Request" and create one from your branch (`feat/user-login`) into `main`.
    * Add your team members as reviewers. We will review and merge it.