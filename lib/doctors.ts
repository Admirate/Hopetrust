export type Doctor = {
  name: string;
  qualification: string;
  department: string;
  bio: string;
  bookingUrl: string;
  photo?: string;
};

export const doctors: Doctor[] = [
  {
    name: 'Mrs. Rajeshwari Luther',
    qualification: 'MA Psychology',
    department: 'Psychology',
    bio: "I'm Rajeshwari Luther, a counselling psychologist with over 25 years of experience in mental health, addiction treatment, family counselling and training. I believe listening to what my client has to say is the most important part of my practice.",
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48109&eid=48109',
  },
  {
    name: 'Dr. Vidhya Sagar',
    qualification: 'PhD in Clinical Psychology',
    department: 'Psychology',
    bio: 'Dr Vidhya Sagar holds a PhD and M.Phil. (Clinical Psych) from the National Institute of Mental Health and Neurosciences (NIMHANS), Bangalore.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48124&eid=48109',
  },
  {
    name: 'Ms. Muskan Gupta',
    qualification: 'MPhil Clinical Psychology',
    department: 'Psychology',
    bio: 'Muskan is an RCI-certified clinical psychologist.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48125&eid=48109',
  },
  {
    name: 'Ms. Akansha Kabra',
    qualification: 'MA Psychology',
    department: 'Psychology',
    bio: 'Akansha is a Masters in Psychology and qualified in cognitive behaviour therapy, relaxation-based techniques, Imago relationship therapy, and play therapy.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48126&eid=48109',
  },
  {
    name: 'Ms. Sneha Sesha',
    qualification: 'MPhil in Social Work',
    department: 'Social Work',
    bio: 'She is a highly skilled psychiatric social worker specializing in addiction recovery and mental health interventions.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=45153&eid=48109',
  },
  {
    name: 'Ms. Arani Shankar',
    qualification: 'PGDP in Clinical Psychology',
    department: 'Psychology',
    bio: 'Arani is an RCI certified clinical psychologist.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48146&eid=48109',
  },
  {
    name: 'Dr. Nishanth Vemana',
    qualification: 'MD Psychiatry',
    department: 'Psychiatry',
    bio: 'Dr Nishanth is an M.D. in psychiatry with over 14 years of experience.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=41861&eid=48109',
  },
  {
    name: 'Dr. K. Aparna',
    qualification: 'MD Psychiatry',
    department: 'Psychiatry',
    bio: 'Dr. K Aparna is an experienced Neuropsychiatrist and certified life coach, offering specialized services in mental health and wellness. With expertise in addiction psychiatry, Dr. Aparna handles complex cases including psychosis and bipolar disorder. Fluent in both English and Telugu, she provides personalized, compassionate care.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48191&eid=48109',
  },
  {
    name: 'Dr. Justina Wilma Fernandes',
    qualification: 'PhD Psychology',
    department: 'Psychology',
    bio: 'Dr. Tina Fernandes (MA, BEd, MPhil, PhD) has worked in the field of Research, Education and Mental Health for over 35 years.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48148&eid=48109',
  },
  {
    name: 'Ms. Purvi Chottai',
    qualification: 'MPhil Clinical Psychology',
    department: 'Psychology',
    bio: 'Purvi is an RCI certified clinical psychologist with a MPhil in clinical psychology. She has vast experience supporting individuals suffering from anxiety, depression, addictions, adjusting to life\'s transitions, grief, anger mismanagement, and emotional well-being.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=42507&eid=48109',
  },
  {
    name: 'Ms. Apeksha',
    qualification: 'PGDP in Clinical Psychology',
    department: 'Psychology',
    bio: 'Apeksha is a licensed psychologist committed to providing personalized, compassionate care that meets each client where they are. Her approach is flexible and responsive — drawing from a range of evidence-based methods. She works with stress, depression, anxiety disorders, and adjustment disorders.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48264&eid=48109',
  },
  {
    name: 'Ms. Shruti Sharma',
    qualification: 'MSc Psychology',
    department: 'Psychology',
    bio: 'Shruti is a Masters in Clinical Psychology from Jain University Bangalore. She works with students and young adults dealing with adjustment issues, anxiety, and stress management. Trained in queer affirmative therapy, family therapy, acceptance and commitment therapy, and other therapeutic approaches.',
    bookingUrl: 'https://meet-my-doctor.firebaseapp.com/#/?uid=48827&eid=48109',
  },
];

export const departments = [...new Set(doctors.map((d) => d.department))];
