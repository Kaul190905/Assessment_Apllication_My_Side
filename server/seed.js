const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Test = require('./models/Test');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Test.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // --- Seed Demo Student ---
    const demoStudent = await User.create({
      email: 'STU2025001',
      password: 'student123',
      name: 'Demo Student',
      role: 'student',
      rollNumber: 'STU2025001',
      department: 'Computer Science',
      semester: '6th Semester',
      batch: '2022-2026'
    });
    console.log(`👤 Created demo student: ${demoStudent.email}`);

    // --- Seed Sample Tests ---
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const tenDaysLater = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    const tests = [
      {
        testId: 'TEST001',
        topic: 'Java Programming Fundamentals',
        count: 5,
        duration: 30,
        difficulty: 'Easy',
        published: true,
        startDate: oneHourAgo,
        endDate: twoDaysLater,
        questions: [
          {
            id: 1,
            text: 'Which of the following is used to find and fix bugs in Java programs?',
            options: ['JVM', 'JRE', 'JDK', 'JDB'],
            marks: 2,
            answer: 'JDB'
          },
          {
            id: 2,
            text: 'What is the size of a float variable in Java?',
            options: ['8 bit', '16 bit', '32 bit', '64 bit'],
            marks: 2,
            answer: '32 bit'
          },
          {
            id: 3,
            text: 'Which keyword is used to prevent a class from being inherited?',
            options: ['static', 'super', 'final', 'abstract'],
            marks: 2,
            answer: 'final'
          },
          {
            id: 4,
            text: 'Which package contains all the classes and interfaces for the Collection framework?',
            options: ['java.lang', 'java.util', 'java.net', 'java.io'],
            marks: 2,
            answer: 'java.util'
          },
          {
            id: 5,
            text: 'What is the default value of a boolean variable in Java?',
            options: ['true', 'false', '0', 'null'],
            marks: 2,
            answer: 'false'
          }
        ]
      },
      {
        testId: 'TEST002',
        topic: 'Data Structures - Arrays & Linked Lists',
        count: 5,
        duration: 45,
        difficulty: 'Medium',
        published: true,
        startDate: oneHourAgo,
        endDate: fiveDaysLater,
        questions: [
          {
            id: 1,
            text: 'What is the time complexity of accessing an element in an array by index?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            marks: 2,
            answer: 'O(1)'
          },
          {
            id: 2,
            text: 'Which data structure uses FIFO (First In First Out)?',
            options: ['Stack', 'Queue', 'Tree', 'Graph'],
            marks: 2,
            answer: 'Queue'
          },
          {
            id: 3,
            text: 'What is the worst-case time complexity of inserting at the beginning of a singly linked list?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            marks: 2,
            answer: 'O(1)'
          },
          {
            id: 4,
            text: 'In a doubly linked list, each node contains how many pointers?',
            options: ['1', '2', '3', '4'],
            marks: 2,
            answer: '2'
          },
          {
            id: 5,
            text: 'Which of the following is NOT a type of linked list?',
            options: ['Singly', 'Doubly', 'Circular', 'Parallel'],
            marks: 2,
            answer: 'Parallel'
          }
        ]
      },
      {
        testId: 'TEST003',
        topic: 'Python Basics Quiz',
        count: 5,
        duration: 20,
        difficulty: 'Easy',
        published: true,
        startDate: twoDaysLater,
        endDate: tenDaysLater,
        questions: [
          {
            id: 1,
            text: 'What is the correct file extension for Python files?',
            options: ['.pyth', '.pt', '.py', '.pn'],
            marks: 2,
            answer: '.py'
          },
          {
            id: 2,
            text: 'Which of the following is used to define a function in Python?',
            options: ['function', 'def', 'fun', 'define'],
            marks: 2,
            answer: 'def'
          },
          {
            id: 3,
            text: 'What data type is the result of: type(3.14)?',
            options: ['int', 'float', 'double', 'decimal'],
            marks: 2,
            answer: 'float'
          },
          {
            id: 4,
            text: 'How do you create a list in Python?',
            options: ['list = ()', 'list = []', 'list = {}', 'list = <>'],
            marks: 2,
            answer: 'list = []'
          },
          {
            id: 5,
            text: 'Which keyword is used for conditional execution in Python?',
            options: ['switch', 'case', 'if', 'when'],
            marks: 2,
            answer: 'if'
          }
        ]
      },
      {
        testId: 'TEST004',
        topic: 'Database Management Systems',
        count: 5,
        duration: 60,
        difficulty: 'Hard',
        published: true,
        startDate: oneHourAgo,
        endDate: fiveDaysLater,
        questions: [
          {
            id: 1,
            text: 'Which normal form deals with transitive dependencies?',
            options: ['1NF', '2NF', '3NF', 'BCNF'],
            marks: 2,
            answer: '3NF'
          },
          {
            id: 2,
            text: 'What does ACID stand for in database transactions?',
            options: [
              'Atomicity, Consistency, Isolation, Durability',
              'Addition, Consistency, Isolation, Data',
              'Atomicity, Concurrency, Isolation, Durability',
              'Atomicity, Consistency, Integration, Durability'
            ],
            marks: 2,
            answer: 'Atomicity, Consistency, Isolation, Durability'
          },
          {
            id: 3,
            text: 'Which SQL command is used to remove a table from a database?',
            options: ['DELETE', 'REMOVE', 'DROP', 'DESTROY'],
            marks: 2,
            answer: 'DROP'
          },
          {
            id: 4,
            text: 'What type of join returns all records from both tables?',
            options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
            marks: 2,
            answer: 'FULL OUTER JOIN'
          },
          {
            id: 5,
            text: 'Which key uniquely identifies each row in a table?',
            options: ['Foreign Key', 'Primary Key', 'Candidate Key', 'Composite Key'],
            marks: 2,
            answer: 'Primary Key'
          }
        ]
      }
    ];

    await Test.insertMany(tests);
    console.log(`📝 Created ${tests.length} sample tests`);

    console.log('\n--- Seed Summary ---');
    console.log(`👤 Demo User:  STU2025001 / student123`);
    console.log(`📝 Tests:      ${tests.length} published tests`);
    console.log(`✅ Seeding complete!\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
