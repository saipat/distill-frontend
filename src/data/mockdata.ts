import type { VideoData } from '../types'

export const MOCK_VIDEO_DATA: VideoData = {
  url: 'https://www.youtube.com/watch?v=eMlx5fFNoYc',
  videoId: 'eMlx5fFNoYc',
  title: '3Blue1Brown — Attention in transformers, visually explained',
  duration: '26 min',
  summary: {
    tldr: 'This video builds intuition for how attention works inside transformer models — starting from the problem of context, through query/key/value matrices, all the way to multi-head attention and why it enables modern LLMs to understand language so powerfully.',
    key_concepts: [
      'Self-attention — how every token relates to every other token',
      'Query, key, and value matrices — the three learned projections',
      'Softmax — turning raw attention scores into a probability distribution',
      'Multi-head attention — running attention in parallel across subspaces',
      'Why transformers outperform RNNs on long sequences',
    ],
    conclusion:
      'Attention is the single mechanism that makes large language models possible. Once you understand how every token attends to every other token with a learned weight, the rest of transformer architecture clicks into place. This is the most important concept before diving into modern AI.',
  },
  moments: [
    {
      timestamp: '0:42',
      seconds: 42,
      title: 'The context problem',
      description:
        'Why the word "bank" means different things in different sentences — and why fixed embeddings cannot capture this.',
    },
    {
      timestamp: '4:15',
      seconds: 255,
      title: 'Query, key, and value matrices',
      description:
        'The three learned projections explained with a concrete retrieval analogy.',
    },
    {
      timestamp: '9:30',
      seconds: 570,
      title: 'Computing attention scores',
      description:
        'The dot product between Q and K, scaled by the square root of dimension to prevent vanishing gradients.',
    },
    {
      timestamp: '14:05',
      seconds: 845,
      title: 'Softmax and weighted sum',
      description:
        'Turning raw scores into a probability distribution, then using them to mix the value vectors.',
    },
    {
      timestamp: '18:50',
      seconds: 1130,
      title: 'Multi-head attention',
      description:
        'Running attention in parallel across multiple subspaces so the model can track different kinds of relationships simultaneously.',
    },
    {
      timestamp: '23:20',
      seconds: 1400,
      title: 'Why transformers beat RNNs',
      description:
        'Parallelisation during training and direct token-to-token connections regardless of distance in the sequence.',
    },
  ],
  flashcards: [
    {
      id: 'fc1',
      question: 'What problem does the attention mechanism solve?',
      answer:
        'It lets a model relate any two tokens directly regardless of their distance in the sequence, solving the long-range dependency problem that RNNs struggled with.',
    },
    {
      id: 'fc2',
      question: 'What are the three matrices in self-attention?',
      answer:
        'Query (Q), Key (K), and Value (V). Each input token is projected into all three. Attention scores come from Q·Kᵀ and the output is a weighted sum of V.',
    },
    {
      id: 'fc3',
      question: 'Why do we scale the dot product by √d?',
      answer:
        'To prevent the dot products from growing too large in high dimensions, which would push softmax into regions with extremely small gradients.',
    },
    {
      id: 'fc4',
      question: 'What does multi-head attention add?',
      answer:
        'Multiple attention heads run in parallel, each in a different learned subspace. This lets the model simultaneously track different types of relationships between tokens.',
    },
    {
      id: 'fc5',
      question: 'Why do transformers train faster than RNNs?',
      answer:
        'Transformers process all tokens in parallel — there is no sequential dependency. RNNs must process tokens one at a time, making parallelisation impossible.',
    },
    {
      id: 'fc6',
      question: 'What does positional encoding add and why is it needed?',
      answer:
        'A fixed or learned vector added to each token embedding to encode its position in the sequence. Attention has no built-in sense of order, so position must be injected explicitly.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'What is the main problem that the attention mechanism was designed to solve?',
      options: [
        'Making neural networks train faster on GPUs',
        'Relating tokens across long distances without sequential processing',
        'Reducing the number of parameters in a model',
        'Converting words into numerical vectors',
      ],
      correctAnswer: 'Relating tokens across long distances without sequential processing',
      explanation:
        'RNNs struggled to pass information across long sequences because gradients vanish. Attention creates a direct learned connection between any two tokens regardless of distance.',
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      question: 'In self-attention, what do the Query and Key matrices produce when multiplied together?',
      options: [
        'The final output embedding for each token',
        'The positional encoding vectors',
        'Raw attention scores showing how much each token should attend to each other',
        'The vocabulary probability distribution',
      ],
      correctAnswer: 'Raw attention scores showing how much each token should attend to each other',
      explanation:
        'Q·Kᵀ produces a matrix of raw scores. Softmax then turns these into a probability distribution, which is used to take a weighted sum of the Value vectors.',
    },
    {
      id: 'q3',
      type: 'typed',
      question: 'In your own words, explain why we divide the attention scores by the square root of the key dimension (√d) before applying softmax.',
      options: undefined,
      correctAnswer:
        'Dividing by √d prevents the dot products from becoming very large in high dimensions, which would push softmax into regions with very small gradients and make learning slow or unstable.',
      explanation:
        'In high dimensions, dot products tend to have large magnitudes. Large inputs to softmax create near-zero gradients everywhere except the maximum, which hurts training.',
    },
    {
      id: 'q4',
      type: 'multiple_choice',
      question: 'What is the key advantage of multi-head attention over single-head attention?',
      options: [
        'It uses fewer parameters and is faster to compute',
        'It can attend to multiple positions in parallel in different learned subspaces',
        'It removes the need for positional encoding',
        'It works directly on raw pixel data',
      ],
      correctAnswer: 'It can attend to multiple positions in parallel in different learned subspaces',
      explanation:
        'Each head learns to track a different type of relationship (syntax, coreference, semantics etc). Concatenating their outputs gives the model richer representations.',
    },
    {
      id: 'q5',
      type: 'typed',
      question: 'Why do transformers need positional encoding, and what would happen without it?',
      options: undefined,
      correctAnswer:
        'Attention has no built-in sense of order — it treats every token equally regardless of position. Without positional encoding, the model could not distinguish "the cat sat on the mat" from "the mat sat on the cat".',
      explanation:
        'Pure attention is permutation-invariant. Positional encodings inject order information so the model knows which token came first.',
    },
  ],
}