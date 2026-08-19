/**
 * ModelLens - Interactive ML Explanation Tool
 * Pure JavaScript implementation with simulated ML logic
 */

// =========================================
// DATA CONFIGURATION
// =========================================

const DATASETS = {
    churn: {
        id: 'churn',
        name: "Customer Churn",
        description: "Predict customer churn probability based on account behavior.",
        badge: "CLASSIFICATION",
        target: "Churn probability",
        unit: "%",
        features: [
            { id: "monthly_charges", label: "Monthly charges", min: 20, max: 150, default: 72, step: 1 },
            { id: "tenure", label: "Customer tenure", min: 1, max: 72, default: 18, step: 1 },
            { id: "contract_type", label: "Contract type", type: "select", options: ["Month-to-month", "One year", "Two year"], default: "Month-to-month" },
            { id: "data_usage", label: "Data usage (GB)", min: 0, max: 50, default: 15, step: 0.5 },
            { id: "support_calls", label: "Support calls", min: 0, max: 10, default: 2, step: 1 }
        ]
    },
    housing: {
        id: 'housing',
        name: "House Price Prediction",
        description: "Estimate house prices using property characteristics.",
        badge: "REGRESSION",
        target: "Estimated price",
        unit: "K",
        features: [
            { id: "sqft", label: "Square footage", min: 500, max: 4000, default: 1800, step: 10 },
            { id: "bedrooms", label: "Bedrooms", type: "select", options: ["1", "2", "3", "4", "5"], default: "3" },
            { id: "bathrooms", label: "Bathrooms", type: "select", options: ["1", "1.5", "2", "2.5", "3"], default: "2" },
            { id: "age", label: "Property age (years)", min: 0, max: 100, default: 15, step: 1 },
            { id: "location_score", label: "Location score", min: 1, max: 10, default: 6, step: 0.5 }
        ]
    },
    diabetes: {
        id: 'diabetes',
        name: "Diabetes Risk",
        description: "Assess diabetes risk based on health metrics.",
        badge: "CLASSIFICATION",
        target: "Risk probability",
        unit: "%",
        features: [
            { id: "glucose", label: "Glucose level", min: 60, max: 200, default: 110, step: 1 },
            { id: "bmi", label: "BMI", min: 15, max: 45, default: 28, step: 0.5 },
            { id: "age_health", label: "Age", min: 18, max: 80, default: 40, step: 1 },
            { id: "blood_pressure", label: "Blood pressure", min: 60, max: 140, default: 95, step: 1 },
            { id: "family_history", label: "Family history", type: "select", options: ["No", "Yes"], default: "No" }
        ]
    },
    loan: {
        id: 'loan',
        name: "Loan Approval",
        description: "Predict loan approval likelihood from applicant data.",
        badge: "CLASSIFICATION",
        target: "Approval probability",
        unit: "%",
        features: [
            { id: "income", label: "Annual income (K)", min: 20, max: 200, default: 65, step: 1 },
            { id: "credit_score", label: "Credit score", min: 300, max: 850, default: 680, step: 5 },
            { id: "loan_amount", label: "Loan amount (K)", min: 10, max: 500, default: 150, step: 5 },
            { id: "employment_years", label: "Employment years", min: 0, max: 30, default: 5, step: 1 },
            { id: "debt_ratio", label: "Debt-to-income ratio", min: 0, max: 50, default: 25, step: 1 }
        ]
    },
    iris: {
        id: 'iris',
        name: "Iris Flower Classification",
        description: "Classify iris species from flower measurements.",
        badge: "CLASSIFICATION",
        target: "Species",
        unit: "",
        features: [
            { id: "sepal_length", label: "Sepal length (cm)", min: 4, max: 8, default: 5.8, step: 0.1 },
            { id: "sepal_width", label: "Sepal width (cm)", min: 2, max: 4.5, default: 3.0, step: 0.1 },
            { id: "petal_length", label: "Petal length (cm)", min: 1, max: 7, default: 4.5, step: 0.1 },
            { id: "petal_width", label: "Petal width (cm)", min: 0.1, max: 2.5, default: 1.5, step: 0.1 }
        ]
    }
};

