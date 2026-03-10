// Тест для проверки исправления проблемы с дублированием пятницы
// Этот тест демонстрирует правильную логику расчета строк

function testScheduleParsing() {
  // Пример данных о начальных строках для дней недели
  const dayStartRows = {
    Monday: 10,
    Tuesday: 30,
    Wednesday: 50,
    Thursday: 70,
    Friday: 90,
    Saturday: 110
  };

  console.log('=== ТЕСТ Проверки логики парсинга расписания ===\n');

  // СТАРАЯ ЛОГИКА (неправильная)
  console.log('СТАРАЯ ЛОГИКА (проблема):');
  for (const [dayName, startRow] of Object.entries(dayStartRows)) {
    const orderedDays = Object.entries(dayStartRows).sort((a, b) => a[1] - b[1]);
    
    console.log(`День: ${dayName}, startRow: ${startRow}`);
    console.log(`orderedDays.length: ${orderedDays.length}`);
    
    for (let pair = 0; pair < orderedDays.length; pair++) {
      const rowIndex1 = startRow + pair * 2;
      const rowIndex2 = startRow + pair * 2 + 1;
      console.log(`  Пара ${pair + 1}: строки ${rowIndex1}-${rowIndex2}`);
    }
    console.log('');
  }

  console.log('\n=== НОВАЯ ЛОГИКА (правильная) ===\n');

  // НОВАЯ ЛОГИКА (правильная)
  const orderedDays = Object.entries(dayStartRows).sort((a, b) => a[1] - b[1]);
  const maxPairsPerDay = 7;

  console.log('НОВАЯ ЛОГИКА (исправлена):');
  for (const [dayName, startRow] of Object.entries(dayStartRows)) {
    console.log(`День: ${dayName}, startRow: ${startRow}`);
    
    for (let pair = 0; pair < maxPairsPerDay; pair++) {
      const rowIndex1 = startRow + pair * 2;
      const rowIndex2 = startRow + pair * 2 + 1;
      console.log(`  Пара ${pair + 1}: строки ${rowIndex1}-${rowIndex2}`);
    }
    console.log('');
  }

  console.log('=== Анализ проблемы ===');
  console.log('Проблема была в том, что для пятницы (startRow: 90) старая логика:');
  console.log('- Использовала orderedDays.length = 6 дней');
  console.log('- Обрабатывала пары от 0 до 5 (6 пар)');
  console.log('- Обрабатывала строки: 90-91, 92-93, 94-95, 96-97, 98-99, 100-101');
  console.log('- Но строки 94-101 уже содержали данные от четверга (70-89 диапазон)');
  console.log('');
  console.log('Новая логика:');
  console.log('- Ограничивает количество пар до 7 (реалистичное количество)');
  console.log('- Для каждого дня обрабатывает только свои строки');
  console.log('- Нет пересечения с данными других дней');
}

testScheduleParsing();
