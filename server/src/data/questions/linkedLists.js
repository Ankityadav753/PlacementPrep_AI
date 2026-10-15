export const linkedListsQuestions = [
  {
    "id": "cq_49",
    "slug": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "difficulty": "Easy",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Recursion"
    ],
    "inputFormat": "The heads of two sorted linked lists list1 and list2",
    "outputFormat": "The head of the merged sorted linked list",
    "referenceUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
    "attribution": "Classic iterative / recursive two-pointer linked list merging question.",
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    "constraints": [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    "examples": [
      {
        "input": "list1 = [1, 2, 4], list2 = [1, 3, 4]",
        "output": "[1, 1, 2, 3, 4, 4]",
        "explanation": "Interleaving nodes maintains sorted order."
      },
      {
        "input": "list1 = [], list2 = []",
        "output": "[]",
        "explanation": "Merging two empty lists results in an empty list."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 4], [1, 3, 4]",
        "expectedOutput": "[1, 1, 2, 3, 4, 4]",
        "hidden": false
      },
      {
        "input": "[], []",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "[], [0]",
        "expectedOutput": "[0]",
        "hidden": true
      },
      {
        "input": "[5], [1, 2, 4]",
        "expectedOutput": "[1, 2, 4, 5]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} list1\n * @param {ListNode} list2\n * @return {ListNode}\n */\nfunction mergeTwoLists(list1, list2) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_50",
    "slug": "linked-list-cycle",
    "title": "Linked List Cycle",
    "difficulty": "Easy",
    "topic": "Linked List",
    "tags": [
      "Hash Table",
      "Linked List",
      "Two Pointers"
    ],
    "inputFormat": "head, the head of a linked list",
    "outputFormat": "Boolean true if there is a cycle in the linked list, or false otherwise",
    "referenceUrl": "https://leetcode.com/problems/linked-list-cycle/",
    "attribution": "Floyds cycle-finding algorithm (slow and fast pointers) textbook problem.",
    "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Return true if there is a cycle in the linked list. Otherwise, return false.",
    "constraints": [
      "The number of the nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list."
    ],
    "examples": [
      {
        "input": "head = [3, 2, 0, -4], pos = 1",
        "output": "true",
        "explanation": "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)."
      },
      {
        "input": "head = [1, 2], pos = 0",
        "output": "true",
        "explanation": "There is a cycle in the linked list, where the tail connects to the 0th node."
      }
    ],
    "testCases": [
      {
        "input": "[3, 2, 0, -4], pos = 1",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1, 2], pos = 0",
        "expectedOutput": "true",
        "hidden": false
      },
      {
        "input": "[1], pos = -1",
        "expectedOutput": "false",
        "hidden": true
      },
      {
        "input": "[], pos = -1",
        "expectedOutput": "false",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Write your solution here\n        return false;\n    }\n};",
      "java": "/**\n * Definition for singly-linked list.\n * class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; next = null; }\n * }\n */\npublic class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Write your solution here\n        return false;\n    }\n}",
      "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, x):\n#         self.val = x\n#         self.next = None\nclass Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val) {\n *     this.val = val;\n *     this.next = null;\n * }\n */\n/**\n * @param {ListNode} head\n * @return {boolean}\n */\nfunction hasCycle(head) {\n    // Write your solution here\n    return false;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_51",
    "slug": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End of List",
    "difficulty": "Medium",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Two Pointers"
    ],
    "inputFormat": "The head of a linked list and an integer n",
    "outputFormat": "The head of the modified linked list",
    "referenceUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "attribution": "One-pass two-pointer fast/slow runner technique standard.",
    "description": "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    "constraints": [
      "The number of nodes in the list is sz.",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ],
    "examples": [
      {
        "input": "head = [1, 2, 3, 4, 5], n = 2",
        "output": "[1, 2, 3, 5]",
        "explanation": "The 2nd node from the end is 4. Removing it yields [1, 2, 3, 5]."
      },
      {
        "input": "head = [1], n = 1",
        "output": "[]",
        "explanation": "Removing only node yields empty list."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4, 5], 2",
        "expectedOutput": "[1, 2, 3, 5]",
        "hidden": false
      },
      {
        "input": "[1], 1",
        "expectedOutput": "[]",
        "hidden": false
      },
      {
        "input": "[1, 2], 1",
        "expectedOutput": "[1]",
        "hidden": true
      },
      {
        "input": "[1, 2], 2",
        "expectedOutput": "[2]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(NULL) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode(int x) { val = x; }\n * }\n */\nclass Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @param {number} n\n * @return {ListNode}\n */\nfunction removeNthFromEnd(head, n) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_52",
    "slug": "reorder-list",
    "title": "Reorder List",
    "difficulty": "Medium",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Two Pointers",
      "Stack",
      "Recursion"
    ],
    "inputFormat": "The head of a singly linked-list",
    "outputFormat": "The list reordered in-place",
    "referenceUrl": "https://leetcode.com/problems/reorder-list/",
    "attribution": "Composite linked list manipulation: find middle, reverse second half, merge.",
    "description": "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → … You may not modify the values in the list's nodes. Only nodes themselves may be changed.",
    "constraints": [
      "The number of nodes in the list is in the range [1, 5 * 10^4].",
      "1 <= Node.val <= 1000"
    ],
    "examples": [
      {
        "input": "head = [1, 2, 3, 4]",
        "output": "[1, 4, 2, 3]",
        "explanation": "Nodes interwoven from ends."
      },
      {
        "input": "head = [1, 2, 3, 4, 5]",
        "output": "[1, 5, 2, 4, 3]",
        "explanation": "Odd length list reordering."
      }
    ],
    "testCases": [
      {
        "input": "[1, 2, 3, 4]",
        "expectedOutput": "[1, 4, 2, 3]",
        "hidden": false
      },
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "[1, 5, 2, 4, 3]",
        "hidden": false
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "hidden": true
      },
      {
        "input": "[1, 2]",
        "expectedOutput": "[1, 2]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    void reorderList(ListNode* head) {\n        // Write your solution here\n    }\n};",
      "java": "class Solution {\n    public void reorderList(ListNode head) {\n        // Write your solution here\n    }\n}",
      "python": "class Solution:\n    def reorderList(self, head: Optional[ListNode]) -> None:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {ListNode} head\n * @return {void} Do not return anything, modify head in-place instead.\n */\nfunction reorderList(head) {\n    // Write your solution here\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_53",
    "slug": "add-two-numbers",
    "title": "Add Two Numbers",
    "difficulty": "Medium",
    "topic": "Linked List",
    "tags": [
      "Linked List",
      "Math",
      "Recursion"
    ],
    "inputFormat": "Two non-empty linked lists l1 and l2 representing two non-negative integers",
    "outputFormat": "The sum as a linked list in reverse digit order",
    "referenceUrl": "https://leetcode.com/problems/add-two-numbers/",
    "attribution": "Carry propagation on linked list digit streams interview classic.",
    "description": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    "constraints": [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    "examples": [
      {
        "input": "l1 = [2, 4, 3], l2 = [5, 6, 4]",
        "output": "[7, 0, 8]",
        "explanation": "342 + 465 = 807."
      },
      {
        "input": "l1 = [0], l2 = [0]",
        "output": "[0]",
        "explanation": "0 + 0 = 0."
      }
    ],
    "testCases": [
      {
        "input": "[2, 4, 3], [5, 6, 4]",
        "expectedOutput": "[7, 0, 8]",
        "hidden": false
      },
      {
        "input": "[0], [0]",
        "expectedOutput": "[0]",
        "hidden": false
      },
      {
        "input": "[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]",
        "expectedOutput": "[8, 9, 9, 9, 0, 0, 0, 1]",
        "hidden": true
      },
      {
        "input": "[1, 8], [0]",
        "expectedOutput": "[1, 8]",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nfunction addTwoNumbers(l1, l2) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  },
  {
    "id": "cq_54",
    "slug": "intersection-of-two-linked-lists",
    "title": "Intersection of Two Linked Lists",
    "difficulty": "Easy",
    "topic": "Linked List",
    "tags": [
      "Hash Table",
      "Linked List",
      "Two Pointers"
    ],
    "inputFormat": "The heads of two singly linked-lists headA and headB",
    "outputFormat": "The node at which the two lists intersect, or null if no intersection",
    "referenceUrl": "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "attribution": "Two-pointer path alignment question frequently featured in technical tests.",
    "description": "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.",
    "constraints": [
      "The number of nodes of listA is in the m.",
      "The number of nodes of listB is in the n.",
      "1 <= m, n <= 3 * 10^4",
      "1 <= Node.val <= 10^5"
    ],
    "examples": [
      {
        "input": "intersectVal = 8, listA = [4, 1, 8, 4, 5], listB = [5, 6, 1, 8, 4, 5], skipA = 2, skipB = 3",
        "output": "Intersected at '8'",
        "explanation": "The intersected node's value is 8."
      },
      {
        "input": "intersectVal = 2, listA = [1, 9, 1, 2, 4], listB = [3, 2, 4], skipA = 3, skipB = 1",
        "output": "Intersected at '2'",
        "explanation": "The intersected node's value is 2."
      }
    ],
    "testCases": [
      {
        "input": "8, [4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3",
        "expectedOutput": "8",
        "hidden": false
      },
      {
        "input": "2, [1, 9, 1, 2, 4], [3, 2, 4], 3, 1",
        "expectedOutput": "2",
        "hidden": false
      },
      {
        "input": "0, [2, 6, 4], [1, 5], 3, 2",
        "expectedOutput": "null",
        "hidden": true
      },
      {
        "input": "1, [1], [1], 0, 0",
        "expectedOutput": "1",
        "hidden": true
      }
    ],
    "starterCode": {
      "cpp": "class Solution {\npublic:\n    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {\n        // Write your solution here\n        return nullptr;\n    }\n};",
      "java": "public class Solution {\n    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {\n        // Write your solution here\n        return null;\n    }\n}",
      "python": "class Solution:\n    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:\n        # Write your solution here\n        pass",
      "javascript": "/**\n * @param {ListNode} headA\n * @param {ListNode} headB\n * @return {ListNode}\n */\nfunction getIntersectionNode(headA, headB) {\n    // Write your solution here\n    return null;\n}"
    },
    "supportedLanguages": [
      "cpp",
      "java",
      "python",
      "javascript"
    ]
  }
];
export default linkedListsQuestions;
