import {
  Program,
  ProgramLocation,
  ImpactStatistic,
  ImpactStory,
  Testimonial,
  GalleryItem,
  VideoItem,
  Product,
  TrainingProgram,
  Workshop,
  ConsultancyService,
  ResourceItem,
  FAQItem,
  EventItem,
  NewsItem,
  TeamMember,
  Partner,
  Award,
  TransparencyDoc
} from '../types';

export const IMPACT_STATS: ImpactStatistic[] = [
  {
    id: 'stat-1',
    value: 50000,
    suffix: '+',
    label: 'Women & Girls Reached',
    description: 'Empowered through menstrual health literacy and hygienic solutions',
    category: 'outreach',
    iconName: 'Users'
  },
  {
    id: 'stat-2',
    value: 120,
    suffix: '+',
    label: 'Villages & Tribal Padas Covered',
    description: 'Deep grassroots engagement across remote geographic clusters',
    category: 'reach',
    iconName: 'MapPin'
  },
  {
    id: 'stat-3',
    value: 15,
    suffix: '',
    label: 'Asha Cloth Pad Production Centres',
    description: 'Decentralized rural micro-units driven by local women artisans',
    category: 'livelihood',
    iconName: 'Factory'
  },
  {
    id: 'stat-4',
    value: 300,
    suffix: '+',
    label: 'Volunteers & Fellows Trained',
    description: 'Grassroots change-agents leading conversations on dignity',
    category: 'fellows',
    iconName: 'HeartHandshake'
  },
  {
    id: 'stat-5',
    value: 85000,
    suffix: '+',
    label: 'Asha Reusable Pads Distributed',
    description: 'Preventing tons of non-biodegradable sanitary waste',
    category: 'sustainability',
    iconName: 'Leaf'
  },
  {
    id: 'stat-6',
    value: 420,
    suffix: '+',
    label: 'Community & School Samata Sessions',
    description: 'Breaking gender taboos among young boys, girls, and elders',
    category: 'education',
    iconName: 'GraduationCap'
  }
];

export const PROGRAMS_DATA: Program[] = [
  {
    id: 'prog-1',
    title: 'Arogya Samwadak Fellowships',
    slug: 'arogya-samwadak-fellowships',
    category: 'fellowship',
    tagline: 'Grassroots youth fellows leading community health dialogues',
    shortDescription: 'A 1-year intensive grassroots fellowship training rural youth and community women to become primary menstrual health champions and health facilitators.',
    fullDescription: 'The Arogya Samwadak Fellowship identifies and trains motivated young individuals and community women from rural and peri-urban Maharashtra. Fellows receive in-depth pedagogy on biological reproduction, menstrual hygiene management (MHM), scientific myth-busting, counseling, and public health advocacy. They conduct weekly village circles, school workshops, and door-to-door counseling to normalize menstrual conversations and identify reproductive health concerns early.',
    problemAddressed: 'Severe culture of silence, lack of accessible healthcare guidance in rural belts, and high dropout rates of young girls at menarche.',
    objectives: [
      'Build localized, trusted health leaders in every village cluster.',
      'Eradicate discriminatory menstrual taboos through evidence-based health dialogue.',
      'Facilitate safe access to reusable menstrual hygiene products and medical referrals.'
    ],
    locations: ['Pune Rural', 'Gadchiroli Tribal Belts', 'Nashik', 'Nandurbar', 'Satara'],
    beneficiaries: 'Adolescent girls, mothers, ASHAs, Anganwadi workers, and village panchayats',
    impactMetrics: [
      { label: 'Fellows Trained', value: '140+' },
      { label: 'Community Circles', value: '1,200+' },
      { label: 'Families Counselled', value: '22,000+' }
    ],
    image: '/images/fellowship/arogya-samwadak-session.jpg',
    galleryImages: [
      '/images/fellowship/classroom-session.jpg',
      '/images/fellowship/school-girls-group.jpg'
    ],
    activities: [
      { title: 'Peer-to-Peer Menarche Circles', description: 'Interactive visual story sessions for girls aged 10-16 in local schools.', frequency: 'Weekly' },
      { title: 'Mothers & Daughters Sangam', description: 'Intergenerational myth-busting dialogues breaking generational taboos.', frequency: 'Bi-monthly' },
      { title: 'Men & Boys Gender Samata Dialogues', description: 'Sensitizing fathers, brothers, and husbands to support period dignity.', frequency: 'Monthly' }
    ],
    featured: true,
    reports: [
      { title: 'Arogya Samwadak Impact Report 2024-25', fileUrl: '#', size: '2.4 MB' }
    ]
  },
  {
    id: 'prog-2',
    title: 'Asha Reusable Cloth Pads Production Centres',
    slug: 'asha-cloth-pads-production',
    category: 'production',
    tagline: 'Decentralized women-led eco-friendly sanitary manufacturing',
    shortDescription: 'Community-run micro-manufacturing units providing dignified livelihoods to rural women while crafting high-absorbency, breathable cotton reusable pads.',
    fullDescription: 'Samajbandh established 15 decentralized Asha Cloth Pad Production Centres in collaboration with local Self-Help Groups (SHGs). Women artisans are trained in precision stitching, high-grade cotton layering, leak-proof PU membrane assembly, and sterilization packaging. Each centre creates sustainable local livelihoods, restores economic agency to women, and provides low-cost, skin-friendly sanitary options for rural communities.',
    problemAddressed: 'Sanitary poverty, prohibitive recurring costs of plastic single-use pads, and rural disposal challenges leading to soil and water contamination.',
    objectives: [
      'Create sustainable financial independence for rural women artisans.',
      'Produce affordable, certified 100% skin-safe reusable pads designed for Indian climatic conditions.',
      'Eliminate tons of hazardous single-use menstrual plastic waste from rural ecosystems.'
    ],
    locations: ['Pune', 'Gadchiroli', 'Solapur', 'Nashik', 'Ahmednagar'],
    beneficiaries: 'Rural women tailors, SHG members, and low-income menstruators',
    impactMetrics: [
      { label: 'Active Micro-Centres', value: '15 Units' },
      { label: 'Artisans Employed', value: '95+ Women' },
      { label: 'Pads Manufactured', value: '90,000+' }
    ],
    image: '/images/kurma/tailoring-training-unit.jpg',
    galleryImages: [
      '/images/stories/women-handstitching-pads.jpg',
      '/images/products/asha-menstrual-kit.jpg'
    ],
    activities: [
      { title: 'Artisan Stitching & QC Training', description: '15-day technical skill upgrade on industrial stitching machines.', frequency: 'Quarterly batches' },
      { title: 'Decentralized Sourcing & Assembly', description: 'Zero-chemical soft cotton and waterproof breathable layer assembly.', frequency: 'Ongoing daily' },
      { title: 'Micro-Entrepreneurship Mentorship', description: 'Financial literacy, inventory management, and cooperative banking.', frequency: 'Monthly' }
    ],
    featured: true
  },
  {
    id: 'prog-3',
    title: 'Kurma Sudhar Karykram (Period Rest Shed Reforms)',
    slug: 'kurma-sudhar-karykram',
    category: 'rural-outreach',
    tagline: 'Reforming menstrual isolation practices into dignified rest homes',
    shortDescription: 'A landmark community-driven intervention in tribal regions reforming the unsafe, unhygienic traditional seclusion huts (Gaokor / Kurma Ghar) into clean, secure spaces.',
    fullDescription: 'In several indigenous communities, menstruating women are traditionally relegated to isolated, dilapidated structures known as Kurma Ghar or Gaokor on village outskirts, lacking water, electricity, and safety from reptiles or weather extremes. The Kurma Sudhar Karykram works directly with tribal elders, gram panchayats, and women to build consensus, renovate or construct secure community rest homes with running water, solar power, and hygienic sanitation, while actively facilitating gradual transition towards home-based dignity.',
    problemAddressed: 'Severe health hazards, physical vulnerability, snakebites, and stigma experienced by tribal women during mandatory monthly isolation.',
    objectives: [
      'Ensure immediate physical safety, hygiene, and dignity for isolated tribal menstruators.',
      'Provide clean bio-toilets, solar electrification, and pure drinking water at rest structures.',
      'Foster inter-generational dialogue to dismantle harmful untouchability practices sustainably.'
    ],
    locations: ['Bhamragad', 'Kurkheda', 'Dhanora', 'Etapalli', 'Aheri (Gadchiroli)'],
    beneficiaries: 'Tribal women, adolescent girls, elder village committees, and traditional healers',
    impactMetrics: [
      { label: 'Rest Homes Upgraded', value: '18 Structures' },
      { label: 'Tribal Padas Impacted', value: '45 Padas' },
      { label: 'Reptile Incidents Averted', value: '100% Zero Incidents' }
    ],
    image: '/images/kurma/community-session-under-tree.jpg',
    galleryImages: [
      '/images/kurma/kurma-hut-interior.jpg',
      '/images/kurma/arogya-sakhi-training.jpg'
    ],
    activities: [
      { title: 'Gram Panchayat & Elder Consensus Meetings', description: 'Sensitizing village Patils, Pujaris, and traditional elders.', frequency: 'Monthly' },
      { title: 'Eco-Friendly Rest Shed Upgradation', description: 'Installing solar lanterns, mosquito netting, clean beds, and running water taps.', frequency: 'Ongoing' },
      { title: 'Mobile Medical Health Check-ups', description: 'Frontline screening for reproductive tract infections and anemia.', frequency: 'Bi-weekly' }
    ],
    featured: true
  },
  {
    id: 'prog-4',
    title: 'School & College "Samata" Menstrual Health Education',
    slug: 'school-college-samata-mhm',
    category: 'education',
    tagline: 'Age-appropriate puberty literacy for adolescent girls and boys',
    shortDescription: 'Comprehensive school-based educational workshops, comic books, felt anatomy charts, and teacher training to eradicate adolescent period absenteeism.',
    fullDescription: 'Operating across rural Zilla Parishad schools, ashram shalas, and urban colleges, the Samata program introduces scientifically grounded, shame-free reproductive health education. Through culturally contextualized comic booklets, visual pelvic anatomy aprons, and interactive games, we teach girls about biological cycles, menstrual hygiene management (MHM), safe washing and sun-drying of cloth pads, and pain relief.',
    problemAddressed: '23% of adolescent girls in India drop out or miss school regularly upon reaching menarche due to lack of knowledge, shame, and poor sanitation.',
    objectives: [
      'Demystify puberty changes and debunk harmful cultural superstitions in schools.',
      'Engage adolescent boys as empathetic allies to stop bullying and teasing.',
      'Equip school washrooms with emergency sanitary dispensers and clean disposal/wash facilities.'
    ],
    locations: ['Pune', 'Nashik', 'Satara', 'Gadchiroli', 'Nandurbar'],
    beneficiaries: 'School students (Classes 6-12), college youth, teachers, and school headmasters',
    impactMetrics: [
      { label: 'Schools Reached', value: '280+ Schools' },
      { label: 'Students Sensitized', value: '38,000+ Students' },
      { label: 'Attendance Gain', value: '+24% Improvement' }
    ],
    image: '/images/samata-yatra/gender-equality-school.jpg',
    galleryImages: [
      '/images/awareness/school-girls-session.jpg',
      '/images/fellowship/menstrual-health-awareness.jpg'
    ],
    activities: [
      { title: 'Interactive Puberty & Biology Workshops', description: 'Using visual comic books and anatomical felt models for class 6-10 students.', frequency: 'Daily during school terms' },
      { title: 'Boys "Bandhav" Sensitization Sessions', description: 'Co-educational and male-focused modules fostering empathy and ending shaming.', frequency: 'Weekly' },
      { title: 'Teacher MHM Champion Training', description: 'Equipping teachers to provide compassionate adolescent health counseling.', frequency: 'Quarterly' }
    ],
    featured: true
  }
];

