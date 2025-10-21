# Cloud Based File Storage System (Team Avengers)

A secure and modern web application for uploading, managing, and accessing your files from anywhere, built with React and Supabase.

## ✨ Features

* **User Authentication:** Secure Sign Up, Login, Logout, Password Reset.
* **File Management:** Upload, Download, List, and Delete files.
* **Role-Based Access:** Separate dashboards and permissions for Users and Admins.
* **Admin Dashboard:** View and manage users (edit roles, delete users).
* **Modern UI:** Styled using Material UI (MUI) with a dark theme.

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router
* **UI Library:** Material UI (MUI)
* **Backend:** Supabase
    * Authentication
    * PostgreSQL Database (with Row Level Security)
    * Storage
* **Deployment:** Netlify

## 🚀 Live Demo

[https://filedalokhiseb.netlify.app/](https://filedalokhiseb.netlify.app/)

## ⚙️ Local Setup

Follow these steps to set up and run the project locally on your machine:

1.  **Clone the Repository:**
    Open your terminal and run the following command:
    ```bash
    git clone [https://github.com/akshat3021/cloud-file-storage.git](https://github.com/akshat3021/cloud-file-storage.git)
    cd cloud-file-storage
    ```

2.  **Install Dependencies:**
    Install the necessary Node.js packages using npm:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    This project requires credentials to connect to the Supabase backend.
    * Create a new file named `.env` in the root directory of the project (the same level as `package.json`).
    * Add the following lines to the `.env` file, replacing the placeholder values with your actual Supabase Project URL and Anon Key:
      ```env
      REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
      REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```
    * You can find these keys in your Supabase project settings under **Settings > API**.
    * **Important:** The `.env` file should **not** be committed to Git. Ensure your `.gitignore` file includes `.env`.

4.  **Run the Development Server:**
    Start the React development server:
    ```bash
    npm start
    ```
    The application should automatically open in your default web browser at `http://localhost:3000`.

## 📄 License

[Choose a License, e.g., MIT]