document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("descalingForm");
  const resultSection = document.getElementById("resultSection");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");

  // Create 1–5 rating buttons dynamically
  document.querySelectorAll(".scale").forEach(scale => {
    const qNum = scale.getAttribute("data-question");
    for (let i = 1; i <= 5; i++) {
      const input = document.createElement("input");
      const label = document.createElement("label");
      input.type = "radio";
      input.id = `q${qNum}-${i}`;
      input.name = `q${qNum}`;
      input.value = i;
      label.setAttribute("for", input.id);
      label.textContent = i;
      scale.appendChild(input);
      scale.appendChild(label);
    }
  });

  // Improvement tips for all 9 principles
  const tips = [
    {
      title: "From Specialist Roles to Teams",
      message: "Encourage collaborative, cross-functional teams that share ownership of outcomes. Merge specialist responsibilities into team ownership."
    },
    {
      title: "From Resource Thinking to People Thinking",
      message: "Empower individuals to learn beyond their roles. Encourage growth, pairing, and job rotation to foster adaptability and innovation."
    },
    {
      title: "From Organizing Around Technology to Customer Value",
      message: "Structure teams around end-to-end customer value streams. Align reporting and goals with delivering customer outcomes."
    },
    {
      title: "From Independent Teams to Cross-Team Cooperation",
      message: "Foster collaboration across teams with shared OKRs, cross-demos, and team-of-teams communication channels."
    },
    {
      title: "From Coordinate to Integrate → Continuous Integration",
      message: "Adopt continuous integration and automated testing. Merge code multiple times per day to enhance collective progress."
    },
    {
      title: "From Projects to Products",
      message: "Shift from temporary projects to long-term product ownership. Fund and empower stable product teams to continuously deliver value."
    },
    {
      title: "From Many Small Products to Few Broad Products",
      message: "Unify product portfolios and backlogs to simplify coordination and increase shared focus on broader customer outcomes."
    },
    {
      title: "From Technical to User-Centric Backlog Items",
      message: "Write backlog items in plain, user-oriented language to clarify value and improve stakeholder communication."
    },
    {
      title: "From Remote to Co-Located Collaboration",
      message: "Encourage periodic in-person collaboration. Even a few days of co-location improves trust, alignment, and learning."
    }
  ];

  // Handle submission
  form.addEventListener("submit", e => {
    e.preventDefault();

    const scores = [];
    for (let i = 1; i <= 9; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        alert(`Please rate question ${i} before submitting.`);
        return;
      }
      scores.push(parseInt(selected.value));
    }

    // Find lowest score(s)
    const minScore = Math.min(...scores);
    const weakestIndexes = scores
      .map((score, i) => (score === minScore ? i : -1))
      .filter(i => i !== -1);

    // Show the first weakest principle (could expand to multiple)
    const weakest = tips[weakestIndexes[0]];

    resultTitle.textContent = `Focus Area: ${weakest.title}`;
    resultMessage.textContent = weakest.message;
    resultSection.classList.remove("hidden");

    // Optional: Log scores for debugging or submission tracking
    console.log("Scores:", scores);
  });
});
