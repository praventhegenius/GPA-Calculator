# Academic Performance Dashboard

A comprehensive, modern, and interactive GPA calculator and academic performance dashboard. This application helps students track their academic progress, calculate GPAs across different scales (10-point, US 4.0, German), and project future performance.

## 🚀 Live Demo / Quick Access

You don't need to install anything! Access the full application directly in your browser (works great on mobile too):

**👉 [Click here to open the GPA Calculator](https://praventhegenius.github.io/GPA-Calculator/)**

*No login required. Your data is saved automatically to your device.*

---

## Features

- **Multi-Scale GPA Calculation**: Automatically calculates and converts grades between:
    - 10-point CGPA Scale
    - US 4.0 GPA Scale
    - German Grading Scale
- **Semester Management**:
    - Add, edit, and remove past semesters.
    - Detailed subject-wise entry (Course Name, Credits, Grade).
- **Current Semester Projection**:
    - Input current semester subjects to see how they affect your overall CGPA.
- **Future Performance Prediction**:
    - "What-if" analysis: Project your cumulative CGPA by setting targets for future semesters.
- **Data Persistence**:
    - Automatically saves your data to your browser's local storage so you never lose your progress.
- **Import/Export**:
    - Export your academic profile to CSV for backup or analysis.
    - Import previously exported CSV files.
- **Academic Report**:
    - Generate a clean, printable report of your entire academic history and projections.
- **Modern UI/UX**:
    - Beautiful Glassmorphism design.
    - Fluid animations and transitions.
    - Responsive layout for all devices.
    - Premium light theme aesthetics.

## 📖 User Guide

This tool is designed to be your personal academic companion. Here is how to make the most of it:

### 1. Getting Started
Click the [Live Demo link](https://praventhegenius.github.io/GPA-Calculator/) or open `index.html` locally. You will be greeted by the Dashboard.

### 2. Building Your Profile (Past Semesters)
To get accurate predictions, you first need to input your academic history.
1.  Click on the **"Manage Profile"** button (or switch to the Profile view).
2.  **Add a Semester**: Click the **"Add Semester"** button. A new semester card will appear.
3.  **Name It**: Give your semester a name (e.g., "Fall 2023", "Semester 1").
4.  **Add Subjects**:
    - Click **"Add Subject"** inside the semester card.
    - **Course Name**: Enter the name of the subject (e.g., "Data Structures").
    - **Credits**: Enter the credit value of the course (e.g., 3 or 4). *This is crucial for accurate weighting.*
    - **Grade**: Select your grade from the dropdown menu (S, A, B, C, etc.).
5.  **Repeat**: Do this for all your completed semesters. The app will automatically calculate your SGPA for each semester and your cumulative CGPA.

### 3. Tracking the Current Semester
On the main **Dashboard**, you will see a "Current Semester" card.
- Use this space for courses you are *currently* taking.
- Add your expected grades to see how they will impact your overall CGPA in real-time.
- This helps you understand what grades you need to maintain or improve your standing.

### 4. Future Projections (The "What-If" Machine)
Want to know if you can reach a 9.0 CGPA by graduation?
1.  On the Dashboard, look for the **"Future Projection"** card.
2.  Toggle the switch to **ON**.
3.  **Est. Credits**: Enter how many credits you plan to take in the next semester (e.g., 24).
4.  **Target GPA**: Enter the GPA you hope to achieve (e.g., 9.5).
5.  Watch the **Cumulative CGPA** card at the top! It will update instantly to show you what your final CGPA would be if you hit those targets.

### 5. Data Management
- **Auto-Save**: The application automatically saves your data to your browser. You can close the tab and come back later; everything will be there.
- **Export**: Click the **"Export"** button to download a `.csv` file of your data. Keep this as a backup or use it to transfer your data to another device.
- **Import**: Click **"Import"** and select your backup `.csv` file to restore your data.

## Technologies Used

- **Core**: HTML5, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Framework**: React.js (via CDN, using Babel Standalone for JSX)
- **Icons**: Phosphor Icons
- **Fonts**: Google Fonts (Outfit, JetBrains Mono)

## Setup (For Developers)

If you want to run this locally or contribute:

1.  Clone the repository:
    ```bash
    git clone https://github.com/praventhegenius/GPA-Calculator.git
    ```
2.  Navigate to the project folder.
3.  Open `index.html` in your browser.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