export const LOCATIONS_DATA: ProgramLocation[] = [
  {
    id: 'loc-pune',
    name: 'Pune District & Western Hub',
    state: 'Maharashtra',
    district: 'Pune',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    activeSince: '2018',
    productionCentresCount: 6,
    villagesCovered: 42,
    womenReached: 21500,
    activePrograms: ['prog-1', 'prog-2', 'prog-4'],
    leadContact: 'Headquarters Coordination Desk',
    description: 'Central operations secretariat, state-of-the-art research facility, and master training hub in Junnar and Pune city.',
    image: '/images/asha-kendra/children-workshop-baner.jpg',
    activitiesList: ['State Fellowship Training Academy', 'Junnar Central Micro-Production Unit', 'Pune High School Menstrual Literacy Circles']
  },
  {
    id: 'loc-gadchiroli',
    name: 'Gadchiroli Tribal Forest Belts',
    state: 'Maharashtra',
    district: 'Gadchiroli',
    coordinates: { lat: 20.1849, lng: 80.003 },
    activeSince: '2020',
    productionCentresCount: 3,
    villagesCovered: 38,
    womenReached: 12400,
    activePrograms: ['prog-1', 'prog-2', 'prog-3', 'prog-4'],
    leadContact: 'Tribal Area Field Secretariat',
    description: 'Deep forest interventions across Bhamragad, Kurkheda, and Etapalli focusing on Kurma Sudhar rest shed transformations.',
    image: '/images/stories/gadchiroli-tribal-awareness.jpg',
    activitiesList: ['Gaokor Rest Home Upgradation', 'Indigenous Women SHG Stitching Hub', 'Door-to-Door Health Counseling']
  },
  {
    id: 'loc-nashik',
    name: 'Nashik & Dindori Rural Clusters',
    state: 'Maharashtra',
    district: 'Nashik',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    activeSince: '2021',
    productionCentresCount: 2,
    villagesCovered: 24,
    womenReached: 8100,
    activePrograms: ['prog-1', 'prog-2', 'prog-4'],
    leadContact: 'Northern Maharashtra Desk',
    description: 'Agrarian and tribal belt programs with specialized seasonal migration worker menstrual health clinics.',
    image: '/images/awareness/asha-worker-training.jpg',
    activitiesList: ['Farm Worker Menstrual Health Clinics', 'Zilla Parishad School Samata Circles', 'Rural SHG Cloth Pad Distribution']
  }
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: 'story-1',
    title: 'From Breaking Silence to Guiding 200 Adolescent Girls in Bhamragad',
    beneficiaryName: 'Sunita Madavi',
    age: 23,
    location: 'Bhamragad, Gadchiroli',
    programName: 'Arogya Samwadak Fellowship',
    category: 'fellow',
    quote: 'For years, we were taught to fear our own biology and sleep on cold mud floors in Gaokor. Today, I stand in our Gram Panchayat and teach young girls that their bodies are sacred and healthy.',
    summary: 'Sunita joined the Arogya Samwadak fellowship in 2023. Over 18 months, she converted a dilapidated seclusion shed into a secure rest home and led health dialogues across 8 tribal padas.',
    story: 'Growing up in an interior forest hamlet in Gadchiroli, Sunita experienced the harsh realities of menstrual isolation firsthand. When Samajbandh initiated the Arogya Samwadak Fellowship, Sunita enrolled despite severe pushback from village conservatives. After rigorous training in menstrual biology and community communication, she initiated gentle dialogues with local elder women and the village headman (Patil). Today, Sunita has facilitated the renovation of 2 rest homes with running water, solar power, and clean cotton mattresses. She conducts weekly learning circles for over 200 adolescent schoolgirls and manages an emergency supply bank of Asha cloth pads.',
    fullStory: 'Growing up in an interior forest hamlet in Gadchiroli, Sunita experienced the harsh realities of menstrual isolation firsthand. When Samajbandh initiated the Arogya Samwadak Fellowship, Sunita enrolled despite severe pushback from village conservatives. After rigorous training in menstrual biology and community communication, she initiated gentle dialogues with local elder women and the village headman (Patil). Today, Sunita has facilitated the renovation of 2 rest homes with running water, solar power, and clean cotton mattresses. She conducts weekly learning circles for over 200 adolescent schoolgirls and manages an emergency supply bank of Asha cloth pads.',
    impactSummary: 'Over 200 young girls now attend school uninterrupted throughout their menstrual cycle; 2 village rest homes upgraded with safety and water.',
    impactResult: '200+ Girls Attending School Uninterrupted • 2 Safe Rest Homes Built',
    image: '/images/kurma/village-women-session.jpg',
    beforeAfter: {
      before: 'Mandatory unhygienic 5-day isolation in hazardous shed without water, high rate of skin infections.',
      after: 'Secure, dignified rest home with clean water, solar light, and scientific health awareness.'
    },
    date: 'January 2025',
    author: 'Samajbandh Field Communications'
  },
  {
    id: 'story-2',
    title: 'Stitching Independence: How Lata Tai Became a Micro-Production Lead',
    beneficiaryName: 'Lata Patil',
    age: 38,
    location: 'Junnar Block, Pune',
    programName: 'Asha Reusable Cloth Pads Production Centres',
    category: 'artisan',
    quote: 'Before this centre opened, I struggled to afford disposable pads for myself and my two teenage daughters. Now I earn a steady monthly income stitching pads, and my daughters proudly use what we make.',
    summary: 'A homemaker turned lead artisan at the Junnar Asha Production Centre, Lata Tai supervises quality testing and has trained 14 other SHG women in industrial stitching.',
    story: 'Lata Tai lived in a small agrarian household where unpredictable seasonal rainfall made household finances precarious. Sanitary pads were viewed as an unaffordable luxury, forcing her family to rely on rough, repeatedly used rags that caused recurring rashes. In 2022, Samajbandh partnered with her SHG to set up an Asha Reusable Cloth Pad stitching unit. Lata underwent our 15-day technical skill masterclass. Her natural precision made her a lead quality inspector. Today, her unit produces over 1,200 tested, sterilised reusable pads every month, distributing them through local Anganwadis and schools.',
    fullStory: 'Lata Tai lived in a small agrarian household where unpredictable seasonal rainfall made household finances precarious. Sanitary pads were viewed as an unaffordable luxury, forcing her family to rely on rough, repeatedly used rags that caused recurring rashes. In 2022, Samajbandh partnered with her SHG to set up an Asha Reusable Cloth Pad stitching unit. Lata underwent our 15-day technical skill masterclass. Her natural precision made her a lead quality inspector. Today, her unit produces over 1,200 tested, sterilised reusable pads every month, distributing them through local Anganwadis and schools.',
    impactSummary: 'Earns ₹7,500/month in sustainable supplementary household income; supplies pads to 4 surrounding village schools.',
    impactResult: '₹7,500/month Steady Livelihood • 14 Women Artisans Mentored',
    image: '/images/stories/women-handstitching-pads.jpg',
    beforeAfter: {
      before: 'Zero personal income, reliance on unsafe rag usage, recurring gynecological distress.',
      after: 'Monthly independent income of ₹7,500+, 100% adoption of hygienic reusable pads across her family.'
    },
    date: 'November 2024',
    author: 'Livelihoods Desk'
  },
  {
    id: 'story-3',
    title: 'Zero Period Absenteeism: The Transformation of ZP High School, Velhe',
    beneficiaryName: 'Principal S. Deshmukh & Student Council',
    location: 'Velhe, Pune District',
    programName: 'School & College Samata Programs',
    category: 'student',
    quote: 'Boys used to mock girls if a stain appeared on their uniform. After Samajbandh conducted co-educational Samata sessions, the boys themselves advocated for an emergency pad kit in the sports room.',
    summary: 'How a rural school achieved 0% period-related absenteeism and built an empathetic, shame-free student culture through structured gender education.',
    story: 'In 2023, an internal audit at ZP High School Velhe revealed that girls missed an average of 3 to 4 school days every single month during their menstrual cycle. Teachers lacked dedicated resources to discuss reproductive biology openly. Samajbandh implemented a comprehensive 6-month Samata package: teacher orientations, separate adolescent girl circles, joint gender equity workshops for boys, and the setup of an Asha Reusable Kit dispenser and hot water bag in the medical room. Within one academic year, dropout indicators plummeted and girls reported feeling confident and respected.',
    fullStory: 'In 2023, an internal audit at ZP High School Velhe revealed that girls missed an average of 3 to 4 school days every single month during their menstrual cycle. Teachers lacked dedicated resources to discuss reproductive biology openly. Samajbandh implemented a comprehensive 6-month Samata package: teacher orientations, separate adolescent girl circles, joint gender equity workshops for boys, and the setup of an Asha Reusable Kit dispenser and hot water bag in the medical room. Within one academic year, dropout indicators plummeted and girls reported feeling confident and respected.',
    impactSummary: '98.5% reduction in period-linked absenteeism across 240 female students; 180 male students trained as empathetic allies.',
    impactResult: '98.5% Drop in School Absenteeism • Zero Bullying Culture',
    image: '/images/awareness/school-girls-session.jpg',
    beforeAfter: {
      before: 'Average 3-4 days absent per girl per month; pervasive classroom teasing.',
      after: 'Zero menstrual absenteeism, supportive co-ed environment with fully equipped sanitation corners.'
    },
    date: 'August 2024',
    author: 'Education & Youth Wing'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Meenakshi Shinde',
    designation: 'Chief Medical Officer & Public Health Consultant',
    organization: 'District Rural Health Mission',
    location: 'Nashik',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
    content: 'Samajbandh’s model of combining sustainable cloth pad production with long-term youth fellows solves both the supply gap and the behavioral barrier. In our primary health centres, we have noted a measurable drop in bacterial vaginosis and skin allergies among women who transitioned to Asha reusable pads.',
    category: 'partner',
    featured: true
  },
  {
    id: 'test-2',
    name: 'Priyanka Meshram',
    designation: 'Arogya Samwadak Fellow (Batch 2024)',
    organization: 'Samajbandh Youth Fellowship',
    location: 'Kurkheda, Gadchiroli',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    content: 'Being an Arogya Samwadak gave me the courage to look into the eyes of village elders and explain that menstruation is a natural biological cycle, not a curse or sin. When young girls run up to me to ask questions without whispering, I know we are winning.',
    category: 'fellow',
    featured: true
  },
  {
    id: 'test-3',
    name: 'Vikram Joshi',
    designation: 'Head of CSR & Sustainability',
    organization: 'Apex Engineering Foundation',
    location: 'Mumbai / Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    content: 'Our partnership with Samajbandh has been one of our highest-impact ESG investments. Every rupee is tracked with absolute transparency, and their decentralized production units directly stimulate rural household economics while solving a critical health need.',
    category: 'partner',
    featured: true
  },
  {
    id: 'test-4',
    name: 'Rukmini Bai Gavande',
    designation: 'Self-Help Group President',
    organization: 'Tejaswini Mahila Bachat Gat',
    location: 'Satara Rural',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    content: 'The Asha pads are so soft, clean easily with cold water, dry quickly under the sun, and last for more than 2 years. We save over ₹1,200 every year per woman in our household, and there is no plastic trash to bury or burn.',
    category: 'beneficiary',
    featured: true
  },
  {
    id: 'test-5',
    name: 'Ananya Kulkarni',
    designation: 'Class 10 Student',
    organization: 'ZP High School, Junnar',
    location: 'Pune',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    content: 'Before the workshop, I used to miss 3 days of school every month out of fear of stains. The Asha cotton pad feels so secure, and our classroom teacher now keeps emergency kits in the locker.',
    category: 'student',
    featured: true
  },
  {
    id: 'test-6',
    name: 'Sumanbai Uikey',
    designation: 'Tribal Community Elder',
    organization: 'Kurkheda Gram Sabha',
    location: 'Gadchiroli',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
    content: 'For generations our daughters suffered in dark mud Gaokors. Now with solar lights, running water taps, and proper beds, our daughters are safe from snakes and illness.',
    category: 'tribal-elder',
    featured: true
  }
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'prod-asha-regular-pack',
    title: 'Asha Reusable Cloth Pads — Comfort Pack of 4',
    subtitle: '100% Breathable Cotton | Multi-Layer High Absorbency | Up to 3 Years Lifespan',
    category: 'cloth-pads',
    price: 380,
    sponsorPrice: 380,
    description: 'Designed in rural Maharashtra by women artisans, the Asha Comfort Pack contains 4 premium multi-layered reusable pads (2 Regular Flow + 2 Heavy Flow/Night) with leak-proof breathable wings and stainless nickel-free snap buttons. Crafted from 100% unbleached skin-friendly flannel cotton that prevents rashes, chafing, and unpleasant plastic odor.',
    impactStatement: 'Purchasing 1 pack prevents ~480 single-use non-biodegradable plastic pads from entering landfills and supports 2 hours of fair-wage stitching for rural women tailors.',
    features: [
      'Top Layer: Ultra-soft 100% brushed cotton flannel for instant dry-feel',
      'Absorbent Core: 3 to 4 dense absorbent cotton fleece layers',
      'Bottom Barrier: Breathable water-resistant TPU membrane to stop leaks',
      'Wings with dual-position nickel-free snap buttons for secure snug fit',
      'Lab tested for color fastness, zero harmful phthalates, and high absorbency',
      'Washable & reusable for up to 75-100 wash cycles (approx. 2-3 years)'
    ],
    layersTech: [
      'Layer 1 (Skin Contact): 100% Natural Brushed Cotton Flannel',
      'Layer 2 & 3 (Core): High-Density Hydrophilic Cotton Fleece',
      'Layer 4 (Reinforced Core): Compact Absorbent Matrix',
      'Layer 5 (Leak-Shield): Breathable Micro-porous Polyurethane Membrane',
      'Outer Layer: Soft Printed Cotton Backing'
    ],
    usageGuide: [
      '1. Pre-wash before first use in cold water with mild soap.',
      '2. Position pad with soft brushed cotton facing up and snap wings under your underwear.',
      '3. Change every 4 to 6 hours or as per flow requirement.',
      '4. Rinse immediately in cold water, wash with mild detergent, and sun-dry thoroughly (natural UV sterilization).'
    ],
    sustainabilityScore: '98% Carbon & Plastic Reduction vs. Disposable Pads',
    inStock: true,
    images: [
      '/images/products/asha-menstrual-kit.jpg',
      '/images/stories/women-handstitching-pads.jpg'
    ],
    badge: 'Bestseller & Eco-Hero',
    contents: ['2x Regular Flow Pads (240mm)', '2x Heavy/Overnight Pads (290mm)', '1x Waterproof Storage Travel Pouch', '1x Illustrated Care & Washing Guide']
  },
  {
    id: 'prod-school-kit',
    title: 'Samata School Menstrual Health Kit',
    subtitle: 'Curated complete hygiene starter pack for adolescent students',
    category: 'kits',
    price: 490,
    sponsorPrice: 490,
    description: 'A comprehensive dignity kit prepared for schoolgirls entering menarche. Contains 3 reusable Asha cloth pads, a discreet leak-proof carry pouch, a natural cold-process hygiene soap bar, an illustrated anatomical comic guide in Marathi/Hindi/English, and a cycle tracking card.',
    impactStatement: 'Sponsoring this kit guarantees 2 full years of uninterrupted school attendance for an adolescent girl in a rural Zilla Parishad or tribal school.',
    features: [
      'Compact, discreet drawstring bag easily carried in standard schoolbags',
      'Includes 3 varied-size Asha reusable cloth pads with snap wings',
      'Illustrated bilingual guide addressing puberty myths, pain relief, and hygiene',
      'Reusable wet-bag for carrying used pads safely home from school'
    ],
    usageGuide: [
      'Ideal for distribution during school health drives and adolescent counseling sessions.'
    ],
    sustainabilityScore: '100% Plastic-Free Packaging',
    inStock: true,
    images: [
      '/images/samata-yatra/gender-equality-school.jpg'
    ],
    badge: 'High Impact Sponsorship',
    contents: ['3x Asha Reusable Cloth Pads', '1x Waterproof Odor-Lock Carry Pouch', '1x Natural Coconut Oil Soap Bar', '1x Illustrated Menarche Comic Book', '1x 12-Month Period Tracker']
  },
  {
    id: 'prod-emergency-kit',
    title: 'Community & Emergency Relief Menstrual Kit',
    subtitle: 'Rapid deployment kit for flood/disaster relief & tribal rest sheds',
    category: 'kits',
    price: 650,
    sponsorPrice: 650,
    description: 'Designed specifically for rapid humanitarian aid, climate emergencies, and tribal rest sheds (Gaokor). Includes 4 heavy-duty reusable pads, a rapid-dry microfiber towel, disinfectant washing soap, reusable carry pouch, clean undergarments (2 pairs), and multi-purpose antiseptic wash.',
    impactStatement: 'Ensures dignified menstrual hygiene for vulnerable women during seasonal flooding, migrations, and remote tribal seclusion.',
    features: [
      'Heavy-duty weatherproof packaging',
      'Includes 2 pairs of comfortable 100% cotton stretch undergarments',
      'Fast-drying microfiber sanitizing towel for quick sun exposure'
    ],
    usageGuide: ['Standard emergency humanitarian and community replenishment kit.'],
    sustainabilityScore: 'Reusable & Zero Waste',
    inStock: true,
    images: [
      '/images/kurma/arogya-sakhi-outreach.jpg'
    ],
    badge: 'Disaster Relief & Tribal Focus',
    contents: ['4x Heavy Flow Asha Pads', '2x 100% Cotton Undergarments', '1x Quick-Dry Microfiber Towel', '2x Antiseptic Laundry Soap Bars', '1x Waterproof Wet/Dry Storage Bag']
  }
];

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'train-tot-master',
    title: 'Master Training of Trainers (ToT): Menstrual Health & Social Equity',
    category: 'training',
    targetAudience: 'NGO Field Staff, ASHA & Anganwadi Coordinators, Public Health Workers, Social Workers',
    duration: '3 Days (24 Hours Intensive)',
    format: 'Offline / On-ground',
    eligibility: 'Passionate about grassroots health, prior experience in community development preferred',
    description: 'A comprehensive, experiential training program certifying participants as Master Menstrual Health Facilitators. Covers biological reproduction, de-stigmatization communication techniques, empathetic counseling, addressing cultural taboos, and organizing village health circles.',
    curriculum: [
      'Module 1: Female Anatomy, Endocrinology & Scientific Menstrual Physiology',
      'Module 2: Mapping Socio-Cultural Myths, Stigmas & Gaokor Traditions',
      'Module 3: Sustainable MHM Products — Materials, Hygiene, Washing Protocols & Lifecycle',
      'Module 4: Participatory Facilitation Pedagogy using Felt Anatomy Aprons & Visual Flashcards',
      'Module 5: Male Sensitization & Involving Village Stakeholders (Sarpanch, Elders, ASHAs)',
      'Module 6: Monitoring, Evaluation & Counseling Ethics'
    ],
    outcomes: [
      'Certified Samajbandh Master Trainer status with complete facilitation toolkits',
      'Access to ongoing mentorship, curriculum updates, and regional network cohorts',
      'Ability to independently run compliant, evidence-backed community health workshops'
    ],
    nextBatchDate: 'April 15-17, 2026 (Pune Training Hub)',
    image: '/images/awareness/asha-worker-training.jpg'
  },
  {
    id: 'train-cloth-pad-stitching',
    title: 'SHG Cloth Pad Stitching & Quality Certification Masterclass',
    category: 'training',
    targetAudience: 'Women Self-Help Groups (SHGs), Local Tailoring Collectives, Rural Livelihood Missions',
    duration: '5 Days Practical Workshop',
    format: 'Offline / On-ground',
    eligibility: 'Basic sewing machine literacy',
    description: 'Technical vocational training teaching women how to cut, layer, stitch, attach nickel-free snap buttons, and quality-test leak-proof cloth pads to medical-grade hygiene standards.',
    curriculum: [
      'Fabric selection, zero-waste cutting patterns, and raw material grading',
      'Industrial machine adjustment, curved seam stitching, and TPU membrane handling',
      'Snap button attachment and tensile strength testing',
      'Sterile packaging, batch coding, and cooperative inventory record-keeping'
    ],
    outcomes: [
      'Enables SHG collectives to operate an authorized Asha Cloth Pad micro-production unit',
      'Immediate qualification for Samajbandh decentralized procurement buyback scheme'
    ],
    nextBatchDate: 'May 04-08, 2026',
    image: '/images/stories/women-handstitching-pads.jpg'
  }
];

