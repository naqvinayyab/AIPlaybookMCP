# Data Protection and Privacy

## Overview

AI-driven technologies offer significant benefits but pose potential risks to individuals and groups if not implemented with specific focus on protecting personal data and privacy rights.

Organizations developing and deploying AI systems must consider UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018 principles, minimizing privacy intrusion risk from the outset.

## Core Data Protection Principles for AI

UK data protection law applies regardless of technology type, so basic compliance principles apply to any AI system.

### Key Principles

- **Accountability:** Clear ownership of risk and responsibility for mitigations and compliance
- **Lawfulness:** Applicable lawful basis for processing personal data and lawful processing under regulations
- **Purpose Limitation:** Define why processing personal data and only process for that purpose
- **Transparency and Individual Rights:** Open about personal data use, users can exercise information rights
- **Fairness:** Avoid processing personal data in detrimental, unexpected or misleading ways
- **Data Minimisation:** Process only data needed for the task
- **Storage Limitation:** Don't accumulate large amounts of personal data for unjustifiably long periods
- **Human Oversight:** Build in human oversight to automated decision making
- **Accuracy:** Steps to ensure accuracy of AI-generated responses and individual-related data
- **Security:** Appropriate technical and organisational mitigations for sensitive and personal data

**Important:** Data protection and privacy considerations require specialist expertise. Involve relevant data protection, legal and information governance professionals from AI project outset following data protection by design principles.

## Accountability

Accountability establishes ownership of risk, responsibility for mitigations, compliance, ability to demonstrate compliance, and high privacy standards.

### Strategic Requirements

**Organizational Steps:**
- Make strategic decision on AI technology fit with existing risk tolerance
- Review risk governance model to establish clear senior-level AI risk ownership
- Implement measures to mitigate risks and test effectiveness
- Identify residual risks and align with organization's risk threshold
- Work collaboratively, transparently and demonstrate risk mitigation
- Conduct regular reviews due to evolving AI technologies and new regulations
- Engage with internal data protection, privacy and legal experts from outset

### Data Protection by Design

Important component of UK GDPR risk-based approach requiring integration of data protection safeguards into personal data processing activities throughout AI product lifecycle.

**Ensures:**
- Implementation of appropriate technical and organisational measures
- Protection of data subject rights
- Compliance with UK GDPR and Data Protection Act 2018 principles

### Practical Recommendations

- Establish ownership of AI risks at senior level
- Integrate AI oversight into governance processes
- Take risk-based approach defining risk appetite
- Follow data protection by design and by default principles

## Lawfulness and Purpose Limitation

Before implementing AI solutions, undertake Data Protection Impact Assessment (DPIA) involving assessment of data protection and privacy risks and implementation of appropriate mitigations.

### DPIA Requirements

**Article 35(3)(a) UK GDPR requires DPIA if AI use involves:**
- Systematic and extensive evaluation of personal data aspects based on automated processing (including profiling) producing legal or similarly significant effects
- Large-scale processing of special categories of personal data
- Systematic monitoring of publicly accessible areas on large scale

**ICO also requires DPIA for innovative technology use.**

### DPIA Process Actions

1. **Describe** purpose of personal data processing activities
2. **Assess** necessity and proportionality of personal data processing
3. **Identify** all personal data including special category data being processed (sources and flows)
4. **Identify** valid lawful basis under Article 6 (and additional special conditions under Article 9 for special category data)
5. **Identify** organisation's role as data controller and any data processors involved
6. **Identify** stages when AI processes and automated decisions may impact individuals
7. **Seek and document** views of individuals whose personal data is being processed
8. **Identify** stages when humans are involved in decision-making process
9. **Consider** potential detriment to individuals due to bias or inaccuracy
10. **Document** measures and safeguards, and residual risk levels

### Purpose Limitation Considerations

**Purpose Definition:**
- Clear and well-defined purpose articulation guides lawful basis deliberations
- Determines minimum personal data absolutely necessary for AI service deployment

**Repurposing Personal Data:**
- AI systems often reuse personal data for new purposes different from original collection
- May cause tension with UK GDPR purpose limitation
- Repurposing only legitimate if new purpose is 'compatible' with original purpose

