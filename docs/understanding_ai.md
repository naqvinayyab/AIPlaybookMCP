# Understanding AI

*This section supports Principle 1: You know what AI is and what its limitations are.*

## What is AI?

AI is not new - the term 'artificial intelligence' was coined in 1956 during the Dartmouth workshop. Since then, there have been recurring waves of progress and excitement, followed by periods of waning interest referred to as 'AI winters'.

### Official Definition

The UK government uses the OECD definition:

> "An AI system is a machine-based system that, for explicit or implicit objectives, infers, from the input it receives, how to generate outputs such as predictions, content, recommendations, or decisions that can influence physical or virtual environments. Different AI systems vary in their levels of autonomy and adaptiveness after deployment."

**Key Characteristics:**
- **Adaptable**: Can find new ways to meet human-set objectives
- **Autonomous**: Can operate with varying levels of autonomy, including without human control

## Fields of AI

AI comprises a complex and evolving set of interconnected fields. Advances in one area typically propagate throughout these networks, conferring novel behaviors and capability increases.

### Neural Networks (NNs)

**What they are:** Computational models inspired by biological neural networks in the human brain.

**How they work:**
- Learn through exposure to data in training cycles
- Gradually adjust connections between network parts
- Set weights between nodes of adjacent layers
- Calculate errors and adjust backwards through network
- Repeated execution tunes network for generalization

**Applications:** Image recognition, medical imaging, speech recognition, autonomous systems

### Machine Learning (ML)

**What it is:** The branch of AI that learns from data by extracting features and learning relationships.

**How it works:**
- Uses algorithms to analyze data, learn patterns, make predictions
- Requires training on carefully selected information
- Creates optimized models identifying pertinent features
- Can use labeled data (supervised learning) or unlabeled data (unsupervised learning)

**Applications:** Fraud detection, feedback analysis, image processing, summarization

### Deep Learning (DL)

**What it is:** Subset of ML involving complex model structures and sophisticated neural networks.

**How it works:**
- Initially detects simple features (edges in images)
- Gradually combines them to recognize complex patterns
- More resource-intensive but excels with complex tasks and large datasets

**Applications:** Biomedical research, autonomous driving, advanced image and speech recognition, NLP

### Speech Recognition (SR)

**What it is:** Field of ML dedicated to processing speech, including speech-to-text (STT) and speech-to-speech (S2S).

**How it works:**
- Converts speech into numeric representations (spectrograms)
- DL models analyze spectrograms to identify sounds, words, sentences
- STT results in written text; S2S translates and converts back to speech

**Applications:** Banking voice systems, personal assistants (Siri, Alexa), call analytics, meeting summarization

### Computer Vision (CV)

**What it is:** Field enabling computers to interpret, analyze and understand visual information.

**How it works:**
- Breaks down images into pixels
- Processes pixels to detect edges, shapes, colors
- Uses information to recognize objects, people, scenes
- Performs classification, object detection, video analysis, image segmentation

**Applications:** Facial recognition, quality control, healthcare imaging, surveillance, robotics

### Natural Language Processing (NLP)

**What it is:** Field focusing on processing human language, combining computational linguistics and machine learning.

**How it works:**
- Converts text into numerical representations
- Processes through ML models using series of steps:
  - Noise reduction
  - Tokenization
  - Stop-words removal
  - Stemming/lemmatization
  - Vectorization
  - Embeddings
- Considers word order and context for meaning

**Applications:** Machine translation, document classification, sentiment analysis, text summarization, conversational AI

### Generative AI

**What it is:** Subset of AI capable of generating text, images, video or other output using probabilistic models.

**How it works:**
- Learns from large amounts of curated training data
- Discerns and replicates complex patterns and structures
- When given prompt, evaluates probability of potential responses
- Selects most likely response based on training data patterns

**Examples:** ChatGPT, Claude, Gemini, Dall-E, Adobe Photoshop Generative Fill, Microsoft 365 Copilot

**Applications:** Content generation, advanced analysis, drug discovery molecular testing, synthetic datasets for ML training

### Agentic AI

**What it is:** Autonomous AI systems that make decisions and perform actions with minimal human intervention.