export const WORKSHOPS_DATA: Workshop[] = [
  {
    id: 'ws-school-samata',
    title: 'School & College "Samata" Menstrual Literacy Workshop',
    category: 'workshops',
    clientType: 'Schools & Colleges',
    duration: '2 to 3 Hours per Session',
    locationType: 'On-site / Pan-India',
    description: 'Interactive, age-appropriate educational sessions for adolescent girls and co-educational gender equity discussions for boys to eliminate classroom teasing and foster mutual respect.',
    keyTopics: [
      'Demystifying puberty changes and hormonal cycles',
      'Safe hygiene practices, pain management, and nutrition for iron-deficiency anemia',
      'Safe disposal vs. reusable cloth pads awareness',
      'Ending period shaming and supporting peers'
    ],
    outcomes: [
      'Empowered students with high menstrual literacy',
      'Setup of School Emergency Menstrual Supply Corner',
      'Free distribution of student sample kits where sponsored'
    ],
    image: '/images/fellowship/classroom-session.jpg',
    upcomingDates: ['Available upon institutional booking']
  },
  {
    id: 'ws-corporate-dei',
    title: 'Corporate Menstrual Equity, Health & Ergonomics Workshop',
    category: 'workshops',
    clientType: 'Corporate CSR',
    duration: '90 Minutes Interactive (Online or On-site)',
    locationType: 'Virtual',
    description: 'Designed for corporate workplaces looking to build inclusive, health-conscious cultures. Covers menstrual ergonomics, hormonal health, leave policies, and employee CSR volunteering opportunities.',
    keyTopics: [
      'Understanding menstrual health & perimenopause in workplace productivity',
      'Workplace ergonomics, stress management & nutrition',
      'Designing inclusive corporate sanitation facilities',
      'Sponsoring rural school clusters through employee matching campaigns'
    ],
    outcomes: [
      'Heightened DEI awareness and employee wellbeing',
      'Direct avenues for corporate employee engagement and cloth pad packing drives'
    ],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop'
  }
];

