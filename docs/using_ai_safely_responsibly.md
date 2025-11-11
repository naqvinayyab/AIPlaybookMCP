# Using AI Safely and Responsibly

*This section supports Principles 2, 3, 4, and 10.*

## Overview

Ethical and responsible use of AI is crucial for maintaining public trust, protecting individual rights, and fostering equitable societal progress. Many considerations interact with each other, so read all topics together and seek support from data ethics, privacy, legal and security experts.

## Ethics

The ethical risks and opportunities of AI depend on context and solution nature. Key themes to address:

- Safety, security and robustness
- Transparency and explainability  
- Fairness, bias and discrimination
- Accountability and responsibility
- Contestability and redress
- Societal wellbeing and public good

**Important Note:** These areas may overlap and interact. Promotion of one ethical value may come at cost of others. Consider trade-offs early, ensure benefits outweigh risks, and avoid unacceptable risks.

### Measurement and Assessment

Make specific and robust measurements to assess AI systems, such as:
- Evaluate accuracy and quality against protected characteristics (Equality Act 2010)
- Select most appropriate assessments for technology and use case
- Recognize that state of the art is rapidly developing

**Additional Resources:**
- Data Ethics Framework
- UKSA ethics self-assessment guidance

## Safety, Security and Robustness

Build AI solutions that are resilient, sustainable and function reliably, even in unforeseen situations or against adversarial attacks.

### Definitions

**Safety:** System's ability to operate without causing harm to people or environment
- Particularly important in high-risk areas (healthcare, policing, justice)

**Security:** Protection of data, assets and functionality against unauthorized access, misuse or damage

**Robustness:** Algorithm/model ability to maintain performance and stability under different conditions
- **Reliability:** Consistently perform as intended across expected scenarios
- Should adapt or respond consistently to unexpected events
- Minimize harm and provide suitable warnings

### Implementation Requirements

**Performance Metrics**
- Establish accuracy measures for correct outputs
- Test systems in variety of scenarios including extreme/rare events
- Implement red teaming processes
- Record model behavior with unexpected and anomalous scenarios

**Privacy Considerations**
- Understand privacy extends beyond UK GDPR and Data Protection Act 2018
- Consider group privacy risks (characteristics/behaviors leading to discrimination)
- Address potential stigmatization or harm to collectives

### Practical Recommendations

- Establish performance metrics measuring accuracy of model outputs
- Test system in variety of scenarios including extreme or rare events
- Implement red teaming processes and record anomalous behavior
- Use training resources including Civil Service Learning ethics courses
- Read GOV.UK Chat case study on user research for AI products

## Transparency and Explainability

AI systems should be appropriately transparent and explainable per AI regulation white paper.

### Definitions

**Transparency:** Communication of appropriate information about AI system to right people
- Information on how, when, and for which purposes system is used

**Explainability:** Ability to clarify how AI system arrives at given output or decision
- What factors lead to specific outcomes (loan applications, recommendations)

### Challenges

**Transparency Limitations:**
- Proprietary and 'black box' commercial tools
- Limited by commercial considerations

**Explainability Limitations:**
- May not be possible for certain machine learning forms
- May only be achievable at cost of performance
- Technical constraints of complex systems

### Types of Transparency

**Technical Transparency**
- Information about technical operation
- Code used to create algorithms
- Underlying datasets used to train models

**Process Transparency**
- Design, development and deployment decisions/practices
- Mechanisms demonstrating solution is responsible and trustworthy
- Robust reporting mechanisms and governance frameworks

**Outcome-based Transparency and Explainability**
- Clarify to users how solution works
- Which factors influence decision making and outputs
- Individual-level explanations where requested

**Internal Transparency**
- Up-to-date internal records on technology and processes
- Process-based transparency information retention

**Public Transparency**
- Communication about department's AI system use
- Available to general public in open, accessible format

### Standards and Tools

**Algorithmic Transparency Recording Standard (ATRS)**
- Required for central government departments and certain arm's length bodies
- Recommended for other public sector bodies
- Ensure transparency around algorithmic tools in decision-making

