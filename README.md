# AI Workout Planner

The AI Workout Planner is a web-based application designed to create personalized, progressive workout plans tailored to an individual's fitness goals, lifestyle, and available equipment. Leveraging AI capabilities, this planner ensures variety, safety, and progression in every workout.

## Features
- **Personalized Plans:** Workout plans based on height, weight, body type, goals, and restrictions.
- **Progressive Workouts:** Intensity and difficulty increase weekly to ensure consistent improvement.
- **Customizable Options:** Choose from various workout styles such as HIIT, Yoga, Pilates, Strength Training, and more.
- **User-Friendly Interface:** Modern design with easy-to-use forms.
- **PDF Export:** Download your personalized workout plan as a PDF.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **AI Integration:** Google Gemini AI API
- **PDF Generation:** jsPDF Library

## How to Use
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-workout-planner.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ai-workout-planner
   ```
3. Open `index.html` in your preferred browser.
4. Fill in the form with your details and submit.
5. View the generated workout plan or download it as a PDF.

## Setup
To use the AI functionality, you need a Google Gemini AI API key:
1. Replace the placeholder `API_KEY` in `script` with your actual API key.
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```
2. Ensure your API key has access to the Google Gemini AI API.

## Project Structure
- `index.html`: Main HTML file containing the form and layout.
- `style.css`: Contains all the styling rules.
- `script.js`: Includes JavaScript for form handling, AI API integration, and PDF generation.
- `images/`: Contains header images for the page design.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributions
Contributions are welcome! If you have suggestions or want to add features, please open an issue or submit a pull request.

## Contact
For questions or feedback, reach out to:
- **Email:** your-email@example.com
- **GitHub:** [your-username](https://github.com/your-username)

---
### Screenshots
![Screenshot](images/screenshot.jpg)

Enjoy planning your workouts and achieving your fitness goals!