**Compatibility Criteria:**
- Whether new purpose aligns with data subjects' expectations
- What type of personal data is involved
- Potential impact on data subjects' interests
- Whether additional safeguards needed for fairness and transparency

### Geographic and Transfer Considerations

**Data Processing Location:**
- Identify geographic location of each distinct processing activity
- Processing outside UK increases risk of losing UK data protection law protection
- May need additional safeguards (international data transfer agreements)
- Required if processing in jurisdictions where data protection regime not deemed adequate

### High Risk Consultation

If assessment indicates high risk to data protection rights that cannot be sufficiently reduced despite mitigations, must consult ICO before starting personal data processing.

### Practical Recommendations

- Seek support from data compliance professionals (data protection, legal, privacy experts)
- Identify data processing operations, purpose, and map personal data sources/flows
- Determine if personal data necessary for each activity
- Check if processing special category data or children's data
- Identify applicable lawful basis and assess risk through DPIAs
- If risks remain high after mitigations, consult with ICO
- Identify processing outside UK to take additional safeguards
- Assess any changes in AI system purpose for continued compliance

## Transparency and Individual Rights

Organizations must be transparent about personal data processing in AI systems so individuals can effectively exercise UK GDPR rights.

### UK GDPR Requirements

**Data Controllers Must:**
- Provide information in concise, transparent, intelligible, easily accessible form using clear, plain language
- Be transparent about purpose, retention periods, third parties involved
- Be transparent about automated decision making existence, providing meaningful information about logic involved and significance/consequences for data subject
- Provide clear explanation of system results
- Uphold individuals' rights including access to personal data and simple processes for correction/objection

### Scope of Transparency

**Applies to personal data from all sources including:**
- Interactive qualities of AI systems collecting new data
- Text and audiovisual inputs
- Example: facial recognition for public monitoring needs clear signage and information about data controllers, information collected, purpose, legal basis, retention period

### Practical Recommendations

- Explain system in plain English
- Be transparent about purpose, retention periods, third parties
- Be transparent about automated decision making using ATRS where required
- Provide clear explanation of system results using ICO guidance
- Follow "Explaining decisions made with AI" guidance

## Fairness

Fairness under UK GDPR applies to AI systems processing personal data meaning "you should only process personal data in ways that people would reasonably expect and not use it in any way that could have unjustified adverse effects on them."

### Assessment Tools

**DPIAs are main tool to:**
- Consider risks to individual rights and freedoms
- Include potential for significant social or economic disadvantage
- Demonstrate whether processing is necessary, proportionate and fair

### Public Attitudes Context

**RTA Public Attitudes to Data and AI Survey (December 2023) findings:**
- People's comfort with AI use greatly depends on specific context
- Perceptions of AI governance need vary considerably by sector
- Substantial proportion prioritizes careful management of AI in healthcare, military, banking and finance

### Fairness Requirements

**Must ensure AI systems:**
- Don't process personal data in ways unduly detrimental, unexpected or misleading to individuals
- Are accurate and non-discriminatory if inferring data about people
- Uphold 'right to be informed' for individuals whose personal data is used at any AI development/deployment stage

### Biometric Data Considerations

**Computer vision technologies (facial recognition) concerns:**
- Risk of errors in matching faces
- Less accurate on women and people of colour (biased results)
- Can create discrimination raising fundamental rights concerns
- Facial images constitute biometric data (personal data from specific technical processing)
- May fall into special categories revealing racial or ethnic origin (require enhanced protection)

**Biometric Data Requirements:**
- Ensure technologies capturing/processing data are overt, accurate, proportionate, fair
- Deploy narrow 'zone of recognition'
- Promptly delete data not meeting potential match threshold

### Rights Protection Focus

Data protection protects individuals' rights and freedoms regarding personal data processing, not just information rights. This includes right to privacy and right to non-discrimination.

### Practical Recommendations

- Identify risks to individual rights and freedoms through DPIAs
- Assess whether processing is necessary, proportionate and fair
- Use ICO's AI data protection and risk toolkit to reduce risks
- Mitigate risks using ICO's guidance on fairness in AI systems
- Provide clear reassurance about upholding privacy rights with simple processes
- Address user objections (automated decisions, significant legal impact) by implementing safeguards

