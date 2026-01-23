export const questions = [
  { 
    id: 1, 
    text: "Which of the following is used to find and fix bugs in Java programs?", 
    options: ["JVM", "JRE", "JDK", "JDB"],
    marks: 2
  },
  { 
    id: 2, 
    text: "What is the size of float variable?", 
    options: ["8 bit", "16 bit", "32 bit", "64 bit"],
    marks: 2 
  },
  { 
    id: 3, 
    text: "Automatic type conversion is possible in which of the following cases?", 
    options: ["Byte to int", "Int to long", "Long to int", "Short to int"],
    marks: 2 
  },
  { 
    id: 4, 
    text: "Which package contains all the classes and interfaces for collection framework?", 
    options: ["java.lang", "java.util", "java.net", "java.io"],
    marks: 2 
  },
  { 
    id: 5, 
    text: "Which of these method of HashSet is used to remove all the elements from HashSet?", 
    options: ["removeAll()", "clear()", "deleteAll()", "remove()"],
    marks: 2 
  }
];

// Fill to 20 questions for demo
while (questions.length < 20) {
  questions.push({
    id: questions.length + 1,
    text: `Sample Question ${questions.length + 1}: Choose the correct option`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    marks: 2
  });
}