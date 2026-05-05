-- ============================================================
-- UPDATE DOCTOR BIOS — Hope Trust India
-- Run this in: Supabase Dashboard > SQL Editor
-- IDEMPOTENT — safe to re-run at any time.
-- Format: \n for line breaks, lines ending with : are headers,
--         lines starting with • are bullet points.
-- Batch 1: 6 doctors (Rajeshwari, Nishanth, Vidhya Sagar, Shruti, Muskan, Arani)
-- ============================================================

UPDATE doctors SET bio = E'Rajeshwari Luther is a counselling psychologist with over 25 years of experience helping individuals, couples, and families find clarity, resilience, and a renewed sense of self.\n\nAreas of Expertise:\n\u2022 Mental health & addiction recovery\n\u2022 Co-dependency & parenting challenges\n\u2022 Life transitions & everyday well-being\n\u2022 Corporate mental health & EAP programs\n\nTherapeutic Approaches:\n\u2022 Talk therapy & narrative therapy\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Art therapy & meditation\n\u2022 Certified & accredited EFT practitioner\n\nQualifications:\n\u2022 Master''s in Psychology\n\u2022 Healthcare Management — ISB Hyderabad\n\u2022 Addiction Treatment — Hazelden-Betty Ford, USA\n\u2022 Diploma in Art Therapy\n\nLanguages: English, Hindi & Telugu'
WHERE name = 'Mrs. Rajeshwari Luther';

UPDATE doctors SET bio = E'Dr. Nishanth is an M.D. in Psychiatry with over 14 years of experience. His work in rehabilitation and clinical settings has reinforced his belief that "there is no health without mental health."\n\nAreas of Expertise:\n\u2022 Substance addiction & rehabilitation\n\u2022 Chronic mental illness — schizophrenia, bipolar disorder\n\u2022 Depression, anxiety & OCD\n\nLanguages: Hindi, English, Telugu & Kannada'
WHERE name = 'Dr. Nishanth Vemana';

UPDATE doctors SET bio = E'Dr. Vidhya Sagar has over 11 years of clinical experience and four years in teaching.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & OCD spectrum disorders\n\u2022 Substance & behavioural addictions (internet, sexual, pornography)\n\u2022 Psychotic disorders & pain management\n\u2022 Sexual dysfunctions & sleep-related issues\n\u2022 Couple, marital & parenting matters\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Mindfulness-based therapies\n\u2022 Social skills & relaxation training\n\u2022 Psychometric testing\n\nQualifications:\n\u2022 PhD in Clinical Psychology — NIMHANS, Bangalore\n\u2022 M.Phil. in Clinical Psychology — NIMHANS, Bangalore\n\nLanguages: English, Hindi & Telugu'
WHERE name = 'Dr. Vidhya Sagar';

UPDATE doctors SET bio = E'Shruti is a Masters in Clinical Psychology from Jain University, Bangalore. As a Gen Z therapist, students find her particularly relatable.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & stress management\n\u2022 Gender identity & sexuality\n\u2022 Body image & self-esteem challenges\n\u2022 Substance use & exam stress\n\u2022 Career confusion & academic performance anxiety\n\u2022 Social anxiety & boundary setting\n\nTherapeutic Approaches:\n\u2022 CBT, DBT & Acceptance and Commitment Therapy (ACT)\n\u2022 Queer Affirmative Therapy\n\u2022 Family Therapy & Systematic Desensitisation\n\nQualifications:\n\u2022 MSc Clinical Psychology — Jain University, Bangalore\n\u2022 Diploma in Organizational Psychology\n\nLanguages: Hindi, English, Urdu, Dogri & Punjabi'
WHERE name = 'Ms. Shruti Sharma';

UPDATE doctors SET bio = E'Muskan is an RCI-certified clinical psychologist providing individual and couple counselling for both children and adults.\n\nAreas of Expertise:\n\u2022 Depression, anxiety & panic disorders\n\u2022 Eating disorders & PTSD\n\u2022 ADHD & adjustment disorders\n\u2022 Substance use & personality disorders\n\u2022 Psychometric testing\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Acceptance & Commitment Therapy (ACT)\n\u2022 Schema-focused therapy\n\u2022 Dialectical Behaviour Therapy (DBT)\n\u2022 Exposure & Response Prevention (ERP)\n\u2022 Mindfulness therapy\n\nQualifications:\n\u2022 M.Phil. in Clinical Psychology — Manipal Academy of Higher Education'
WHERE name = 'Ms. Muskan Gupta';

UPDATE doctors SET bio = E'Arani is an RCI-certified clinical psychologist with over 6 years of experience in evidence-based psychotherapies.\n\nAreas of Expertise:\n\u2022 Depression & OCD spectrum disorders\n\u2022 Anxiety & ADHD\n\u2022 Substance use & personality disorders\n\u2022 Couple & marital issues\n\u2022 Psychological assessments\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Rational Emotive Behaviour Therapy (REBT)\n\u2022 Acceptance & Commitment Therapy (ACT)\n\u2022 Exposure & Response Prevention (ERP)\n\u2022 Mindfulness-based therapies & NLP\n\nQualifications:\n\u2022 Professional Diploma in Clinical Psychology\n\u2022 MSc Psychology — Acharya Nagarjuna University\n\nLanguages: English, Telugu & Hindi'
WHERE name = 'Ms. Arani Shankar';