## Data Minimisation

Data minimisation principle requires identifying minimum personal data needed to fulfill purpose and processing only that information.

### Key Requirements

**Does not mean AI tools should not process personal data, but:**
- If same outcome achievable by processing less personal data, must do so
- Retaining unnecessary data is risk to individuals
- Excluding irrelevant data prevents algorithms from identifying insignificant or coincidental correlations

### Implementation Techniques

**Privacy-Enhancing Technologies (PETs):**
- Offer stronger protections preserving data privacy while enabling effective data use
- Provide new tools for anonymisation
- Enable collaborative analysis on privately held datasets
- Allow data use without disclosing copies
- Multi-purpose: reinforce data governance, tools for collaboration, accountability through audits

**Synthetic Data Example:**
- Artificial dataset not including actual data on 'real' individuals
- Mirrors characteristics and proportional relationships of original dataset statistical aspects
- Maintains analytical value while protecting individual privacy

### Practical Recommendations

- Justify personal data use through DPIA thinking about problem being solved
- Settle with minimum personal data required (less data = less risk)
- Reduce identification risk through appropriate de-identification techniques (redaction, pseudonymisation, encryption)
- Refer to ICO guidance on privacy-enhancing technologies

## Storage Limitation

UK GDPR states personal data should only be held as long as reasonably justified for processing purpose, not retained longer than needed.

### Key Considerations

**Think Through:**
- What personal data the technology will hold
- Why you have it and what it's used for
- Whether you can justify keeping it for that period

**Process Requirements:**
- Map all personal data flows through every development, testing and deployment stage
- Utilise data minimisation, anonymisation techniques and eventual deletion
- Irreversibly transform or remove personal data where appropriate

### Practical Recommendations

- Use data minimisation and anonymisation techniques to remove or transform personal data
- Be transparent about personal data retention length in privacy notices

## Human Oversight

Although possible to use AI systems for automated decision making, this may infringe UK GDPR. Article 22 prohibits decisions based solely on automated processing that have legal or similarly significant consequences for individuals.

### Requirements

**AI Services Affecting Legal Status/Rights:**
- Must only use AI to support decisions made by human decision maker
- Cannot make decisions automatically without human involvement

**Human Input Must Be 'Meaningful':**
- Several factors determine human involvement level:
  - Complexity of output
  - Potential impact
  - Amount of specialist human knowledge required (legal, medical)

### Implementation

**Deliberation Processes:**
- Introduce into all lifecycle stages
- Combine human and machine abilities for best results
- Ensure meaningful human review at appropriate stages

### Practical Recommendations

- Design, document and assess stages when meaningful human review processes incorporated
- Consider what additional information taken into account for final decisions
- Use ICO guidance on automated decision making under UK GDPR
- Clarify types of decisions having legal or similarly significant effect

## Accuracy

Accuracy in data protection context requires personal data not be factually incorrect or misleading, and where necessary, corrected, deleted and kept up-to-date without delay.

### Key Principles

**AI Outputs Treatment:**
- Should not treat AI outputs as factual information about individual
- Consider outputs as 'statistically informed guess'
- Factor in possibility of incorrect outputs and impact on decisions

**Transparency Requirements:**
- Make explicit that AI system outputs are statistically informed guesses rather than facts
- Include information about data source and how inference generated

### Practical Recommendations

- Test AI outputs against existing knowledge and expertise during training and testing
- Be transparent that outputs are statistically informed guesses rather than facts
- Document data source and AI system used to generate conclusions
- Implement processes to consider individuals' feedback, views and corrections of factual errors

## Security

Security considerations are covered in detail in the dedicated [Security](./08_security.md) section, but key data protection security requirements include:

### Core Requirements

- Implement appropriate technical and organisational mitigations
- Protect sensitive and personal data
- Follow Government Cyber Security Strategy
- Comply with Secure by Design principles
- Meet government's Cyber Security Standard

### AI-Specific Security Considerations

- Understand AI-specific security risks (data poisoning, perturbation attacks, prompt injections, hallucinations)
- Build in safeguards and technical controls
- Implement security testing and content filtering
- Use validation checks to ensure accuracy and prevent data leaks

---

**Next:** [Security](./08_security.md)