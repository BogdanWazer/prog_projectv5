document
  .getElementById('optionalFieldsButton')
  .addEventListener('click', function () {
    const optionalFields = document.querySelector('.optional-fields');
    optionalFields.style.display =
      optionalFields.style.display === 'none' ? 'block' : 'none';
  });

function calculatePension() {
  const initialContribution = parseFloat(
    document.getElementById('initial_contribution').value
  );
  const annualContribution = parseFloat(
    document.getElementById('annual_contribution').value
  );

  // Отримання додаткових даних, якщо вони відображені
  let annualInterestRate = 0;
  let years = 0;
  if (document.querySelector('.optional-fields').style.display === 'block') {
    annualInterestRate =
      parseFloat(document.getElementById('annual_interest_rate').value) / 100;
    years = parseInt(document.getElementById('years').value);
  }

  const futureValues = [initialContribution];

  for (let year = 1; year <= years; year++) {
    futureValues.push(futureValues[year - 1] + annualContribution);
    futureValues[year] *= 1 + annualInterestRate;
  }

  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById('pensionChart').getContext('2d');

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: years + 1 }, (_, i) => i),
      datasets: [
        {
          label: 'Пенсійний капітал',
          data: futureValues,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