-- ============================================================
-- Batch 2: 6 doctors (Akansha, Sneha, Tina, Purvi, Aparna, Apeksha)
-- ============================================================

UPDATE doctors SET bio = E'Akansha is a Masters in Psychology with an eclectic therapeutic approach, using a variety of therapies tailored to each client''s unique needs and overall well-being.\n\nAreas of Expertise:\n\u2022 Anxiety & anger management\n\u2022 Stress management & depression\n\u2022 Adjustment & self-esteem issues\n\u2022 Socio-emotional concerns\n\nTherapeutic Approaches:\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Relaxation-based techniques\n\u2022 Imago Relationship Therapy\n\u2022 Play Therapy\n\nLanguages: Hindi & English'
WHERE name = 'Ms. Akansha Kabra';

UPDATE doctors SET bio = E'Sneha is a highly skilled psychiatric social worker specializing in addiction recovery and mental health interventions.\n\nAreas of Expertise:\n\u2022 Deaddiction & substance dependencies\n\u2022 Social skills training & cognitive retraining\n\u2022 Family counselling & psychoeducation\n\u2022 Mental health rehabilitation\n\nTherapeutic Approaches:\n\u2022 Cognitive Behavioural Therapy (CBT)\n\u2022 Motivational Enhancement Therapy (MET)\n\u2022 Family therapy & psychoeducation\n\u2022 Personalized recovery planning\n\nQualifications:\n\u2022 MPhil in Psychiatric Social Work \u2014 Manipal Academy of Higher Education\n\nLanguages: English, Telugu & Hindi'
WHERE name = 'Ms. Sneha Sesha';

UPDATE doctors SET bio = E'Dr. Tina Fernandes has worked in Research, Education, and Mental Health for over 35 years. She is committed to empowering individuals to break cycles, heal, and reclaim their agency.\n\nAreas of Expertise:\n\u2022 Managing personal relationships\n\u2022 Life transitions & adjustment\n\u2022 Anxiety, depression & trauma\n\u2022 Disruptive behaviours & self-esteem\n\u2022 Adolescent & adult psychological issues\n\nTherapeutic Approaches:\n\u2022 Narrative therapy\n\u2022 Mindfulness-based therapy\n\u2022 Cognitive Behaviour Therapy (CBT)\n\u2022 Person-centred therapy\n\u2022 Psychoanalytic psychotherapy\n\nQualifications:\n\u2022 MA, BEd, MPhil, PhD in Psychology\n\nLanguages: English & Hindi'
WHERE name = 'Dr. Justina Wilma Fernandes';

UPDATE doctors SET bio = E'Purvi is an RCI-certified clinical psychologist and certified marital & family therapist, specializing in heterosexual and LGBTQ+ couples and families.\n\nAreas of Expertise:\n\u2022 Anxiety, depression & grief\n\u2022 Addiction & emotional disturbances\n\u2022 Life transitions & anger management\n\u2022 Stress, pre- & post-operative counselling\n\u2022 Pain management & adolescent issues\n\u2022 LGBTQ+ couple & family therapy\n\nTherapeutic Approaches:\n\u2022 Emotionally Focused Therapy (EFT)\n\u2022 Solution-driven, evidence-based integrative approach\n\nQualifications:\n\u2022 MPhil in Clinical Psychology\n\u2022 MSc Health Psychology \u2014 Central University, Hyderabad\n\nLanguages: Hindi, English & Gujarati'
WHERE name = 'Ms. Purvi Chottai';

UPDATE doctors SET bio = E'Dr. K Aparna is an experienced Neuropsychiatrist and certified life coach, offering specialized services in mental health and wellness.\n\nAreas of Expertise:\n\u2022 Addiction psychiatry\n\u2022 Psychosis & bipolar disorder\n\u2022 Depression, anxiety & OCD\n\u2022 Personality disorders\n\u2022 Adolescent psychiatry\n\u2022 Senile dementia care\n\nQualifications:\n\u2022 MD in Psychiatry\n\nLanguages: English & Telugu'
WHERE name = 'Dr. K. Aparna';

UPDATE doctors SET bio = E'Apeksha is a licensed psychologist committed to providing personalized, compassionate care that meets each client where they are. Her approach is flexible and responsive, drawing from evidence-based methods.\n\nAreas of Expertise:\n\u2022 Stress & depression\n\u2022 Anxiety disorders\n\u2022 Adjustment disorders\n\nQualifications:\n\u2022 Professional Diploma in Clinical Psychology \u2014 Sweekaar Academy of Rehabilitation Sciences, Hyderabad\n\nLanguages: English & Hindi'
WHERE name = 'Ms. Apeksha';

-- Verify all updates
SELECT name, LEFT(bio, 80) || '...' AS bio_preview FROM doctors ORDER BY display_order;