const MODELS = {
    logistic: {
        id: 'logistic',
        name: "Logistic Regression",
        description: "Linear model that outputs probabilities for binary classification tasks."
    },
    random_forest: {
        id: 'random_forest',
        name: "Random Forest",
        description: "Ensemble of decision trees providing robust, non-linear predictions."
    },
    knn: {
        id: 'knn',
        name: "K-Nearest Neighbors",
        description: "Distance-based classifier that finds similar examples for prediction."
    }
};

// =========================================
// APPLICATION STATE
// =========================================

const state = {
    currentDataset: 'churn',
    currentModel: 'logistic',
    featureValues: {}
};

// =========================================
// DOM REFS
// =========================================

const DOM = {
    datasetGrid: document.getElementById('datasetGrid'),
    modelTabs: document.getElementById('modelTabs'),
    modelDesc: document.getElementById('modelDesc'),
    controlsBody: document.getElementById('controlsBody'),
    analyzeBtn: document.getElementById('analyze'),
    
    prediction: document.getElementById('prediction'),
    predictionUnit: document.getElementById('predictionUnit'),
    riskText: document.getElementById('riskText'),
    message: document.getElementById('message'),
    resultStatus: document.getElementById('resultStatus'),
    
    bar1: document.getElementById('bar1'),
    bar2: document.getElementById('bar2'),
    bar3: document.getElementById('bar3'),
    bar1Value: document.getElementById('bar1Value'),
    bar2Value: document.getElementById('bar2Value'),
    bar3Value: document.getElementById('bar3Value'),
    barLabel1: document.getElementById('barLabel1'),
    barLabel2: document.getElementById('barLabel2'),
    barLabel3: document.getElementById('barLabel3'),
    
    heroPrediction: document.getElementById('heroPrediction'),
    heroRisk: document.getElementById('heroRisk'),
    heroLabel: document.getElementById('heroLabel'),
    heroModel: document.getElementById('heroModel'),
    heroFeature1: document.getElementById('heroFeature1'),
    heroFeature2: document.getElementById('heroFeature2'),
    heroFeature3: document.getElementById('heroFeature3')
};

// =========================================
// RENDER FUNCTIONS
// =========================================

function renderDatasets() {
    DOM.datasetGrid.innerHTML = '';
    
    Object.entries(DATASETS).forEach(([key, dataset]) => {
        const card = document.createElement('button');
        card.className = `dataset-card ${key === state.currentDataset ? 'active' : ''}`;
        card.innerHTML = `
            <span class="badge">${dataset.badge}</span>
            <h4>${dataset.name}</h4>
            <p>${dataset.description}</p>
        `;
        
        card.addEventListener('click', () => {
            state.currentDataset = key;
            renderDatasets();
            renderControls();
            renderModelTabs();
            updateResult();
        });
        
        DOM.datasetGrid.appendChild(card);
    });
}

function renderModelTabs() {
    DOM.modelTabs.innerHTML = '';
    
    Object.entries(MODELS).forEach(([key, model]) => {
        const tab = document.createElement('button');
        tab.className = `model-tab ${key === state.currentModel ? 'active' : ''}`;
        tab.textContent = model.name;
        
        tab.addEventListener('click', () => {
            state.currentModel = key;
            renderModelTabs();
            updateResult();
        });
        
        DOM.modelTabs.appendChild(tab);
    });
    
    DOM.modelDesc.textContent = MODELS[state.currentModel].description;
}

