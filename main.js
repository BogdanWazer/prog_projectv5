function calculatePension() {
  // Отримуємо значення введених користувачем даних
  const initialContribution = parseFloat(
    document.getElementById('initial_contribution').value
  );
  const monthlyContribution = parseFloat(
    document.getElementById('monthly_contribution').value
  );
  const annualInterestRate = parseFloat(
    document.getElementById('annual_interest_rate').value
  );
  const years = parseInt(document.getElementById('years').value);
  const additionalContributions = parseFloat(
    document.getElementById('additional_contributions').value
  );
  const inflationRate = parseFloat(
    document.getElementById('inflation_rate').value
  );
  const showEveryThreeYears = document.getElementById(
    'show_every_three_years'
  ).checked;
  const convertToCurrency = document.getElementById(
    'convert_to_currency'
  ).value;
  const additionalContributionsYear = parseInt(
    document.getElementById('additional_contributions_year').value
  );

  // Перевіряємо, чи коректно введені всі значення
  if (
    isNaN(initialContribution) ||
    isNaN(monthlyContribution) ||
    isNaN(annualInterestRate) ||
    isNaN(years) ||
    isNaN(additionalContributions) ||
    isNaN(inflationRate)
  ) {
    alert('Будь ласка, введіть всі необхідні дані.');
    return;
  }

  // Конвертуємо річну ставку в щомісячну
  const monthlyInterestRate = (1 + annualInterestRate / 100) ** (1 / 12) - 1;

  // Обчислюємо пенсійний капітал та збитки від інфляції
  let pensionCapital = initialContribution;
  let totalInflationLoss = 0;
  const capitalByYear = [];
  const additionalContributionsMap = new Map();

  for (let i = 1; i <= years * 12; i++) {
    if (additionalContributionsYear === i / 12) {
      // Додаткові внески за роком
      pensionCapital += additionalContributions;
      additionalContributionsMap.set(i / 12, additionalContributions);
    }
    // Щомісячні внески та їх приріст
    pensionCapital += monthlyContribution;
    pensionCapital *= 1 + monthlyInterestRate;

    if (i % 12 === 0 || i === years * 12) {
      // Запис капіталу за кожний рік
      capitalByYear.push({ year: i / 12, capital: pensionCapital });
    }

    // Рахуємо збитки від інфляції щомісяця
    const inflationLoss = (pensionCapital * (inflationRate / 100)) / 12;
    totalInflationLoss += inflationLoss;
    pensionCapital -= inflationLoss;
  }

  // Обчислюємо результати в обраній валюті
  let resultText = '';
  if (convertToCurrency === 'USD') {
    resultText = `Ваш пенсійний капітал через ${years} років становитиме: ${(
      pensionCapital / 37
    ).toFixed(2)} USD<br>`;
  } else if (convertToCurrency === 'EUR') {
    resultText = `Ваш пенсійний капітал через ${years} років становитиме: ${(
      pensionCapital / 39
    ).toFixed(2)} EUR<br>`;
  } else {
    resultText = `Ваш пенсійний капітал через ${years} років становитиме: ${pensionCapital.toFixed(
      2
    )} грн<br>`;
  }

  // Відображаємо результат на сторінці
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = resultText;

  // Відображаємо стан капіталу за кожний рік
  const capitalByYearElement = document.getElementById('capital_by_year');
  capitalByYearElement.innerHTML = `<p>Стан капіталу за кожний рік:</p>`;
  capitalByYear.forEach((item) => {
    capitalByYearElement.innerHTML += `Рік ${item.year}: ${item.capital.toFixed(
      2
    )} грн<br>`;
  });

  // Відображаємо додаткові внески за роками
  const additionalContributionsElement = document.getElementById(
    'additional_contributions_list'
  );
  additionalContributionsElement.innerHTML = `<p>Додаткові внески:</p>`;
  additionalContributionsMap.forEach((value, year) => {
    additionalContributionsElement.innerHTML += `Рік ${year}: ${value.toFixed(
      2
    )} грн<br>`;
  });
}