export const WORKSHOPS_SERVICES = WORKSHOPS_DATA;

export const CONSULTANCY_DATA: ConsultancyService[] = [
  {
    id: 'cons-csr-strategy',
    title: 'CSR Menstrual Health & WASH Program Strategy & Advisory',
    category: 'consultancy',
    targetClients: 'Corporate CSR Foundations, International Grant Agencies, Philanthropic Trusts',
    description: 'End-to-end strategic advisory for designing, implementing, monitoring, and evaluating high-impact rural menstrual hygiene and women’s economic empowerment initiatives aligned with UN SDGs.',
    offerings: [
      'Baseline needs assessment and cultural landscape mapping in target aspirational districts',
      'Decentralized production unit setup feasibility and SHG selection',
      'Tailored curriculum development in local dialects',
      'Third-party Social Return on Investment (SROI) audits and statutory reporting'
    ],
    deliverables: [
      'Comprehensive Project Blueprint & Implementation Roadmap',
      'Quarterly Milestone & Impact Telemetry Reports',
      'Documentary Case Studies and Audited Expenditure Statements'
    ],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
  }
];

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'res-guide-cloth-pad-hygiene',
    title: 'The Complete Guide to Reusable Cloth Pad Hygiene, Washing & Sun-Drying',
    category: 'guidebook',
    slug: 'guide-reusable-cloth-pad-hygiene',
    summary: 'A step-by-step illustrated manual explaining how to wash, disinfect, and sun-dry cloth pads for maximum hygiene and 3-year longevity.',
    content: `Reusable cloth pads are healthy, comfortable, and environmentally sustainable when cleaned according to simple scientific principles.
    
1. Cold Water Soak: Always rinse used pads in cold water first. Hot water coagulates blood proteins and causes stains.
2. Gentle Soap Washing: Rub with mild bathing soap or laundry bar. Do not use harsh bleaches or chemical softeners.
3. The Power of Sunlight: Hang the pads in direct sunlight. Sun rays contain natural ultraviolet (UV) radiation that acts as a potent disinfectant.
4. Storage: Once completely dry, store in a clean, breathable cotton bag in a dry cupboard.`,
    author: 'Samajbandh Health & Research Wing',
    date: 'February 2025',
    readTime: '4 min read',
    fileSize: '1.8 MB',
    fileFormat: 'PDF Document',
    downloadUrl: '#',
    language: 'Marathi, Hindi, English',
    topics: ['Cloth Pads', 'Hygiene', 'IEC Material', 'Washing Guidelines'],
    tags: ['Cloth Pads', 'Hygiene', 'IEC Material', 'Infographic'],
    thumbnail: '/images/products/asha-menstrual-kit.jpg',
    image: '/images/products/asha-menstrual-kit.jpg'
  },
  {
    id: 'res-paper-gaokor-reforms',
    title: 'Dignity Over Dogma: Lessons from 5 Years of Gaokor Rest Shed Reforms in Gadchiroli',
    category: 'research-paper',
    slug: 'research-gaokor-reforms-gadchiroli',
    summary: 'An empirical policy white paper documenting the socio-medical impact of upgrading tribal menstrual isolation structures into dignified community health homes.',
    content: `This field report synthesizes qualitative interviews with 420 tribal women and Gram Panchayat leaders across Bhamragad and Kurkheda blocks. Key findings indicate an 84% reduction in seasonal reproductive tract infections and 100% elimination of snakebite casualties during menstrual seclusion following the introduction of solar-lit rest homes and running water infrastructure.`,
    author: 'Samajbandh Research & Advocacy Wing',
    date: 'January 2025',
    readTime: '12 min read',
    fileSize: '3.6 MB',
    fileFormat: 'Research Paper PDF',
    downloadUrl: '#',
    language: 'English',
    topics: ['Tribal Health', 'Gaokor Reforms', 'Public Policy', 'Gadchiroli'],
    tags: ['Research', 'Tribal Health', 'Gaokor', 'Policy White Paper'],
    thumbnail: '/images/kurma/kurma-hut-roof.jpg',
    image: '/images/kurma/kurma-hut-roof.jpg'
  },
  {
    id: 'res-comic-samata-menarche',
    title: 'Samata’s Journey: An Illustrated Comic Guide to Puberty and Periods',
    category: 'school-toolkit',
    slug: 'comic-samata-journey-puberty',
    summary: 'A friendly, colorfully illustrated educational comic book created for children aged 10-15 demystifying biological changes without fear or shame.',
    author: 'Samajbandh Youth Team',
    date: 'December 2024',
    readTime: '6 min read',
    fileSize: '4.2 MB',
    fileFormat: 'Illustrated Comic PDF',
    downloadUrl: '#',
    language: 'Marathi & Hindi',
    topics: ['School Toolkit', 'Puberty Education', 'Menarche', 'Comics'],
    tags: ['Comic', 'Adolescent Education', 'Schools', 'Downloadable IEC'],
    thumbnail: '/images/samata-yatra/gender-equality-school.jpg',
    image: '/images/samata-yatra/gender-equality-school.jpg'
  },
  {
    id: 'res-poster-uv-drying',
    title: 'Sunlight UV Disinfection Poster for Community Centers',
    category: 'iec-material',
    slug: 'poster-sunlight-uv-disinfection',
    summary: 'Printable high-resolution poster explaining the antimicrobial role of ultraviolet sunlight in sanitizing cotton cloth pads.',
    author: 'Visual IEC Design Desk',
    date: 'January 2025',
    readTime: '2 min read',
    fileSize: '2.1 MB',
    fileFormat: 'Hi-Res Poster PDF',
    downloadUrl: '#',
    language: 'Marathi & Hindi',
    topics: ['Sun Drying', 'UV Sanitization', 'Posters', 'Community Walls'],
    tags: ['Poster', 'IEC', 'Sunlight', 'Sanitation'],
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop'
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What is Samajbandh and what is its core mission?',
    answer: 'Samajbandh is a dedicated social-impact organization working to ensure menstrual health, dignity, and gender equity across rural and urban communities. We operate through three integrated strategic pillars: EDUCATE (community health literacy & youth fellowships), ENGAGE (grassroots outreach & Kurma Sudhar rest shed reforms), and SUSTAIN (decentralized Asha reusable cloth pad production centres creating women livelihoods).',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Are Asha Reusable Cloth Pads hygienic and safe to use?',
    answer: 'Yes, 100%. Asha Cloth Pads are crafted from certified, unbleached skin-contact cotton flannel, multi-layer high-density absorbent cores, and a micro-porous breathable leak-proof membrane. When washed with normal soap and sun-dried thoroughly, direct UV radiation disinfects the fabric completely, preventing rashes, bacterial infections, and chemical allergies associated with single-use plastics.',
    category: 'cloth-pads'
  },
  {
    id: 'faq-3',
    question: 'What is the "Kurma Sudhar Karykram" in tribal areas?',
    answer: 'In certain indigenous communities, menstruating women are traditionally relegated to isolated, unsafe structures called Kurma Ghar or Gaokor. The Kurma Sudhar Karykram works with village elders and panchayats to upgrade these structures into clean, secure spaces with running water, solar power, clean bedding, and bio-toilets, while conducting sustained education to facilitate the eventual transition to home-based dignity.',
    category: 'menstrual-health'
  },
  {
    id: 'faq-4',
    question: 'How do Asha Production Centres create local women livelihoods?',
    answer: 'We establish decentralized micro-production centres run by local Self-Help Groups (SHGs). Women artisans receive industrial stitching training, quality certification, and fair wages. This provides steady supplementary income, empowers women as health ambassadors in their own villages, and ensures affordable pads are always locally available.',
    category: 'general'
  },
  {
    id: 'faq-5',
    question: 'Are donations to Samajbandh eligible for tax exemption in India?',
    answer: 'Yes. Donations are eligible for 50% tax deduction under Section 80G of the Indian Income Tax Act. Upon completing your donation, an official 80G receipt and certificate are generated and dispatched to your registered email address.',
    category: 'donation'
  },
  {
    id: 'faq-6',
    question: 'How can I volunteer or apply for an Arogya Samwadak Fellowship?',
    answer: 'You can apply directly through our "Get Involved" page. We welcome on-ground volunteers for school workshops, medical camps, cloth collection drives, and social research. The Arogya Samwadak Fellowship invites annual applications for youth and grassroots facilitators.',
    category: 'volunteering'
  },
  {
    id: 'faq-7',
    question: 'Can schools, colleges, or CSR corporate partners request bulk orders or customized workshops?',
    answer: 'Absolutely. We regularly conduct sponsored workshops for schools, colleges, and corporate organizations, as well as bulk procurement of customized Menstrual Health Kits for employee donation drives or village adoptions.',
    category: 'general'
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Arogya Samwadak Fellowship 2026-27 Orientation & Selection Camp',
    type: 'Fellowship Camp',
    date: 'April 22, 2026',
    time: '10:00 AM – 4:00 PM IST',
    location: 'Samajbandh Central Training Center, Pune',
    isVirtual: false,
    registrationOpen: true,
    seatsLeft: 24,
    eligibility: 'Passionate youth aged 20-30 residing in Maharashtra, committed to rural health',
    description: 'An interactive immersion camp for shortlisted applicants to experience our experiential training methodology, interact with existing fellows, and finalize selection for the 2026-27 cohort.',
    image: '/images/fellowship/menstrual-health-awareness.jpg'
  },
  {
    id: 'ev-2',
    title: 'Statewide Webinar: "Menstrual Equity in School Curriculums: Policy to Practice"',
    type: 'Webinar',
    date: 'May 08, 2026',
    time: '4:00 PM – 6:00 PM IST',
    location: 'Virtual (Zoom Live Stream)',
    isVirtual: true,
    registrationOpen: true,
    eligibility: 'Open to educators, NGO heads, researchers, and public health advocates',
    description: 'A panel discussion featuring public health specialists, adolescent psychologists, and school principals discussing pragmatic solutions to end menstrual absenteeism.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ev-3',
    title: 'Community Menstrual Health Drive & Cloth Pad Distribution',
    type: 'Awareness Drive',
    date: 'May 28, 2026 (Menstrual Hygiene Day)',
    time: '9:00 AM – 5:00 PM IST',
    location: 'Gadchiroli & Nandurbar Cluster Centres',
    isVirtual: false,
    registrationOpen: true,
    seatsLeft: 50,
    eligibility: 'Volunteers, doctors, nurses, and student ambassadors',
    description: 'A multi-village celebration of Menstrual Hygiene Day featuring free health checkups, pad distribution, street plays, and felicitations of village health champions.',
    image: '/images/kurma/village-gathering-hills.jpg'
  }
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Samajbandh Expands Asha Production Network to 15th Decentralized Micro-Centre',
    type: 'news',
    date: 'February 12, 2025',
    source: 'Samajbandh Press Bureau',
    summary: 'With the launch of the new Junnar micro-centre, Samajbandh now provides direct sustainable employment to 95 rural women tailors.',
    content: 'The new production unit in Junnar was inaugurated in the presence of local Gram Panchayat leaders and SHG federations. The unit features high-speed electric sewing machinery and an integrated clean inspection facility capable of producing 1,500 reusable pads monthly.',
    image: '/images/kurma/tailoring-training-unit.jpg'
  },
  {
    id: 'news-2',
    title: 'Tribal Rest Shed Upgradation Model Featured at Maharashtra State Public Health Summit',
    type: 'press',
    date: 'January 28, 2025',
    source: 'State Public Health Department',
    summary: 'Government commendation for Samajbandh’s non-coercive community consensus framework in Gaokor reforms.',
    content: 'At the annual state rural health summit in Mumbai, public health commissioners commended Samajbandh for achieving 0% snakebite incidents and an 84% reduction in reproductive tract infections in Kurkheda through dignified rest homes.',
    image: '/images/kurma/kurma-hut-interior.jpg'
  },
  {
    id: 'news-3',
    title: 'Over 180 Tonnes of Sanitary Plastic Waste Diverted in FY 2024-25',
    type: 'media',
    date: 'December 15, 2024',
    source: 'EcoIndia Journal',
    summary: 'Decentralized adoption of Asha washable cotton pads saves municipal bodies and village councils millions in solid waste disposal costs.',
    content: 'A comprehensive environmental life cycle analysis conducted with university researchers proved that every reusable Asha pad prevents approximately 120 single-use plastic pads from polluting rural rivers, soil, and open burning sites.',
    image: '/images/products/asha-menstrual-kit.jpg'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Aniket Gujarathi',
    role: 'Founder & Executive Director',
    category: 'leadership',
    education: 'M.S. Social Work (Tata Institute of Social Sciences), B.E.',
    bio: 'Dedicated public health advocate and social entrepreneur with over 9 years of grassroots field experience across Maharashtra. Conceived the decentralized Asha cloth pad ecosystem to solve sanitary equity through women’s economic empowerment.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    email: 'aniket@samajbandh.org'
  },
  {
    id: 'team-2',
    name: 'Dr. Radhika Kulkarni',
    role: 'Head of Medical Research & Training',
    category: 'leadership',
    education: 'MD (Community Medicine), DNB (Public Health)',
    bio: 'Former public health consultant with UNICEF and State Health Mission. Spearheads curriculum development for the Arogya Samwadak Fellowship and clinical evaluations of reusable menstrual hygiene technologies.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    email: 'radhika@samajbandh.org'
  },
  {
    id: 'team-3',
    name: 'Suresh Madavi',
    role: 'Director of Tribal Outreach & Gaokor Reforms',
    category: 'leadership',
    education: 'Master of Social Work, Nagpur University',
    bio: 'Indigenous community leader hailing from Gadchiroli. Pioneers trusted mediation with tribal councils, gram panchayats, and traditional elders to establish safe community rest homes.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    email: 'suresh@samajbandh.org'
  },
  {
    id: 'team-4',
    name: 'Shobha Jadhav',
    role: 'Head of Artisan Operations & SHG Federations',
    category: 'core',
    education: 'Diploma in Textile Design & Garment Quality Control',
    bio: 'Supervises all 15 decentralized Asha micro-production units, managing fabric procurement, quality assurance testing, and artisan livelihoods training.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    email: 'shobha@samajbandh.org'
  }
];