function renderControls() {
    const dataset = DATASETS[state.currentDataset];
    DOM.controlsBody.innerHTML = '';
    
    dataset.features.forEach((feature) => {
        const control = document.createElement('div');
        control.className = 'control';
        
        const valueId = `feat_${feature.id}`;
        const currentValue = state.featureValues[feature.id] ?? feature.default;
        
        if (feature.type === 'select') {
            control.innerHTML = `
                <div class="control-title">
                    <label for="${valueId}">${feature.label}</label>
                </div>
                <select id="${valueId}">
                    ${feature.options.map(opt => 
                        `<option value="${opt}" ${opt === currentValue ? 'selected' : ''}>${opt}</option>`
                    ).join('')}
                </select>
            `;
            
            const select = control.querySelector('select');
            select.addEventListener('change', () => {
                state.featureValues[feature.id] = select.value;
            });
        } else {
            control.innerHTML = `
                <div class="control-title">
                    <label for="${valueId}">${feature.label}</label>
                    <strong id="${valueId}_display">${currentValue}</strong>
                </div>
                <input type="range" id="${valueId}" 
                       min="${feature.min}" max="${feature.max}" 
                       value="${currentValue}" step="${feature.step || 1}">
                <div class="range-values">
                    <span>${feature.min}</span>
                    <span>${feature.max}</span>
                </div>
            `;
            
            const input = control.querySelector('input');
            const display = control.querySelector(`#${valueId}_display`);
            
            input.addEventListener('input', () => {
                const val = parseFloat(input.value);
                display.textContent = val;
                state.featureValues[feature.id] = val;
            });
        }
        
        DOM.controlsBody.appendChild(control);
    });
    
    // Initialize feature values
    dataset.features.forEach((feature) => {
        const el = document.getElementById(`feat_${feature.id}`);
        if (el) {
            state.featureValues[feature.id] = feature.type === 'select' ? el.value : parseFloat(el.value);
        }
    });
}

// =========================================
// PREDICTION ENGINE (Simulated ML)
// =========================================

function calculatePrediction() {
    const dataset = DATASETS[state.currentDataset];
    const values = state.featureValues;
    
    switch (state.currentDataset) {
        case 'churn': {
            const charges = values.monthly_charges || 72;
            const tenure = values.tenure || 18;
            const contract = values.contract_type || 'Month-to-month';
            const dataUsage = values.data_usage || 15;
            const calls = values.support_calls || 2;
            
            let score = 30;
            score += (charges - 20) * 0.2;
            score += (30 - tenure) * 0.5;
            score += contract === 'Month-to-month' ? 15 : contract === 'One year' ? -5 : -12;
            score += dataUsage > 30 ? 8 : 0;
            score += calls > 3 ? 10 : 0;
            
            return { score: Math.round(Math.max(5, Math.min(95, score))), unit: '%' };
        }
        
        case 'housing': {
            const sqft = values.sqft || 1800;
            const bedrooms = parseInt(values.bedrooms) || 3;
            const bathrooms = parseFloat(values.bathrooms) || 2;
            const age = values.age || 15;
            const location = values.location_score || 6;
            
            let score = 150;
            score += (sqft - 1000) * 0.04;
            score += bedrooms * 15;
            score += bathrooms * 20;
            score -= age * 0.8;
            score += (location - 5) * 25;
            
            return { score: Math.round(Math.max(50, Math.min(450, score))), unit: 'K' };
        }
        
        case 'diabetes': {
            const glucose = values.glucose || 110;
            const bmi = values.bmi || 28;
            const age = values.age_health || 40;
            const bp = values.blood_pressure || 95;
            const history = values.family_history || 'No';
            
            let score = 10;
            score += (glucose - 80) * 0.4;
            score += (bmi - 20) * 1.2;
            score += (age - 20) * 0.5;
            score += bp > 120 ? 10 : 0;
            score += history === 'Yes' ? 18 : 0;
            
            return { score: Math.round(Math.max(5, Math.min(95, score))), unit: '%' };
        }
        
        case 'loan': {
            const income = values.income || 65;
            const credit = values.credit_score || 680;
            const loanAmt = values.loan_amount || 150;
            const employment = values.employment_years || 5;
            const debt = values.debt_ratio || 25;
            
            let score = 20;
            score += (credit - 500) * 0.12;
            score += (income - 30) * 0.3;
            score += employment * 2;
            score -= debt > 30 ? 15 : 0;
            score -= loanAmt > income * 3 ? 10 : 0;
            
            return { score: Math.round(Math.max(5, Math.min(95, score))), unit: '%' };
        }
        
        case 'iris': {
            const petalL = values.petal_length || 4.5;
            const petalW = values.petal_width || 1.5;
            
            if (petalL < 2.5) {
                return { score: 0, label: 'Setosa', confidence: 95, unit: '' };
            } else if (petalL < 5.0) {
                return { score: 0, label: petalW < 1.8 ? 'Versicolor' : 'Virginica', confidence: petalW < 1.8 ? 85 : 75, unit: '' };
            } else {
                return { score: 0, label: 'Virginica', confidence: 90, unit: '' };
            }
        }
        
        default:
            return { score: 50, unit: '%' };
    }
}

