// GradePro - Advanced CGPA Calculator & Grade Predictor
// Developed by Suryansh Gupta
// Industry-ready, fully functional application

class GradePro {
    constructor() {
        this.universityData = this.initializeUniversityData();
        this.subjects = [];
        this.semesters = [];
        this.currentTheme = 'light';
        this.achievements = [];
        this.calculationHistory = [];
        this.currentSGPA = 0;
        this.isInitialized = false;
        
        // Ensure DOM is ready before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            console.log('🚀 Initializing GradePro...');
            
            // Initialize theme first
            this.initializeTheme();
            
            // Wait a bit for DOM to be fully ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Bind all event listeners
            this.bindEvents();
            
            // Initialize components
            this.initializeAchievements();
            this.initializeSubjects();
            this.populateUniversitiesGrid();
            
            // Load saved data
            this.loadSavedData();
            
            // Initialize charts
            this.initializeCharts();
            
            // Setup service worker for PWA
            this.setupServiceWorker();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ GradePro initialized successfully');
            this.showToast('🎓 Welcome to GradePro - India\'s #1 CGPA Calculator!', 'success');
            
        } catch (error) {
            console.error('❌ Error initializing GradePro:', error);
            this.showToast('Error loading application. Please refresh the page.', 'error');
        }
    }

    initializeUniversityData() {
        return {
            "universal": {
                "name": "Universal Formula",
                "location": "All Universities",
                "formula": "CGPA × 9.5",
                "scale": "10.0"
            },
            "AKTU": {
                "name": "Abdul Kalam Technical University",
                "location": "Uttar Pradesh",
                "formula": "(CGPA × 10) - 7.5",
                "scale": "10.0"
            },
            "AU": {
                "name": "Anna University",
                "location": "Tamil Nadu", 
                "formula": "CGPA × 9.5",
                "scale": "10.0"
            },
            "VTU": {
                "name": "Visvesvaraya Technological University",
                "location": "Karnataka",
                "formula": "CGPA × 10",
                "scale": "10.0"
            },
            "KTU": {
                "name": "Kerala Technological University",
                "location": "Kerala",
                "formula": "(CGPA × 10) - 3.75",
                "scale": "10.0"
            },
            "MU": {
                "name": "University of Mumbai",
                "location": "Maharashtra",
                "formula": "(CGPA × 7.1) + 11",
                "scale": "10.0"
            },
            "GTU": {
                "name": "Gujarat Technological University",
                "location": "Gujarat",
                "formula": "(CGPA - 0.5) × 10",
                "scale": "10.0"
            },
            "SPPU": {
                "name": "Savitribai Phule Pune University",
                "location": "Maharashtra",
                "formula": "(CGPA - 0.75) × 10 + 5",
                "scale": "10.0"
            },
            "BPUT": {
                "name": "Biju Patnaik University of Technology",
                "location": "Odisha",
                "formula": "CGPA × 10",
                "scale": "10.0"
            },
            "RGPV": {
                "name": "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
                "location": "Madhya Pradesh",
                "formula": "CGPA × 10",
                "scale": "10.0"
            },
            "DU": {
                "name": "Delhi University",
                "location": "Delhi",
                "formula": "(CGPA - 0.5) × 10",
                "scale": "10.0"
            },
            "JNTU": {
                "name": "Jawaharlal Nehru Technological University",
                "location": "Telangana",
                "formula": "(CGPA - 0.75) × 10",
                "scale": "10.0"
            }
        };
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('gradepro-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-toggle__icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    bindEvents() {
        console.log('🔗 Binding event listeners...');
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            console.log('✅ Theme toggle bound');
        }

        // University selection
        const universitySelect = document.getElementById('universitySelect');
        if (universitySelect) {
            universitySelect.addEventListener('change', (e) => {
                this.updateFormula(e.target.value);
                this.calculateCGPA();
            });
            console.log('✅ University select bound');
        }

        // CGPA input - Multiple event types for better responsiveness
        const cgpaInput = document.getElementById('cgpaInput');
        if (cgpaInput) {
            cgpaInput.addEventListener('input', () => this.calculateCGPA());
            cgpaInput.addEventListener('change', () => this.calculateCGPA());
            cgpaInput.addEventListener('keyup', () => this.calculateCGPA());
            cgpaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculateCGPA();
                }
            });
            console.log('✅ CGPA input bound');
        }

        // Calculate button
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.calculateCGPA();
            });
            console.log('✅ Calculate button bound');
        }

        // Subject management
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => this.addSubject());
        }

        const clearSubjectsBtn = document.getElementById('clearSubjectsBtn');
        if (clearSubjectsBtn) {
            clearSubjectsBtn.addEventListener('click', () => this.clearAllSubjects());
        }

        // Semester management
        const addSemesterBtn = document.getElementById('addSemesterBtn');
        if (addSemesterBtn) {
            addSemesterBtn.addEventListener('click', () => this.addSemester());
        }

        const clearAllBtn = document.getElementById('clearAllBtn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllSemesters());
        }

        // AI Prediction
        const predictBtn = document.getElementById('predictBtn');
        if (predictBtn) {
            predictBtn.addEventListener('click', () => this.generatePrediction());
        }

        // Export functions
        const exportPDFBtn = document.getElementById('exportPDFBtn');
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.exportToPDF());
        }

        const exportCSVBtn = document.getElementById('exportCSVBtn');
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.exportToCSV());
        }

        const saveHistoryBtn = document.getElementById('saveHistoryBtn');
        if (saveHistoryBtn) {
            saveHistoryBtn.addEventListener('click', () => this.saveToHistory());
        }

        const shareResultsBtn = document.getElementById('shareResultsBtn');
        if (shareResultsBtn) {
            shareResultsBtn.addEventListener('click', () => this.shareResults());
        }

        // Help FAB
        const helpFab = document.getElementById('helpFab');
        if (helpFab) {
            helpFab.addEventListener('click', () => this.showHelp());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.calculateCGPA();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveToHistory();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.addSubject();
                        break;
                }
            }
        });

        // Auto-save functionality
        setInterval(() => {
            this.autoSave();
        }, 30000); // Auto-save every 30 seconds
        
        console.log('✅ All event listeners bound successfully');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('gradepro-theme', this.currentTheme);
        this.updateThemeToggle();
        this.showToast(`🎨 Switched to ${this.currentTheme} theme`, 'info');
    }

    updateFormula(university) {
        console.log('🔄 Updating formula for:', university);
        const formulaDisplay = document.getElementById('formulaDisplay');
        if (!formulaDisplay) {
            console.warn('Formula display element not found');
            return;
        }
        
        const universityInfo = this.universityData[university];
        if (universityInfo) {
            formulaDisplay.innerHTML = `<small>Formula: ${universityInfo.formula}</small>`;
            console.log('✅ Formula updated:', universityInfo.formula);
        }
    }

    calculateCGPA() {
        console.log('🧮 Starting CGPA calculation...');
        
        const cgpaInput = document.getElementById('cgpaInput');
        const universitySelect = document.getElementById('universitySelect');
        const percentageResult = document.getElementById('percentageResult');
        
        if (!cgpaInput || !universitySelect || !percentageResult) {
            console.error('❌ Required elements not found:', {
                cgpaInput: !!cgpaInput,
                universitySelect: !!universitySelect,
                percentageResult: !!percentageResult
            });
            return;
        }
        
        const cgpaValue = cgpaInput.value.trim();
        const cgpa = parseFloat(cgpaValue);
        const university = universitySelect.value;
        
        console.log('📊 Calculation inputs:', { cgpa, university, cgpaValue });
        
        if (!cgpaValue || isNaN(cgpa) || cgpa <= 0) {
            percentageResult.textContent = '0.00%';
            console.log('⚠️ Invalid CGPA input, showing 0.00%');
            return;
        }

        if (cgpa > 10) {
            this.showToast('⚠️ CGPA cannot be greater than 10.0', 'error');
            cgpaInput.value = '10.0';
            return;
        }

        const percentage = this.calculateUniversitySpecificPercentage(cgpa, university);
        console.log('📈 Calculated percentage:', percentage);
        
        // Ensure percentage is within valid range
        const finalPercentage = Math.max(0, Math.min(100, percentage));
        
        percentageResult.textContent = `${finalPercentage.toFixed(2)}%`;
        console.log('✅ Percentage updated to:', finalPercentage.toFixed(2) + '%');
        
        // Add visual feedback
        this.addRippleEffect(percentageResult);
        
        // Save calculation to history
        this.addToHistory({
            cgpa: cgpa,
            percentage: finalPercentage,
            university: university,
            timestamp: new Date().toISOString()
        });

        // Check for achievements
        this.checkAchievements(cgpa, finalPercentage);
        
        // Show success message for first calculation
        if (this.calculationHistory.length === 1) {
            this.showToast('🎯 First calculation completed!', 'success');
        }
    }

    calculateUniversitySpecificPercentage(cgpa, university) {
        console.log('🏛️ Calculating for university:', university, 'CGPA:', cgpa);
        
        const universityInfo = this.universityData[university];
        if (!universityInfo) {
            console.warn('University not found, using universal formula');
            return cgpa * 9.5;
        }

        let result;
        try {
            switch (university) {
                case 'universal':
                    result = cgpa * 9.5;
                    break;
                case 'AKTU':
                    result = (cgpa * 10) - 7.5;
                    break;
                case 'AU':
                    result = cgpa * 9.5;
                    break;
                case 'VTU':
                    result = cgpa * 10;
                    break;
                case 'KTU':
                    result = (cgpa * 10) - 3.75;
                    break;
                case 'MU':
                    result = (cgpa * 7.1) + 11;
                    break;
                case 'GTU':
                    result = (cgpa - 0.5) * 10;
                    break;
                case 'SPPU':
                    result = (cgpa - 0.75) * 10 + 5;
                    break;
                case 'BPUT':
                    result = cgpa * 10;
                    break;
                case 'RGPV':
                    result = cgpa * 10;
                    break;
                case 'DU':
                    result = (cgpa - 0.5) * 10;
                    break;
                case 'JNTU':
                    result = (cgpa - 0.75) * 10;
                    break;
                default:
                    result = cgpa * 9.5;
            }
            console.log('✅ University-specific calculation result:', result);
            return result;
        } catch (error) {
            console.error('Error calculating percentage:', error);
            return cgpa * 9.5;
        }
    }

    initializeSubjects() {
        this.addSubject(); // Add one default subject
    }

    addSubject() {
        const subject = {
            id: Date.now() + Math.random(),
            name: '',
            grade: '',
            credits: 3
        };
        
        this.subjects.push(subject);
        this.renderSubjects();
        this.showToast('📚 Subject added', 'success');
    }

    renderSubjects() {
        const subjectsGrid = document.getElementById('subjectsGrid');
        if (!subjectsGrid) return;
        
        subjectsGrid.innerHTML = '';
        
        this.subjects.forEach(subject => {
            const subjectCard = this.createSubjectCard(subject);
            subjectsGrid.appendChild(subjectCard);
        });
        
        this.calculateSGPA();
    }

    createSubjectCard(subject) {
        const card = document.createElement('div');
        card.className = 'subject-card glass';
        card.innerHTML = `
            <div class="subject-row">
                <input type="text" class="form-control" placeholder="Subject Name" 
                       value="${subject.name}" 
                       onchange="window.gradePro.updateSubject(${subject.id}, 'name', this.value)">
                <select class="form-control" onchange="window.gradePro.updateSubject(${subject.id}, 'grade', this.value)">
                    <option value="">Grade</option>
                    <option value="10" ${subject.grade === '10' ? 'selected' : ''}>O (10)</option>
                    <option value="9" ${subject.grade === '9' ? 'selected' : ''}>A+ (9)</option>
                    <option value="8" ${subject.grade === '8' ? 'selected' : ''}>A (8)</option>
                    <option value="7" ${subject.grade === '7' ? 'selected' : ''}>B+ (7)</option>
                    <option value="6" ${subject.grade === '6' ? 'selected' : ''}>B (6)</option>
                    <option value="5" ${subject.grade === '5' ? 'selected' : ''}>C (5)</option>
                    <option value="4" ${subject.grade === '4' ? 'selected' : ''}>D (4)</option>
                    <option value="0" ${subject.grade === '0' ? 'selected' : ''}>F (0)</option>
                </select>
                <input type="number" class="form-control" placeholder="Credits" min="1" max="6" 
                       value="${subject.credits}" 
                       onchange="window.gradePro.updateSubject(${subject.id}, 'credits', this.value)">
                <button class="subject-remove" onclick="window.gradePro.removeSubject(${subject.id})" 
                        aria-label="Remove subject">×</button>
            </div>
        `;
        return card;
    }

    updateSubject(subjectId, field, value) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (subject) {
            subject[field] = field === 'credits' || field === 'grade' ? parseFloat(value) || 0 : value;
            this.calculateSGPA();
            this.autoSave();
        }
    }

    removeSubject(subjectId) {
        this.subjects = this.subjects.filter(s => s.id !== subjectId);
        this.renderSubjects();
        this.showToast('🗑️ Subject removed', 'info');
    }

    clearAllSubjects() {
        this.subjects = [];
        this.renderSubjects();
        this.showToast('🧹 All subjects cleared', 'info');
    }

    calculateSGPA() {
        if (this.subjects.length === 0) {
            this.currentSGPA = 0;
            this.updateSGPADisplay(0);
            return;
        }

        let totalCredits = 0;
        let totalGradePoints = 0;

        this.subjects.forEach(subject => {
            if (subject.grade && subject.credits) {
                const gradePoints = parseFloat(subject.grade) * parseFloat(subject.credits);
                totalGradePoints += gradePoints;
                totalCredits += parseFloat(subject.credits);
            }
        });

        const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
        this.currentSGPA = sgpa;
        this.updateSGPADisplay(sgpa);
        
        // Update CGPA input if it's empty
        const cgpaInput = document.getElementById('cgpaInput');
        if (cgpaInput && !cgpaInput.value && sgpa > 0) {
            cgpaInput.value = sgpa.toFixed(2);
            this.calculateCGPA();
        }
    }

    updateSGPADisplay(sgpa) {
        const sgpaValue = document.getElementById('currentSGPA');
        if (sgpaValue) {
            sgpaValue.textContent = sgpa.toFixed(2);
            
            // Add color coding based on SGPA
            sgpaValue.className = 'sgpa-value';
            if (sgpa >= 8.5) {
                sgpaValue.style.color = 'var(--color-success)';
            } else if (sgpa >= 7.0) {
                sgpaValue.style.color = 'var(--color-warning)';
            } else if (sgpa > 0) {
                sgpaValue.style.color = 'var(--color-error)';
            } else {
                sgpaValue.style.color = 'var(--color-text-secondary)';
            }
        }
    }

    addSemester() {
        const semesterNumber = this.semesters.length + 1;
        const semester = {
            id: Date.now(),
            number: semesterNumber,
            sgpa: 0,
            credits: 0,
            subjects: []
        };
        
        this.semesters.push(semester);
        this.renderSemesters();
        this.showToast(`📅 Semester ${semesterNumber} added`, 'success');
    }

    renderSemesters() {
        const semestersGrid = document.getElementById('semestersGrid');
        if (!semestersGrid) return;
        
        semestersGrid.innerHTML = '';
        
        this.semesters.forEach(semester => {
            const semesterCard = this.createSemesterCard(semester);
            semestersGrid.appendChild(semesterCard);
        });
    }

    createSemesterCard(semester) {
        const card = document.createElement('div');
        card.className = 'semester-card glass';
        card.innerHTML = `
            <div class="semester-header">
                <h4 class="semester-title">Semester ${semester.number}</h4>
                <button class="semester-remove" onclick="window.gradePro.removeSemester(${semester.id})" 
                        aria-label="Remove semester">×</button>
            </div>
            <div class="semester-content">
                <div class="form-group">
                    <label class="form-label">SGPA</label>
                    <input type="number" class="form-control glass" placeholder="8.5" min="0" max="10" step="0.01" 
                           value="${semester.sgpa || ''}"
                           onchange="window.gradePro.updateSemesterSGPA(${semester.id}, this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Credits</label>
                    <input type="number" class="form-control glass" placeholder="24" min="0" max="30" 
                           value="${semester.credits || ''}"
                           onchange="window.gradePro.updateSemesterCredits(${semester.id}, this.value)">
                </div>
                <div class="semester-stats">
                    <div class="stat-item">
                        <span class="stat-label">Grade:</span>
                        <span class="stat-value">${this.getGradeFromSGPA(semester.sgpa)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Points:</span>
                        <span class="stat-value">${(semester.sgpa * semester.credits).toFixed(1)}</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    updateSemesterSGPA(semesterId, sgpa) {
        const semester = this.semesters.find(s => s.id === semesterId);
        if (semester) {
            semester.sgpa = parseFloat(sgpa) || 0;
            this.renderSemesters();
            this.updateOverallCGPA();
            this.autoSave();
        }
    }

    updateSemesterCredits(semesterId, credits) {
        const semester = this.semesters.find(s => s.id === semesterId);
        if (semester) {
            semester.credits = parseFloat(credits) || 0;
            this.renderSemesters();
            this.updateOverallCGPA();
            this.autoSave();
        }
    }

    removeSemester(semesterId) {
        this.semesters = this.semesters.filter(s => s.id !== semesterId);
        // Renumber semesters
        this.semesters.forEach((semester, index) => {
            semester.number = index + 1;
        });
        this.renderSemesters();
        this.updateOverallCGPA();
        this.showToast('🗑️ Semester removed', 'info');
    }

    clearAllSemesters() {
        this.semesters = [];
        this.renderSemesters();
        this.updateOverallCGPA();
        this.showToast('🧹 All semesters cleared', 'info');
    }

    updateOverallCGPA() {
        if (this.semesters.length === 0) return;
        
        let totalCredits = 0;
        let totalGradePoints = 0;
        
        this.semesters.forEach(semester => {
            if (semester.sgpa && semester.credits) {
                totalGradePoints += semester.sgpa * semester.credits;
                totalCredits += semester.credits;
            }
        });
        
        if (totalCredits > 0) {
            const overallCGPA = totalGradePoints / totalCredits;
            const cgpaInput = document.getElementById('cgpaInput');
            if (cgpaInput) {
                cgpaInput.value = overallCGPA.toFixed(2);
                this.calculateCGPA();
            }
        }
    }

    generatePrediction() {
        const targetCGPA = parseFloat(document.getElementById('targetCGPA')?.value);
        const remainingSemesters = parseInt(document.getElementById('remainingSemesters')?.value);
        const predictionResults = document.getElementById('predictionResults');
        
        if (!targetCGPA || !remainingSemesters || !predictionResults) {
            this.showToast('⚠️ Please enter target CGPA and remaining semesters', 'error');
            return;
        }

        if (targetCGPA > 10) {
            this.showToast('⚠️ Target CGPA cannot be greater than 10.0', 'error');
            return;
        }

        this.showLoading();
        
        // Simulate AI processing with realistic delay
        setTimeout(() => {
            const currentCGPA = this.calculateCurrentCGPA();
            const requiredSGPA = this.calculateRequiredSGPA(currentCGPA, targetCGPA, remainingSemesters);
            const probability = this.calculateAchievementProbability(requiredSGPA);
            const difficulty = this.getDifficultyLevel(probability);
            
            predictionResults.innerHTML = `
                <div class="prediction-result">
                    <h4>🎯 AI Prediction Results</h4>
                    <div class="prediction-metrics">
                        <div class="metric glass">
                            <span class="metric-label">Current CGPA:</span>
                            <span class="metric-value">${currentCGPA.toFixed(2)}</span>
                        </div>
                        <div class="metric glass">
                            <span class="metric-label">Required SGPA:</span>
                            <span class="metric-value ${requiredSGPA > 10 ? 'text-error' : requiredSGPA > 8.5 ? 'text-warning' : 'text-success'}">${requiredSGPA.toFixed(2)}</span>
                        </div>
                        <div class="metric glass">
                            <span class="metric-label">Achievement Probability:</span>
                            <span class="metric-value ${probability >= 70 ? 'text-success' : probability >= 40 ? 'text-warning' : 'text-error'}">${probability}%</span>
                        </div>
                        <div class="metric glass">
                            <span class="metric-label">Difficulty Level:</span>
                            <span class="metric-value">${difficulty}</span>
                        </div>
                    </div>
                    <div class="prediction-advice">
                        <h5>📋 AI Recommendations:</h5>
                        <ul>
                            ${this.generateRecommendations(requiredSGPA, probability).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            this.hideLoading();
            this.showToast('🤖 AI prediction generated successfully', 'success');
            this.unlockAchievement('ai_predictor');
        }, 2000);
    }

    calculateCurrentCGPA() {
        if (this.semesters.length === 0) {
            // Use current SGPA if no semesters
            return this.currentSGPA || 0;
        }
        
        let totalCredits = 0;
        let totalGradePoints = 0;
        
        this.semesters.forEach(semester => {
            if (semester.sgpa && semester.credits) {
                totalGradePoints += semester.sgpa * semester.credits;
                totalCredits += semester.credits;
            }
        });
        
        return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    }

    calculateRequiredSGPA(currentCGPA, targetCGPA, remainingSemesters) {
        const totalSemesters = this.semesters.length + remainingSemesters;
        if (totalSemesters === 0) return targetCGPA;
        
        const requiredTotalPoints = targetCGPA * totalSemesters;
        const currentTotalPoints = currentCGPA * this.semesters.length;
        const requiredPoints = requiredTotalPoints - currentTotalPoints;
        
        return remainingSemesters > 0 ? (requiredPoints / remainingSemesters) : 0;
    }

    calculateAchievementProbability(requiredSGPA) {
        if (requiredSGPA <= 0) return 100;
        if (requiredSGPA <= 6.0) return 95;
        if (requiredSGPA <= 7.0) return 85;
        if (requiredSGPA <= 8.0) return 70;
        if (requiredSGPA <= 8.5) return 55;
        if (requiredSGPA <= 9.0) return 35;
        if (requiredSGPA <= 9.5) return 20;
        if (requiredSGPA <= 10.0) return 10;
        return 2;
    }

    getDifficultyLevel(probability) {
        if (probability >= 80) return '🟢 Easy';
        if (probability >= 60) return '🟡 Moderate';
        if (probability >= 40) return '🟠 Challenging';
        if (probability >= 20) return '🔴 Very Hard';
        return '⚫ Nearly Impossible';
    }

    generateRecommendations(requiredSGPA, probability) {
        const recommendations = [];
        
        if (requiredSGPA > 10) {
            recommendations.push('<li>❌ Target impossible with current progress - consider extending timeline</li>');
            recommendations.push('<li>📊 Review and adjust your target CGPA to be more realistic</li>');
        } else if (requiredSGPA <= 7.0) {
            recommendations.push('<li>✅ Target is highly achievable with consistent effort</li>');
            recommendations.push('<li>📚 Maintain regular study schedule and attend classes</li>');
            recommendations.push('<li>🎯 Focus on understanding concepts rather than memorization</li>');
        } else if (requiredSGPA <= 8.5) {
            recommendations.push('<li>⚡ Requires dedicated effort but very achievable</li>');
            recommendations.push('<li>📖 Consider additional study resources and practice tests</li>');
            recommendations.push('<li>👥 Form study groups for collaborative learning</li>');
            recommendations.push('<li>🕒 Allocate 2-3 hours daily for focused study</li>');
        } else if (requiredSGPA <= 9.5) {
            recommendations.push('<li>🔥 Challenging target requiring exceptional dedication</li>');
            recommendations.push('<li>💪 Seek academic support and tutoring if needed</li>');
            recommendations.push('<li>📋 Create detailed study plan with daily goals</li>');
            recommendations.push('<li>🎯 Focus heavily on high-credit subjects</li>');
            recommendations.push('<li>📞 Consider professor office hours for clarification</li>');
        } else {
            recommendations.push('<li>🚀 Elite performance required - maximum effort needed</li>');
            recommendations.push('<li>🎓 Consider academic coaching or mentorship</li>');
            recommendations.push('<li>⏰ Dedicate 4-5 hours daily to intensive study</li>');
            recommendations.push('<li>🔬 Aim for perfection in assignments and projects</li>');
        }
        
        return recommendations;
    }

    initializeAchievements() {
        this.achievements = [
            { id: 'first_calc', icon: '🎯', label: 'First Calculator', description: 'Made your first calculation', unlocked: false },
            { id: 'high_achiever', icon: '🏆', label: 'High Achiever', description: 'CGPA above 8.5', unlocked: false },
            { id: 'consistent', icon: '📊', label: 'Consistent Performer', description: 'Added 5+ semesters', unlocked: false },
            { id: 'ai_predictor', icon: '🤖', label: 'AI Predictor', description: 'Used AI prediction feature', unlocked: false },
            { id: 'data_export', icon: '📄', label: 'Data Exporter', description: 'Exported your data', unlocked: false },
            { id: 'semester_master', icon: '📚', label: 'Semester Master', description: 'Completed 8 semesters', unlocked: false },
            { id: 'perfectionist', icon: '💎', label: 'Perfectionist', description: 'Achieved 10.0 CGPA', unlocked: false },
            { id: 'explorer', icon: '🗺️', label: 'University Explorer', description: 'Tried 5+ universities', unlocked: false }
        ];
        
        this.renderBadges();
    }

    renderBadges() {
        const badgesContainer = document.getElementById('badgesContainer');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '';
        
        this.achievements.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge glass ${badge.unlocked ? '' : 'badge--locked'}`;
            badgeElement.title = badge.description;
            badgeElement.innerHTML = `
                <span class="badge__icon">${badge.icon}</span>
                <span class="badge__label">${badge.label}</span>
            `;
            badgesContainer.appendChild(badgeElement);
        });
    }

    checkAchievements(cgpa, percentage) {
        let newAchievements = [];
        
        // First calculation
        if (!this.achievements.find(a => a.id === 'first_calc').unlocked) {
            this.unlockAchievement('first_calc');
            newAchievements.push('First Calculator');
        }
        
        // High achiever (8.5+ CGPA)
        if (cgpa >= 8.5 && !this.achievements.find(a => a.id === 'high_achiever').unlocked) {
            this.unlockAchievement('high_achiever');
            newAchievements.push('High Achiever');
        }
        
        // Perfectionist (10.0 CGPA)
        if (cgpa >= 10.0 && !this.achievements.find(a => a.id === 'perfectionist').unlocked) {
            this.unlockAchievement('perfectionist');
            newAchievements.push('Perfectionist');
        }
        
        // Consistent performer (5+ semesters)
        if (this.semesters.length >= 5 && !this.achievements.find(a => a.id === 'consistent').unlocked) {
            this.unlockAchievement('consistent');
            newAchievements.push('Consistent Performer');
        }
        
        // Semester master (8 semesters)
        if (this.semesters.length >= 8 && !this.achievements.find(a => a.id === 'semester_master').unlocked) {
            this.unlockAchievement('semester_master');
            newAchievements.push('Semester Master');
        }
        
        // Show achievement notifications
        newAchievements.forEach(achievement => {
            this.showToast(`🏆 Achievement Unlocked: ${achievement}!`, 'success');
        });
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.renderBadges();
            this.saveData();
        }
    }

    populateUniversitiesGrid() {
        const universitiesGrid = document.getElementById('universitiesGrid');
        if (!universitiesGrid) return;
        
        universitiesGrid.innerHTML = '';
        
        Object.entries(this.universityData).forEach(([code, university]) => {
            if (code === 'universal') return; // Skip universal option
            
            const universityCard = document.createElement('div');
            universityCard.className = 'university-card glass hover-lift';
            universityCard.innerHTML = `
                <div class="university-card__icon">🏛️</div>
                <h3 class="university-card__name">${university.name}</h3>
                <p class="university-card__location">📍 ${university.location}</p>
                <div class="university-card__formula">${university.formula}</div>
            `;
            
            universityCard.addEventListener('click', () => {
                const universitySelect = document.getElementById('universitySelect');
                if (universitySelect) {
                    universitySelect.value = code;
                    this.updateFormula(code);
                    this.calculateCGPA();
                    this.showToast(`🏛️ Selected ${university.name}`, 'info');
                }
            });
            
            universitiesGrid.appendChild(universityCard);
        });
    }

    initializeCharts() {
        const gradeChart = document.getElementById('gradeChart');
        if (gradeChart) {
            this.drawSimpleChart(gradeChart.getContext('2d'), gradeChart.width, gradeChart.height);
        }
    }

    drawSimpleChart(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        
        // Background
        ctx.fillStyle = 'rgba(79, 172, 254, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Chart elements
        if (this.subjects.length > 0) {
            const gradeCounts = { 'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
            
            this.subjects.forEach(subject => {
                const grade = this.getGradeFromPoints(subject.grade);
                if (gradeCounts.hasOwnProperty(grade)) {
                    gradeCounts[grade]++;
                }
            });
            
            // Simple bar chart
            const grades = Object.keys(gradeCounts);
            const maxCount = Math.max(...Object.values(gradeCounts), 1);
            const barWidth = width / grades.length;
            
            grades.forEach((grade, index) => {
                const barHeight = (gradeCounts[grade] / maxCount) * (height - 40);
                const x = index * barWidth;
                const y = height - barHeight - 20;
                
                // Bar
                ctx.fillStyle = this.getGradeColor(grade);
                ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
                
                // Label
                ctx.fillStyle = '#333';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(grade, x + barWidth / 2, height - 5);
                ctx.fillText(gradeCounts[grade], x + barWidth / 2, y - 5);
            });
        } else {
            // Placeholder
            ctx.fillStyle = '#666';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Add subjects to see grade distribution', width / 2, height / 2);
        }
    }

    getGradeFromPoints(points) {
        const p = parseFloat(points);
        if (p >= 10) return 'O';
        if (p >= 9) return 'A+';
        if (p >= 8) return 'A';
        if (p >= 7) return 'B+';
        if (p >= 6) return 'B';
        if (p >= 5) return 'C';
        if (p >= 4) return 'D';
        return 'F';
    }

    getGradeFromSGPA(sgpa) {
        if (sgpa >= 9.5) return 'O';
        if (sgpa >= 8.5) return 'A+';
        if (sgpa >= 7.5) return 'A';
        if (sgpa >= 6.5) return 'B+';
        if (sgpa >= 5.5) return 'B';
        if (sgpa >= 4.5) return 'C';
        if (sgpa >= 4.0) return 'D';
        return 'F';
    }

    getGradeColor(grade) {
        const colors = {
            'O': '#4CAF50',
            'A+': '#8BC34A',
            'A': '#CDDC39',
            'B+': '#FFEB3B',
            'B': '#FFC107',
            'C': '#FF9800',
            'D': '#FF5722',
            'F': '#F44336'
        };
        return colors[grade] || '#999';
    }

    exportToPDF() {
        this.showLoading();
        
        setTimeout(() => {
            const data = this.generateReportData();
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `gradepro-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.hideLoading();
            this.showToast('📄 Report exported successfully', 'success');
            this.unlockAchievement('data_export');
        }, 1000);
    }

    exportToCSV() {
        const data = this.generateCSVData();
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gradepro-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('📊 Data exported to CSV', 'success');
        this.unlockAchievement('data_export');
    }

    generateReportData() {
        return {
            generatedBy: 'GradePro - India\'s #1 CGPA Calculator',
            timestamp: new Date().toISOString(),
            currentCGPA: this.calculateCurrentCGPA(),
            currentSGPA: this.currentSGPA,
            subjects: this.subjects,
            semesters: this.semesters,
            achievements: this.achievements.filter(a => a.unlocked),
            calculationHistory: this.calculationHistory.slice(-20),
            summary: {
                totalSubjects: this.subjects.length,
                totalSemesters: this.semesters.length,
                unlockedAchievements: this.achievements.filter(a => a.unlocked).length
            }
        };
    }

    generateCSVData() {
        let csv = 'Type,Name,Grade/SGPA,Credits,Points\n';
        
        // Add subjects
        this.subjects.forEach(subject => {
            csv += `Subject,"${subject.name}",${subject.grade},${subject.credits},${(subject.grade * subject.credits).toFixed(2)}\n`;
        });
        
        // Add semesters
        this.semesters.forEach(semester => {
            csv += `Semester,Semester ${semester.number},${semester.sgpa},${semester.credits},${(semester.sgpa * semester.credits).toFixed(2)}\n`;
        });
        
        return csv;
    }

    saveToHistory() {
        const cgpa = parseFloat(document.getElementById('cgpaInput')?.value);
        const university = document.getElementById('universitySelect')?.value;
        
        if (!cgpa) {
            this.showToast('⚠️ Please enter a CGPA to save', 'error');
            return;
        }
        
        const percentage = this.calculateUniversitySpecificPercentage(cgpa, university);
        
        this.addToHistory({
            cgpa: cgpa,
            percentage: percentage,
            university: university,
            subjects: [...this.subjects],
            semesters: [...this.semesters],
            timestamp: new Date().toISOString()
        });
        
        this.showToast('💾 Calculation saved to history', 'success');
    }

    shareResults() {
        const cgpa = parseFloat(document.getElementById('cgpaInput')?.value);
        const percentage = document.getElementById('percentageResult')?.textContent;
        const university = document.getElementById('universitySelect')?.selectedOptions[0]?.textContent;
        
        if (!cgpa) {
            this.showToast('⚠️ Please calculate CGPA first', 'error');
            return;
        }
        
        const shareText = `🎓 My CGPA: ${cgpa}/10.0\n📊 Percentage: ${percentage}\n🏛️ University: ${university}\n\nCalculated using GradePro - India's #1 CGPA Calculator\n#GradePro #CGPA #AcademicSuccess`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My CGPA Results - GradePro',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('🔗 Results copied to clipboard', 'success');
            }).catch(() => {
                this.showToast('❌ Failed to copy results', 'error');
            });
        }
    }

    showHelp() {
        const helpContent = `
            <div style="max-width: 400px; text-align: left;">
                <h3>🎓 GradePro Help</h3>
                <div style="margin: 16px 0;">
                    <h4>🚀 Quick Start:</h4>
                    <p>1. Select your university<br>
                    2. Enter your CGPA<br>
                    3. Get instant percentage conversion</p>
                </div>
                <div style="margin: 16px 0;">
                    <h4>⌨️ Keyboard Shortcuts:</h4>
                    <p>• Ctrl+Enter: Calculate<br>
                    • Ctrl+S: Save to history<br>
                    • Ctrl+N: Add subject</p>
                </div>
                <div style="margin: 16px 0;">
                    <h4>🎯 Features:</h4>
                    <p>• AI grade prediction<br>
                    • Subject-wise tracking<br>
                    • Achievement system<br>
                    • Data export</p>
                </div>
                <div style="margin: 16px 0;">
                    <small>Developed with ❤️ by Suryansh Gupta</small>
                </div>
            </div>
        `;
        
        // Create modal (simplified)
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; color: var(--color-text);
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--glass-bg); backdrop-filter: var(--glass-backdrop);
            border: 1px solid var(--glass-border); border-radius: 16px;
            padding: 24px; box-shadow: var(--glass-shadow);
        `;
        content.innerHTML = helpContent;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute; top: 16px; right: 16px;
            background: none; border: none; font-size: 20px;
            cursor: pointer; color: var(--color-text);
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        content.style.position = 'relative';
        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };
    }

    addToHistory(calculation) {
        this.calculationHistory.unshift(calculation);
        if (this.calculationHistory.length > 100) {
            this.calculationHistory = this.calculationHistory.slice(0, 100);
        }
        this.saveData();
    }

    addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute; border-radius: 50%;
            transform: scale(0); animation: ripple 0.6s linear;
            background-color: rgba(255, 255, 255, 0.7);
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    autoSave() {
        if (this.isInitialized) {
            this.saveData();
        }
    }

    saveData() {
        try {
            const data = {
                subjects: this.subjects,
                semesters: this.semesters,
                achievements: this.achievements,
                calculationHistory: this.calculationHistory,
                theme: this.currentTheme,
                version: '2.0.0',
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('gradepro-data', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('⚠️ Failed to save data locally', 'error');
        }
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('gradepro-data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.subjects = data.subjects || [];
                this.semesters = data.semesters || [];
                this.achievements = data.achievements || this.achievements;
                this.calculationHistory = data.calculationHistory || [];
                
                this.renderSubjects();
                this.renderSemesters();
                this.renderBadges();
                
                console.log('✅ Data loaded successfully');
                if (data.lastSaved) {
                    const lastSaved = new Date(data.lastSaved).toLocaleDateString();
                    this.showToast(`📁 Data loaded from ${lastSaved}`, 'info');
                }
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            this.showToast('⚠️ Failed to load saved data', 'error');
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} glass`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">×</button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// CSS Animation for toast slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
let gradePro;

