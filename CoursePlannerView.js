// CoursePlannerView Component
// This component helps students plan their remaining semesters to reach 162 credits for graduation

const CoursePlannerView = ({ completedSemesters, courseCatalog, onUpdatePlan }) => {
    const [coursePlan, setCoursePlan] = useState({
        semesters: {
            6: [],
            7: [],
            8: []
        }
    });
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [completedCredits, setCompletedCredits] = useState({});
    const [recommendations, setRecommendations] = useState([]);

    // Calculate completed credits on mount and when completedSemesters changes
    useEffect(() => {
        if (completedSemesters && completedSemesters.length > 0) {
            const credits = calculateCompletedCategoryCredits(completedSemesters);
            setCompletedCredits(credits);

            if (courseCatalog) {
                const recs = getCourseRecommendations(credits, courseCatalog);
                setRecommendations(recs);
            }
        }
    }, [completedSemesters, courseCatalog]);

    // Load saved plan from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('coursePlan_v1');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCoursePlan(parsed);
            } catch (e) {
                console.error('Failed to load course plan:', e);
            }
        }
    }, []);

    // Save plan to localStorage
    useEffect(() => {
        localStorage.setItem('coursePlan_v1', JSON.stringify(coursePlan));
        if (onUpdatePlan) {
            onUpdatePlan(coursePlan);
        }
    }, [coursePlan, onUpdatePlan]);

    const handleAddCourse = (semesterNumber, course) => {
        setCoursePlan(prev => ({
            ...prev,
            semesters: {
                ...prev.semesters,
                [semesterNumber]: [...(prev.semesters[semesterNumber] || []), course]
            }
        }));

        // Auto-add BEXC100N to next semester if added
        if (course.code === 'BEXC100N' && semesterNumber < 8) {
            setTimeout(() => {
                setCoursePlan(prev => ({
                    ...prev,
                    semesters: {
                        ...prev.semesters,
                        [semesterNumber + 1]: [...(prev.semesters[semesterNumber + 1] || []), {
                            ...course,
                            autoAdded: true,
                            note: 'Auto-added (BEXC100N spans 2 semesters)'
                        }]
                    }
                }));
            }, 100);
        }
    };

    const handleRemoveCourse = (semesterNumber, courseIndex) => {
        setCoursePlan(prev => ({
            ...prev,
            semesters: {
                ...prev.semesters,
                [semesterNumber]: prev.semesters[semesterNumber].filter((_, idx) => idx !== courseIndex)
            }
        }));
    };

    const openCourseModal = (semesterNumber) => {
        setSelectedSemester(semesterNumber);
        setIsModalOpen(true);
    };

    const closeCourseModal = () => {
        setIsModalOpen(false);
        setSelectedSemester(null);
        setSearchQuery('');
        setSelectedCategory('ALL');
    };

    // Calculate total credits including planned
    const calculateTotalCredits = () => {
        const planned = { ...completedCredits };

        Object.values(coursePlan.semesters).forEach(semester => {
            semester.forEach(course => {
                if (planned[course.category] !== undefined) {
                    planned[course.category] += course.credits;
                }
            });
        });

        return planned;
    };

    const totalCredits = calculateTotalCredits();
    const totalEarned = Object.values(totalCredits).reduce((sum, val) => sum + val, 0);
    const progressPercent = (totalEarned / CREDIT_REQUIREMENTS.TOTAL.required) * 100;

    // Filter courses for modal
    const getAvailableCourses = () => {
        if (!courseCatalog) return [];

        let courses = [];
        if (selectedCategory === 'ALL') {
            Object.values(courseCatalog).forEach(categoryList => {
                courses = courses.concat(categoryList);
            });
        } else {
            courses = courseCatalog[selectedCategory] || [];
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            courses = courses.filter(c =>
                c.code.toLowerCase().includes(query) ||
                c.title.toLowerCase().includes(query)
            );
        }

        // Filter out already added courses in this semester
        const semesterCourses = coursePlan.semesters[selectedSemester] || [];
        const addedCodes = new Set(semesterCourses.map(c => c.code));
        courses = courses.filter(c => !addedCodes.has(c.code));

        return courses;
    };

    if (!courseCatalog) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <i className="ph-bold ph-spinner animate-spin text-4xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Loading Course Catalog...</h3>
                <p className="text-slate-500 text-center max-w-md">
                    Please wait while we load the course information.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Progress Overview */}
            <div className="glass-card rounded-3xl p-8 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Course Planner</h2>
                        <p className="text-slate-500 text-sm">Plan your path to graduation</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-primary-600 font-mono">
                            {totalEarned.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">
                            / {CREDIT_REQUIREMENTS.TOTAL.required} Credits
                        </div>
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">Overall Progress</span>
                        <span className="text-sm font-mono text-slate-600">{progressPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(CREDIT_REQUIREMENTS).filter(k => k !== 'TOTAL').map(category => {
                        const required = CREDIT_REQUIREMENTS[category].required;
                        const earned = totalCredits[category] || 0;
                        const percent = required > 0 ? (earned / required) * 100 : 0;
                        const isComplete = earned >= required;

                        return (
                            <div key={category} className="bg-white/50 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{category}</span>
                                    {isComplete && <i className="ph-fill ph-check-circle text-green-500"></i>}
                                </div>
                                <div className="text-lg font-bold text-slate-800 font-mono mb-1">
                                    {earned.toFixed(1)} / {required}
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-primary-500'}`}
                                        style={{ width: `${Math.min(percent, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Elective Total (DE + OE) */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm font-bold text-blue-700">Electives Total (DE + OE)</span>
                            <p className="text-xs text-blue-600 mt-1">Must equal exactly {ELECTIVE_TOTAL_REQUIREMENT} credits</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700 font-mono">
                                {((totalCredits.DE || 0) + (totalCredits.OE || 0)).toFixed(1)}
                            </div>
                            <div className="text-xs text-blue-600">/ {ELECTIVE_TOTAL_REQUIREMENT}</div>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-sm font-bold text-slate-700 mb-3">📋 Recommendations</h4>
                        <div className="space-y-2">
                            {recommendations.slice(0, 3).map((rec, idx) => (
                                <div key={idx} className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                                    <span className="font-bold text-amber-800">{rec.category}:</span>
                                    <span className="text-amber-700 ml-2">{rec.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Semester Planning */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 px-2">Semester Planning</h3>

                {[6, 7, 8].map(semNum => {
                    const semesterCourses = coursePlan.semesters[semNum] || [];
                    const validation = validateSemesterCredits(semesterCourses, semNum);

                    return (
                        <div key={semNum} className="glass-card rounded-2xl p-6 animate-slide-up">
                            {/* Semester Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800">Semester {semNum}</h4>
                                    <p className="text-xs text-slate-500">
                                        {validation.regularCredits.toFixed(1)} / {SEMESTER_LIMITS.base} credits
                                        {validation.hasNPTEL && ' (+ NPTEL)'}
                                        {validation.projectCredits > 0 && ` (+ ${validation.projectCredits} PI)`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openCourseModal(semNum)}
                                    className="btn-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    <i className="ph-bold ph-plus"></i>
                                    Add Course
                                </button>
                            </div>

                            {/* Warnings */}
                            {validation.warnings.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {validation.warnings.map((warning, idx) => (
                                        <div key={idx} className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-sm flex items-start gap-2">
                                            <i className="ph-fill ph-warning text-amber-600 mt-0.5"></i>
                                            <span className="text-amber-800">{warning}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Course List */}
                            {semesterCourses.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <i className="ph-bold ph-books text-4xl mb-2"></i>
                                    <p className="text-sm">No courses planned yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {semesterCourses.map((course, idx) => (
                                        <div key={idx} className="bg-white/50 rounded-lg p-4 flex justify-between items-center hover:bg-white/80 transition-colors">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                        {course.code}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{course.title}</span>
                                                    {course.isNPTEL && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">
                                                            NPTEL
                                                        </span>
                                                    )}
                                                    {course.autoAdded && (
                                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                            Auto-added
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                                    <span>{course.category}</span>
                                                    <span>•</span>
                                                    <span>{course.credits} credits</span>
                                                    <span>•</span>
                                                    <span>{course.type}</span>
                                                </div>
                                                {course.note && (
                                                    <p className="text-xs text-slate-500 italic mt-1">{course.note}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveCourse(semNum, idx)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <i className="ph-bold ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Course Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Add Course to Semester {selectedSemester}</h3>
                                <p className="text-sm text-slate-500">Select courses to add to your plan</p>
                            </div>
                            <button onClick={closeCourseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <i className="ph-bold ph-x text-xl"></i>
                            </button>
                        </div>

                        <div className="p-6 border-b border-slate-100 space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <i className="ph-bold ph-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search by code or title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {['ALL', 'FC', 'DLES', 'DC', 'DE', 'OE', 'PI', 'NGCR'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === cat
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6">
                            <div className="space-y-2">
                                {getAvailableCourses().map((course, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            handleAddCourse(selectedSemester, course);
                                            closeCourseModal();
                                        }}
                                        className="w-full bg-slate-50 hover:bg-primary-50 border border-slate-200 hover:border-primary-300 rounded-xl p-4 text-left transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                                                        {course.code}
                                                    </span>
                                                    <span className="font-bold text-slate-800">{course.title}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span className="font-bold text-primary-600">{course.category}</span>
                                                    <span>•</span>
                                                    <span>{course.credits} credits</span>
                                                    <span>•</span>
                                                    <span>{course.type}</span>
                                                    {course.isNPTEL && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-blue-600 font-bold">NPTEL (doesn't count toward 27.5)</span>
                                                        </>
                                                    )}
                                                    {!course.countsTowardLimit && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-purple-600 font-bold">Doesn't count toward limit</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <i className="ph-bold ph-plus-circle text-2xl text-primary-600"></i>
                                        </div>
                                    </button>
                                ))}
                                {getAvailableCourses().length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <i className="ph-bold ph-magnifying-glass text-4xl mb-2"></i>
                                        <p>No courses found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={closeCourseModal}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
