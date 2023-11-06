// Функція для отримання курсів валют з API Приватбанку
function getExchangeRates() {
  return fetch('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5')
    .then((response) => response.json())
    .then((data) => {
      // Знайдіть курси долара та євро у відповіді API
      const usdRate = data.find((currency) => currency.ccy === 'USD');
      const eurRate = data.find((currency) => currency.ccy === 'EUR');

      // Отримайте курси купівлі та продажу для долара та євро
      const usdBuyRate = parseFloat(usdRate.buy);
      const usdSaleRate = parseFloat(usdRate.sale);
      const eurBuyRate = parseFloat(eurRate.buy);
      const eurSaleRate = parseFloat(eurRate.sale);

      return { usdBuyRate, usdSaleRate, eurBuyRate, eurSaleRate };
    })
    .catch((error) => {
      console.error('Помилка при отриманні курсів валют: ', error);
      return null;
    });
}

// Функція для розрахунку пенсійного капіталу з урахуванням курсів валют
async function calculatePension() {
  // Отримайте курси валют з API Приватбанку
  const exchangeRates = await getExchangeRates();

  if (exchangeRates === null) {
    return;
  }

  // Отримайте значення введених користувачем даних
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
      pensionCapital += additionalContributions;
      additionalContributionsMap.set(i / 12, additionalContributions);
    }
    pensionCapital += monthlyContribution;
    pensionCapital *= 1 + monthlyInterestRate;

    if (i % 12 === 0 || i === years * 12) {
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
    const pensionInUSD = pensionCapital / exchangeRates.usdBuyRate;
    resultText = `Ваш пенсійний капітал через ${years} років становитиме: ${pensionInUSD.toFixed(
      2
    )} USD<br>`;
  } else if (convertToCurrency === 'EUR') {
    const pensionInEUR = pensionCapital / exchangeRates.eurBuyRate;
    resultText = `Ваш пенсійний капітал через ${years} років становитиме: ${pensionInEUR.toFixed(
      2
    )} EUR<br>`;
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