// Ensure proper initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gradePro = new GradePro();
        window.gradePro = gradePro;
    });
} else {
    gradePro = new GradePro();
    window.gradePro = gradePro;
}

// Performance monitoring
window.addEventListener('load', () => {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`🚀 GradePro loaded in ${loadTime}ms`);
        
        if (loadTime < 2000 && window.gradePro) {
            window.gradePro.showToast('⚡ Lightning fast loading!', 'success');
        }
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e);
    if (window.gradePro) {
        window.gradePro.showToast('⚠️ An error occurred. Please refresh if issues persist.', 'error');
    }
});

// Offline/Online status
window.addEventListener('online', () => {
    if (window.gradePro) {
        window.gradePro.showToast('🌐 Back online!', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.gradePro) {
        window.gradePro.showToast('📱 Working offline', 'info');
    }
});

// Test function for debugging
window.testCalculation = function() {
    console.log('🧪 Testing calculation...');
    const cgpaInput = document.getElementById('cgpaInput');
    const universitySelect = document.getElementById('universitySelect');
    
    if (cgpaInput && universitySelect) {
        cgpaInput.value = '8.5';
        universitySelect.value = 'AKTU';
        
        if (window.gradePro) {
            window.gradePro.calculateCGPA();
            console.log('✅ Test calculation completed');
        }
    }
};