// =========================================
// UPDATE RESULT
// =========================================

function updateResult() {
    const dataset = DATASETS[state.currentDataset];
    const result = calculatePrediction();
    
    // Update hero
    DOM.heroLabel.textContent = dataset.target.toUpperCase();
    DOM.heroModel.textContent = MODELS[state.currentModel].name.toUpperCase();
    
    // Animate prediction
    DOM.prediction.style.transform = 'translateY(-8px)';
    setTimeout(() => {
        if (state.currentDataset === 'iris') {
            DOM.prediction.textContent = result.label;
        } else {
            DOM.prediction.textContent = result.score;
        }
        DOM.prediction.style.transform = 'translateY(0)';
    }, 150);
    
    DOM.predictionUnit.textContent = result.unit || dataset.unit;
    
    // Update hero prediction
    if (state.currentDataset === 'iris') {
        DOM.heroPrediction.textContent = result.label;
    } else {
        DOM.heroPrediction.textContent = result.score + (result.unit || dataset.unit);
    }
    
    // Update risk/result text
    if (state.currentDataset === 'iris') {
        DOM.riskText.textContent = `SPECIES: ${result.label}`;
        DOM.message.textContent = `Predicted with ${result.confidence}% confidence based on flower measurements.`;
        DOM.heroRisk.textContent = result.label;
    } else if (state.currentDataset === 'housing') {
        DOM.riskText.textContent = `ESTIMATED: $${result.score}K`;
        DOM.message.textContent = `Estimated house price of $${result.score}K based on property characteristics.`;
        DOM.heroRisk.textContent = `$${result.score}K`;
    } else {
        const score = result.score;
        if (score >= 70) {
            DOM.riskText.textContent = 'HIGH RISK';
            DOM.message.textContent = `High probability prediction based on current input values.`;
            DOM.heroRisk.textContent = 'HIGH';
        } else if (score >= 45) {
            DOM.riskText.textContent = 'MEDIUM RISK';
            DOM.message.textContent = `Moderate probability with mixed indicators.`;
            DOM.heroRisk.textContent = 'MEDIUM';
        } else {
            DOM.riskText.textContent = 'LOW RISK';
            DOM.message.textContent = `Low probability prediction based on current input values.`;
            DOM.heroRisk.textContent = 'LOW';
        }
    }
    
    // Update influence bars
    updateInfluenceBars(result);
    
    // Update hero feature bars
    updateHeroFeatures(result);
    
    DOM.resultStatus.textContent = 'UPDATED';
}