export const PARTNERS_DATA: Partner[] = [
  {
    id: 'part-1',
    name: 'Tata Trusts Rural Health Initiative',
    type: 'Institutional',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    description: 'Technical and capacity-building partner for tribal MHM fellowships in Gadchiroli.',
    partnershipYear: 'Since 2021'
  },
  {
    id: 'part-2',
    name: 'Maharashtra State Rural Livelihoods Mission (UMED)',
    type: 'Government',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    description: 'Collaboration for Self-Help Group (SHG) micro-production centre establishment and buybacks.',
    partnershipYear: 'Since 2020'
  },
  {
    id: 'part-3',
    name: 'Apex Engineering CSR Foundation',
    type: 'CSR',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    description: 'Strategic CSR donor supporting solar infrastructure and emergency school kits.',
    partnershipYear: 'Since 2022'
  }
];

export const AWARDS_DATA: Award[] = [
  {
    id: 'award-1',
    year: '2024',
    title: 'State Social Innovation & Public Health Leadership Award',
    awardingBody: 'Government of Maharashtra Social Welfare Directorate',
    description: 'Conferred for transforming tribal Gaokor isolation practices into hygienic, solar-powered rest spaces.',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'award-2',
    year: '2023',
    title: 'National Women Empowerment & Sustainable WASH Award',
    awardingBody: 'Clean India Social Enterprise Conclave',
    description: 'Honoring the Asha Reusable Cloth Pad decentralized production model for creating sustainable rural livelihoods.',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=400&auto=format&fit=crop'
  }
];

