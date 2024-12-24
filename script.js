const API_KEY = 'AIzaSyAbUfd5A_Se2boJMXvntqClfvy_B8TFI_4'; // Replace with your actual Gemini AI API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.getElementById('workoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Generating your personalized workout plan...';
    resultDiv.style.display = 'block';

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    try {
        const workoutPlan = await generateWorkoutPlan(formValues);
        resultDiv.innerHTML = formatWorkoutPlan(workoutPlan);
        document.getElementById('downloadPdf').style.display = 'block';
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
});

document.getElementById('downloadPdf').addEventListener('click', generatePDF);

async function generateWorkoutPlan(formValues) {
    const prompt = `Create a detailed, progressive ${formValues.challengeWeeks}-week personalized workout plan for a ${formValues.age}-year-old ${formValues.gender} with ${formValues.bodyType} body type, ${formValues.workoutLevel} fitness level. Current weight: ${formValues.currentWeight}kg, target: ${formValues.targetWeight}kg. 5 workout days per week, ${formValues.workoutTime} minutes per session. 

Primary goals: ${formValues.bodyGoals}
Secondary goals: ${formValues.otherGoals}
Available equipment: ${formValues.equipment}
Exercise restrictions: ${formValues.exerciseRestrictions}

Include warmup (${formValues.warmupCooldown === 'yes' ? 'Yes' : 'No'}) and cooldown (${formValues.warmupCooldown === 'yes' ? 'Yes' : 'No'}).

Provide a single, comprehensive full-body warmup routine to be used for all workout days.

For each week:
1. Provide a detailed weekly overview highlighting progression and focus areas.
2. For each workout day (5 days per week):
   a. Specify the day of the week and main focus (e.g., "Monday - Full Body Strength")
   b. Main workout (${formValues.workoutTime} minutes):
      - Workout structure (e.g., circuit, HIIT, strength training)
      - 5 exercises with:
        * Exercise name
        * Sets and reps (or duration for timed exercises)
        * Rest periods
        * Detailed form cues and tips
        * Equipment needed (if any)
        * Intensity level (e.g., RPE 7/10)
   c. Cooldown routine (if applicable):
      - List 3-4 specific stretches with durations

Ensure progressive overload by increasing reps, sets, or difficulty of exercises each week. Address all user goals throughout the program. Customize exercises based on available equipment and restrictions.

Format with ** ** for important headings (e.g., **Week 1**, **Monday - Full Body Strength**).`;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192,
                },
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error generating workout plan:', error);
        throw new Error('Failed to generate workout plan. Please try again later.');
    }
}

function formatWorkoutPlan(plan) {
    if (plan.toLowerCase().includes("disclaimer")) {
        return `<div class="disclaimer">${plan}</div>`;
    }

    let formattedPlan = plan.replace(/\*\*(.*?)\*\*/g, '<h2>$1</h2>');
    
    formattedPlan = formattedPlan.replace(/^(Week \d+):/gm, '<h2>$1:</h2>');
    formattedPlan = formattedPlan.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)( - .*?):/gm, '<h3>$1$2:</h3>');
    formattedPlan = formattedPlan.replace(/^(Warmup|Main workout|Cooldown):/gm, '<h4>$1:</h4>');
    
    formattedPlan = formattedPlan.replace(/<h2>(Week \d+):/g, '<div class="week-block"><h2>$1:');
    formattedPlan = formattedPlan.replace(/(?=<h2>Week \d+:|$)/g, '</div>');
    
    formattedPlan = formattedPlan.replace(/<h2>(Week \d+):<\/h2>/g, (match, week) => {
        return `${match}<div class="week-overview"><strong>${week} Overview:</strong> `;
    });
    formattedPlan = formattedPlan.replace(/(<h3>.*?:)/g, '</div>$1');
    
    formattedPlan = formattedPlan.replace(/(\d+\.\s*)(.*?)(\n|$)/g, '<p><strong>$1</strong>$2</p>');
    formattedPlan = formattedPlan.replace(/(Exercise|Sets|Reps|Rest|Form cues|Equipment|Intensity):\s/g, '<br><em>$1:</em> ');
    
    return formattedPlan;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const content = document.getElementById('result');
    let y = 10;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    function addText(text, fontSize = 12, isBold = false) {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, maxLineWidth);
        for (let i = 0; i < lines.length; i++) {
            if (y > 280) {
                doc.addPage();
                y = 10;
            }
            doc.text(lines[i], margin, y);
            y += lineHeight;
        }
        y += 5;
    }

    const parser = new DOMParser();
    const htmlContent = parser.parseFromString(content.innerHTML, 'text/html');

    function traverseNode(node) {
        for (let child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                addText(child.textContent);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'H2') {
                    addText(child.textContent, 16, true);
                } else if (child.tagName === 'H3') {
                    addText(child.textContent, 14, true);
                } else if (child.tagName === 'H4') {
                    addText(child.textContent, 13, true);
                } else if (child.tagName === 'P') {
                    addText(child.textContent);
                } else {
                    traverseNode(child);
                }
            }
        }
    }

    traverseNode(htmlContent.body);

    doc.save('workout_plan.pdf');
}


