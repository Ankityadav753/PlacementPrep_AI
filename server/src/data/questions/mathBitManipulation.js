export const mathBitManipulationQuestions = [
  {
    "id": "cq_97",
    "slug": "single-number",
    "title": "Single Number",
    "difficulty": "Easy",
    "topic": "Bit Manipulation",
    "tags": [
      "Array",
      "Bit Manipulation"
    ],
    "inputFormat": "A non-empty array of integers nums",
    "outputFormat": "The single element that appears only once",
    "referenceUrl": "https://leetcode.com/problems/single-number/",
    "attribution": "XOR self-cancellation property interview classic.",
    "description": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4",
      "Each element in the array appears twice except for one element which appears only once."
    ],
    "examples": [
      {
        "input": "nums = [2, 2, 1]",
        "output": "1",
        "explanation": "1 appears once."
      },
      {
        "input": "nums = [4, 1, 2, 1, 2]",
        "output": "4",
        "explanation": "4 appears once."
      }
    ],
    "testCases": [
      {
        "input": "[2, 2, 1]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[4, 1, 2, 1, 2]",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[-1, -1, -2]",
        "expectedOutput": "-2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction singleNumber(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_98",
    "slug": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "difficulty": "Easy",
    "topic": "Bit Manipulation",
    "tags": [
      "Divide and Conquer",
      "Bit Manipulation"
    ],
    "inputFormat": "A positive integer n",
    "outputFormat": "The number of set bits (Hamming weight)",
    "referenceUrl": "https://leetcode.com/problems/number-of-1-bits/",
    "attribution": "Brian Kernighan's algorithm bit manipulation standard.",
    "description": "Given a positive integer n, write a function that returns the number of set bits in its binary representation (also known as the Hamming weight).",
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "examples": [
      {
        "input": "n = 11",
        "output": "3",
        "explanation": "The input binary string 1011 has a total of three set bits."
      },
      {
        "input": "n = 128",
        "output": "1",
        "explanation": "The input binary string 10000000 has a total of one set bit."
      }
    ],
    "testCases": [
      {
        "input": "11",
        "expectedOutput": "3",
        "hidden": false
      },
      {
        "input": "128",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "2147483645",
        "expectedOutput": "30",
        "hidden": true
      },
      {
        "input": "1",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int hammingWeight(int n) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int hammingWeight(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_99",
    "slug": "counting-bits",
    "title": "Counting Bits",
    "difficulty": "Easy",
    "topic": "Bit Manipulation",
    "tags": [
      "Dynamic Programming",
      "Bit Manipulation"
    ],
    "inputFormat": "An integer n",
    "outputFormat": "An array ans of length n + 1 such that ans[i] is the number of 1's in binary representation of i",
    "referenceUrl": "https://leetcode.com/problems/counting-bits/",
    "attribution": "Bit DP relation ans[i] = ans[i >> 1] + (i & 1).",
    "description": "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i. You should do it in linear time O(n).",
    "constraints": [
      "0 <= n <= 10^5"
    ],
    "examples": [
      {
        "input": "n = 2",
        "output": "[0, 1, 1]",
        "explanation": "0 --> 0, 1 --> 1, 2 --> 10."
      },
      {
        "input": "n = 5",
        "output": "[0, 1, 1, 2, 1, 2]",
        "explanation": "0 --> 0, 1 --> 1, 2 --> 10, 3 --> 11, 4 --> 100, 5 --> 101."
      }
    ],
    "testCases": [
      {
        "input": "2",
        "expectedOutput": "[0, 1, 1]",
        "hidden": false
      },
      {
        "input": "5",
        "expectedOutput": "[0, 1, 1, 2, 1, 2]",
        "hidden": false
      },
      {
        "input": "0",
        "expectedOutput": "[0]",
        "hidden": true
      },
      {
        "input": "1",
        "expectedOutput": "[0, 1]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> countBits(int n) {\n        // Write your solution here\n        return {};\n    }\n};",
      "java": "class Solution {\n    public int[] countBits(int n) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "python": "class Solution:\n    def countBits(self, n: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n\n * @return {number[]}\n */\nfunction countBits(n) {\n    // Write your solution here\n    return [];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_100",
    "slug": "reverse-bits",
    "title": "Reverse Bits",
    "difficulty": "Easy",
    "topic": "Bit Manipulation",
    "tags": [
      "Divide and Conquer",
      "Bit Manipulation"
    ],
    "inputFormat": "A 32-bit unsigned integer represented in decimal or binary",
    "outputFormat": "The reversed 32-bit unsigned integer value",
    "referenceUrl": "https://leetcode.com/problems/reverse-bits/",
    "attribution": "32-bit bitwise shifting and mask construction interview standard.",
    "description": "Reverse bits of a given 32 bits unsigned integer.",
    "constraints": [
      "The input must be a binary string of length 32."
    ],
    "examples": [
      {
        "input": "n = 00000010100101000001111010011100",
        "output": "964176192",
        "explanation": "The input binary string 00000010100101000001111010011100 represents the unsigned integer 43261596, so return 964176192 which its binary representation is 00111001011110000010100101000000."
      },
      {
        "input": "n = 11111111111111111111111111111101",
        "output": "3221225471",
        "explanation": "Reversing gives 10111111111111111111111111111111."
      }
    ],
    "testCases": [
      {
        "input": "43261596",
        "expectedOutput": "964176192",
        "hidden": false
      },
      {
        "input": "4294967293",
        "expectedOutput": "3221225471",
        "hidden": false
      },
      {
        "input": "1",
        "expectedOutput": "2147483648",
        "hidden": true
      },
      {
        "input": "0",
        "expectedOutput": "0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "public class Solution {\n    public int reverseBits(int n) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def reverseBits(self, n: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number} n - a positive integer\n * @return {number} - a positive integer\n */\nfunction reverseBits(n) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default mathBitManipulationQuestions;