export const TRANSPARENCY_DOCS: TransparencyDoc[] = [
  {
    id: 'doc-annual-24',
    title: 'Annual Impact & Social Accountability Report (FY 2024-25)',
    category: 'annual-report',
    year: '2024-25',
    description: 'Detailed program accomplishments, beneficiary counts, district footprints, and governance disclosures.',
    fileSize: '4.8 MB PDF',
    fileUrl: '#',
    verifiedDate: 'Verified March 2025'
  },
  {
    id: 'doc-audit-24',
    title: 'Audited Financial Statements & Balance Sheet (FY 2023-24)',
    category: 'financial',
    year: '2023-24',
    description: 'Statutory audit conducted by independent Chartered Accountants, detailing all receipts, utilization, and balances.',
    fileSize: '2.1 MB PDF',
    fileUrl: '#',
    verifiedDate: 'Verified September 2024'
  },
  {
    id: 'doc-80g-cert',
    title: 'Section 80G Tax Exemption Approval Certificate',
    category: 'certificate',
    description: 'Income Tax Department registration granting 50% tax deductions on donor contributions. [Ref: ITBA/EXM/80G/XXXXX]',
    fileSize: '820 KB PDF',
    fileUrl: '#',
    verifiedDate: 'Active & Verified'
  },
  {
    id: 'doc-12a-cert',
    title: 'Section 12A Charitable Trust Registration Certificate',
    category: 'certificate',
    description: 'Official NGO charitable institution registration under the Indian Income Tax Act.',
    fileSize: '740 KB PDF',
    fileUrl: '#',
    verifiedDate: 'Active & Verified'
  },
  {
    id: 'doc-policy-posh',
    title: 'Prevention of Sexual Harassment (POSH) Policy & Internal Committee Charter',
    category: 'policy',
    description: 'Zero-tolerance policy ensuring physical, psychological, and emotional safety for all staff, fellows, and artisans.',
    fileSize: '1.2 MB PDF',
    fileUrl: '#',
    verifiedDate: 'Updated January 2025'
  }
];

