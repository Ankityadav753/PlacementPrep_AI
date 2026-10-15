export const sortingBinarySearchQuestions = [
  {
    "id": "cq_43",
    "slug": "find-first-and-last-position-of-element-in-sorted-array",
    "title": "Find First and Last Position of Element in Sorted Array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "An array of integers nums sorted in non-decreasing order and target integer",
    "outputFormat": "Starting and ending position of target value as [first, last], or [-1, -1]",
    "referenceUrl": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    "attribution": "Dual binary search boundaries problem frequently tested in interview rounds.",
    "description": "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
    "constraints": [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "nums is a non-decreasing array.",
      "-10^9 <= target <= 10^9"
    ],
    "examples": [
      {
        "input": "nums = [5, 7, 7, 8, 8, 10], target = 8",
        "output": "[3, 4]",
        "explanation": "8 first appears at index 3 and last at index 4."
      },
      {
        "input": "nums = [5, 7, 7, 8, 8, 10], target = 6",
        "output": "[-1, -1]",
        "explanation": "6 is not present in the array."
      }
    ],
    "testCases": [
      {
        "input": "[5, 7, 7, 8, 8, 10], 8",
        "expectedOutput": "[3, 4]",
        "hidden": false
      },
      {
        "input": "[5, 7, 7, 8, 8, 10], 6",
        "expectedOutput": "[-1, -1]",
        "hidden": false
      },
      {
        "input": "[], 0",
        "expectedOutput": "[-1, -1]",
        "hidden": true
      },
      {
        "input": "[1], 1",
        "expectedOutput": "[0, 0]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    vector<int> searchRange(vector<int>& nums, int target) {\n        // Write your solution here\n        return {-1, -1};\n    }\n};",
      "java": "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{-1, -1};\n    }\n}",
      "python": "class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction searchRange(nums, target) {\n    // Write your solution here\n    return [-1, -1];\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_44",
    "slug": "search-a-2d-matrix",
    "title": "Search a 2D Matrix",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search",
      "Matrix"
    ],
    "inputFormat": "An m x n integer matrix matrix and an integer target",
    "outputFormat": "Boolean true if target is in matrix or false otherwise",
    "referenceUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
    "attribution": "Virtual 1D binary search on 2D flattened indices benchmark.",
    "description": "You are given an m x n integer matrix matrix with the following two properties: Each row is sorted in non-decreasing order. The first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise. You must write a solution in O(log(m * n)) time complexity.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 100",
      "-10^4 <= matrix[i][j], target <= 10^4"
    ],
    "examples": [
      {
        "input": "matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 3",
        "output": "true",
        "explanation": "3 is located at row 0, column 1."
      },
      {
        "input": "matrix = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target = 13",
        "output": "false",
        "explanation": "13 is not present in the matrix."
      }
    ],
    "testCases": [
      {
        "input": "[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13",
        "expectedOutput": "false",
        "hidden": false
      },
      {
        "input": "[[1]], 1",
        "expectedOutput": "true",
        "hidden": true
      },
      {
        "input": "[[1]], 2",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    bool searchMatrix(vector<vector<int>>& matrix, int target) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "class Solution:\n    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[][]} matrix\n * @param {number} target\n * @return {boolean}\n */\nfunction searchMatrix(matrix, target) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_45",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "A sorted rotated array of unique elements nums",
    "outputFormat": "The minimum element integer",
    "referenceUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    "attribution": "Binary search inflection point recognition question in interview rounds.",
    "description": "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times."
    ],
    "examples": [
      {
        "input": "nums = [3, 4, 5, 1, 2]",
        "output": "1",
        "explanation": "Original array was [1, 2, 3, 4, 5] rotated 3 times."
      },
      {
        "input": "nums = [4, 5, 6, 7, 0, 1, 2]",
        "output": "0",
        "explanation": "Original array was [0, 1, 2, 4, 5, 6, 7] and rotated 4 times."
      }
    ],
    "testCases": [
      {
        "input": "[3, 4, 5, 1, 2]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[4, 5, 6, 7, 0, 1, 2]",
        "expectedOutput": "0",
        "hidden": false
      },
      {
        "input": "[11, 13, 15, 17]",
        "expectedOutput": "11",
        "hidden": true
      },
      {
        "input": "[2, 1]",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int findMin(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def findMin(self, nums: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMin(nums) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_46",
    "slug": "peak-index-in-a-mountain-array",
    "title": "Peak Index in a Mountain Array",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "A mountain array arr",
    "outputFormat": "The index i such that arr[0] < arr[1] < ... < arr[i - 1] < arr[i] > arr[i + 1] > ... > arr[arr.length - 1]",
    "referenceUrl": "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
    "attribution": "Unimodal slope binary search pattern common in coding interviews.",
    "description": "An array arr is a mountain if arr.length >= 3 and there exists some i with 0 < i < arr.length - 1 such that arr[0] < arr[1] < ... < arr[i - 1] < arr[i] and arr[i] > arr[i + 1] > ... > arr[arr.length - 1]. Given a mountain array arr, return the index i of the peak element. You must solve it in O(log(arr.length)) time complexity.",
    "constraints": [
      "3 <= arr.length <= 10^5",
      "0 <= arr[i] <= 10^6",
      "arr is guaranteed to be a mountain array."
    ],
    "examples": [
      {
        "input": "arr = [0, 1, 0]",
        "output": "1",
        "explanation": "Peak is at index 1."
      },
      {
        "input": "arr = [0, 2, 1, 0]",
        "output": "1",
        "explanation": "Peak is at index 1."
      }
    ],
    "testCases": [
      {
        "input": "[0, 1, 0]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[0, 2, 1, 0]",
        "expectedOutput": "1",
        "hidden": false
      },
      {
        "input": "[0, 10, 5, 2]",
        "expectedOutput": "1",
        "hidden": true
      },
      {
        "input": "[3, 4, 5, 1]",
        "expectedOutput": "2",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int peakIndexInMountainArray(vector<int>& arr) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int peakIndexInMountainArray(int[] arr) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def peakIndexInMountainArray(self, arr: list[int]) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} arr\n * @return {number}\n */\nfunction peakIndexInMountainArray(arr) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_47",
    "slug": "koko-eating-bananas",
    "title": "Koko Eating Bananas",
    "difficulty": "Medium",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search"
    ],
    "inputFormat": "An integer array piles and an integer h",
    "outputFormat": "The minimum integer eating speed k such that Koko can eat all bananas within h hours",
    "referenceUrl": "https://leetcode.com/problems/koko-eating-bananas/",
    "attribution": "Binary search on answer space standard in product engineering interviews.",
    "description": "Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile and eats k bananas from it. If the pile has less than k bananas, she eats all of them and will not eat any more during that hour. Return the minimum integer k such that she can eat all bananas within h hours.",
    "constraints": [
      "1 <= piles.length <= 10^4",
      "piles.length <= h <= 10^9",
      "1 <= piles[i] <= 10^9"
    ],
    "examples": [
      {
        "input": "piles = [3, 6, 7, 11], h = 8",
        "output": "4",
        "explanation": "With speed 4, Koko takes 1 + 2 + 2 + 3 = 8 hours."
      },
      {
        "input": "piles = [30, 11, 23, 4, 20], h = 5",
        "output": "30",
        "explanation": "Speed 30 is required since each pile takes 1 hour."
      }
    ],
    "testCases": [
      {
        "input": "[3, 6, 7, 11], 8",
        "expectedOutput": "4",
        "hidden": false
      },
      {
        "input": "[30, 11, 23, 4, 20], 5",
        "expectedOutput": "30",
        "hidden": false
      },
      {
        "input": "[30, 11, 23, 4, 20], 6",
        "expectedOutput": "23",
        "hidden": true
      },
      {
        "input": "[312884470], 968709470",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    int minEatingSpeed(vector<int>& piles, int h) {\n        // Write your solution here\n        return 0;\n    }\n};",
      "java": "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        // Write your solution here\n        return 0;\n    }\n}",
      "python": "class Solution:\n    def minEatingSpeed(self, piles: list[int], h: int) -> int:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} piles\n * @param {number} h\n * @return {number}\n */\nfunction minEatingSpeed(piles, h) {\n    // Write your solution here\n    return 0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_48",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "Hard",
    "topic": "Binary Search",
    "tags": [
      "Array",
      "Binary Search",
      "Divide and Conquer"
    ],
    "inputFormat": "Two sorted arrays nums1 and nums2 of size m and n respectively",
    "outputFormat": "The median of the two sorted arrays as a double / float",
    "referenceUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    "attribution": "Dual array binary partition classic (Google, Microsoft, Amazon).",
    "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    "constraints": [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    "examples": [
      {
        "input": "nums1 = [1, 3], nums2 = [2]",
        "output": "2.0",
        "explanation": "Merged array = [1, 2, 3] and median is 2."
      },
      {
        "input": "nums1 = [1, 2], nums2 = [3, 4]",
        "output": "2.5",
        "explanation": "Merged array = [1, 2, 3, 4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    "testCases": [
      {
        "input": "[1, 3], [2]",
        "expectedOutput": "2.0",
        "hidden": false
      },
      {
        "input": "[1, 2], [3, 4]",
        "expectedOutput": "2.5",
        "hidden": false
      },
      {
        "input": "[0, 0], [0, 0]",
        "expectedOutput": "0.0",
        "hidden": true
      },
      {
        "input": "[], [1]",
        "expectedOutput": "1.0",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n};",
      "java": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}",
      "python": "class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nfunction findMedianSortedArrays(nums1, nums2) {\n    // Write your solution here\n    return 0.0;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default sortingBinarySearchQuestions;
