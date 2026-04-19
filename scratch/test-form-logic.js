// Simple test to verify the form validation logic
const testFormValidation = () => {
  console.log('Testing form validation logic...\n');

  // Test cases for isFormValid
  const testCases = [
    {
      name: 'Empty form',
      formData: { name: '', durationDays: '', priceUSD: '' },
      expected: false
    },
    {
      name: 'Only name filled',
      formData: { name: 'Test Course', durationDays: '', priceUSD: '' },
      expected: false
    },
    {
      name: 'Name and duration filled',
      formData: { name: 'Test Course', durationDays: '28', priceUSD: '' },
      expected: false
    },
    {
      name: 'All required fields filled',
      formData: { name: 'Test Course', durationDays: '28', priceUSD: '1200' },
      expected: true
    },
    {
      name: 'Invalid duration (non-numeric)',
      formData: { name: 'Test Course', durationDays: 'abc', priceUSD: '1200' },
      expected: false
    },
    {
      name: 'Invalid price (non-numeric)',
      formData: { name: 'Test Course', durationDays: '28', priceUSD: 'abc' },
      expected: false
    },
    {
      name: 'Whitespace-only name',
      formData: { name: '   ', durationDays: '28', priceUSD: '1200' },
      expected: false
    }
  ];

  testCases.forEach((testCase, index) => {
    const isFormValid = testCase.formData.name.trim() &&
                       testCase.formData.durationDays &&
                       !isNaN(Number(testCase.formData.durationDays)) &&
                       testCase.formData.priceUSD &&
                       !isNaN(Number(testCase.formData.priceUSD));

    const passed = isFormValid === testCase.expected;
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Form data: ${JSON.stringify(testCase.formData)}`);
    console.log(`  isFormValid: ${isFormValid} (expected: ${testCase.expected}) - ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
  });

  console.log('Form validation logic test completed.');
};

// Test validation function
const testValidation = () => {
  console.log('Testing validation function...\n');

  const validate = (formData) => {
    if (!formData.name.trim()) return "Course Title is required.";
    if (!formData.durationDays || isNaN(Number(formData.durationDays))) return "Valid duration in days is required.";
    if (!formData.priceUSD || isNaN(Number(formData.priceUSD))) return "Valid Base Price (USD) is required.";
    return null;
  };

  const testCases = [
    { formData: { name: '', durationDays: '28', priceUSD: '1200' }, expected: "Course Title is required." },
    { formData: { name: 'Test', durationDays: '', priceUSD: '1200' }, expected: "Valid duration in days is required." },
    { formData: { name: 'Test', durationDays: 'abc', priceUSD: '1200' }, expected: "Valid duration in days is required." },
    { formData: { name: 'Test', durationDays: '28', priceUSD: '' }, expected: "Valid Base Price (USD) is required." },
    { formData: { name: 'Test', durationDays: '28', priceUSD: 'abc' }, expected: "Valid Base Price (USD) is required." },
    { formData: { name: 'Test', durationDays: '28', priceUSD: '1200' }, expected: null }
  ];

  testCases.forEach((testCase, index) => {
    const result = validate(testCase.formData);
    const passed = result === testCase.expected;
    console.log(`Validation Test ${index + 1}:`);
    console.log(`  Input: ${JSON.stringify(testCase.formData)}`);
    console.log(`  Expected: "${testCase.expected}"`);
    console.log(`  Got: "${result}" - ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
  });

  console.log('Validation function test completed.');
};

testFormValidation();
testValidation();