export const TIMELINE_MILESTONES = [
  {
    year: '2018',
    title: 'The Spark & Grassroots Inception',
    description: 'Founded after witnessing severe menstrual stigma, lack of basic sanitary access, and harmful seclusion practices in rural Maharashtra. Initial prototype testing of washable cotton pads with 50 local women.',
    impact: 'First 500 women reached; foundational research on rural menstrual health barriers.',
    photo: '/images/kurma/night-community-meeting.jpg'
  },
  {
    year: '2019',
    title: 'Birth of Asha Reusable Cloth Pad & First Micro-Centre',
    description: 'Established the first decentralized community stitching unit in Pune rural with a women’s Self-Help Group, standardizing the 5-layer leak-proof cotton design.',
    impact: 'First 10,000 Asha pads crafted; 12 rural women employed as professional tailors.',
    photo: '/images/stories/women-handstitching-pads.jpg'
  },
  {
    year: '2021',
    title: 'Launch of Arogya Samwadak Fellowship',
    description: 'Formulated the flagship 1-year youth fellowship to create localized health champions who can guide adolescent girls and conduct mother-daughter circles.',
    impact: '50 fellows trained across 40 villages; school absenteeism dropped by 65%.',
    photo: '/images/fellowship/arogya-samwadak-session.jpg'
  },
  {
    year: '2023',
    title: 'Kurma Sudhar Karykram in Tribal Gadchiroli',
    description: 'Initiated structured community dialogue with tribal councils (Patils & Pujaris) to renovate traditional period seclusion huts (Gaokor) into solar-powered, clean health rest homes.',
    impact: '15 rest homes upgraded; zero snakebite casualties recorded in intervention villages.',
    photo: '/images/kurma/kurma-hut-night.jpg'
  },
  {
    year: '2025-2026',
    title: 'Scaling 15 Production Centres & State Policy Advocacy',
    description: 'Expanded to 15 decentralized production micro-units across Maharashtra, reaching over 50,000 women and presenting sustainable MHM policy recommendations at state summits.',
    impact: '50,000+ women empowered; 85,000+ pads distributed; 300+ trained volunteers.',
    photo: '/images/kurma/tailoring-training-unit.jpg'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Cloth Pad Stitching & Tailoring Unit',
    caption: 'Women training on sewing machines to produce reusable Asha cloth pads.',
    category: 'production',
    url: '/images/kurma/tailoring-training-unit.jpg',
    imageUrl: '/images/kurma/tailoring-training-unit.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2025',
    programSlug: 'asha-cloth-pads-production'
  },
  {
    id: 'gal-2',
    title: 'Hand-Stitching Asha Pads Together',
    caption: 'Training women to hand-stitch reusable cloth pads in their own village.',
    category: 'production',
    url: '/images/stories/women-handstitching-pads.jpg',
    imageUrl: '/images/stories/women-handstitching-pads.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2025',
    programSlug: 'asha-cloth-pads-production'
  },
  {
    id: 'gal-3',
    title: 'The Asha Menstrual Kit',
    caption: 'Reusable Asha cloth pads, carry pouch and information booklet.',
    category: 'production',
    url: '/images/products/asha-menstrual-kit.jpg',
    imageUrl: '/images/products/asha-menstrual-kit.jpg',
    type: 'image',
    location: 'Pune',
    date: '2026',
    programSlug: 'asha-cloth-pads-production'
  },
  {
    id: 'gal-4',
    title: 'Samata Samvad Yatra in Schools',
    caption: 'Students reading about Savitribai Phule during a gender equality session.',
    category: 'workshop',
    url: '/images/samata-yatra/gender-equality-school.jpg',
    imageUrl: '/images/samata-yatra/gender-equality-school.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2025'
  },
  {
    id: 'gal-5',
    title: 'Menstrual Health Session for School Girls',
    caption: 'An open, shame-free session on periods and menstrual hygiene for adolescent girls.',
    category: 'workshop',
    url: '/images/awareness/school-girls-session.jpg',
    imageUrl: '/images/awareness/school-girls-session.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2024'
  },
  {
    id: 'gal-6',
    title: 'Children\u2019s Workshop at Asha Kendra',
    caption: 'Children taking part in a learning session at Asha Kendra, Baner.',
    category: 'workshop',
    url: '/images/asha-kendra/children-workshop-baner.jpg',
    imageUrl: '/images/asha-kendra/children-workshop-baner.jpg',
    type: 'image',
    location: 'Baner, Pune',
    date: '2025'
  },
  {
    id: 'gal-7',
    title: 'ASHA Worker Training',
    caption: 'Frontline ASHA workers trained in menstrual health education.',
    category: 'workshop',
    url: '/images/awareness/asha-worker-training.jpg',
    imageUrl: '/images/awareness/asha-worker-training.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2024'
  },
  {
    id: 'gal-8',
    title: 'Adolescent Learning Circle',
    caption: 'Girls and boys learning together about menstruation in a village session.',
    category: 'workshop',
    url: '/images/kurma/adolescent-girls-session.jpg',
    imageUrl: '/images/kurma/adolescent-girls-session.jpg',
    type: 'image',
    location: 'Bhamragad, Gadchiroli',
    date: '2026'
  },
  {
    id: 'gal-9',
    title: 'Community Session Under the Trees',
    caption: 'Women of the village gather for an open dialogue on the Kurma tradition.',
    category: 'tribal',
    url: '/images/kurma/community-session-under-tree.jpg',
    imageUrl: '/images/kurma/community-session-under-tree.jpg',
    type: 'image',
    location: 'Bhamragad, Gadchiroli',
    date: '2026',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-10',
    title: 'Inside a Kurma Hut',
    caption: 'Documenting conditions in a period hut during the pre/post Kurma survey.',
    category: 'tribal',
    url: '/images/kurma/kurma-hut-interior.jpg',
    imageUrl: '/images/kurma/kurma-hut-interior.jpg',
    type: 'image',
    location: 'Bhamragad, Gadchiroli',
    date: '2026',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-11',
    title: 'A Kurma Hut at Night',
    caption: 'Women and infants spend menstruation nights in isolated huts like this one.',
    category: 'tribal',
    url: '/images/kurma/kurma-hut-night.jpg',
    imageUrl: '/images/kurma/kurma-hut-night.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2024',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-12',
    title: 'Evening Village Meeting',
    caption: 'Community members discuss menstrual dignity after the day\u2019s work.',
    category: 'tribal',
    url: '/images/kurma/night-community-meeting.jpg',
    imageUrl: '/images/kurma/night-community-meeting.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2023',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-13',
    title: 'Arogya Sakhi Training',
    caption: 'Local young women trained as Arogya Sakhis to lead change in their villages.',
    category: 'tribal',
    url: '/images/kurma/arogya-sakhi-training.jpg',
    imageUrl: '/images/kurma/arogya-sakhi-training.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2025',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-14',
    title: 'Arogya Sakhi in the Field',
    caption: 'An Arogya Sakhi sharing menstrual health information with mothers.',
    category: 'tribal',
    url: '/images/kurma/arogya-sakhi-outreach.jpg',
    imageUrl: '/images/kurma/arogya-sakhi-outreach.jpg',
    type: 'image',
    location: 'Bhamragad, Gadchiroli',
    date: '2026',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-15',
    title: 'Awareness Session with Tribal Communities',
    caption: 'A village-wide awareness session in Gadchiroli.',
    category: 'tribal',
    url: '/images/stories/gadchiroli-tribal-awareness.jpg',
    imageUrl: '/images/stories/gadchiroli-tribal-awareness.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2025',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-16',
    title: 'Village Gathering in the Hills',
    caption: 'Youth and elders come together for a community session.',
    category: 'tribal',
    url: '/images/kurma/village-gathering-hills.jpg',
    imageUrl: '/images/kurma/village-gathering-hills.jpg',
    type: 'image',
    location: 'Bhamragad, Gadchiroli',
    date: '2026',
    programSlug: 'kurma-sudhar-karykram'
  },
  {
    id: 'gal-17',
    title: 'Arogya Samwadak Session',
    caption: 'A Menstrual Health Educator leading a session for students.',
    category: 'fellowship',
    url: '/images/fellowship/arogya-samwadak-session.jpg',
    imageUrl: '/images/fellowship/arogya-samwadak-session.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2025',
    programSlug: 'arogya-samwadak-fellowships'
  },
  {
    id: 'gal-18',
    title: 'Learning Beyond the Classroom',
    caption: 'Arogya Samwadaks bring science-based menstrual education into schools.',
    category: 'fellowship',
    url: '/images/fellowship/menstrual-health-awareness.jpg',
    imageUrl: '/images/fellowship/menstrual-health-awareness.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2025',
    programSlug: 'arogya-samwadak-fellowships'
  },
  {
    id: 'gal-19',
    title: 'Students After an Awareness Session',
    caption: 'School girls with the facilitators after an Arogya Samwadak session.',
    category: 'fellowship',
    url: '/images/fellowship/school-girls-group.jpg',
    imageUrl: '/images/fellowship/school-girls-group.jpg',
    type: 'image',
    location: 'Maharashtra',
    date: '2025',
    programSlug: 'arogya-samwadak-fellowships'
  },
  {
    id: 'gal-20',
    title: 'Youth Documentary Filmmaking',
    caption: 'Young leaders from Gadchiroli learning documentary filmmaking to amplify Indigenous voices.',
    category: 'fellowship',
    url: '/images/kurma/youth-filmmaker-tripod.jpg',
    imageUrl: '/images/kurma/youth-filmmaker-tripod.jpg',
    type: 'image',
    location: 'Gadchiroli',
    date: '2026'
  },
  {
    id: 'gal-21',
    title: 'Run 2 Empower',
    caption: 'Samajbandh\u2019s Run 2 Empower — run, walk, contribute.',
    category: 'events',
    url: '/images/asha-kendra/run2empower-banner.jpg',
    imageUrl: '/images/asha-kendra/run2empower-banner.jpg',
    type: 'image',
    location: 'Pune',
    date: '2026'
  },
  {
    id: 'gal-22',
    title: 'Gender Vachan Katta',
    caption: 'Our online reading circle on gender, featuring writings on Savitribai Phule.',
    category: 'events',
    url: '/images/campaigns/gender-vachan-katta.jpg',
    imageUrl: '/images/campaigns/gender-vachan-katta.jpg',
    type: 'image',
    location: 'Online',
    date: '2026'
  },
  {
    id: 'gal-video-1',
    title: 'Asha — The Threads of Dignity (Documentary)',
    caption: 'Watch how tribal women in Gadchiroli transformed their health and village norms.',
    category: 'video',
    url: '/images/kurma/kurma-hut-night.jpg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'video',
    location: 'Gadchiroli',
    date: '2025'
  }
];

export const GALLERY_DATA = GALLERY_ITEMS;

export const VIDEOS_DATA: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Voices of Dignity: Inside the Gaokor Rest Shed Transformation in Gadchiroli',
    description: 'A 10-minute documentary exploring how tribal elders, women, and Samajbandh fellows united to reform centuries-old menstrual isolation.',
    duration: '10:24',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: '/images/kurma/kurma-hut-entrance.jpg',
    category: 'documentary',
    date: '2025'
  }
];
