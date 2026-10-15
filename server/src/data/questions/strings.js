export const stringsQuestions = [
  {
    "id": "cq_30",
    "slug": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "Easy",
    "topic": "Strings",
    "tags": [
      "Hash Table",
      "String",
      "Sorting"
    ],
    "inputFormat": "Two strings s and t",
    "outputFormat": "Boolean true if t is an anagram of s, false otherwise",
    "referenceUrl": "https://leetcode.com/problems/valid-anagram/",
    "attribution": "Fundamental frequency table problem for service and product company screenings.",
    "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "explanation": "Both words contain the same characters with identical frequencies."
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false",
        "explanation": "Character sets differ."
      }
    ],
    "testCases": [
      {
        "input": "\"anagram\", \"nagaram\"",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "\"rat\", \"car\"",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "\"a\", \"ab\"",
        "expectedOutput": "false",
        "hidden": true
      },
      {
        "input": "\"listen\", \"silent\"",
        "expectedOutput": "true",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_31",
    "slug": "longest-common-prefix",
    "title": "Longest Common Prefix",
    "difficulty": "Easy",
    "topic": "Strings",
    "tags": [
      "String",
      "Trie"
    ],
    "inputFormat": "An array of strings strs",
    "outputFormat": "The longest common prefix string among the array",
    "referenceUrl": "https://leetcode.com/problems/longest-common-prefix/",
    "attribution": "Common string scanning problem in fresher interview assessments.",
    "description": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
    "constraints": [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] consists of only lowercase English letters."
    ],
    "examples": [
      {
        "input": "strs = [\"flower\", \"flow\", \"flight\"]",
        "output": "\"fl\"",
        "explanation": "\"fl\" is the prefix common to all three strings."
      },
      {
        "input": "strs = [\"dog\", \"racecar\", \"car\"]",
        "output": "\"\"",
        "explanation": "There is no common prefix among the input strings."
      }
    ],
    "testCases": [
      {
        "input": "[\"flower\", \"flow\", \"flight\"]",
        "expectedOutput": "\"fl\"",
        "hidden": false
      },
      {
        "input": "[\"dog\", \"racecar\", \"car\"]",
        "expectedOutput": "\"\"",
        "hidden": false
      },
      {
        "input": "[\"interspecies\", \"interstellar\", \"interstate\"]",
        "expectedOutput": "\"inters\"",
        "hidden": true
      },
      {
        "input": "[\"throne\"]",
        "expectedOutput": "\"throne\"",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your solution here\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "python": "class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string[]} strs\n * @return {string}\n */\nfunction longestCommonPrefix(strs) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_32",
    "slug": "roman-to-integer",
    "title": "Roman to Integer",
    "difficulty": "Easy",
    "topic": "Strings",
    "tags": [
      "Hash Table",
      "Math",
      "String"
    ],
    "inputFormat": "A string s representing a Roman numeral",
    "outputFormat": "The integer value of the Roman numeral",
    "referenceUrl": "https://leetcode.com/problems/roman-to-integer/",
    "attribution": "Classic symbol mapping question popular in MNC coding challenges.",
    "description": "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
    "constraints": [
      "1 <= s.length <= 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
      "It is guaranteed that s is a valid roman numeral in the range [1, 3999]."
    ],
    "examples": [
      {
        "input": "s = \"III\"",
        "output": "3",
        "explanation": "III = 3."
      },
      {
        "input": "s = \"LVIII\"",
        "output": "58",
        "explanation": "L = 50, V = 5, III = 3."
      }
    ],
    "testCases": [
      {
        "input": "\"III\"",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "\"LVIII\"",
        "expectedOutput": "58",
        "hidden": false
      },
      {
        "input": "\"MCMXCIV\"",
        "expectedOutput": "1994",
        "hidden": true
      },
      {
        "input": "\"IX\"",
        "expectedOutput": "9",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int romanToInt(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int romanToInt(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def romanToInt(self, s: str) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction romanToInt(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_33",
    "slug": "integer-to-roman",
    "title": "Integer to Roman",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "Hash Table",
      "Math",
      "String"
    ],
    "inputFormat": "An integer num",
    "outputFormat": "The Roman numeral string representation",
    "referenceUrl": "https://leetcode.com/problems/integer-to-roman/",
    "attribution": "Greedy subtraction and symbol table construction interview problem.",
    "description": "Given an integer num, convert it to a Roman numeral. Seven symbols represent Roman values: I (1), V (5), X (10), L (50), C (100), D (500), M (1000).",
    "constraints": [
      "1 <= num <= 3999"
    ],
    "examples": [
      {
        "input": "num = 3749",
        "output": "\"MMMDCCXLIX\"",
        "explanation": "3000 = MMM, 700 = DCC, 40 = XL, 9 = IX."
      },
      {
        "input": "num = 58",
        "output": "\"LVIII\"",
        "explanation": "50 = L, 8 = VIII."
      }
    ],
    "testCases": [
      {
        "input": "3749",
        "expectedOutput": "\"MMMDCCXLIX\"",
        "hidden": false
      },
      {
        "input": "58",
        "expectedOutput": "\"LVIII\"",
        "hidden": false
      },
      {
        "input": "1994",
        "expectedOutput": "\"MCMXCIV\"",
        "hidden": true
      },
      {
        "input": "4",
        "expectedOutput": "\"IV\"",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    string intToRoman(int num) {\n        // Write your solution here\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String intToRoman(int num) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "python": "class Solution:\n    def intToRoman(self, num: int) -> str:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} num\n * @return {string}\n */\nfunction intToRoman(num) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_34",
    "slug": "string-to-integer-atoi",
    "title": "String to Integer (atoi)",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "String"
    ],
    "inputFormat": "A string s",
    "outputFormat": "A 32-bit signed integer",
    "referenceUrl": "https://leetcode.com/problems/string-to-integer-atoi/",
    "attribution": "Boundary condition and edge case parsing standard in tech interviews.",
    "description": "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function). Discard leading whitespaces, detect sign, convert digits, and clamp to [-2^31, 2^31 - 1].",
    "constraints": [
      "0 <= s.length <= 200",
      "s consists of English letters, digits, ' ', '+', '-', and '.'."
    ],
    "examples": [
      {
        "input": "s = \"42\"",
        "output": "42",
        "explanation": "Leading characters form integer 42."
      },
      {
        "input": "s = \"   -042\"",
        "output": "-42",
        "explanation": "Whitespaces read and ignored, \"-\" taken, digits read as 42."
      }
    ],
    "testCases": [
      {
        "input": "\"42\"",
        "expectedOutput": "42",
        "hidden": false
      },
      {
        "input": "\"   -042\"",
        "expectedOutput": "-42",
        "hidden": false
      },
      {
        "input": "\"1337c0d3\"",
        "expectedOutput": "1337",
        "hidden": true
      },
      {
        "input": "\"-91283472332\"",
        "expectedOutput": "-2147483648",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int myAtoi(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int myAtoi(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def myAtoi(self, s: str) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction myAtoi(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_35",
    "slug": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "Two Pointers",
      "String",
      "Dynamic Programming"
    ],
    "inputFormat": "A string s",
    "outputFormat": "The longest palindromic substring in s",
    "referenceUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
    "attribution": "Expand around center pattern standard across top software engineering roles.",
    "description": "Given a string s, return the longest palindromic substring in s.",
    "constraints": [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    "examples": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\"",
        "explanation": "\"aba\" is also a valid answer."
      },
      {
        "input": "s = \"cbbd\"",
        "output": "\"bb\"",
        "explanation": "\"bb\" is the longest palindromic substring."
      }
    ],
    "testCases": [
      {
        "input": "\"babad\"",
        "expectedOutput": "\"bab\"",
        "hidden": false
      },
      {
        "input": "\"cbbd\"",
        "expectedOutput": "\"bb\"",
        "hidden": false
      },
      {
        "input": "\"a\"",
        "expectedOutput": "\"a\"",
        "hidden": true
      },
      {
        "input": "\"racecar\"",
        "expectedOutput": "\"racecar\"",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your solution here\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String longestPalindrome(String s) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "python": "class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {string}\n */\nfunction longestPalindrome(s) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_36",
    "slug": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "Two Pointers",
      "String",
      "Dynamic Programming"
    ],
    "inputFormat": "A string s",
    "outputFormat": "The number of palindromic substrings in s",
    "referenceUrl": "https://leetcode.com/problems/palindromic-substrings/",
    "attribution": "Center expansion counting problem featured in interview questions.",
    "description": "Given a string s, return the number of palindromic substrings in it. A string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.",
    "constraints": [
      "1 <= s.length <= 1000",
      "s consists of lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"abc\"",
        "output": "3",
        "explanation": "Three palindromic strings: \"a\", \"b\", \"c\"."
      },
      {
        "input": "s = \"aaa\"",
        "output": "6",
        "explanation": "Six palindromic strings: \"a\", \"a\", \"a\", \"aa\", \"aa\", \"aaa\"."
      }
    ],
    "testCases": [
      {
        "input": "\"abc\"",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "\"aaa\"",
        "expectedOutput": "6",
        "hidden": false
      },
      {
        "input": "\"fdsklf\"",
        "expectedOutput": "6",
        "hidden": true
      },
      {
        "input": "\"abccba\"",
        "expectedOutput": "9",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int countSubstrings(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int countSubstrings(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def countSubstrings(self, s: str) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @return {number}\n */\nfunction countSubstrings(s) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_37",
    "slug": "count-and-say",
    "title": "Count and Say",
    "difficulty": "Medium",
    "topic": "Strings",
    "tags": [
      "String"
    ],
    "inputFormat": "A positive integer n",
    "outputFormat": "The nth element of the count-and-say sequence",
    "referenceUrl": "https://leetcode.com/problems/count-and-say/",
    "attribution": "Run-length encoding string generation common in TCS and Infosys.",
    "description": "The count-and-say sequence is a sequence of digit strings defined by the recursive formula: countAndSay(1) = \"1\", and countAndSay(n) is the run-length encoding of countAndSay(n - 1). Given a positive integer n, return the nth element of the count-and-say sequence.",
    "constraints": [
      "1 <= n <= 30"
    ],
    "examples": [
      {
        "input": "n = 1",
        "output": "\"1\"",
        "explanation": "Base case."
      },
      {
        "input": "n = 4",
        "output": "\"1211\"",
        "explanation": "countAndSay(1) = \"1\", countAndSay(2) = \"11\", countAndSay(3) = \"21\", countAndSay(4) = \"1211\"."
      }
    ],
    "testCases": [
      {
        "input": "1",
        "expectedOutput": "\"1\"",
        "hidden": false
      },
      {
        "input": "4",
        "expectedOutput": "\"1211\"",
        "hidden": false
      },
      {
        "input": "5",
        "expectedOutput": "\"111221\"",
        "hidden": true
      },
      {
        "input": "2",
        "expectedOutput": "\"11\"",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    string countAndSay(int n) {\n        // Write your solution here\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String countAndSay(int n) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "python": "class Solution:\n    def countAndSay(self, n: int) -> str:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {string}\n */\nfunction countAndSay(n) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_38",
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "difficulty": "Hard",
    "topic": "Strings",
    "tags": [
      "Hash Table",
      "String",
      "Sliding Window"
    ],
    "inputFormat": "Two strings s and t of lengths m and n",
    "outputFormat": "The minimum window substring of s such that every character in t is included",
    "referenceUrl": "https://leetcode.com/problems/minimum-window-substring/",
    "attribution": "Hard-level sliding window benchmark problem asked across FAANG/MAANG.",
    "description": "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
    "constraints": [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters."
    ],
    "examples": [
      {
        "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
        "output": "\"BANC\"",
        "explanation": "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t."
      },
      {
        "input": "s = \"a\", t = \"a\"",
        "output": "\"a\"",
        "explanation": "Entire string is the minimum window."
      }
    ],
    "testCases": [
      {
        "input": "\"ADOBECODEBANC\", \"ABC\"",
        "expectedOutput": "\"BANC\"",
        "hidden": false
      },
      {
        "input": "\"a\", \"a\"",
        "expectedOutput": "\"a\"",
        "hidden": false
      },
      {
        "input": "\"a\", \"aa\"",
        "expectedOutput": "\"\"",
        "hidden": true
      },
      {
        "input": "\"ab\", \"b\"",
        "expectedOutput": "\"b\"",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your solution here\n        return \"\";\n    }\n};",
      "java": "class Solution {\n    public String minWindow(String s, String t) {\n        // Write your solution here\n        return \"\";\n    }\n}",
      "python": "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {string} s\n * @param {string} t\n * @return {string}\n */\nfunction minWindow(s, t) {\n    // Write your solution here\n    return \"\";\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default stringsQuestions;