**How it works:**
- Uses Foundation Models (primarily LLMs) to match capabilities with objectives
- Understands environment and available tools/functions
- Takes actions autonomously to achieve objectives
- Multiple agents can work together in complex systems

**Example:** Order processing system with multiple agents capturing pricing data, automatically retrieving latest prices when needed.

## Applications of AI in Government

### Current Applications

| Application | Traditional AI | Generative AI |
|-------------|---------------|---------------|
| **Speed up services** | ML and OCR for processing handwritten letters | Retrieve organizational information faster, route correspondence |
| **Reduce workload** | Facial recognition for passport control | Suggest drafts of routine responses, code autocomplete |
| **Complex tasks** | Analyze large datasets, identify trends/anomalies | Review and summarize information, identify/correct errors |
| **Specialist tasks** | Predictive analytics, fraud detection | Summarize specialist documentation, translate documents |
| **Improve quality** | Recommender systems, feedback analysis | Improve readability/accessibility, simplify language |

### Real-World Examples

Government bodies are already using AI for:
- Processing thousands of handwritten letters daily
- Automatic passport control at airports
- Analyzing large datasets for decision-making
- Detecting fraudulent activities
- Optimizing budget allocations
- Improving web navigation and information finding

## Limitations of AI

### General AI Limitations

**Bias**
- AI systems replicate bias from training data
- Model bias: innate deviation causing prediction errors
- Algorithmic bias: systematic inequality in outcomes
- Lack consciousness to self-correct

**Data Dependencies**
- Heavily reliant on data quality and quantity
- Insufficient data prevents effective generalization
- Poor quality/biased/noisy data leads to inaccurate outcomes

**Accuracy Issues**
- Difficult to achieve 100% accuracy under all conditions
- Must be clear about objective measures for assessment
- Various factors impact performance

**Transparency Challenges**
- Some models too sophisticated to trace input-to-output relationships
- "Black box" problem with deep learning architectures
- Difficult to explain decision-making processes

**Cost and Sustainability**
- Implementation can be complex, time-consuming, expensive
- Ongoing investment needed for maintenance and updates
- Considerable compute costs
- Environmental impact considerations

### Generative AI Specific Limitations

**Hallucination (Confabulation)**
- Create plausible but factually incorrect content
- Generate content by returning most likely output based on training patterns
- No actual understanding of content truth

**Lack of Critical Thinking**
- No personal experience or judgement
- Appear to reason but are not sentient
- Cannot replace professional advice in critical areas

**Inappropriate Content**
- Can generate offensive or inappropriate content
- Replicate toxic material from training data
- Need proper guidance and filtering

**Domain Expertise Limitations**
- Not domain experts
- Not substitute for professional advice (legal, medical, etc.)
- Limited contextual understanding

**Information Currency**
- Many LLMs lack real-time internet access
- Limited to training data timeframe
- May not have current information

## Ethics and Societal Impact

### Benefits
- Improving productivity
- Enhancing access to services
- Supporting data-driven decisions
- Enabling innovation

### Risks
- Two-sided impacts if not used responsibly
- Potential for bias amplification
- Privacy and security concerns
- Social and economic disruption

### Key Considerations
- Legal, ethical, and security implications
- Need for appropriate safeguards
- Importance of responsible development and deployment
- Balance between innovation and risk management

## Hardware Infrastructure

Traditional CPUs struggle with AI's large data and calculation requirements. Modern AI systems use:

- **Graphics Processing Units (GPUs)**: Networks of thousands for training largest models
- **Tensor Processing Units (TPUs)**: Optimized for ML training
- **Neural Processing Units (NPUs)**: Increasingly used for optimization

The largest modern AI systems range from hundreds of billions to trillions of parameters.

## Learning Resources

**Free Training Available:**
- Civil Service Learning e-learning courses
- AI insights articles
- Government Campus AI courses
- Digital Excellence Programme for senior civil servants

**Topics Covered:**
- AI and generative AI fundamentals
- AI ethics understanding
- Business value of AI
- Technical curricula with certificates
- Working with LLMs, ML, deep learning, NLP, speech recognition, computer vision

---

**Next:** [Building AI Solutions](./03_building_ai_solutions.md)