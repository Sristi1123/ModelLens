Live Demo: model-lens-delta.vercel.app

🎯 What is ModelLens?
ModelLens is an interactive, educational tool that demystifies machine learning predictions. Instead of treating models as black boxes, it helps you understand what influenced a prediction by connecting outputs back to the inputs that shaped them.

No fabricated testimonials. No fake user counts. Just honest, working software that demonstrates ML interpretability.

✨ Key Features
Live Interactive Demo — Adjust sliders and dropdowns, watch predictions change in real-time

Multiple Datasets — Choose from 5 different ML problems:

Customer Churn

House Price Prediction

Diabetes Risk

Loan Approval

Iris Flower Classification

Model Selection — Switch between Logistic Regression, Random Forest, and K-Nearest Neighbors

Feature Influence Visualization — See which features contributed most to each prediction

Responsive Design — Works flawlessly on desktop (1440px) and mobile (390px)

Dark Mode Support — Full, all-or-nothing dark theme

🚀 Quick Start
Live Demo
Visit model-lens-delta.vercel.app — no installation needed!

Run Locally
bash
# Clone the repository
git clone https://github.com/Sristi1123/ModelLens.git

# Navigate to the folder
cd ModelLens

# Open index.html in your browser
# (Double-click the file or use a local server)
🛠️ Tech Stack
Frontend: Vanilla HTML5, CSS3, JavaScript (No frameworks — keeps it lightweight and fast)

Styling: Custom CSS with responsive design and dark mode

Deployment: Vercel

Version Control: Git + GitHub

📁 Project Structure
text
ModelLens/
├── index.html          # Main landing page
├── css/
│   └── style.css       # All styles (responsive, dark mode)
├── js/
│   └── script.js       # Interactive logic (simulated ML engine)
├── data/               # Dataset reference files
├── ml/
│   └── models.py       # Conceptual ML implementation (reference)
└── README.md           # This file
🎨 Design Philosophy
This project was built with a "Product Hunt ready" mindset:

First 3 seconds: Clear value proposition with a live demo that shows the product, not just claims

Honest copy: No fake testimonials, user counts, or logos

Tasteful interactions: One meaningful motion (prediction animation) that earns its keep

Accessible: Full dark mode support, responsive from 390px to 1440px

📊 How the Demo Works
The prediction engine uses simulated ML logic (not actual trained models) to demonstrate interpretability:

User adjusts input features (sliders/selectors)

JavaScript calculates a "prediction" based on feature weights

Result updates with:

Prediction value

Risk indicator

Feature influence bars

Explanatory text

This simulates what a real ML explanation tool would show.

🌐 Deployment
Deployed on Vercel with automatic deployments from GitHub:
