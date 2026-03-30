export interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcode: string;
  gfg: string;
  topic: string;
}

export interface Sheet {
  id: string;
  name: string;
  educator: string;
  description: string;
  icon: string;
  questions: Question[];
}

const arrayQuestions: Question[] = [
  { id: "a1", title: "Two Sum", difficulty: "Easy", leetcode: "https://leetcode.com/problems/two-sum/", gfg: "https://www.geeksforgeeks.org/two-sum/", topic: "Arrays" },
  { id: "a2", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", gfg: "https://www.geeksforgeeks.org/stock-buy-sell/", topic: "Arrays" },
  { id: "a3", title: "Contains Duplicate", difficulty: "Easy", leetcode: "https://leetcode.com/problems/contains-duplicate/", gfg: "https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/", topic: "Arrays" },
  { id: "a4", title: "Maximum Subarray", difficulty: "Medium", leetcode: "https://leetcode.com/problems/maximum-subarray/", gfg: "https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/", topic: "Arrays" },
  { id: "a5", title: "Product of Array Except Self", difficulty: "Medium", leetcode: "https://leetcode.com/problems/product-of-array-except-self/", gfg: "https://www.geeksforgeeks.org/a-product-array-puzzle/", topic: "Arrays" },
  { id: "a6", title: "3Sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/3sum/", gfg: "https://www.geeksforgeeks.org/find-a-triplet-that-sum-to-a-given-value/", topic: "Arrays" },
  { id: "a7", title: "Container With Most Water", difficulty: "Medium", leetcode: "https://leetcode.com/problems/container-with-most-water/", gfg: "https://www.geeksforgeeks.org/container-with-most-water/", topic: "Arrays" },
  { id: "a8", title: "Trapping Rain Water", difficulty: "Hard", leetcode: "https://leetcode.com/problems/trapping-rain-water/", gfg: "https://www.geeksforgeeks.org/trapping-rain-water/", topic: "Arrays" },
];

const sortingQuestions: Question[] = [
  { id: "s1", title: "Sort Colors", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sort-colors/", gfg: "https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/", topic: "Sorting" },
  { id: "s2", title: "Merge Intervals", difficulty: "Medium", leetcode: "https://leetcode.com/problems/merge-intervals/", gfg: "https://www.geeksforgeeks.org/merging-intervals/", topic: "Sorting" },
  { id: "s3", title: "Kth Largest Element", difficulty: "Medium", leetcode: "https://leetcode.com/problems/kth-largest-element-in-an-array/", gfg: "https://www.geeksforgeeks.org/kth-smallest-largest-element-in-unsorted-array/", topic: "Sorting" },
];

const bsQuestions: Question[] = [
  { id: "b1", title: "Binary Search", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-search/", gfg: "https://www.geeksforgeeks.org/binary-search/", topic: "Binary Search" },
  { id: "b2", title: "Search in Rotated Sorted Array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/", gfg: "https://www.geeksforgeeks.org/search-an-element-in-a-sorted-and-pivoted-array/", topic: "Binary Search" },
  { id: "b3", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", gfg: "https://www.geeksforgeeks.org/find-minimum-element-in-a-sorted-and-rotated-array/", topic: "Binary Search" },
  { id: "b4", title: "Median of Two Sorted Arrays", difficulty: "Hard", leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/", gfg: "https://www.geeksforgeeks.org/median-of-two-sorted-arrays/", topic: "Binary Search" },
];

const stringQuestions: Question[] = [
  { id: "st1", title: "Valid Anagram", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-anagram/", gfg: "https://www.geeksforgeeks.org/check-whether-two-strings-are-anagram-of-each-other/", topic: "Strings" },
  { id: "st2", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", gfg: "https://www.geeksforgeeks.org/length-of-the-longest-substring-without-repeating-characters/", topic: "Strings" },
  { id: "st3", title: "Longest Palindromic Substring", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-palindromic-substring/", gfg: "https://www.geeksforgeeks.org/longest-palindrome-substring/", topic: "Strings" },
];

const llQuestions: Question[] = [
  { id: "l1", title: "Reverse Linked List", difficulty: "Easy", leetcode: "https://leetcode.com/problems/reverse-linked-list/", gfg: "https://www.geeksforgeeks.org/reverse-a-linked-list/", topic: "Linked List" },
  { id: "l2", title: "Merge Two Sorted Lists", difficulty: "Easy", leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/", gfg: "https://www.geeksforgeeks.org/merge-two-sorted-linked-lists/", topic: "Linked List" },
  { id: "l3", title: "Linked List Cycle", difficulty: "Easy", leetcode: "https://leetcode.com/problems/linked-list-cycle/", gfg: "https://www.geeksforgeeks.org/detect-loop-in-a-linked-list/", topic: "Linked List" },
  { id: "l4", title: "Remove Nth Node From End", difficulty: "Medium", leetcode: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", gfg: "https://www.geeksforgeeks.org/delete-nth-node-from-the-end-of-the-given-linked-list/", topic: "Linked List" },
];

const stackQuestions: Question[] = [
  { id: "sk1", title: "Valid Parentheses", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-parentheses/", gfg: "https://www.geeksforgeeks.org/check-for-balanced-parentheses-in-an-expression/", topic: "Stack & Queue" },
  { id: "sk2", title: "Min Stack", difficulty: "Medium", leetcode: "https://leetcode.com/problems/min-stack/", gfg: "https://www.geeksforgeeks.org/design-a-stack-that-supports-getmin-in-o1-time-and-o1-extra-space/", topic: "Stack & Queue" },
  { id: "sk3", title: "Next Greater Element", difficulty: "Medium", leetcode: "https://leetcode.com/problems/next-greater-element-i/", gfg: "https://www.geeksforgeeks.org/next-greater-element/", topic: "Stack & Queue" },
];

const treeQuestions: Question[] = [
  { id: "t1", title: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", gfg: "https://www.geeksforgeeks.org/write-a-c-program-to-find-the-maximum-depth-or-height-of-a-tree/", topic: "Trees" },
  { id: "t2", title: "Invert Binary Tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/invert-binary-tree/", gfg: "https://www.geeksforgeeks.org/write-an-efficient-c-function-to-convert-a-tree-into-its-mirror-tree/", topic: "Trees" },
  { id: "t3", title: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/", gfg: "https://www.geeksforgeeks.org/level-order-tree-traversal/", topic: "Trees" },
  { id: "t4", title: "Validate Binary Search Tree", difficulty: "Medium", leetcode: "https://leetcode.com/problems/validate-binary-search-tree/", gfg: "https://www.geeksforgeeks.org/a-program-to-check-if-a-binary-tree-is-bst-or-not/", topic: "Trees" },
];

const graphQuestions: Question[] = [
  { id: "g1", title: "Number of Islands", difficulty: "Medium", leetcode: "https://leetcode.com/problems/number-of-islands/", gfg: "https://www.geeksforgeeks.org/find-number-of-islands/", topic: "Graphs" },
  { id: "g2", title: "Clone Graph", difficulty: "Medium", leetcode: "https://leetcode.com/problems/clone-graph/", gfg: "https://www.geeksforgeeks.org/clone-an-undirected-graph/", topic: "Graphs" },
  { id: "g3", title: "Course Schedule", difficulty: "Medium", leetcode: "https://leetcode.com/problems/course-schedule/", gfg: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/", topic: "Graphs" },
];

const dpQuestions: Question[] = [
  { id: "d1", title: "Climbing Stairs", difficulty: "Easy", leetcode: "https://leetcode.com/problems/climbing-stairs/", gfg: "https://www.geeksforgeeks.org/count-ways-reach-nth-stair/", topic: "Dynamic Programming" },
  { id: "d2", title: "House Robber", difficulty: "Medium", leetcode: "https://leetcode.com/problems/house-robber/", gfg: "https://www.geeksforgeeks.org/find-maximum-possible-stolen-value-houses/", topic: "Dynamic Programming" },
  { id: "d3", title: "Longest Increasing Subsequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/", gfg: "https://www.geeksforgeeks.org/longest-increasing-subsequence-dp-3/", topic: "Dynamic Programming" },
  { id: "d4", title: "Coin Change", difficulty: "Medium", leetcode: "https://leetcode.com/problems/coin-change/", gfg: "https://www.geeksforgeeks.org/find-minimum-number-of-coins-that-make-a-change/", topic: "Dynamic Programming" },
  { id: "d5", title: "Edit Distance", difficulty: "Hard", leetcode: "https://leetcode.com/problems/edit-distance/", gfg: "https://www.geeksforgeeks.org/edit-distance-dp-5/", topic: "Dynamic Programming" },
];

const allQuestions = [...arrayQuestions, ...sortingQuestions, ...bsQuestions, ...stringQuestions, ...llQuestions, ...stackQuestions, ...treeQuestions, ...graphQuestions, ...dpQuestions];

function shuffleAndPick(arr: Question[], count: number, prefix: string): Question[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, i) => ({ ...q, id: `${prefix}_${q.id}` }));
}

export const sheets: Sheet[] = [
  {
    id: "striver",
    name: "Striver's DSA Sheet",
    educator: "Striver (Raj Vikramaditya)",
    description: "A comprehensive 191-question sheet covering all major DSA topics for coding interviews.",
    icon: "🔥",
    questions: [
      ...arrayQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...sortingQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...bsQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...stringQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...llQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...stackQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...treeQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...graphQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
      ...dpQuestions.map(q => ({ ...q, id: `striver_${q.id}` })),
    ],
  },
  {
    id: "lovebabbar",
    name: "Love Babbar DSA Sheet",
    educator: "Love Babbar",
    description: "450 DSA questions curated for cracking top product-based company interviews.",
    icon: "💛",
    questions: [
      ...arrayQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...sortingQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...bsQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...stringQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...llQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...treeQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...graphQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
      ...dpQuestions.map(q => ({ ...q, id: `lb_${q.id}` })),
    ],
  },
  {
    id: "apnacollege",
    name: "Apna College DSA Sheet",
    educator: "Apna College (Aman Dhattarwal)",
    description: "Beginner-friendly DSA sheet perfect for college students starting their coding journey.",
    icon: "🎓",
    questions: [
      ...arrayQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...sortingQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...bsQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...stringQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...llQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...stackQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
      ...dpQuestions.map(q => ({ ...q, id: `ac_${q.id}` })),
    ],
  },
  {
    id: "common",
    name: "Common Interview Questions",
    educator: "AI Aggregated",
    description: "Most frequently asked DSA questions across top tech company interviews, curated by AI.",
    icon: "🤖",
    questions: [
      ...arrayQuestions.slice(0, 5).map(q => ({ ...q, id: `common_${q.id}` })),
      ...bsQuestions.slice(0, 2).map(q => ({ ...q, id: `common_${q.id}` })),
      ...stringQuestions.map(q => ({ ...q, id: `common_${q.id}` })),
      ...llQuestions.slice(0, 3).map(q => ({ ...q, id: `common_${q.id}` })),
      ...treeQuestions.slice(0, 3).map(q => ({ ...q, id: `common_${q.id}` })),
      ...graphQuestions.slice(0, 2).map(q => ({ ...q, id: `common_${q.id}` })),
      ...dpQuestions.slice(0, 3).map(q => ({ ...q, id: `common_${q.id}` })),
    ],
  },
];

export function getTopics(questions: Question[]): string[] {
  return [...new Set(questions.map(q => q.topic))];
}

export function getQuestionsByTopic(questions: Question[], topic: string): Question[] {
  return questions.filter(q => q.topic === topic);
}
