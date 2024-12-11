import { useState } from "react";
import "./cssfiles/Faq.css";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqs = [
    {
      question: "What is dyslexia?",
      answer:
        "Dyslexia is a specific learning disability that is neurobiological in origin. It is characterized by difficulties with accurate and/or fluent word recognition and by poor spelling and decoding abilities.",
    },
    {
      question: "What are common signs of autism?",
      answer:
        "Common signs of autism include difficulties with communication, challenges with social interactions, and repetitive behaviors. Each person with autism is unique and may exhibit different symptoms.",
    },
    {
      question: "How can I support a child with dyslexia?",
      answer:
        "Support a child with dyslexia by providing them with a structured and supportive learning environment, using multisensory teaching methods, and being patient and understanding.",
    },
    {
      question: "What interventions are effective for children with autism?",
      answer:
        "Effective interventions for children with autism often include behavioral therapy, speech and language therapy, occupational therapy, and tailored educational support.",
    },
    {
      question: "Can dyslexia be cured?",
      answer:
        "Dyslexia is a lifelong condition. However, with the right support and intervention, individuals with dyslexia can learn to read and write effectively.",
    },
    {
      question: "Are there any assistive technologies for dyslexia?",
      answer:
        "Yes, there are many assistive technologies available for dyslexia, such as text-to-speech software, audiobooks, and specialized educational apps that can help improve reading and writing skills.",
    },
    {
      question: "What are the early signs of dyslexia in children?",
      answer:
        "Early signs of dyslexia in children may include difficulty learning the alphabet, trouble rhyming, difficulty recognizing words that begin with the same sound, and struggling with basic reading and writing tasks.",
    },
    {
      question: "How is autism diagnosed?",
      answer:
        "Autism is diagnosed through a combination of developmental screenings, behavioral evaluations, and assessments conducted by healthcare professionals. There is no single medical test for diagnosing autism.",
    },
    {
      question:
        "What is the difference between autism and Asperger's syndrome?",
      answer:
        "Asperger's syndrome is considered a part of the autism spectrum disorder (ASD). Individuals with Asperger's syndrome typically have milder symptoms and do not have significant delays in language development.",
    },
    {
      question: "Can autism be treated?",
      answer:
        "While there is no cure for autism, various treatments and interventions can help individuals with autism manage symptoms and improve their quality of life. These include behavioral therapy, speech therapy, and occupational therapy.",
    },
    {
      question:
        "What resources are available for parents of children with autism or dyslexia?",
      answer:
        "There are numerous resources available, including support groups, educational organizations, online forums, and professional services that can provide guidance, support, and information for parents.",
    },
  ];

  return (
    <div className="faq">
      <div className="container mt-5 mb-5 faqcontainer p-4 rounded-4">
        <h1 className="mb-4 fw-medium text-center fw-bold">
          Frequently Asked Questions
        </h1>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item mb-3"
              onClick={() => toggleFAQ(index)}
            >
              <div className="card faq-card">
                <div className="card-header faq-question d-flex justify-content-between align-items-center">
                  {faq.question}
                  <span className="faq-arrow">
                    {activeIndex === index ? "˄" : "˅"}
                  </span>
                </div>
                <div
                  className={`card-body faq-answer ${
                    activeIndex === index ? "show" : ""
                  }`}
                >
                  <p className="card-text">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