function updateInfluenceBars(result) {
    const dataset = DATASETS[state.currentDataset];
    const values = state.featureValues;
    
    const labels = {
        churn: ['Monthly charges', 'Contract type', 'Tenure'],
        housing: ['Square footage', 'Bedrooms', 'Location score'],
        diabetes: ['Glucose', 'BMI', 'Age'],
        loan: ['Credit score', 'Income', 'Debt ratio'],
        iris: ['Petal length', 'Petal width', 'Sepal length']
    };
    
    const barLabels = labels[state.currentDataset] || ['Feature 1', 'Feature 2', 'Feature 3'];
    DOM.barLabel1.textContent = barLabels[0];
    DOM.barLabel2.textContent = barLabels[1];
    DOM.barLabel3.textContent = barLabels[2];
    
    let influenceValues = [];
    
    switch (state.currentDataset) {
        case 'churn': {
            const charges = values.monthly_charges || 72;
            const contract = values.contract_type || 'Month-to-month';
            const tenure = values.tenure || 18;
            influenceValues = [
                Math.round(Math.min(95, (charges - 20) * 0.9)),
                contract === 'Month-to-month' ? 82 : contract === 'One year' ? 55 : 35,
                Math.round(Math.max(25, 90 - tenure))
            ];
            break;
        }
        case 'housing': {
            const sqft = values.sqft || 1800;
            const bedrooms = parseInt(values.bedrooms) || 3;
            const location = values.location_score || 6;
            influenceValues = [
                Math.round(Math.min(95, (sqft - 500) * 0.04 + 20)),
                Math.round(Math.min(90, bedrooms * 15 + 30)),
                Math.round(Math.min(95, (location - 1) * 12 + 10))
            ];
            break;
        }
        case 'diabetes': {
            const glucose = values.glucose || 110;
            const bmi = values.bmi || 28;
            const age = values.age_health || 40;
            influenceValues = [
                Math.round(Math.min(95, (glucose - 60) * 0.6)),
                Math.round(Math.min(95, (bmi - 15) * 1.5)),
                Math.round(Math.min(95, (age - 18) * 0.8))
            ];
            break;
        }
        case 'loan': {
            const credit = values.credit_score || 680;
            const income = values.income || 65;
            const debt = values.debt_ratio || 25;
            influenceValues = [
                Math.round(Math.min(95, (credit - 300) * 0.15)),
                Math.round(Math.min(95, (income - 20) * 0.5)),
                Math.round(Math.min(95, Math.max(20, 70 - debt * 0.5)))
            ];
            break;
        }
        case 'iris': {
            const petalL = values.petal_length || 4.5;
            const petalW = values.petal_width || 1.5;
            const sepalL = values.sepal_length || 5.8;
            influenceValues = [
                Math.round(Math.min(95, (petalL - 1) * 12 + 10)),
                Math.round(Math.min(95, (petalW - 0.1) * 15 + 10)),
                Math.round(Math.min(90, (sepalL - 4) * 10 + 10))
            ];
            break;
        }
        default: {
            influenceValues = [50, 50, 50];
        }
    }
    
    const bars = [DOM.bar1, DOM.bar2, DOM.bar3];
    const barValues = [DOM.bar1Value, DOM.bar2Value, DOM.bar3Value];
    
    influenceValues.forEach((val, i) => {
        if (bars[i]) {
            const clamped = Math.min(100, Math.round(val));
            bars[i].style.width = clamped + '%';
            barValues[i].textContent = clamped;
        }
    });
}

function updateHeroFeatures(result) {
    const values = state.featureValues;
    const labels = ['Monthly charges', 'Contract type', 'Tenure'];
    const heroFeatures = [DOM.heroFeature1, DOM.heroFeature2, DOM.heroFeature3];
    
    let influenceValues = [];
    
    if (state.currentDataset === 'churn') {
        const charges = values.monthly_charges || 72;
        const contract = values.contract_type || 'Month-to-month';
        const tenure = values.tenure || 18;
        influenceValues = [
            Math.round(Math.min(95, (charges - 20) * 0.9)),
            contract === 'Month-to-month' ? 82 : contract === 'One year' ? 55 : 35,
            Math.round(Math.max(25, 90 - tenure))
        ];
    } else {
        influenceValues = [50, 50, 50];
    }
    
    heroFeatures.forEach((el, i) => {
        if (el && influenceValues[i]) {
            const span = el.querySelector('span');
            const bar = el.querySelector('.line i');
            const b = el.querySelector('b');
            if (span) span.textContent = labels[i] || 'Feature';
            if (bar) bar.style.width = influenceValues[i] + '%';
            if (b) b.textContent = influenceValues[i];
        }
    });
}

// =========================================
// EVENT LISTENERS
// =========================================

DOM.analyzeBtn.addEventListener('click', function() {
    DOM.resultStatus.textContent = 'CALCULATING...';
    setTimeout(updateResult, 400);
});

// =========================================
// INITIALIZATION
// =========================================

function init() {
    renderDatasets();
    renderModelTabs();
    renderControls();
    updateResult();
    
    setTimeout(() => {
        const dataset = DATASETS[state.currentDataset];
        DOM.heroLabel.textContent = dataset.target.toUpperCase();
        DOM.heroModel.textContent = MODELS[state.currentModel].name.toUpperCase();
    }, 100);
}

document.addEventListener('DOMContentLoaded', init);