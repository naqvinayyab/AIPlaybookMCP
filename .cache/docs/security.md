Security

Cyber security is a primary concern for all government services, as laid out in the [Government Cyber Security Strategy](https://www.gov.uk/government/publications/government-cyber-security-strategy-2022-to-2030). When building and deploying new services, including AI systems, the government has a responsibility to make sure these are secure to use and also resilient to cyber attacks. To meet this requirement, your service must comply with the government’s [Secure by Design principles](https://www.security.gov.uk/guidance/secure-by-design/) before it can be deployed. 

There are some security risks that apply uniquely to AI and/or generative AI technologies. This section takes you through some of these risks to help you keep AI solutions in government secure. 

To learn more about AI security, you’re encouraged to join the [cross-government AI security group](mailto:x-gov-genai-security-group@digital.cabinet-office.gov.uk) that brings together security practitioners, data scientists and AI experts. Please note that only those with GOV.UK email addresses can currently join this group.

How to deploy AI securely 

Depending on how AI systems are used, they can present different security challenges and varying levels of risk that must be managed. This section covers some of the approaches that you need to take for:

-   public AI applications and web services
-   embedded AI applications
-   public AI application programming interfaces (APIs)
-   privately hosted open source AI models
-   working with your organisational data
-   open-source vs closed-source models

Public AI applications and web services

A simple way to implement an AI solution is to use publicly available commercial applications – such as Google Gemini or ChatGPT in the case of generative AI. While you might think that these public tools are more secure, you should consider that you cannot easily control the data input to the models: you must rely on educating users on what data they can and cannot enter into these services.

You also have no control over the outputs from these models, and you’re subject to their commercial licence agreements and privacy statements. For example, [OpenAI](https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance) will use the prompt data you enter directly into the ChatGPT website to improve their models, although individual users can opt out. When using public AI applications, you must not enter official information unless it has been published or is cleared for publication.

Embedded AI applications

Many vendors include AI features and capabilities directly within their products, for example Slack GPT and Microsoft Copilot. While this guidance applies at a high level to each of these applications, they come with their own unique security concerns. Before adopting any of these products it’s important to understand the underlying architecture of the solution, and what mitigations the vendor has put in place for the inherent risks associated with AI.

In addition to embedded applications, there are also many AI-powered plugins or extensions to other software. For example, Visual Studio Code has a large ecosystem of community-built extensions, many of which offer AI functionality. You must take extreme caution before installing any unverified extensions as these can pose a security risk.

There has also been a proliferation of AI transcription tools that are capable of joining virtual meetings and transcribing meeting notes. These present a serious risk of data leakage as they silently upload meeting recordings to an AI service for transcription and analysis. When hosting virtual meetings, organisers should verify the identity of all attendees and state up front that the use of third-party meeting transcription tools is not allowed.

You should always speak with your security team to discuss your requirements before deploying any embedded AI applications, extensions or plugins.

Public AI APIs

Many public AI applications offer the ability to access their services through APIs. By using the API you can integrate AI capabilities into your own applications, intercept the data being sent to the AI model, and also process the responses before returning them to the user.

For example, when integrating a large language model (LLM) through an API you can include privacy-enhancing technology (PET) to prevent data leakage, add content filters to sanitise the prompts and responses, and log and audit all interactions with the model. Be aware that PETs come with their own limitations, therefore selection of the PET should be proportionate to the sensitivity of the data.

Refer to the Information Commissioner’s Office (ICO)’s guidance on [privacy-enhancing technologies (PETs)](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/privacy-enhancing-technologies/) and the Responsible Technology Adoption Unit (RTA)’s [PET adoption guide](https://www.gov.uk/government/publications/privacy-enhancing-technologies-adoption-guide) for more information. Consider also that your data is still passed over to the provider when you use an API, although retention policies tend to be more flexible for API use. For example, OpenAI only [retains prompt data sent to the API for 30 days](https://openai.com/enterprise-privacy#api-platform-faq).

Privately hosted AI models

Instead of using a public AI offering, the alternative is to host your own AI model. This could be a model taken from one of the many publicly available pre-trained open source models or it could be a model you have built and trained yourself. By running a model in your own private cloud infrastructure, you ensure that data never leaves an environment that you own.

In the case of generative AI, the models you can run in this way are not on the scale of the publicly available ones, but can still provide acceptable results for certain applications. The advantage is that you have complete control over the model and the data it consumes. The disadvantage is that you’re responsible for ensuring the model is secure and up to date. Consider that you must also maintain the infrastructure to host your model, which brings additional costs along with the specialist skills you’ll need in machine learning (ML) operations.

Managed machine learning model hosting platform

An alternative approach to setting up the infrastructure to host your own model from scratch, is to use a fully managed ML model hosting platform. For example, [Amazon Bedrock](https://aws.amazon.com/bedrock/) and [IBM watsonx.ai](http://watsonx.ai) allow you to host different open source or commercially available AI models and compare their performance, while [Microsoft Azure OpenAI service](https://learn.microsoft.com/en-gb/azure/ai-services/openai/overview) offers access to the OpenAI GPT models but running in a private instance with zero-day retention policies.

Running AI models locally

Many open source AI models are capable of being run locally on a single machine. This is often attractive because it allows the models to be run in isolation, with limited or no network access. This type of deployment is not recommended for most production services, but might be appropriate for ad-hoc or one-off applications where performance of the model is not paramount. 

Training AI models

In addition to where your AI model runs, you should also consider how it was trained because this is important from a security perspective. For example, many of the publicly available generative AI models were trained using data from the public internet. This means that they could include data that is personally identifiable, inaccurate, illegal or harmful, any of which could present a security risk.

It’s possible to train an AI model using your own data, and for many specific and limited tasks this is often the most appropriate approach because it gives you complete control of the training data. For generative AI models, the cost of doing this for larger and more capable systems is prohibitive and the amount of private data required to produce acceptable performance of a large model is beyond the capacity of most organisations. You should assume that any data you use to train your model could be extracted by an attacker. There’s more about this in the Data leakage section.

Working with your organisational data

A key application of AI is working with your organisation’s private data. By enabling the model to access, understand and use this data, insights and knowledge can be provided to users that are specific to their subject domain and will provide more reliable results. For a standard ML model, you can train them directly with your private data set. For generative AI models, you can fine-tune them or use approaches like retrieval augmented generation (RAG) to augment the model with your private data.

If you use your own data with an AI model, you immediately increase the data security risk and you need to apply additional security controls to stop data leakage and privacy violations.

Questions you should consider when using your own private data with an AI model include:

-   where is your data being sent and how is it being processed?
-   is your data being used to train future models?
-   how long is your data being retained? 
-   is your data being logged and who has access to those logs and for what purpose?

Open-source vs closed-source models

Neither open-source or closed-source AI models are inherently less secure than the other. A fully open-source model may expose not only the model code, but also the weights of its parameters and the data used to train the model. While this increases transparency, it also potentially presents a greater risk, as knowing the weights and the training data could allow an attacker to create attacks carefully tailored to the specific model.

One benefit of fully open-source models is that they allow you to inspect the source code and model architecture, enabling security experts to audit the code for vulnerabilities. Despite this, because of its complexity, even an open source generative AI model remains mostly opaque and hard to analyse. 

Security risks

AI security risks are divided into 2 main categories: the risk of using AI and the risk of adversaries using AI against you. 

Using AI

There are many resources you can use to explore the risks of using AI:

-   the National Cyber Security Centre (NCSC) has published a set of [principles around securing machine learning (ML) solutions](https://www.ncsc.gov.uk/collection/machine-learning)
-   Microsoft has compiled a list of [ML failure modes](https://learn.microsoft.com/en-us/security/engineering/failure-modes-in-machine-learning)
-   [MITRE Adversarial Threat Landscape for AI Systems (ATLAS) matrix](https://atlas.mitre.org/matrices/ATLAS) is an open source knowledge base of techniques used to attack AI systems
-   [International Scientific Report on the Safety of Advanced AI has an analysis of risks posed by general purpose advanced AI systems](https://www.gov.uk/government/publications/international-scientific-report-on-the-safety-of-advanced-ai)
-   the Open Worldwide Application Security Project (OWASP) has done significant work to identify the [unique risks posed by LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/) – these risks focus on the use of LLMs but many of them will also apply to other types of generative AI models and more widely to AI in general

From a combination of these sources, we can draw out some of the most common vulnerabilities and discuss them in context of AI applications in government.

Data and model poisoning

This is when data used to train an AI model has been tampered with, leading the model to produce incorrect or harmful output.

Attackers can target the data used to train an AI model to introduce vulnerabilities, backdoors or biases that compromise the model’s security and behaviour. 

For a traditional ML model that uses a limited amount of training data for a specific task, this type of attack can be prevented by training the model yourself on a known data set that you control. 

For frontier generative AI models, the barrier to entry for training a model from scratch is high and fine-tuning an existing model is much easier and cheaper. There are many open source models that are easy to fine-tune (for image generation, for example), and these can and are used to produce specific types of outputs, some of which are harmful or illegal. 

When using an AI model – particularly a specialised, fine-tuned model – from a third-party source, it’s difficult to ascertain if it has been tampered with. Poisoned models may appear to be functioning as expected until a specific prompt triggers the malicious behaviour.

Supply chain vulnerabilities of this kind are not unique to AI. For example, when software libraries are hacked, all downstream systems that depend on those libraries are affected – a notable example of this was the [Faker NPM hack](https://www.bleepingcomputer.com/news/security/dev-corrupts-npm-libs-colors-and-faker-breaking-thousands-of-apps/). Many automated tools exist for detecting, tracking and fixing security issues with open source software, but the current tooling for doing this with open source AI models is much more limited. Popular open source AI model site [Hugging Face](https://huggingface.co/) does have some [malware scanning tooling](https://huggingface.co/docs/hub/security-malware), but this is not capable of determining if a given AI model has been trained on poisoned data. 

AI model hosting platforms like Microsoft’s [Azure AI](https://azure.microsoft.com/en-gb/products/ai-studio/), Amazon’s [Bedrock](https://aws.amazon.com/bedrock/) and IBM’s [watsonx.ai](http://watsonx.ai) allow developers to use commercial models and other third-party AI models. These services do not make any guarantees about the security and integrity of the third-party models that they’re capable of hosting.

Training data can also be poisoned indirectly through the introduction of malicious data into known collections of open data that are used to train or fine-tune frontier generative AI models. This is likely to become an increasing threat as hackers learn which publicly available data sets (for example, Wikipedia or Reddit) have been used to train generative AI models, and target these to poison future versions of the models.

The impacts of an AI model trained or fine-tuned with poisoned data are wide ranging, including direct security threats to the organisation running the model and biased or harmful outputs to the users of the model. Poisoned models could push people to particular products or subvert confidence in government services. 

To help detect and prevent data poisoning, you’ll need to make sure your users and developers are trained on the risks and aware that the results from AI models can be false or biased. Outputs of models should be tested against known good responses and should be systematically tested for biases. ML hosting platforms often include evaluation tools that can measure and test the performance of an ML model, such as [Google’s Vertex AI](https://cloud.google.com/vertex-ai/docs/evaluation/introduction) or [Microsoft’s Prompt Flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/concept-model-monitoring-generative-ai-evaluation-metrics?view=azureml-api-2). Improved explainability of the models themselves would also help, enabling the output to be traced back to the source training data. For more information, refer to the Transparency and explainability section.

Data leakage

This is when responses from an AI model reveal confidential information, such as personal data. 

AI models are trained using data. In the case of generative AI, data is commonly taken from the public internet and will contain personal data and other confidential information. AI models can suffer from data leakage, depending on their intended mode of operation. For example, a model that is being used as a classifier to rank or sort data into groups based on criteria would necessarily be less likely to leak training data than a generative AI model, as its outputs are confined to the specific classification problem. However, if an AI model has been trained or fine-tuned with private data that has different levels of security controls based on the user who should be seeing it, for example documents that are restricted to a specific group of people, there is currently no way to preserve these controls when training the model.

Generative AI models can also be [made to reveal their original training data](https://arxiv.org/abs/2311.17035) through their responses, meaning that any outputs from a generative AI model could potentially contain confidential information. For generative AI, a way to preserve user access controls is to use ‘in-context learning’. A search is carried out first on the private data a user is permitted to see, and the retrieved results are passed in context to the generative AI model. This type of approach is known as retrieval augmented generation (RAG), and is used in many commercial generative AI tools (such as Microsoft Copilot). 

In-context learning has limitations and can degrade the performance of a generative AI model in certain applications. RAG tools are susceptible to indirect prompt injection, either in the information retrieved by the initial search or through the user prompt, meaning that security controls could be circumvented and private data could still be leaked.

You should make sure your AI model only has access to the data the user of the model should be able to access.

Insecure AI tool chain

This refers to when tools used to train, fine-tune, host, serialise and operate AI models are not secure. 

Specialised tools built to support AI models have been found to lack basic security features. For example, the Pickle format used to serialise ML models [has serious security flaws](https://huggingface.co/docs/hub/security-pickle). This may be because the tools were developed at pace by AI researchers and data scientists not following secure coding practices. AI tools often have elevated access rights to the systems they’re running on, making the impact of a security breach even worse. This is not a new risk, as any developer tooling can be insecure, but AI tools appear to be particularly prone to security issues. It’s easier for a hacker to target the tool chain for an AI model than the model itself.

You should make sure your cybersecurity team has approved the tools you use to support your AI models. This includes checking that the tools implement user authentication and follow the principle of least privilege, meaning they are not running with administrator permissions to your system.

Exacerbates previously existing risks

This refers to when the use of AI exacerbates previously existing risks, such as poor data management, insufficient security classification, insecure storage of credentials, and more. 

An example of this sort of risk is over-privileged access. This happens when an AI tool is used to enhance enterprise-wide search capabilities. A user may not be aware of sensitive data that they currently have access to on a government system, but when they use an AI-enhanced search tool, the power of the tool exposes the lack of access controls and brings back sensitive data that the user was unaware of being able to see. The AI tool is not creating this issue: the problem already exists, but the AI tool is making it worse. 

In line with the advice of vendors, you should review all enterprise access controls before deploying an AI tool to your system. This should be an ongoing exercise because no system is static. It’s essential that you’re able to continually monitor and review access controls when deploying AI applications across your organisation.

Perturbation attack

This is when an attacker stealthily modifies the inputs to an AI model to get a desired response. 

An example of this type of threat is a computer vision (CV) system for medical diagnostics trained to distinguish between abnormal and normal scans. The system can be fooled when presented with an image containing specific amounts of noise, causing it to classify a scan incorrectly. Mitigations include adversarial training of the model with noisy images to improve robustness against this type of attack.

Prompt injection 

This is when hackers use prompts that can make the generative AI model behave in unexpected ways. 

Prompt injection is a type of perturbation attack specifically targeted at generative AI systems that use text prompts to generate new content (text, image, audio, video). Developers lay down rules about how a model should behave and respond as system instructions, which are provided to the model along with the user prompt. Fundamentally, a generative AI model cannot distinguish between the user prompt and these system instructions because both are just seen as input to the model. A hacker can exploit this flaw by crafting special prompts that circumvent the system instructions, causing the model to respond in an unintended way. 

The potential impact of prompt injections ranges from very mild, like a user making a banking chatbot tell jokes in the style of a pirate, to much more serious. For example, a hacker might trick a generative AI model designed to send alerts to patients about medical appointments into sending fake messages about non-existing appointments.

Prompt injections come in 2 forms: 

-   direct, which means the user who is interacting with the generative AI model crafts the prompt injection themselves
-   indirect, when other information that is being sent to a generative AI model is tampered with to include a prompt injection. For example, an email attachment can include a prompt and when a generative AI model that is tasked with summarising emails reads the attachment, the prompt injection is triggered

Generative AI has the ability to take natural language inputs and have a machine act on them. A common pattern for using LLMs in this way is called ReAct ([Reason-Act](https://arxiv.org/abs/2210.03629)): the LLM is prompted to reason about how to perform a task, and the response from the model is processed and used to automate calls to different services that perform actions. Hackers can subvert this approach to make the model perform different actions, which significantly limits the utility of generative AI in fully automated solutions. To make sure the model is doing the right thing, there must be a human present to review the action before carrying it out. This is why the majority of commercial applications of generative AI are in the space of human assistants (‘copilots’). 

Work is underway to address the prompt injection issue and a number of mitigations are already available. These include:

-   filtering prompts before they’re sent to the model (by sending the prompts through another ML model trained to detect likely prompt injections)
-   filtering the outputs of the model before they’re returned to the user
-   more [speculative work](https://arxiv.org/html/2312.14197v1) around fine-tuning models to better distinguish between user input and system prompts

To defend against prompt injection, you should log all prompts sent to a model and carry out ongoing audits to determine if prompt injection is happening, blocking users you find who are responsible.

Hallucinations

Hallucinations are when the generative AI model responds with information that appears to be truthful but is actually false.

Counterintuitively for a machine, generative AI is better at creative tasks than fact retrieval. This is because all generative AI models predict and generate content by determining the most likely subsequent pattern based on previous training (for example, an LLM will predict the next most likely word). The models are therefore very good at generating plausible predictions that look correct but may not actually be correct. The risk is that overreliance by human operators on the outputs of generative AI models results in misinformation, miscommunication, legal issues and security vulnerabilities. 

Fundamentally, generative AI models cannot be trusted to produce factual content. Any generative AI services that output generated content directly to the public – for example, an LLM-powered chatbot giving advice on a government website – would be prone to hallucination and could lead to someone being misled about a government service, policy or point of law. 

A [legal case in Canada](https://bc.ctvnews.ca/air-canada-s-chatbot-gave-a-b-c-man-the-wrong-information-now-the-airline-has-to-pay-for-the-mistake-1.6769454) found an organisation that owned a site with a hallucinating chatbot financially responsible for the bad advice it dispensed. In the worst case, hallucination could even lead to direct harm if a user acted on faulty advice. For example, a user being advised not to seek medical attention when they needed to. 

In addition to this direct risk, there’s also a significant indirect risk if officials are relying on generative AI as a primary information source when providing the public with guidance, advising ministers or informing policy decisions. 

You should make sure your users are trained not to uncritically trust the outputs of generative AI or to rely exclusively on their responses. Specifically around cybersecurity, if security practitioners in government become overly reliant on the advice of generative AI assistants, they may become less effective at spotting novel attacks and may even be misled into following bad advice and exposing systems to increased cybersecurity risks.

Adversaries using AIMisinformation

This is when AI is used to create realistic synthetic media, leading to the spread of misinformation, undermining trust in digital media and manipulating public opinion. 

Adversaries could use AI to interfere in electoral processes and spread misinformation. What makes this threat more potent is the ease with which bad actors can produce content for multiple audiences in many languages, with translations reflecting nuance and common parlance to make them more credible.

The technical ease with which generative AI models can be integrated with social media or other platforms also means that bad actors could spread misinformation automatically and at scale. At present, misinformation is the most pressing risk that AI (particularly generative AI) presents to governments, specifically relating to the integrity of democratic elections. There have already been a number of instances of [suspected AI-generated fake media](https://www.bbc.co.uk/news/world-us-canada-68064247) being deployed in the US. With the release of new, more powerful generative AI models capable of generating realistic video content, such as OpenAI’s [video generation model Sora](https://openai.com/sora), this risk is only going to increase.

Big tech companies have committed to address the issue by including [watermarks in the generated AI content](https://arstechnica.com/ai/2023/07/openai-google-will-watermark-ai-generated-content-to-hinder-deepfakes-misinfo/) their models create, but so far this has not become widespread. [Google has announced a tool](https://www.bbc.co.uk/news/technology-66618852) that can detect and watermark AI-generated content. The [C2PA open standard](https://c2pa.org/) for embedding metadata into media content, which allows the source and provenance of the content to be verified, is also gaining some traction.

When building services that receive and process digital content (text, images or even video), you’ll need to consider the impact of that content being generated by AI and therefore being unreliable, misleading or malicious. For more information about the ethical implications of misinformation, refer to the Societal wellbeing and public good section. 

Phishing

This is when generative AI is used to craft more convincing phishing emails and messages that can be tailored to specific user groups, leading to an increase in internet fraud.

LLMs make it easy for fraudsters to create convincing phishing emails and messages in different languages, even those they do not speak. LLMs can be easily automated to produce unique, targeted and personalised phishing emails at scale, making detection much harder. There is already [some evidence](https://www.prnewswire.com/news-releases/fido-alliance-study-reveals-growing-demand-for-password-alternatives-as-ai-fuelled-phishing-attacks-rise-301957007.html) that the amount of phishing emails and messages is rising, with the likely cause being the advent of generative AI. 

Government is likely to see an increase in phishing emails and social engineering attacks as a result of generative AI. The risk of cyber security breaches through targeted, socially engineered attacks driven by generative AI could become more acute, as it may become easier to identify likely targets by using generative AI to trawl across social networks and other public resources, looking for contact details for government employees in sensitive roles.

To detect scams of this sort, you’ll need more sophisticated counter measures – for example, using another specially trained ML model to detect and block phishing emails produced by generative AI. 

You’ll also need to educate users about how to detect AI-produced fake messages, because previous red flags such as badly formed sentences and incorrect spelling will no longer be enough. The likelihood is that phishing attacks will become more targeted, and use more sophisticated social engineering techniques to gain the recipient’s trust. 

Cyber attacks 

This refers to when generative AI lowers the bar for entry for hackers to create malware and craft cyber attacks that are more sophisticated and harder to detect.

Generative AI has proved to be highly capable at aiding developers to write effective code: the AI model provides the developer with the majority of the solution, including prerequisites and boilerplate code, leaving the developer only needing to finesse the final details. A hacker using a generative AI model specifically to create malware or craft a cyber attack is likely to more quickly and easily achieve a working attack.

All large commercial generative AI models have filters in place to try to detect if a user is asking the model to create malware. However, these filters can be subverted (refer to prompt injection threats). The expectation from some cyber security experts is that the number and sophistication of cyber attacks is likely to rise due to the use of generative AI, as many more bad actors who previously were excluded from being able to create credible threats are now able to do so.

The unique position of government, and the capabilities and desire of hostile state-sponsored groups, mean that this threat is likely to be a key concern for government cybersecurity teams. The potential for escalating levels of sophisticated cyber attacks fuelled by generative AI is real, although [research by Microsoft and OpenAI](https://www.microsoft.com/en-us/security/blog/2024/02/14/staying-ahead-of-threat-actors-in-the-age-of-ai/) has yet to observe any particularly novel or unique attacks resulting from the use of AI. The area is under constant review.

You should expect increased numbers of cyber attacks and take steps to increase your existing cyber security defences. For more information, refer to the [NCSC report on the near-term impact of AI on the cyber threat](https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat).

Fake official correspondence 

This is when generative AI is used to craft convincingly human correspondence which can either be automated and sent at scale to organisations, flooding their usual communications channels, or lead to unfair outcomes when judged against human correspondence. 

An example of this kind of threat might be a hacker using generative AI to create thousands of requests for information from a government department, seemingly sent from multiple unique people. Similar to the phishing threat, the ability of LLMs to create convincing and plausible text in an automated way, at scale, makes this type of attack particularly concerning. A hacker could overwhelm an organisation’s normal communications channels, causing an organisation to spend time and money responding to seemingly genuine requests while degrading their ability to cope with real people. 

Another example of this sort of threat, at a lower scale, is a fraudster submitting official information that will be used to judge a decision, and where the use of generative AI to create fake answers may prejudice the decision.

Areas of particular concern for the UK government are commercial procurement, recruitment, freedom of information requests, and the processing of claims that require an evidence-based decision.

Mitigations are similar to those for phishing or misinformation attacks – for example, processing all correspondence through another ML model trained to detect AI-generated content. When running services that result in decisions based on evidence provided through official correspondence, you should consider the potential impact on the service of the correspondence being AI generated.

Security opportunities

In addition to the threats posed by AI there are also opportunities to improve cyber security through the use of AI. Some of these opportunities are:

-   threat detection: AI can be used to improve threat detection systems by generating synthetic cyber attack data for training more robust models, or directly detecting anomalies in real-time cyber security data. AI models can also be used to analyse historical cyber security data and identify patterns associated with known threats. These patterns can then be used to detect anomalies in real-time network traffic or system behaviour. When unusual activity occurs, the AI model can trigger an alert to be raised to human operators. 
-   incident response: AI models trained or fine-tuned on large amounts of historical cyber security data can predict future threats. By recognising subtle changes in patterns, they can be used to anticipate emerging attack vectors. Generative AI can assist in incident response by automating the generation of reports, recommending remediation actions based on past data, or filtering out noise in verbose cyber security logs, allowing human analysts to focus on the most important information. 
-   security testing: generative AI can create security test cases, improving the efficiency and coverage of security testing. Instead of manually crafting test scenarios, security professionals can use generative AI models to mimic adversary behaviour, simulate various attacks, and analyse existing vulnerabilities, attack patterns and system behaviours. LLMs are good at analysing code, meaning they can also be used to review source code, point out security flaws, and generate secure code snippets based on security best practices. 
-   enhancing vulnerability management: generative AI can assist in documenting security products. LLMs can be used to process the large amounts of documentation, guidance and online help around different security tools and their features and limitations, providing summarised information and enhanced search capabilities. Internet-enabled LLMs can also provide up-to-date insights, helping prioritise vulnerability patches and updates.

Scenarios

The scenarios discussed below build on the security risks identified in this section, and will help you understand how they apply to some of the applications of AI in government. 

Each scenario includes descriptions of potential impacts and mitigations. The likelihood and impact of each risk is scored following the approach outlined in the [OWASP risk rating methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology). In addition to the impact factors included in the OWASP approach, user harm and misinformation are discussed as significant impact factors.

This list of security threat scenarios is not exhaustive, but you can use the scenarios as a template for assessing the risks associated with different applications of AI.

1.  Perturbation attack: an attacker stealthily modifies the inputs to an AI model to get a desired response: Identity verification using image and video capture technology.
2.  Insecure AI tool chain: tools used to train, fine-tune, host, serialise and operate AI models are not secure: Machine learning operations (MLOps) tools used with default configuration.
3.  Prompt injection threats: using prompts that can make the generative AI model behave in unexpected ways: LLM chatbot on a government website.
4.  Data leakage: responses from the LLM reveal sensitive information, for example personal data: Enterprise AI search tool summarising emails.
5.  Hallucinations: the LLM responds with information that appears to be truthful but is actually false: Developer uses LLM-generated code without review.

Identity verification using image and video capture technologyScenario

A government service requires users to prove their identity by capturing an image of an identity document containing their picture, such as a passport or driving licence. A CV AI system then compares this image to a live video clip of the person to verify that the person is who they claim to be. A malicious user uses AI deepfake technology to insert their own image over the genuine photo of another person on a stolen identity document. The CV system is tricked into wrongly verifying that the malicious user’s identity matches the credentials on the other user’s identity document.

Impact

Misidentification of the true user, leading to identity fraud.

Fraudulent access to a government service.

Data loss of personal and confidential data about the genuine user.

Serious security breach if the service provides access to sensitive government information.

Mitigation

Ensure the service only uses biometric identity documents. For example, biometric passports contain electronic passport photos which can be securely transferred to the service for verification. 

Use a trusted third-party service to look up and provide reference images for identity documents, rather than relying on images captured by users themselves. For example, the service could use licence images stored in the DVLA system and check this against the live video image.

Use deepfake detection methods to scan input digital images and video clips which are received by the service. 

Risk rating

Likelihood: MEDIUM

Impact: HIGH

Recommendation

In this specific example, use of a biometric passport can prevent the attack. However, if the deepfake were applied to the live video clip of the user instead of the image of the identity document, the system could still be fooled. Access to this type of deepfake technology is becoming increasingly available, meaning that when you build services to receive and process images or video, you must put in place mechanisms to detect if the content has been manipulated by AI.

MLOps tools used with default configuration Scenario

A data scientist working in a government organisation wants to experiment with training their own ML model using organisational data. The experiment aims to test whether the model can be used to triage official correspondence, improving efficiency. The data scientist starts by using an open source MLOps tool to host and deploy their ML model in their local environment. The default configuration of the tool exposes a public endpoint with no authentication on the public internet. By default, the tool runs with administrator permissions on the host machine. A hacker discovers the exposed endpoint and sends commands to the MLOps tool, using it to gain a foothold in the organisation’s network.

Impact

Serious security breach, which could lead to catastrophic damage to the organisation’s computer systems.

Data loss, including the organisational data used to train the ML model, and other sensitive data that can be accessed through the tool’s elevated permissions.

Mitigation

Check the default configuration of all ML tools before deploying them and ensure basic security controls are in place:  
\- authentication is enabled - no public-facing endpoints are exposed unless explicitly required - the principle of least privilege is applied so that tools only run with the minimum permissions they require

Risk rating

Likelihood: MEDIUM

Impact: HIGH

Recommendation

AI tools should be treated in the same way as all other third-party software. Even when they’re being used for experimentation, secure by design principles should always be applied.

LLM chatbot on a government website – full chat interfaceScenario

A chatbot deployed to a government website to assist with queries relating to a particular public service. The chatbot uses a private instance of one of the publicly trained LLMs. The user’s question is combined with system instructions that tell the LLM to only respond to questions relevant to the specific service. The system instructions are combined with the user’s original question and sent to the LLM. A malicious user could craft a specific prompt that circumvents the system instructions and makes the chatbot respond with irrelevant and potentially harmful information. 

This is an example of a direct prompt injection attack.

Impact

Actual risk of user harm if a user is tricked into using an unsafe prompt that then results in harmful content being returned and acted on. For example, a user looking for information on how to pay a bill is directed to a fraudulent payment site.

Reputational damage to the government if a user made public potentially harmful responses received from the chatbot – for example, a user asking for generic information and receiving an inflammatory response.

Mitigation

Use prompt engineering to attach a meta prompt to any user input to prevent the LLM from responding to malicious input.

Apply content filters trained to detect likely prompt injections to all prompts sent to the LLM.

Choose a more robust model: some models have been shown to be more resistant to this kind of attack than others.

None of these mitigations are sufficient to guarantee that a prompt injection attack would not succeed. Fundamentally, an LLM cannot distinguish between user input and system instructions. Both are processed by the LLM as natural language inputs so there is no way to prevent a user prompt affecting the behaviour of the LLM.

Risk rating

Likelihood: HIGH

Impact: 

LOW – response is returned to a single user with limited repercussions. 

HIGH – response causes actual harm to a user.

Recommendation

Deploying an LLM chatbot to a public-facing government website comes with a significant risk of a direct prompt injection attack. You should consider the impact of an attack like this in the context of the specific use case. A chatbot deployed in a limited function or in controlled conditions – by restricting the number of users, for example – is far lower risk than one that is more widely available.

Enterprise AI search tool summarising emailsScenario

A hacker sends a malicious email attachment to a government recipient who is using an enterprise generative AI tool to assist them. The tool uses a retrieval augmented generation (RAG) pattern, searching the private data the recipient can access and sending relevant data in-context to an LLM. The tool searches the recipient’s inbox, including their unread emails and attachments, for relevant information. The tool passes the prompt injection contained in the attachment to the LLM along with other private data. The prompt injection causes the LLM to respond by summarising the private data in the form of an obfuscated link to a third-party website. When returned to the recipient, the link may, depending on the tools being used, automatically unfurl a preview and instantly exfiltrate the private data to the third-party website.

Impact

Data loss: confidential information contained in the user’s emails is transferred to a third party. 

Reputational damage to the department due to loss of data.

Regulatory breaches with financial consequences.

Mitigation

Configure the enterprise AI tool so that unread emails and attachments are not included in the initial search.

Apply filters before the in-context data is added to the prompt to remove likely prompt injections.

Apply filters to the response generated by the LLM to ensure any links contained in it are only to known resources.

Ensure network controls are enforced that prevent applications making calls to dangerous URLs.

Risk rating

Likelihood: LOW

Impact: HIGH

Recommendation

In this scenario, indirect prompt injection in an email attachment can be used to perform data exfiltration without any action required by the user. Similar [data exfiltration techniques have already been shown to work](https://embracethered.com/blog/posts/2023/google-bard-data-exfiltration/) against commercial LLMs. With the increased adoption by government departments of enterprise AI tools, we will likely see more of these novel generative AI-specific cybersecurity threats.

Developer uses LLM-generated codeScenario

A developer uses a public LLM to answer coding questions and receives advice to install a specific software package, ArangoDB, from the JavaScript package management system npm. When the LLM was trained, the package did not exist. A hacker has previously interrogated the LLM with common coding questions and identified this hallucination. They then created a malicious package with the fictitious name and registered it with the package management system. When the developer installs the package, they receive the malicious code.

Impact

Unauthorised code execution when the software containing the fake package is deployed and run. This could result in significant data loss and other serious consequences.

Mitigation

Do not rely on the responses of the LLM: double-check all outputs before including them in your code. Check all package dependencies of your code before deployment. Use an automated tool such as a ‘dependabot’ or ‘snyk’ to scan for supply chain vulnerabilities.

Risk rating

Likelihood: LOW

Impact: HIGH

Recommendation

If developers follow secure coding best practices, the risk should never arise because all dependencies should be checked before deployment. Over-reliance on LLM-generated code without sufficient human oversight is likely to become an increasing risk. Treat all LLM-generated code as inherently insecure and never use it directly in production code without first doing a code review.

References

[Can you trust ChatGPT’s package recommendations?](https://vulcan.io/blog/ai-hallucinations-package-risk)

Practical recommendationsApplies to AI

-   Design risk-driven security, taking account of the failure modes for the type of AI you’re using – for example, [OWASP Top 10 security risks for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/) or the [ATLAS Matrix](https://atlas.mitre.org/matrices/ATLAS).
-   Use a consistent risk rating methodology to assess the impact and likelihood of each risk – for example, the [OWASP risk rating methodology](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).
-   Minimise the attack surface by only using the AI capabilities you require – for example, by not sending user input directly to an LLM.
-   Defend in depth by adding layers of security – for example, by using PET to prevent data leakage and adding content filters to sanitise output of an AI model.
-   Never use private data that needs different levels of user access permissions to train or fine-tune an AI model.
-   When building services that receive and process text, images or video, take steps to validate inputs to detect if the content has been generated by AI and could be unreliable, misleading or malicious.
-   Review all enterprise access controls before deploying an AI tool to your environment to make sure users can only access the data they have permission to view. 
-   Never enter any official information directly into public AI applications or APIs unless it’s already publicly available or cleared for publication. Exceptions may apply for specific applications with different data handling terms provided under commercial licences, for example Microsoft Copilot.
-   When experimenting with AI tools, pay attention to security and never assume default configurations are secure.

Applies to generative AI

-   Avoid using generative AI where it’s not appropriate or required. Ask yourself if a non-AI solution or a traditional ML model trained for a specific purpose could work just as well.
-   Prevent generative AI responses automatically leading to destructive or irreversible actions, such as sending emails or modifying records. In these situations a human must be present to review the action.
-   Avoid using links to external resources in LLM responses that will be read by humans. If external links are provided, the response must be filtered to remove malicious URLs.
-   Train your users not to trust the outputs of generative AI or rely exclusively on generated responses.
-   Treat all LLM-generated code as inherently insecure and never use it directly in production without code review.
-   Avoid putting LLM chatbots on public-facing government websites unless the risk of direct prompt injection is acceptable under the specific use case.
-   When hosting virtual meetings, organisers should verify the identity of all attendees and state up front that the use of third-party AI meeting transcription tools is not allowed.