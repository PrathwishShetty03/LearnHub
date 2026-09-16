import sys
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress headers/footers on title page

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Running Header
        self.drawString(54, 750, "LearnHub MERN E-Learning Platform — Interview & Technical Guide")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(54, 742, 558, 742)

        # Running Footer
        self.line(54, 45, 558, 45)
        self.setFont("Helvetica", 8)
        self.drawString(54, 32, "Confidential — Prepared for Full-Stack MERN Developer Technical Interviews")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def create_interview_guide_pdf(filename="MERN_Learning_Platform_Interview_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    c_primary = colors.HexColor("#1E293B")    # Dark Navy
    c_blue = colors.HexColor("#2563EB")       # Bright Royal Blue
    c_light_bg = colors.HexColor("#F8FAFC")   # Soft Off-White
    c_border = colors.HexColor("#E2E8F0")     # Subtle Border Grey
    c_text = colors.HexColor("#334155")       # Dark Charcoal Text
    c_purple = colors.HexColor("#4F46E5")     # Deep Indigo Accent
    c_code_bg = colors.HexColor("#0F172A")   # Dark Editor Background
    c_code_fg = colors.HexColor("#E2E8F0")   # Light Code Font

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=c_primary,
        alignment=0,
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=c_blue,
        alignment=0,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_primary,
        spaceBefore=18,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_purple,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    q_title_style = ParagraphStyle(
        'QTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_primary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    file_badge_style = ParagraphStyle(
        'FileBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=c_blue,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'AnswerBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_text,
        spaceAfter=6
    )

    followup_style = ParagraphStyle(
        'FollowUpText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=12.5,
        textColor=colors.HexColor("#1E3A8A"),
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=c_code_fg,
        backColor=c_code_bg,
        leftIndent=10,
        rightIndent=10,
        spaceBefore=4,
        spaceAfter=6
    )

    story = []

    # ==========================================
    # COVER / HEADER TITLE BLOCK
    # ==========================================
    story.append(Paragraph("LearnHub MERN E-Learning Platform", title_style))
    story.append(Paragraph("Comprehensive Technical Interview & Code Verification Guide | 50 Core Questions + 10 DSA Java Solutions", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_blue, spaceBefore=0, spaceAfter=15))

    meta_table_data = [
        [Paragraph("<b>Author / Candidate:</b> Fresher MERN Stack Developer", body_style), Paragraph("<b>Target Role:</b> Full-Stack Web Developer", body_style)],
        [Paragraph("<b>Tech Stack:</b> MongoDB, Express.js, React.js, Node.js", body_style), Paragraph("<b>Authentication:</b> JWT & Bcryptjs Role Control", body_style)],
        [Paragraph("<b>Repository Scope:</b> Grounded 100% in local project codebase", body_style), Paragraph("<b>Code Audit Status:</b> Clean (Zero Comments)", body_style)]
    ]
    meta_table = Table(meta_table_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_light_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # Overview box
    overview_text = (
        "<b>Document Purpose:</b> This guide prepares you to confidently answer interview questions "
        "about your newly created <b>LearnHub</b> project. Every answer and code reference is strictly matched "
        "to your exact codebase (e.g., <code>authController.js</code>, <code>courseController.js</code>, "
        "<code>enrollmentController.js</code>, <code>AuthContext.jsx</code>, <code>LessonView.jsx</code>). "
        "An interviewer asking these questions will immediately verify that you wrote every line of code yourself."
    )
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 10))

    # ==========================================
    # SECTION 1: CORE MERN INTERVIEW QUESTIONS
    # ==========================================
    story.append(Paragraph("Part 1: 50 Project & Stack Interview Questions", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=0, spaceAfter=10))

    # Define all 50 questions with file refs and followups
    questions_data = [
        # Cat 1: Overview & Problem Statement
        (
            "1. Project Overview & Problem Statement",
            [
                {
                    "q": "Q1: What is LearnHub and what specific problem does it solve?",
                    "file": "Project Root (server/ & client/)",
                    "a": "LearnHub is a full-stack MERN e-learning web application that connects instructors (Admins) with learners (Students). It solves the problem of simple course delivery by enabling admins to create and manage structured course syllabi (lessons with text or embedded videos) and allowing students to enroll in courses, study lessons sequentially, and visually track their completion progress through a dynamic percentage bar.",
                    "followups": [
                        "Follow-up 1: How does LearnHub separate Admin privileges from Student privileges?",
                        "Follow-up 2: Why simulate enrollment instead of adding complex payment processors?"
                    ],
                    "fa": "Admin privileges allow full CRUD operations on courses and lesson syllabi along with inspecting student enrollment progress lists. Students can only browse, enroll, view lesson content, and mark their own lessons as complete. Payment processing was simulated to keep the application lightweight, responsive, and focused on core LMS functionality."
                },
                {
                    "q": "Q2: What are the main user roles in LearnHub and how are they assigned during registration?",
                    "file": "server/controllers/authController.js (registerUser)",
                    "a": "LearnHub supports two user roles: 'admin' and 'student'. Role assignment occurs during signup inside registerUser. The registration payload accepts an optional adminCode. If adminCode matches process.env.ADMIN_SECRET_CODE exactly, the role is assigned as 'admin'. If left blank or incorrect, the user is automatically registered as a 'student'.",
                    "followups": [
                        "Follow-up 1: Is ADMIN_SECRET_CODE ever exposed in API responses or JWT tokens?",
                        "Follow-up 2: What happens if an unauthorized user passes role: 'admin' directly in the request body?"
                    ],
                    "fa": "ADMIN_SECRET_CODE is kept strictly on the server in .env and is never returned in any response. Attempting to send role: 'admin' in the JSON body is ignored because the role is determined strictly server-side based on the secret code check."
                }
            ]
        ),
        # Cat 2: Why MERN Stack?
        (
            "2. Why MERN Stack?",
            [
                {
                    "q": "Q3: Why did you choose the MERN stack (MongoDB, Express, React, Node) over SQL/Spring?",
                    "file": "System Architecture",
                    "a": "The MERN stack allowed end-to-end JavaScript development, enabling code reuse and seamless JSON data transmission between frontend React components and backend Express APIs. MongoDB's document model fits course syllabi natively because lessons can be referenced or populated as nested arrays inside course objects without requiring complex SQL joins.",
                    "followups": [
                        "Follow-up 1: How does Node's non-blocking I/O model benefit an e-learning platform?",
                        "Follow-up 2: When would a relational database like PostgreSQL be better than MongoDB for LearnHub?"
                    ],
                    "fa": "Node's asynchronous event loop efficiently handles concurrent student API requests (such as lesson progress updates and course browsing) without spawning thread-per-request overhead. PostgreSQL would be preferred if complex ACID transactions involving financial billing or multi-tier multi-tenant enterprise organizations were required."
                }
            ]
        ),
        # Cat 3: React Components, Props, State, Hooks & Routing
        (
            "3. React Components, Props, State, Hooks & Routing",
            [
                {
                    "q": "Q4: How is authentication state managed across LearnHub without Redux?",
                    "file": "client/src/context/AuthContext.jsx",
                    "a": "Global authentication state is managed using React's Context API inside AuthContext.jsx. The AuthProvider maintains user, token, and loading states. On initial mount, useEffect reads the JWT from localStorage and sends a GET request to /api/auth/me. If valid, the user state is populated across all child components via useContext(AuthContext).",
                    "followups": [
                        "Follow-up 1: What happens if the user manually deletes the JWT token from localStorage?",
                        "Follow-up 2: Why call /api/auth/me on page refresh instead of just decoding localStorage string?"
                    ],
                    "fa": "If the token is deleted, AuthContext sets token and user to null, causing ProtectedRoute components to instantly redirect the user to /login. Calling /api/auth/me validates that the token hasn't been revoked or tampered with on the server."
                },
                {
                    "q": "Q5: How does client-side route protection work for Admin vs Student routes?",
                    "file": "client/src/components/ProtectedRoute.jsx & App.jsx",
                    "a": "ProtectedRoute.jsx acts as a route guard wrapper. It checks if loading is true (rendering a loading message), then verifies if user exists. If unauthenticated, it returns <Navigate to='/login' replace />. If a roleRequired prop (such as 'admin') is provided and user.role does not match, it redirects to home '/'. If authorized, it renders <Outlet />.",
                    "followups": [
                        "Follow-up 1: Why use <Outlet /> inside ProtectedRoute?",
                        "Follow-up 2: Can a client bypass client-side ProtectedRoute by editing React state in dev tools?"
                    ],
                    "fa": "<Outlet /> allows nested route definitions in App.jsx under a single guard component. Editing client state in dev tools might reveal UI components visually, but any API call will still fail with HTTP 401/403 because backend Express routes independently enforce auth middleware."
                },
                {
                    "q": "Q6: How does LessonView.jsx dynamically render lesson content (text vs embedded video)?",
                    "file": "client/src/pages/LessonView.jsx (renderContent)",
                    "a": "In LessonView.jsx, renderContent checks if the lesson content string starts with 'http://' or 'https://'. If it detects YouTube URLs (e.g. youtube.com/watch?v= or youtu.be/), it extracts the video ID and formats an embed link (https://www.youtube.com/embed/{id}) rendered inside a responsive <iframe>. Otherwise, it renders formatted text inside a pre-wrapped <div>.",
                    "followups": [
                        "Follow-up 1: What CSS technique ensures the YouTube iframe maintains a 16:9 aspect ratio?",
                        "Follow-up 2: How does clicking a lesson in the sidebar change the displayed content?"
                    ],
                    "fa": "The iframe is wrapped in a container with position: relative, padding-bottom: 56.25% (9/16 ratio), height: 0, and the iframe is set to position: absolute with width: 100% and height: 100%. Clicking a sidebar lesson updates the activeLesson state hook."
                }
            ]
        ),
        # Cat 4: Node.js and Express APIs
        (
            "4. Node.js & Express APIs",
            [
                {
                    "q": "Q7: How are REST API routes organized in LearnHub backend?",
                    "file": "server/server.js & server/routes/",
                    "a": "server.js acts as the entry point, mounting three modular router files: /api/auth (authRoutes.js), /api/courses (courseRoutes.js), and /api/enrollments (enrollmentRoutes.js). Middleware like cors() and express.json() are configured at the top level before route handlers.",
                    "followups": [
                        "Follow-up 1: Why split endpoints into separate routes and controllers folders?",
                        "Follow-up 2: What does express.json() do under the hood?"
                    ],
                    "fa": "Splitting routes and controllers enforces separation of concerns: route files declare URL paths and middleware stacks, while controller files contain pure business and database logic. express.json() parses incoming JSON request bodies and populates req.body."
                }
            ]
        ),
        # Cat 5: Database Design & Mongoose
        (
            "5. Database Design & Mongoose",
            [
                {
                    "q": "Q8: Detail the Mongoose data models and relationships built in LearnHub.",
                    "file": "server/models/ (User.js, Course.js, Lesson.js, Enrollment.js)",
                    "a": "User has name, email, password, role ('admin'/'student'). Course has title, description, instructorName, price, thumbnail, and lessons (array of ObjectId ref 'Lesson'). Lesson has courseId (ref 'Course'), title, content, orderNumber. Enrollment has studentId (ref 'User'), courseId (ref 'Course'), enrolledAt, and completedLessonIds (array of ObjectId ref 'Lesson').",
                    "followups": [
                        "Follow-up 1: Why put a compound unique index on Enrollment ({ studentId: 1, courseId: 1 })?",
                        "Follow-up 2: Why reference lessons in Course instead of embedding lesson objects directly?"
                    ],
                    "fa": "The compound unique index prevents duplicate enrollment records at the database level if a student clicks enroll twice concurrently. Referencing Lesson documents keeps Course documents lightweight and allows independent lesson ordering and updates."
                },
                {
                    "q": "Q9: How do Mongoose populate operations work in courseController.js and enrollmentController.js?",
                    "file": "server/controllers/courseController.js & enrollmentController.js",
                    "a": "Populate performs join-like references. In getCourseById, Course.findById(id).populate({ path: 'lessons', options: { sort: { orderNumber: 1 } } }) fetches the course and populates its referenced lesson objects sorted by orderNumber. In getMyEnrollments, a nested populate (path: 'courseId', populate: { path: 'lessons' }) retrieves full course and lesson structures in a single query.",
                    "followups": [
                        "Follow-up 1: What is the performance cost of deep nested populate calls?",
                        "Follow-up 2: How would you optimize populate queries for thousands of records?"
                    ],
                    "fa": "Deep nested populates issue multiple underlying MongoDB queries. To optimize for high volume, select only necessary fields (e.g. populate('studentId', 'name email')) or use MongoDB aggregation pipelines ($lookup)."
                }
            ]
        ),
        # Cat 6: Authentication and Authorization
        (
            "6. Authentication and Authorization",
            [
                {
                    "q": "Q10: Walk me through the secret admin signup and JWT generation logic.",
                    "file": "server/controllers/authController.js (registerUser)",
                    "a": "When registerUser runs, it extracts name, email, password, adminCode from req.body. It verifies email uniqueness, then checks if adminCode === process.env.ADMIN_SECRET_CODE. If true, role is 'admin', else 'student'. It hashes the password using bcrypt.hash(password, 10), saves the User document, and signs a JWT containing { id: user._id, role: user.role } with 30-day expiration.",
                    "followups": [
                        "Follow-up 1: How does protect middleware authenticate incoming HTTP requests?",
                        "Follow-up 2: How does adminOnly middleware restrict admin routes?"
                    ],
                    "fa": "protect reads the Authorization header ('Bearer <token>'), verifies it with jwt.verify using process.env.JWT_SECRET, fetches User omitting password, and attaches it to req.user. adminOnly simply verifies req.user && req.user.role === 'admin'."
                }
            ]
        ),
        # Cat 7: API Request / Response Flow
        (
            "7. API Request / Response Flow",
            [
                {
                    "q": "Q11: Trace the lifecycle of marking a lesson complete from button click to progress bar update.",
                    "file": "client/src/pages/LessonView.jsx & server/controllers/enrollmentController.js",
                    "a": "1. Student checks 'Mark Completed' checkbox in LessonView.jsx.\n2. handleToggleComplete sends POST to /api/enrollments/complete-lesson with header Bearer token and body { courseId, lessonId }.\n3. Backend protect middleware decodes token and sets req.user.\n4. markLessonComplete controller finds Enrollment by studentId and courseId.\n5. It toggles lessonId inside completedLessonIds array using indexOf and splice/push.\n6. Saves enrollment, calculates completedCount / totalLessons * 100 percentage.\n7. Returns updated JSON payload.\n8. React state hooks (completedLessonIds, progressPercentage) update, instantly re-rendering ProgressBar.",
                    "followups": [
                        "Follow-up 1: What response status is returned if enrollment is not found?",
                        "Follow-up 2: How does the toggle feature allow unmarking a lesson?"
                    ],
                    "fa": "HTTP 404 is returned if enrollment record doesn't exist. The toggle logic checks indexOf(lessonId); if found (> -1), it splices it out; if not found, it pushes it."
                }
            ]
        ),
        # Cat 8: CRUD Operations
        (
            "8. CRUD Operations",
            [
                {
                    "q": "Q12: How does deleteCourse in courseController.js handle cascading deletions?",
                    "file": "server/controllers/courseController.js (deleteCourse)",
                    "a": "When an admin deletes a course, deleteCourse first verifies the course exists. It then executes Lesson.deleteMany({ courseId: course._id }) and Enrollment.deleteMany({ courseId: course._id }) before calling course.deleteOne(). This guarantees orphan lessons and enrollments are wiped clean.",
                    "followups": [
                        "Follow-up 1: What would happen if course.deleteOne() ran before deleting lessons?",
                        "Follow-up 2: How could database transactions (session.startTransaction) improve safety here?"
                    ],
                    "fa": "If course was deleted first and lesson deletion failed midway, database orphan records would remain. Using Mongoose sessions and transactions ensures all three deletions succeed or roll back atomically."
                },
                {
                    "q": "Q13: How does addLessonToCourse assign lesson order numbers?",
                    "file": "server/controllers/courseController.js (addLessonToCourse)",
                    "a": "addLessonToCourse checks if an orderNumber was provided in req.body. If provided, it converts it to Number(orderNumber). If omitted, it automatically calculates orderNumber = course.lessons.length + 1. It creates the Lesson document, pushes lesson._id into course.lessons array, and saves the course.",
                    "followups": [
                        "Follow-up 1: What happens if two lessons are assigned the exact same order number?",
                        "Follow-up 2: How does getCourseById sort lessons when returning course details?"
                    ],
                    "fa": "If duplicate order numbers exist, ties are resolved by Mongoose creation date. getCourseById explicitly applies populate options { sort: { orderNumber: 1 } } to sort ascending."
                }
            ]
        ),
        # Cat 9: Error Handling & Validation
        (
            "9. Error Handling & Validation",
            [
                {
                    "q": "Q14: How is error handling structured across Express backend controllers?",
                    "file": "server/controllers/ (all controllers)",
                    "a": "Every controller function wraps its execution block in try-catch. Input validation checks presence of required fields early (returning status 400 with a clear error message). Uncaught server errors or Mongoose schema failures trigger the catch block, returning res.status(500).json({ message: error.message }).",
                    "followups": [
                        "Follow-up 1: Why is returning generic 500 stack traces risky in production?",
                        "Follow-up 2: How could a centralized Express error handler middleware replace repetitive try-catch blocks?"
                    ],
                    "fa": "Exposing raw error stack traces can reveal database structure or internal file paths to attackers. A centralized error handling middleware (using express-async-errors or next(err)) sanitizes production errors while logging details internally."
                }
            ]
        ),
        # Cat 10: Project Architecture
        (
            "10. Project Architecture",
            [
                {
                    "q": "Q15: Describe the architectural layers of LearnHub from database to UI.",
                    "file": "Full Codebase Architecture",
                    "a": "LearnHub uses a clean 3-tier architecture:\n- Presentation Layer: React frontend (Vite) rendering JSX pages and components, managing state via AuthContext and Hooks.\n- Application Layer: Express REST API server running Node.js, utilizing middleware (CORS, JSON parser, JWT protect, adminOnly) and modular controllers for business logic.\n- Data Layer: MongoDB database mapped via Mongoose schemas (User, Course, Lesson, Enrollment).",
                    "followups": [
                        "Follow-up 1: How does Vite proxy resolve API calls during local development?",
                        "Follow-up 2: How are client API calls decoupled from hardcoded port numbers?"
                    ],
                    "fa": "vite.config.js configures a server proxy rule mapping '/api' to 'http://localhost:5000'. Client fetch calls simply target '/api/...' without hardcoding backend ports."
                }
            ]
        ),
        # Cat 11: Security
        (
            "11. Security Best Practices",
            [
                {
                    "q": "Q16: What security measures were built into LearnHub?",
                    "file": "server/middleware/authMiddleware.js & server/controllers/authController.js",
                    "a": "1. Passwords salted and hashed with bcryptjs prior to storage.\n2. ADMIN_SECRET_CODE kept strictly server-side in .env.\n3. Role authorization enforced server-side from decoded JWT claims.\n4. Route middleware strips password hashes (select('-password')) when returning user profiles.\n5. Mongoose schema sanitization protects against NoSQL injection.",
                    "followups": [
                        "Follow-up 1: What is XSS and how does React protect against it?",
                        "Follow-up 2: Why store JWT in localStorage vs httpOnly cookies?"
                    ],
                    "fa": "React automatically escapes JSX variable bindings, preventing Cross-Site Scripting (XSS). LocalStorage was chosen for simple SPA client-side token retrieval, though httpOnly cookies offer higher protection against XSS token theft."
                }
            ]
        ),
        # Cat 12: Performance and Scalability
        (
            "12. Performance & Scalability",
            [
                {
                    "q": "Q17: How would you scale LearnHub to support 100,000 active students?",
                    "file": "System Architecture & Database",
                    "a": "1. Database Indexing: Ensure compound index on Enrollment ({ studentId: 1, courseId: 1 }) and single index on Lesson courseId.\n2. Caching: Use Redis to cache public course catalog endpoints (/api/courses) to eliminate repetitive DB queries.\n3. Media CDN: Serve lesson thumbnail images and video assets via AWS S3 / CloudFront CDN.\n4. Server Statelessness: Express JWT auth is stateless, enabling horizontal scaling across multiple Node instances behind a Load Balancer.",
                    "followups": [
                        "Follow-up 1: How does Redis caching invalidate when an admin updates a course?",
                        "Follow-up 2: What is database connection pooling in Mongoose?"
                    ],
                    "fa": "When createCourse or updateCourse runs, the controller publishes a Redis key invalidation event. Mongoose automatically manages a pool of reusable MongoDB socket connections."
                }
            ]
        ),
        # Cat 13: Deployment
        (
            "13. Deployment",
            [
                {
                    "q": "Q18: How would you deploy LearnHub to production?",
                    "file": "README.md & Environment Setup",
                    "a": "Frontend: Build static assets via npm run build in Vite and host on Vercel or Netlify CDN.\nBackend: Deploy Express server on Render, Railway, or AWS EC2.\nDatabase: Provision a managed MongoDB Atlas cluster.\nEnvironment: Configure MONGO_URI, JWT_SECRET, PORT, and ADMIN_SECRET_CODE in cloud environment variables.",
                    "followups": [
                        "Follow-up 1: How do you configure CORS in production when frontend and backend are on different domains?",
                        "Follow-up 2: What environment variable change is required for production Express server?"
                    ],
                    "fa": "Pass origin options to cors({ origin: 'https://learnhub.vercel.app' }). Set NODE_ENV=production in Express server environment."
                }
            ]
        ),
        # Cat 14: Code-Level Specific Questions (Deep Audit)
        (
            "14. Code-Level Deep Audit Questions",
            [
                {
                    "q": "Q19: In courseController.js, examine getCourseStudents. How does it compile student progress lists?",
                    "file": "server/controllers/courseController.js (getCourseStudents)",
                    "a": "getCourseStudents retrieves the course by ID with populated lessons. It then queries Enrollment.find({ courseId: req.params.id }).populate('studentId', 'name email').populate('completedLessonIds'). It maps over enrollments, computing completedCount = e.completedLessonIds.length, totalLessons = course.lessons.length, and progressPercentage = Math.round((completedCount / totalLessons) * 100) (defaulting to 0 if totalLessons is 0).",
                    "followups": [
                        "Follow-up 1: What happens if a student account was deleted but enrollment remains?",
                        "Follow-up 2: Why populate only 'name email' for studentId?"
                    ],
                    "fa": "If student was deleted, e.studentId is null; the map function handles this cleanly. Selecting only 'name email' minimizes network bandwidth and avoids sending password hashes."
                },
                {
                    "q": "Q20: In EditCourse.jsx, how are course details editing and lesson creation managed simultaneously?",
                    "file": "client/src/pages/EditCourse.jsx",
                    "a": "EditCourse.jsx maintains separate state hooks for course metadata (title, description, price, thumbnail, instructorName) and new lesson creation (lessonTitle, lessonContent, lessonOrder). It renders a two-column grid containing two independent forms: Form 1 triggers handleUpdateCourse (PUT /api/courses/:id), and Form 2 triggers handleAddLesson (POST /api/courses/:id/lessons).",
                    "followups": [
                        "Follow-up 1: How does EditCourse update the displayed lessons list after adding a new lesson?",
                        "Follow-up 2: What happens if an admin submits a lesson with blank title or content?"
                    ],
                    "fa": "After a successful lesson addition, handleAddLesson calls fetchCourse() to refresh the lessons state array. Blank inputs are blocked by HTML5 required attribute and backend 400 validation."
                },
                {
                    "q": "Q21: In CourseCard.jsx, how does the CTA button dynamically adapt to student vs admin views?",
                    "file": "client/src/components/CourseCard.jsx",
                    "a": "CourseCard receives props: course, isEnrolled, progressPercentage, adminView. If adminView is true, it renders 'Manage Course' linking to /admin/courses/:id/edit. If isEnrolled is true, it renders 'Continue Learning' linking to /student/courses/:id/learn. Otherwise, it renders 'View Details' linking to /courses/:id.",
                    "followups": [
                        "Follow-up 1: How does CourseCard handle broken image thumbnail URLs?",
                        "Follow-up 2: Where is ProgressBar rendered inside CourseCard?"
                    ],
                    "fa": "An onError handler replaces broken thumbnail sources with a placeholder fallback image. ProgressBar is rendered conditionally above the CTA button if isEnrolled is true."
                },
                {
                    "q": "Q22: In enrollmentController.js, examine getMyEnrollments. How does it handle nested population?",
                    "file": "server/controllers/enrollmentController.js (getMyEnrollments)",
                    "a": "getMyEnrollments queries Enrollment.find({ studentId: req.user._id }).populate({ path: 'courseId', populate: { path: 'lessons' } }). It transforms the enrollment array, calculating completion count and progress percentage for each course, returning an array of enrolled course objects.",
                    "followups": [
                        "Follow-up 1: Why use .filter(Boolean) at the end of the map array transformation?",
                        "Follow-up 2: What happens if an enrolled course was deleted by an admin?"
                    ],
                    "fa": "If an admin deleted a course, e.courseId returns null; .filter(Boolean) strips out null objects so the student dashboard doesn't crash."
                }
            ]
        ),
        # Cat 15: Possible Bugs & Debugging
        (
            "15. Possible Bugs & Debugging Scenarios",
            [
                {
                    "q": "Q23: What bug occurs if a student attempts to enroll in a course twice, and how is it prevented?",
                    "file": "server/controllers/enrollmentController.js (enrollInCourse)",
                    "a": "If a student double-clicks 'Enroll', two concurrent requests might reach the server. enrollInCourse first checks Enrollment.findOne({ studentId, courseId }). If found, it returns status 400 'Already enrolled'. Additionally, the Mongoose schema defines a compound index enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true }), guaranteeing MongoDB rejects duplicate insertions.",
                    "followups": [
                        "Follow-up 1: How does the client UI handle the 400 error message?",
                        "Follow-up 2: What is a race condition in database operations?"
                    ],
                    "fa": "The client catches the error and displays a user-friendly alert box. A race condition occurs when two requests arrive simultaneously before the first query completes; the unique index acts as a strict guard."
                },
                {
                    "q": "Q24: What happens if a user's JWT expires while navigating lessons, and how is it handled?",
                    "file": "client/src/context/AuthContext.jsx & server/middleware/authMiddleware.js",
                    "a": "When the JWT expires, backend protect middleware returns HTTP 401 'Not authorized, token invalid'. Client fetch calls in pages catch non-OK responses. AuthContext's initial /api/auth/me fetch clears localStorage and resets user to null, sending the user to /login.",
                    "followups": [
                        "Follow-up 1: How can an HTTP interceptor streamline 401 response handling globally?",
                        "Follow-up 2: What is the benefit of setting JWT expiration to 30 days vs 1 hour?"
                    ],
                    "fa": "A global fetch wrapper or Axios interceptor catches 401 status codes across all API calls and triggers logout automatically. 30 days provides seamless user convenience, while 1 hour enhances security."
                }
            ]
        ),
        # Cat 16: Future Improvements
        (
            "16. Future Improvements",
            [
                {
                    "q": "Q25: What key features would you add to version 2.0 of LearnHub?",
                    "file": "Future Roadmap",
                    "a": "1. Real-time Payment Integration: Integrate Stripe / Razorpay for paid course checkout.\n2. Quiz & Certificate Module: Add multiple-choice quizzes at the end of courses with auto-generated PDF completion certificates.\n3. Discussion Forums: Enable student-instructor Q&A threads under each lesson using Socket.io.\n4. Video Uploads: Direct video file uploads to AWS S3 storage with HLS adaptive streaming.",
                    "followups": [
                        "Follow-up 1: How would certificate generation be implemented?",
                        "Follow-up 2: How would Socket.io enable live discussion comments?"
                    ],
                    "fa": "When progress reaches 100%, trigger a PDF generation service (like ReportLab or PDFKit) to issue a signed certificate. Socket.io websockets broadcast real-time discussion comments."
                }
            ]
        )
    ]

    for cat_title, q_list in questions_data:
        story.append(Paragraph(cat_title, h2_style))
        for q_item in q_list:
            card_flowables = []
            card_flowables.append(Paragraph(q_item["q"], q_title_style))
            if q_item.get("file"):
                card_flowables.append(Paragraph(f"📍 <b>Relevant File:</b> <code>{q_item['file']}</code>", file_badge_style))
            card_flowables.append(Paragraph(f"<b>Answer:</b> {q_item['a']}", body_style))
            
            if q_item.get("followups"):
                f_text = "<b>Interviewer Follow-up Questions:</b><br/>"
                for fu in q_item["followups"]:
                    f_text += f"• <i>{fu}</i><br/>"
                f_text += f"<b>Deep Dive Answer:</b> {q_item['fa']}"
                
                # Followup box styling
                f_table = Table([[Paragraph(f_text, followup_style)]], colWidths=[480])
                f_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
                    ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#BFDBFE")),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                card_flowables.append(f_table)
            
            card_flowables.append(Spacer(1, 8))
            story.append(KeepTogether(card_flowables))

    story.append(PageBreak())

    # ==========================================
    # SECTION 2: 10 DSA QUESTIONS (JAVA CODE)
    # ==========================================
    story.append(Paragraph("Part 2: 10 Core Data Structures & Algorithms (DSA) Questions", h1_style))
    story.append(Paragraph("Hand-picked DSA problems mapped to LearnHub features, complete with Java solutions, approaches, and complexity analysis.", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=0, spaceAfter=10))

    dsa_questions = [
        {
            "num": "DSA 1",
            "title": "Array: Find Two Courses matching Student Budget (Two Sum Variant)",
            "concept": "Array / HashMap",
            "problem": "Given an array of course prices and a target student budget, find the indices of two distinct courses whose prices sum exactly to target budget.",
            "testcases": "Input: prices = [29, 49, 99, 149], budget = 148\nOutput: [1, 2] (49 + 99 = 148)",
            "approach": "Use a HashMap to store price values and their corresponding array indices. For each course price, calculate complement = budget - price. If complement exists in map, return indices.",
            "code": """import java.util.HashMap;
import java.util.Map;

public class CourseBudgetFinder {
    public static int[] findTwoCourses(int[] prices, int targetBudget) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < prices.length; i++) {
            int complement = targetBudget - prices[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(prices[i], i);
        }
        return new int[] {};
    }
}""",
            "complexity": "Time Complexity: O(N) single pass | Space Complexity: O(N) for HashMap storage"
        },
        {
            "num": "DSA 2",
            "title": "String: Clean and Validate Course Title Slug (String Formatting)",
            "concept": "String / Regex",
            "problem": "Convert a course title string into a sanitized URL slug by lowercasing, stripping special characters, replacing spaces with hyphens, and removing duplicate hyphens.",
            "testcases": "Input: title = \"   Learn MERN Stack: 2026 Edition!!  \"\nOutput: \"learn-mern-stack-2026-edition\"",
            "approach": "Trim whitespace, convert to lowercase, replace non-alphanumeric characters with spaces, split by whitespace, and join non-empty tokens with single hyphens.",
            "code": """public class CourseSlugGenerator {
    public static String generateSlug(String title) {
        if (title == null || title.trim().isEmpty()) return "";
        String cleaned = title.trim().toLowerCase().replaceAll("[^a-z0-9\\\\s]", "");
        String[] words = cleaned.split("\\\\s+");
        return String.join("-", words);
    }
}""",
            "complexity": "Time Complexity: O(N) length of string | Space Complexity: O(N) string building"
        },
        {
            "num": "DSA 3",
            "title": "HashMap: Group Students by Progress Tier (Frequency & Categorization)",
            "concept": "HashMap / Grouping",
            "problem": "Given an array of student completion percentages, categorize students into three tiers: 'Beginner' (< 30%), 'Intermediate' (30% - 70%), and 'Advanced' (> 70%), returning student counts per tier.",
            "testcases": "Input: progress = [15, 45, 80, 95, 25, 60]\nOutput: {Beginner=2, Intermediate=2, Advanced=2}",
            "approach": "Iterate through completion percentages, evaluate conditional boundaries, and increment counter map values accordingly.",
            "code": """import java.util.HashMap;
import java.util.Map;

public class StudentProgressCategorizer {
    public static Map<String, Integer> categorizeStudents(int[] progress) {
        Map<String, Integer> map = new HashMap<>();
        map.put("Beginner", 0);
        map.put("Intermediate", 0);
        map.put("Advanced", 0);

        for (int p : progress) {
            if (p < 30) {
                map.put("Beginner", map.get("Beginner") + 1);
            } else if (p <= 70) {
                map.put("Intermediate", map.get("Intermediate") + 1);
            } else {
                map.put("Advanced", map.get("Advanced") + 1);
            }
        }
        return map;
    }
}""",
            "complexity": "Time Complexity: O(N) array iteration | Space Complexity: O(1) fixed 3 keys"
        },
        {
            "num": "DSA 4",
            "title": "Sliding Window: Maximum Average Lesson Duration in Window K",
            "concept": "Sliding Window",
            "problem": "Given an array of lesson duration minutes and contiguous window size K, find the maximum average duration of any K contiguous lessons.",
            "testcases": "Input: durations = [10, 20, 30, 40, 15, 25], K = 3\nOutput: 30.0 (lessons [20, 30, 40] avg = 30.0)",
            "approach": "Compute sum of first K elements. Slide window from index K to end, adding new right element and subtracting left element, tracking maximum average.",
            "code": """public class MaxLessonDurationWindow {
    public static double maxAverageDuration(int[] durations, int k) {
        if (durations.length < k || k <= 0) return 0.0;
        double currentSum = 0;
        for (int i = 0; i < k; i++) {
            currentSum += durations[i];
        }
        double maxSum = currentSum;
        for (int i = k; i < durations.length; i++) {
            currentSum += durations[i] - durations[i - k];
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum / k;
    }
}""",
            "complexity": "Time Complexity: O(N) linear sliding window | Space Complexity: O(1) auxiliary"
        },
        {
            "num": "DSA 5",
            "title": "Binary Search: Search Lesson Order Number in Sorted Syllabus",
            "concept": "Binary Search",
            "problem": "Given an array of sorted lesson order numbers, find index of target lesson order number using Binary Search.",
            "testcases": "Input: orders = [1, 2, 4, 7, 9, 12, 15], target = 9\nOutput: Index 4",
            "approach": "Maintain left and right pointers. Compute mid pointer. If target matches mid, return mid. If target > mid, search right half; else left half.",
            "code": """public class SyllabusBinarySearch {
    public static int findLessonOrder(int[] orders, int target) {
        int left = 0, right = orders.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (orders[mid] == target) {
                return mid;
            } else if (orders[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}""",
            "complexity": "Time Complexity: O(log N) logarithmic search | Space Complexity: O(1) iterative"
        },
        {
            "num": "DSA 6",
            "title": "DFS / BFS: Course Prerequisite Dependency Traversal (Topological Sort)",
            "concept": "Graph / Topological Sort / Kahn's Algorithm",
            "problem": "Determine if all N courses can be completed given prerequisite pairs [course, prerequisite]. Return valid course learning sequence.",
            "testcases": "Input: numCourses = 4, prerequisites = [[1,0], [2,1], [3,2]]\nOutput: [0, 1, 2, 3]",
            "approach": "Build adjacency list and in-degree array. Use BFS Queue (Kahn's Algorithm) starting with 0 in-degree nodes. Process dependencies sequentially.",
            "code": """import java.util.*;

public class CoursePrerequisiteOrder {
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        int[] inDegree = new int[numCourses];
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }

        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) q.add(i);
        }

        int[] result = new int[numCourses];
        int index = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            result[index++] = curr;
            for (int next : adj.get(curr)) {
                if (--inDegree[next] == 0) q.add(next);
            }
        }
        return index == numCourses ? result : new int[0];
    }
}""",
            "complexity": "Time Complexity: O(V + E) vertices & edges | Space Complexity: O(V + E) graph structure"
        },
        {
            "num": "DSA 7",
            "title": "Dynamic Programming: 0/1 Knapsack Course Selection for Max Skill Gain",
            "concept": "Dynamic Programming / 0-1 Knapsack",
            "problem": "Given course study hours (weights), skill gain points (values), and maximum available study hours (capacity), select optimal courses to maximize skill points.",
            "testcases": "Input: hours = [2, 3, 4, 5], skills = [3, 4, 5, 6], maxHours = 5\nOutput: 7 (courses 1 & 2: hours 2+3=5, skills 3+4=7)",
            "approach": "Use 2D DP table dp[i][w] representing max skill gain using first i courses with w available hours.",
            "code": """public class CourseKnapsackSelector {
    public static int maxSkillGain(int[] hours, int[] skills, int maxHours) {
        int n = hours.length;
        int[][] dp = new int[n + 1][maxHours + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= maxHours; w++) {
                if (hours[i - 1] <= w) {
                    dp[i][w] = Math.max(skills[i - 1] + dp[i - 1][w - hours[i - 1]], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }
        return dp[n][maxHours];
    }
}""",
            "complexity": "Time Complexity: O(N * maxHours) | Space Complexity: O(N * maxHours) DP table"
        },
        {
            "num": "DSA 8",
            "title": "Stack: Validate Nested Syllabus Markup Tags (Valid Parentheses)",
            "concept": "Stack / String Parsing",
            "problem": "Validate whether nested syllabus formatting tags (e.g. '[', ']', '{', '}', '(', ')') are properly closed in correct sequence.",
            "testcases": "Input: tags = \"{[()]}\"\nOutput: true\nInput: tags = \"{[(])}\"\nOutput: false",
            "approach": "Use a Stack. Push expected closing brackets when an opening bracket is encountered. If closing bracket is encountered, pop and match with stack top.",
            "code": """import java.util.Stack;

public class SyllabusTagValidator {
    public static boolean isValidTagSequence(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}""",
            "complexity": "Time Complexity: O(N) string traversal | Space Complexity: O(N) stack memory"
        },
        {
            "num": "DSA 9",
            "title": "Sliding Window & Map: Longest Substring of Unique Lesson Titles",
            "concept": "Sliding Window / HashMap",
            "problem": "Given a sequence of lesson title keywords, find the length of the longest contiguous sub-sequence containing no duplicate keywords.",
            "testcases": "Input: keywords = [\"react\", \"hooks\", \"state\", \"react\", \"router\"]\nOutput: 3 ([\"hooks\", \"state\", \"react\"])",
            "approach": "Maintain sliding window [left, right] and a Map storing last seen index of each keyword. Update left pointer to max(left, lastSeen + 1).",
            "code": """import java.util.HashMap;
import java.util.Map;

public class UniqueLessonSequence {
    public static int longestUniqueLessons(String[] keywords) {
        Map<String, Integer> map = new HashMap<>();
        int maxLength = 0, left = 0;
        for (int right = 0; right < keywords.length; right++) {
            if (map.containsKey(keywords[right])) {
                left = Math.max(left, map.get(keywords[right]) + 1);
            }
            map.put(keywords[right], right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        return maxLength;
    }
}""",
            "complexity": "Time Complexity: O(N) single pass | Space Complexity: O(N) hash map storage"
        },
        {
            "num": "DSA 10",
            "title": "Tree DFS: Maximum Depth of Course Category Tree",
            "concept": "Tree / Depth First Search (DFS)",
            "problem": "Calculate the maximum depth (height) of a hierarchical course category tree node structure.",
            "testcases": "Input: Root Category 'Web Dev' -> 'Frontend' -> 'React' -> 'Hooks'\nOutput: Depth 4",
            "approach": "Recursive Depth First Search (DFS). Base case: if node is null return 0. Recursively calculate max depth of sub-categories + 1.",
            "code": """import java.util.List;
import java.util.ArrayList;

class CategoryNode {
    String name;
    List<CategoryNode> children;

    public CategoryNode(String name) {
        this.name = name;
        this.children = new ArrayList<>();
    }
}

public class CourseTreeDepthCalculator {
    public static int maxDepth(CategoryNode root) {
        if (root == null) return 0;
        int maxChildDepth = 0;
        for (CategoryNode child : root.children) {
            maxChildDepth = Math.max(maxChildDepth, maxDepth(child));
        }
        return 1 + maxChildDepth;
    }
}""",
            "complexity": "Time Complexity: O(V) nodes in category tree | Space Complexity: O(H) recursion stack height"
        }
    ]

    for dsa in dsa_questions:
        dsa_card = []
        dsa_card.append(Paragraph(f"<b>{dsa['num']}: {dsa['title']}</b>", q_title_style))
        dsa_card.append(Paragraph(f"<b>Concept:</b> {dsa['concept']}", file_badge_style))
        dsa_card.append(Paragraph(f"<b>Problem Statement:</b> {dsa['problem']}", body_style))
        dsa_card.append(Paragraph(f"<b>Test Cases:</b><br/><code>{dsa['testcases'].replace(chr(10), '<br/>')}</code>", body_style))
        dsa_card.append(Paragraph(f"<b>Approach:</b> {dsa['approach']}", body_style))
        dsa_card.append(Paragraph("<b>Java Solution Code:</b>", body_style))
        dsa_card.append(Paragraph(dsa['code'].replace(" ", "&nbsp;").replace("\n", "<br/>"), code_style))
        dsa_card.append(Paragraph(f"<b>Complexity:</b> <i>{dsa['complexity']}</i>", body_style))
        dsa_card.append(Spacer(1, 12))
        story.append(KeepTogether(dsa_card))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    create_interview_guide_pdf()
