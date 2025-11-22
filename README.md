# Quiz-It! React Application

A modern, interactive quiz application built with React that supports both multiple-choice and open-ended questions.

## Features

- ✅ Multiple quiz support
- ✅ Multiple-choice questions
- ✅ Open-ended text input questions
- ✅ Real-time progress tracking
- ✅ Score calculation for multiple-choice questions
- ✅ Comprehensive results review
- ✅ Clean, modern UI with smooth animations
- ✅ No external ID libraries (uses simple indexing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
uhohn/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── Quiz.jsx           # Main quiz container
│   │   ├── Quiz.css
│   │   ├── Question.jsx       # Question display logic
│   │   ├── Question.css
│   │   ├── MultipleChoice.jsx # Multiple choice options
│   │   ├── MultipleChoice.css
│   │   ├── OpenQuestion.jsx   # Text input for open questions
│   │   ├── OpenQuestion.css
│   │   ├── ProgressBar.jsx    # Progress indicator
│   │   ├── ProgressBar.css
│   │   ├── Results.jsx        # Results display
│   │   └── Results.css
│   ├── data/
│   │   └── quizData.json      # Quiz questions database
│   ├── App.jsx                 # Main app component
│   ├── App.css
│   ├── index.jsx               # Entry point
│   └── index.css               # Global styles
├── package.json
└── README.md
```

## Component Breakdown

### 1. App Component (`App.jsx`)
The root component that manages quiz selection and navigation.

**Key Features:**
- Displays available quizzes from JSON data
- Handles quiz selection
- Provides navigation between quiz selection and active quiz

**State:**
- `selectedQuiz`: Currently selected quiz data or null

### 2. Quiz Component (`Quiz.jsx`)
Main quiz orchestrator that manages the quiz flow.

**Key Features:**
- Tracks current question index
- Manages user answers
- Calculates scores for multiple-choice questions
- Handles quiz completion
- Provides restart functionality

**State:**
- `currentQuestionIndex`: Index of current question (0-based)
- `answers`: Array of user answers
- `quizCompleted`: Boolean flag for quiz completion
- `score`: Current score for multiple-choice questions

**Props:**
- `quizData`: Complete quiz object with questions

### 3. Question Component (`Question.jsx`)
Displays questions and manages answer submission.

**Key Features:**
- Renders different UI based on question type
- Validates answers before submission
- Handles both multiple-choice and open-ended questions
- Displays error messages for empty submissions

**State:**
- `selectedAnswer`: Index of selected option (multiple-choice)
- `openAnswer`: Text input value (open-ended)
- `error`: Error message string

**Props:**
- `question`: Question object
- `questionNumber`: Display number (1-based)
- `onAnswerSubmit`: Callback function for answer submission

### 4. MultipleChoice Component (`MultipleChoice.jsx`)
Renders multiple-choice options with custom radio buttons.

**Key Features:**
- Custom-styled radio buttons
- Visual feedback on selection
- Click-to-select functionality

**Props:**
- `options`: Array of option strings
- `selectedAnswer`: Index of selected option
- `onSelect`: Callback when option is clicked

### 5. OpenQuestion Component (`OpenQuestion.jsx`)
Text input area for open-ended questions.

**Key Features:**
- Large textarea for detailed answers
- Character counter (1000 character limit)
- Auto-resize capability

**Props:**
- `value`: Current text value
- `onChange`: Callback for text changes

### 6. ProgressBar Component (`ProgressBar.jsx`)
Visual progress indicator for quiz completion.

**Key Features:**
- Shows current question number
- Displays percentage completion
- Animated progress bar

**Props:**
- `current`: Current question number
- `total`: Total number of questions
- `progress`: Progress percentage (0-100)

### 7. Results Component (`Results.jsx`)
Displays final results and answer review.

**Key Features:**
- Score summary for multiple-choice questions
- Percentage calculation
- Review of all answers
- Shows correct answers for multiple-choice
- Displays user's open-ended responses
- Restart quiz functionality

**Props:**
- `answers`: Array of answer objects
- `score`: Final score
- `totalQuestions`: Total number of questions
- `onRestart`: Callback to restart quiz
- `quizTitle`: Title of completed quiz

## JSON Data Structure

### Quiz Data Format (`quizData.json`)

```json
{
  "quizzes": [
    {
      "id": 0,
      "title": "Quiz Title",
      "description": "Quiz description",
      "questions": [
        {
          "id": 0,
          "type": "multiple-choice",
          "question": "Question text?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": 2
        },
        {
          "id": 1,
          "type": "open-ended",
          "question": "Open question text?",
          "sampleAnswer": "Sample/expected answer guidance"
        }
      ]
    }
  ]
}
```

### Question Types

#### Multiple-Choice Question
```json
{
  "id": 0,
  "type": "multiple-choice",
  "question": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1
}
```
- `id`: Simple numeric index (no UUID needed)
- `type`: Must be "multiple-choice"
- `question`: The question text
- `options`: Array of possible answers
- `correctAnswer`: Index of correct option (0-based)

#### Open-Ended Question
```json
{
  "id": 1,
  "type": "open-ended",
  "question": "Explain your answer.",
  "sampleAnswer": "Optional guidance for expected answer"
}
```
- `id`: Simple numeric index
- `type`: Must be "open-ended"
- `question`: The question text
- `sampleAnswer`: Optional field for reference

## How Components Work Together

### Quiz Flow

1. **Quiz Selection** (`App.jsx`)
   - User sees list of available quizzes
   - Clicks on a quiz card
   - App loads quiz data and displays Quiz component

2. **Taking the Quiz** (`Quiz.jsx` → `Question.jsx`)
   - Quiz component shows current question via Question component
   - ProgressBar displays current position
   - Question component renders appropriate input (MultipleChoice or OpenQuestion)
   - User selects/types answer and clicks submit
   - Question validates and passes answer to Quiz component
   - Quiz updates state and moves to next question

3. **Answer Submission Flow**
   ```
   User Input → Question Component
      ↓
   Validation
      ↓
   onAnswerSubmit(answer)
      ↓
   Quiz Component
      ↓
   Update answers array
   Calculate score (if multiple-choice)
      ↓
   Move to next question OR show results
   ```

4. **Results Display** (`Results.jsx`)
   - Shows score summary (multiple-choice only)
   - Displays all questions with user answers
   - For multiple-choice: shows correct/incorrect status
   - For open-ended: displays user's text response
   - Provides restart button to reset quiz

### State Management

**App Level:**
- Selected quiz

**Quiz Level:**
- Current question index
- All user answers
- Score
- Quiz completion status

**Question Level:**
- Current answer being edited
- Validation errors

## Adding New Quizzes

To add a new quiz, edit `src/data/quizData.json`:

```json
{
  "quizzes": [
    // ... existing quizzes
    {
      "id": 2,
      "title": "Your New Quiz",
      "description": "Quiz description",
      "questions": [
        // Add your questions here
      ]
    }
  ]
}
```

## Customization

### Styling
All components have corresponding CSS files. Key color scheme:
- Primary: `#667eea` (purple-blue)
- Secondary: `#764ba2` (purple)
- Success: `#27ae60` (green)
- Error: `#e74c3c` (red)

### Question Limits
- Open-ended questions: 1000 character limit (configurable in `OpenQuestion.jsx`)
- No limit on number of questions per quiz
- No limit on number of options for multiple-choice

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design for mobile and desktop

## License

Free to use and modify for your projects.
