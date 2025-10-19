document.addEventListener('DOMContentLoaded', () => {
  const questions = document.querySelectorAll('.question');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress');
  const quizForm = document.getElementById('quizForm');
  const resultDiv = document.getElementById('result');
  const lowestRatingElem = document.getElementById('lowestRating');
  const resultCanvas = document.getElementById('resultChart');
  const resultCtx = resultCanvas.getContext('2d');

  //suggestions object
  const suggestions = [
  { 
    suggestionId: "Specialist Roles",
    suggestionTitle: "From Specialist Roles to Teams",
    suggestionText:
      "Encourage forming collaborative teams that share responsibility for customer-focused goals. Shift responsibilities like release management, QA, or architecture from designated roles to the teams themselves. Blend roles where possible—allowing developers, testers, and designers to contribute across disciplines. Reducing reliance on single-function job titles helps create teams that adapt and deliver faster."
  },
  {
    suggestionId: "People-Thinking",
    suggestionTitle: "From Resource-Thinking to People-Thinking",
    suggestionText:
      "Shift management practices to focus on learning and capability-building. Treat team members not as fixed-role resources but as individuals who grow over time. Create space for learning, pair work, or rotating responsibilities. Emphasize growth in performance evaluations and de-emphasize utilization metrics. This promotes adaptability and intrinsic motivation."
  },
  { 
    suggestionId: "Organizing Focus",
    suggestionTitle: "From Organizing around Technology to Organizing around Customer Value",
    suggestionText:
      "Re-align team structure around end-to-end customer value streams or products. Instead of organizing purely by technical component (backend team, mobile team, etc.), create multidisciplinary teams responsible for a customer-facing feature or service. This may involve reorganizing reporting lines or redefining product boundaries to ensure each team can deliver visible customer value. Bringing teams closer to real users (through user research, feedback loops, etc.) will reinforce a customer-centric focus and break down tech-centric silos."
  },
  {
    suggestionId: "Team Independence",
    suggestionTitle: "From Independent Teams to Continuous Cross-Team Cooperation",
    suggestionText:
      "Foster a culture of collaboration across teams. Discourage the mindset that teams 'own' separate pieces and must avoid disruptions; instead, encourage mechanisms for frequent interaction (e.g. Scrum-of-Scrums meetings, cross-team demos, shared retrospectives). Establish common goals or OKRs that multiple teams share to promote unity. Also consider rotating members or forming temporary mixed-team task forces for shared initiatives. The goal is to have teams feel part of a larger unified team-of-teams, improving flexibility in how work gets done."
  },
  { 
    suggestionId:"Continuous Integration",
    suggestionTitle: "From Coordinate-to-Integrate to Coordination through Integration",
    suggestionText:
      "Minimize overhead coordination by getting teams to integrate their work continuously. For example, implement Continuous Integration (CI) pipelines and make sure all teams regularly merge code and validate it together. When teams continuously integrate their work, they naturally discover cross-team collaboration opportunities, and external coordination roles become unnecessary. Start by setting up automated build/test systems that pull contributions from all teams throughout the day. This technical practice drives organizational change: integration happening in real time means less need for coordination meetings or project manager intervention to 'glue' pieces together."
  },
  {
    suggestionId:"Projects or Products",
    suggestionTitle: "From Projects to Products",
    suggestionText:
      "Transition from a project-based planning approach to a product-focused approach. Instead of temporary projects with hand-picked teams that disband, create stable product teams with ongoing charters. Redefine 'projects' as increments in a continuous product roadmap. Adjust funding models to fund products (which have continuous value delivery) rather than individual projects. Encourage teams to think of customers and outcomes, not just finishing a project checklist. This shift allows the organization to respond to change more easily, since a product doesn’t have a fixed end date or scope. Leadership should communicate a clear product vision and empower teams to pursue that vision iteratively."
  },
  {
    suggestionId:"Number of Backlogs",
    suggestionTitle: "From Many Small Products to a Few Broad Products",
    suggestionText:
      "Simplify your product portfolio by combining related efforts into broader products. If your organization currently manages many small apps, components, or services separately, consider grouping them into a larger product definition that delivers a wider slice of customer value. Consolidate backlogs and roadmaps where possible – for example, one unified product backlog for a suite of features that were formerly split. This reduces the need for cross-product coordination and prioritization conflicts. Ensure there is one Product Owner (or a small synchronized Product Owner team) overseeing each broad product to streamline decisions. The result is less overhead and a clearer focus for teams, as they all work toward a common product goal rather than disparate mini-products."
  },
  {
    suggestionId:"Clarity of Product Backlog Items",
    suggestionTitle: "From Technical to User-Centric PBIs",
    suggestionText:
      "Write Product Backlog Items in clear, user-centered language. If customers and stakeholders can’t understand backlog items, teams are likely misaligned with value delivery. Using simple, outcome-oriented wording increases clarity, reduces misinterpretation, and enables better feedback."
  },
  {
    suggestionId:"Team Co-location Frequency",
    suggestionTitle: "From Remote to Co-Located Collaboration",
    suggestionText:
      "Even 1–2 days per week of in-person collaboration can improve alignment, trust, and speed. Encourage full-team co-location where feasible, especially for critical meetings like planning and reviews. Shared physical space enables faster learning, reduces miscommunication, and deepens cross-team collaboration."
  }
];

  let currentQuestion = 0;
  let chartInstance = null;
function showQuestion(index) {
  questions.forEach((q, i) => {
    q.classList.remove('active');

    // hide immediately if not the current question
    if (i !== index) {
      q.style.display = 'none';
    }
  });

  const currentQ = questions[index];
  if (currentQ) {
    // Make sure it’s visible before animating
    currentQ.style.display = 'block';

    // Trigger reflow to restart transition
    void currentQ.offsetWidth;

    // Add class to fade in
    currentQ.classList.add('active');
  }

  updateProgress(index);
}


  function updateProgress(index) {
    const total = questions.length;
    const percent = ((index + 1) / total) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${index + 1} of ${total} questions`;
  }

  function getLowestRating(data) {
    const numericValues = Object.keys(data)
      .filter(k => k !== 'contact')
      .map(k => Number(data[k]));
    const minValue = Math.min(...numericValues);
    const lowest = Object.keys(data).find(k => k !== 'contact' && Number(data[k]) === minValue);
    return { lowest, minValue };
  }

  function showResult(data) {
    const { lowest, minValue } = getLowestRating(data);
    lowestRatingElem.textContent = `Lowest Scoring Principle: ${lowest} (${minValue})`;
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth' });

    // Hide question 10
    questions[9].style.display = 'none';

    // Destroy old chart if exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(resultCtx, {
      type: 'radar',
      data: {
        labels: Object.keys(data).filter(k => k !== 'contact'),
        datasets: [{
          label: 'Score',
          data: Object.keys(data).filter(k => k !== 'contact').map(k => Number(data[k])),
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },  // hides legend
        title: { display: false }    // hides title if any
      },
      scales: {
          x: { display: false },
          y: { display: false }
      }}
    });
    // call show suggestion
    showSuggestion(lowest);

  }

  function validateQuestion(question) {
    const checked = question.querySelector('input[type="radio"]:checked');
    if (!checked) {
      question.querySelector('.warning-message').style.display = 'block';
      return false;
    } else {
      question.querySelector('.warning-message').style.display = 'none';
      return true;
    }
  }

  // Next buttons
  const nextButtons = document.querySelectorAll('.next-btn');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = questions[currentQuestion];
      if (!validateQuestion(question)) return;

      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      }
    });
  });

  // Form submission
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lastQuestion = questions[currentQuestion];
    const inputs = lastQuestion.querySelectorAll('input[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) valid = false;
    });
    if (!valid) {
      alert('Please fill out all contact fields.');
      return;
    }

    const formData = {};
    questions.forEach((q, index) => {
      if (index < 9) {
        const selected = q.querySelector('input[type="radio"]:checked');
        formData[q.querySelector('h2').textContent.trim()] = selected ? selected.value : null;
      } else {
        formData.contact = {
          fullName: q.querySelector('input[name="fullName"]').value,
          company: q.querySelector('input[name="company"]').value,
          email: q.querySelector('input[name="email"]').value
        };
      }
    });

    console.log('Collected Data:', formData);
    showResult(formData);
  });

  // Show sugestion
  function showSuggestion(lowestCategory) {
  const suggestionDiv = document.getElementById('suggestion');
  const titleElem = document.getElementById('suggestion-title');
  const textElem = document.getElementById('suggestion-text');

  // Find matching suggestion
  const match = suggestions.find(
    (s) => s.suggestionId.toLowerCase() === lowestCategory.toLowerCase()
  );

  if (match) {
    titleElem.textContent = match.suggestionTitle;
    textElem.textContent = match.suggestionText;
    suggestionDiv.style.display = 'block';
  } else {
    titleElem.textContent = "No suggestion available";
    textElem.textContent = "";
  }
}

  showQuestion(currentQuestion);
});