**Additional Resources:**
- UK's national public sector AI ethics and safety guidance
- Data and model cards/fact sheets (Google's data cards and model cards)
- ICO AI auditing consultation and support
- Explaining decisions made with AI guidance (Alan Turing Institute and ICO)

### Practical Recommendations

- Use ATRS to communicate AI information to public
- Clearly signpost when AI creates content, interacts with public, or impacts decisions
- Put in place evaluation and auditing structures
- Implement transparency and auditing requirements for suppliers
- Use external resources like data cards and model cards
- Make model outputs as explainable as possible
- Consider open source models for greater transparency

## Fairness, Bias and Discrimination

AI systems must not undermine legal rights, discriminate unfairly, or create unfair market outcomes.

### Fairness Requirements

Ensure AI systems:
- Fairly allocate resources or services across all protected characteristics
- Don't disproportionately adversely impact certain subgroups
- Don't represent different groups in harmful, prejudiced or offensive ways

### Sources of Bias

**Human Bias**
- AI systems designed by humans with inherent limitations and biases
- Contextual constraints affect development

**Training Data Bias**
- Models trained on data encoding present and past societal biases
- Present across AI lifecycle
- Generative AI particularly vulnerable (trained on vast unfiltered internet data)
- Prompt wording can introduce bias

**Representational Bias**
- Underrepresented, overrepresented, or misrepresented groups in training data
- Can lead to harmful stereotypes or abusive content
- Performance disparities across social groups
- Benefits primarily privileged, heavily-represented members

### Compounding Factors

**Intersectionality**
- Issues compound when protected characteristics considered in combination
- Complex interactions between different identity aspects

**System Opacity**
- Complexity makes it difficult to identify where/how biases are introduced
- Issues may manifest during implementation despite testing validation

**User Behavior**
- Users may ignore or selectively pay attention to AI recommendations
- Can introduce new forms of bias through usage patterns

### Accessibility Considerations

- Ensure equal benefits achievable by all
- Consider interactions with assistive technologies
- Follow government Service Manual guidance on accessibility design and testing

### Practical Recommendations

- Implement bias mitigation and fairness evaluation across entire AI lifecycle
- Comply with human rights law, Equality Act 2010, Public Sector Equality Duty
- Use EHRC guide to using AI in public services
- Review model outputs and decisions for bias across different groups
- Put feedback mechanisms in place for reporting unfair decisions
- Beware of instances where AI makes Equality Act compliance more difficult
- Adopt continuous evaluation approach for changing fairness considerations

## Accountability and Responsibility

Individuals and organizations must be held responsible for effects of AI systems they develop, deploy or use.

### Three Key Elements

**Answerability**
- Establish chain of human responsibility across AI project lifecycle
- Include responsibility throughout supply chain
- Establish recourse and feedback mechanisms for affected individuals
- Identify specific actors: model developers, application developers, policymakers, regulators, system operators, end-users
- Define roles and responsibilities aligned with legal and ethical standards

**Auditability**
- Demonstrate responsibility and trustworthiness of development/deployment practices
- Uphold robust reporting and documentation protocols
- Retain traceability throughout AI project lifecycle
- Document from data collection to system retirement
- Make documentation accessible to relevant stakeholders

**Liability**
- Ensure all parties acting lawfully and understand legal obligations
- End-user responsibility for system outputs and consequences
- Check outputs are accurate, non-discriminatory, non-harmful
- Don't violate existing legal provisions, guidelines, policies, or terms of use
- Put necessary oversight and human-in-the-loop processes in place
- Consider if AI should be used at all for high-risk situations

### Ultimate Responsibility

- Responsibility for AI output/decisions always rests with public organization
- For commercial AI, ensure vendors understand responsibilities and liabilities
- Put required risk mitigations in place
- Share all relevant information

### Practical Recommendations

- Follow existing legal provisions, guidelines, policies, and provider terms
- Clearly define responsibilities, accountability, liability across all AI lifecycle actors
- Define detailed responsibilities and liability contractually for commercial AI
- Nominate Senior Responsible Owner (SRO) for AI project accountability
- Establish human-in-the-loop process for high impact/risk situations
- Ensure oversight people can identify risks and intervene appropriately
- Adopt risk-based approach to AI use
- Use assurance techniques to evaluate AI system performance

## Contestability and Redress

Mechanisms through which AI systems and outputs/decisions can be challenged, and how impacted individuals can seek remedy.

### Importance

- Help identify and correct ethical issues after deployment
- Must be designed before deployment
- Maintained throughout full system lifecycle
- Interlinked with transparency and explainability requirements

### Key Mechanisms

**Public Awareness**
- Make people aware when AI system is used
- Clearly signpost contestability and redress mechanisms
- Ensure awareness of AI system presence and function
- Make users aware of mechanisms clearly and in timely fashion

**Mechanisms for Appeal**
- Establish and promote clear, accessible mechanisms
- Enable challenging decisions made by AI systems
- Allow wider questions about training, deployment, impacts
- Provide routes for broader AI system concerns

**Change Processes**
- Ensure mechanisms in place to investigate user-highlighted areas
- Make changes to or decommission AI systems if unacceptable risks/harms identified
- Implement adequate response processes

### Limitations

Contestability and redress alone don't ensure responsible technology use:
- Harms may not be apparent to all who are impacted
- Must adhere to other Using AI Safely and Responsibly principles
- Proactive risk identification before harms occur

### Practical Recommendations

- Put mechanisms in place for users to report potential risks or harms
- Nominate SROs responsible for monitoring reports and implementing changes
- Ensure reporting routes clearly disclosed and signposted at interaction points
- Provide option for impacted individuals to contact responsible team directly
- Allocate adequate resources to respond to public communications
- Create contingency plans to maintain essential services if AI use must be stopped

## Societal Wellbeing and Public Good

AI should not only minimize harms but actively promote ethical applications solving societal challenges and delivering social good.

### Government Engagement Importance

- AI may be perceived as impersonal, distant, or alienating
- Government engagement with academia, industry, and civil society crucial
- Dispel fears and foster understanding of AI potential benefits
- Act as leading, responsible user helping UK embrace positive change

### Potential Benefits

**Wide-ranging Applications:**
- Improve productivity and access to services
- Advance health intervention and diagnosis effectiveness
- Create and deliver personalized training
- Promote sustainability (supporting conservationists)
- Reduce existing inequalities (increase health service access for at-risk groups)

### Potential Risks

AI systems may have two-sided impacts without responsible use and safeguards:
- Risk generating harm
- Entrench inequalities
- Undermine democratic processes

### Key Considerations

**Justified Trust**
- Essential for uptake and long-term adoption
- AI can promote public trust in government if public understands responsible development

**Public Benefit**
- Ensure AI solutions represent good value for money
- Benefit the public aligned with UK government ambitions
- Use AI to solve societal and global challenges safely and lawfully

**Harm Minimization**
- Important alongside illustrating public benefit
- Equally important to minimize harms

**Misinformation and Disinformation**
- AI systems can generate factually incorrect information (unintentionally and intentionally)
- Can facilitate spread through plausible but false content
- Recommender systems may promote false content
- LLMs create statistically likely patterns rather than reliable reality accounts
- Credible and convincing text enhances potential for false information belief

**Sustainability**
- AI can help meet sustainability goals
- Also presents risks from energy and resource consumption
- Consider training and deployment environmental costs
- Usually less environmentally sound to train own model if pre-trained models available
- Generative AI expensive to operate - don't use for tasks achievable by other technologies

### Assessment Framework

When assessing AI tool impact, consider:
- Identify and weigh both positive and negative impacts
- Consider unintended consequences
- If negative consequences too high, consider terminating project
- Use ONS ethics guidance to understand and articulate public goods

### Practical Recommendations

- Engage with broader society when defining and deploying AI systems
- Include civil society groups, underrepresented individuals, harm-likely groups, NGOs, academia
- Weigh positive impacts against potential negative ones
- Verify AI-generated information for accuracy
- Assess risks of AI system generating/spreading misinformation
- Assess environmental impact before development
- Consider reasonable trade-off between benefits and energy consumption
- Evaluate environmental credentials of model providers and partners
- Select low carbon emission energy grids and renewable energy infrastructure

---

**Next:** [Legal Considerations](./06_legal_considerations.md)