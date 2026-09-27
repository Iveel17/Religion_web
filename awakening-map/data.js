/**
 * ==============================================================================
 * [Awakening & Dispersion] Dataset for the Three Great Spiritual Leaders (data.js)
 * ==============================================================================
 * 
 * 💡 [USER GUIDE - How to edit or add new locations]:
 * 1. You can open and edit this file directly in any text editor (Notepad, VS Code).
 * 2. Or, click the [✏️ Edit Data] button at the top-right of the web app to 
 *    add/modify points directly on the screen with a map coordinate picker,
 *    and download the updated data.js with one click!
 * 
 * 📌 Field Definitions:
 * - id: Unique string identifier (e.g. 'buddha-1', 'jesus-3')
 * - religion: Group identifier ('buddhism', 'christianity', 'islam')
 * - religionName: Display name ('Buddhism', 'Christianity', 'Islam')
 * - leader: Spiritual leader name ('Gautama Buddha', 'Jesus Christ', 'Prophet Muhammad')
 * - step: Chronological step order (1, 2, 3...)
 * - title: Event title / episode
 * - location: Geographic location (City, Region, Country)
 * - year: Historical era text (e.g. 'c. 528 BCE', 'c. 30 CE')
 * - yearNumber: Integer for timeline slider (negative for BCE, positive for CE)
 * - lat: Latitude coordinate (decimal degrees)
 * - lng: Longitude coordinate (decimal degrees)
 * - summary: 1-2 sentence core summary for quick cards & popups
 * - description: Detailed historical narrative and context
 * - significance: Theological and philosophical significance
 * - quote: Sacred scripture quotation or famous historical decree
 * - imageUrl: Historical illustration or artwork image URL
 * - audioPrompt: Narration script read aloud by the AI Voice / TTS engine
 * ==============================================================================
 */

const RELIGIONS_CONFIG = {
  buddhism: {
    name: 'Buddhism',
    leader: 'Gautama Buddha',
    color: '#E59819', // Golden Saffron
    lightColor: '#FEF3C7',
    darkColor: '#B45309',
    icon: '☸️',
    description: 'Born in the ancient Gangetic plains; teachings of Compassion (Karuna), Dependent Origination (Pratītyasamutpāda), and the Middle Way.',
    bgmUrl: 'audio/buddhism_singing_bowl.ogg',
    bgmTitle: 'Tibetan Singing Bowl (Authentic Acoustic Recording)',
    bgmStyle: 'Tibetan singing bowl, deep meditative drone, temple ambiance, Zen tranquil'
  },
  christianity: {
    name: 'Christianity',
    leader: 'Jesus Christ',
    color: '#DC2626', // Royal Crimson Red
    lightColor: '#FEE2E2',
    darkColor: '#991B1B',
    icon: '✝️',
    description: 'Originated in Roman Galilee and Judea; message of Unconditional Love (Agape), Redemption, and the Kingdom of God.',
    bgmUrl: 'audio/christianity_gregorian_chant.ogg',
    bgmTitle: 'Gregorian Chant (Solemn Cathedral Monastic Choir)',
    bgmStyle: 'Gregorian chant, solemn choir, cathedral reverb, monophonic, sacred acoustic'
  },
  islam: {
    name: 'Islam',
    leader: 'Prophet Muhammad',
    color: '#059669', // Emerald Green
    lightColor: '#D1FAE5',
    darkColor: '#065F46',
    icon: '☪️',
    description: 'Proclaimed in the Arabian oases of Mecca and Medina; complete devotion and submission to the One God (Allah) and universal justice.',
    bgmUrl: 'audio/islam_nasheed_adhan.ogg',
    bgmTitle: 'A Cappella Sacred Chant (Soulful Arabic Modal Melodies)',
    bgmStyle: 'A cappella Nasheed, Arabic modal scales, soulful vocal drone, desert breeze'
  }
};

const MAP_NODES = [
  // ============================================================================
  // 🟡 BUDDHISM - Gautama Buddha & Emperor Ashoka
  // ============================================================================
  {
    id: 'buddha-1',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 1,
    title: 'Birth at Lumbini Grove',
    location: 'Lumbini, Nepal',
    year: 'c. 563 BCE',
    yearNumber: -563,
    lat: 27.4705,
    lng: 83.2755,
    summary: 'Prince Siddhartha Gautama was born to Queen Maya beneath the blossoming Sal tree in the sacred gardens of Lumbini.',
    description: 'While traveling to her maternal home in Devadaha, Queen Maya gave birth to Prince Siddhartha under a blooming Sal tree at Lumbini Grove. According to canonical tradition, upon birth the newborn took seven steps in each cardinal direction, announcing that every sentient being possesses intrinsic dignity and the seed of universal liberation.',
    significance: 'The historical genesis of Buddhism, symbolizing human dignity and the innate potential within all conscious beings to attain supreme awakening.',
    quote: 'Above the heavens and below the earth, all sentient life is dignified; I shall bring peace to those who suffer in this world.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'In the sixth century before the common era, amidst the quiet foothills of the Himalayas at Lumbini Grove, Prince Siddhartha was born, heralding a spiritual revolution that would illuminate all of Asia.'
  },
  {
    id: 'buddha-2',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 2,
    title: 'Kapilavastu: Four Sights & The Great Renunciation',
    location: 'Kapilavastu (Tilaurakot), Nepal / India Border',
    year: 'c. 534 BCE (Age 29)',
    yearNumber: -534,
    lat: 27.5739,
    lng: 83.0565,
    summary: 'Confronted by the realities of aging, sickness, and death outside the palace gates, Siddhartha renounced royal power to seek liberation.',
    description: 'Dissatisfied with sheltered palace luxury, Prince Siddhartha ventured beyond the four palace gates where he encountered an old man, a sick person, and a corpse. Seeing human vulnerability firsthand, he was deeply moved by the sight of a serene wandering ascetic. At age 29, he made the Great Renunciation—leaving royal privilege, wealth, and secular sovereignty in the dead of night to confront existential suffering.',
    significance: 'The paradigm of the spiritual quest: sacrificing worldly ambition to discover a cure for the universal human predicament of suffering (Dukkha).',
    quote: 'Youth is worn away by old age, health is shattered by illness, and life ends in death. Where is the path of true emancipation from this relentless cycle?',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'The gilded halls of Kapilavastu could not conceal the universal reality of suffering. At twenty-nine, Prince Siddhartha left his throne and rode into the wilderness to discover the cure for existential pain.'
  },
  {
    id: 'buddha-3',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 3,
    title: 'Bodh Gaya: Supreme Enlightenment under the Bodhi Tree',
    location: 'Bodh Gaya, Bihar, India',
    year: 'c. 528 BCE (Age 35)',
    yearNumber: -528,
    lat: 24.6959,
    lng: 84.9913,
    summary: 'Rejecting extreme mortification in favor of the Middle Way, Siddhartha sat beneath the Bodhi tree and attained complete awakening (Bodhi).',
    description: 'After six grueling years of severe ascetic self-mortification that nearly claimed his life, Siddhartha realized that starving the flesh does not liberate the mind. Accepting a bowl of milk-rice from the maiden Sujata, he regained strength and sat in steadfast meditation beneath the sacred Bodhi tree (Ficus religiosa). By dawn, he comprehended the Twelve Links of Dependent Origination, dispelled ignorance, and emerged as the Buddha—the Fully Awakened One.',
    significance: 'The philosophical core of Buddhism: liberation achieved not through divine intervention or ritual sacrifices, but through intuitive insight into the nature of reality and the Middle Way.',
    quote: 'House-builder, you are seen! You shall build no more houses for me. All your rafters are broken, your ridgepole is shattered. My mind has attained the unconditioned: the craving is ended.',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Beneath the sprawling canopy of the Bodhi tree at Bodh Gaya, Siddhartha discovered the Middle Way between asceticism and indulgence. Penetrating the causal web of reality, he became the Buddha—the awakened one.'
  },
  {
    id: 'buddha-4',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 4,
    title: 'Sarnath: First Turning of the Wheel of Dharma',
    location: 'Deer Park, Sarnath, Varanasi, India',
    year: 'c. 528 BCE',
    yearNumber: -528,
    lat: 25.3811,
    lng: 83.0214,
    summary: 'Delivered his maiden discourse to five companions, setting forth the Four Noble Truths and the Noble Eightfold Path.',
    description: 'Moved by compassion to share his transformative insight, the Buddha traveled to the Deer Park in Sarnath. There he addressed his five former ascetic companions, setting into motion the Wheel of Dharma (Dharmachakra-pravartana). He outlined the Four Noble Truths—the diagnosis of suffering, its origin in grasping, its cessation in Nirvana, and the Eightfold Path of ethical and mental cultivation.',
    significance: 'The founding of the Buddhist spiritual community (Sangha) and the formal public articulation of Buddhist ethics, psychology, and meditation.',
    quote: 'Monks, these two extremes ought not to be practiced by one who has gone forth: the indulgence in sensual pleasures and the practice of self-mortification. Avoiding both, the Tathagata has realized the Middle Path.',
    imageUrl: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'At Deer Park in Sarnath, the Wheel of Truth was set in motion. The Buddha proclaimed the Four Noble Truths and the Eightfold Path, establishing the spiritual order of the Sangha.'
  },
  {
    id: 'buddha-5',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 5,
    title: 'Rajgir: Venuvana Monastery & Vulture Peak',
    location: 'Rajgir, Bihar, India',
    year: 'c. 520–490 BCE',
    yearNumber: -505,
    lat: 25.0194,
    lng: 85.4217,
    summary: 'Received the first monastic sanctuary (Bamboo Grove) from King Bimbisara and delivered key discourses atop Vulture Peak.',
    description: 'In the Magadhan capital of Rajgir, King Bimbisara became a devout lay disciple and donated the Bamboo Grove (Venuvana), the first settled monastic sanctuary. Here, the Buddha’s foremost disciples Sariputta and Moggallana entered the order. Atop the rugged heights of Gridhrakuta (Vulture Peak), the Buddha delivered profound teachings later canonized in Mahayana scriptures including the Heart Sutra and Lotus Sutra.',
    significance: 'Provided institutional stability to the wandering community, anchoring Buddhism in the royal capitals and intellectual crossroads of ancient India.',
    quote: 'Form is emptiness, emptiness is form; feelings, perceptions, mental formations, and consciousness are also like this.',
    imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'At Rajgir, in the sheltered Bamboo Grove and atop the windswept heights of Vulture Peak, the monastic community flourished as the Buddha expounded the profound emptiness and interdependence of all things.'
  },
  {
    id: 'buddha-6',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Gautama Buddha',
    step: 6,
    title: 'Kushinagar: Mahaparinirvana',
    location: 'Kushinagar, Uttar Pradesh, India',
    year: 'c. 483 BCE (Age 80)',
    yearNumber: -483,
    lat: 26.7404,
    lng: 83.8893,
    summary: 'Reclining between two blooming Sal trees, the Buddha imparted his final exhortation and entered unconditional Parinirvana.',
    description: 'At the age of eighty, having walked the dusty roads of India for forty-five years preaching liberation without distinction of caste, the Buddha reached Kushinagar. Lying on his right side between two flowering Sal trees, he comforted his grieving attendant Ananda. Rather than appointing a human successor, he declared that the Dharma and Vinaya would be their guide, urging them to be islands unto themselves.',
    significance: 'The ultimate realization of freedom from rebirth; a timeless charter for self-reliant spiritual practice without dogmatic dependency.',
    quote: 'All conditioned phenomena are transient and subject to decay. Strive diligently with mindfulness for your own liberation.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Beneath the twin Sal trees of Kushinagar, the Buddha completed his eighty years of earthly journey. His final words echoed as an eternal beacon: "All things are transient; strive diligently with mindfulness."'
  },
  {
    id: 'buddha-7',
    religion: 'buddhism',
    religionName: 'Buddhism',
    leader: 'Emperor Ashoka (Dispersion)',
    step: 7,
    title: 'Pataliputra: Ashoka & Global Propagation',
    location: 'Patna (Pataliputra), Bihar, India',
    year: 'c. 260–232 BCE',
    yearNumber: -250,
    lat: 25.6093,
    lng: 85.1376,
    summary: 'Following the Kalinga War, Emperor Ashoka renounced conquest by sword, engraving rock edicts of Dharma and sending global missions.',
    description: 'Devastated by the immense carnage of his war against Kalinga, Emperor Ashoka of the Maurya Dynasty experienced profound remorse and embraced the Buddha’s path of non-violence (Ahimsa). From his capital at Pataliputra, he convened the Third Buddhist Council, erected pillars inscribed with moral edicts across the subcontinent, and dispatched missionary monks to Sri Lanka, Burma, Central Asia, and Mediterranean Hellenistic realms.',
    significance: 'Transformed Buddhism from a regional north-Indian spiritual movement into a pan-Asian world religion anchored in moral governance.',
    quote: 'The conquest by Dharma is the only true victory. One should respect all living beings, practice truthfulness, and show compassion to all.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'From his imperial throne at Pataliputra, Emperor Ashoka replaced conquest by the sword with conquest by the moral law of Dharma, sending peaceful ambassadors across Asia and the Mediterranean.'
  },

  // ============================================================================
  // 🔴 CHRISTIANITY - Jesus Christ
  // ============================================================================
  {
    id: 'jesus-1',
    religion: 'christianity',
    religionName: 'Christianity',
    leader: 'Jesus Christ',
    step: 1,
    title: 'Bethlehem: Nativity in the Manger',
    location: 'Bethlehem, West Bank / Judea',
    year: 'c. 4 BCE',
    yearNumber: -4,
    lat: 31.7054,
    lng: 35.2024,
    summary: 'Born in a humble stable manger during the Roman census, announced by angels to shepherds in the Judean hills.',
    description: 'In compliance with an imperial decree by Caesar Augustus, Joseph and Mary traveled from Nazareth to Bethlehem, the ancestral city of David. Finding no lodging at the inn, Jesus was born in a humble animal shelter and laid in a feeding trough (manger). His arrival was heralded to lowly field shepherds and commemorated by visiting Magi who followed a celestial star from the East.',
    significance: 'The Incarnation of God in supreme humility—entering human history not through royal palaces, but amongst the poor and marginalized.',
    quote: 'Glory to God in the highest heaven, and on earth peace to those on whom his favor rests. (Luke 2:14)',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Under starlit Judean skies in Bethlehem, Jesus was born in a humble manger. The divine entered human history in utter vulnerability, bringing a message of universal peace and hope to the lowest.'
  },
  {
    id: 'jesus-2',
    religion: 'christianity',
    religionName: 'Christianity',
    leader: 'Jesus Christ',
    step: 2,
    title: 'Nazareth: Childhood, Labor & Preparation',
    location: 'Nazareth, Lower Galilee',
    year: 'c. 4 BCE – 28 CE',
    yearNumber: 15,
    lat: 32.7020,
    lng: 35.3027,
    summary: 'Grew to maturity in the Galilean hill country, practicing the artisan craft of carpentry while preparing for public ministry.',
    description: 'Returning from refuge in Egypt after the death of Herod, the Holy Family settled in Nazareth, a quiet provincial town in Galilee. In this ordinary environment, Jesus mastered the trade of carpentry (tekton) under Joseph, honoring familial duties and observing synagogue life. Scriptures note that he grew in wisdom, stature, and favor with God and all people throughout these unrecorded formative years.',
    significance: 'Affirmation of ordinary human labor, patience, and silent preparation as sacred vessels for spiritual vocation.',
    quote: 'The Spirit of the Lord is upon me, because he has anointed me to proclaim good news to the poor. (Luke 4:18)',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'In the gentle hills of Nazareth, Jesus lived three decades of quiet craftsmanship, embodying divine grace in daily toil while preparing to unveil the mystery of the Kingdom of God.'
  },
  {
    id: 'jesus-3',
    religion: 'christianity',
    religionName: 'Christianity',
    leader: 'Jesus Christ',
    step: 3,
    title: 'Jordan River: Baptism & Divine Anointing',
    location: 'Qasr al-Yahud, Jordan River',
    year: 'c. 28 CE (Age ~30)',
    yearNumber: 28,
    lat: 31.8385,
    lng: 35.5458,
    summary: 'Baptized by John the Baptist as the heavens opened, inaugurating his public ministry followed by forty days in the wilderness.',
    description: 'At the muddy banks of the lower Jordan River, Jesus presented himself to John the Baptist for baptism. As he emerged from the waters, the heavens were opened and the Holy Spirit descended like a dove, accompanied by a voice from heaven: "This is my beloved Son, with whom I am well pleased." Immediately following, Jesus retreated into the Judean wilderness for forty days of fasting, defeating threefold temptations.',
    significance: 'The public revelation of Christ’s Messianic identity and his deliberate self-identification with humanity’s struggles and call to repentance.',
    quote: 'And a voice from heaven said, "This is my Son, whom I love; with him I am well pleased." (Matthew 3:17)',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'At the waters of the Jordan, Jesus was baptized by John. As the Spirit descended like a dove, he embraced his public vocation, stepping forth to proclaim redemption to a weary world.'
  },
  {
    id: 'jesus-4',
    religion: 'christianity',
    religionName: 'Christianity',
    leader: 'Jesus Christ',
    step: 4,
    title: 'Sea of Galilee & Capernaum: Sermon on the Mount',
    location: 'Capernaum & Mount of Beatitudes, Sea of Galilee',
    year: 'c. 28–30 CE',
    yearNumber: 29,
    lat: 32.8808,
    lng: 35.5752,
    summary: 'Made Capernaum his ministry headquarters; delivered the Beatitudes and the radical ethics of love, grace, and forgiveness.',
    description: 'Calling fishermen and tax collectors along the shores of Lake Galilee to be his disciples, Jesus established Capernaum as the center of his Galilean mission. On a hillside overlooking the tranquil lake, he delivered the Sermon on the Mount—redefining righteousness around mercy, purity of heart, and love for one’s enemies. In these fertile lands he healed the afflicted, calmed the storm, and multiplied loaves to feed thousands.',
    significance: 'The ethical and theological foundation of Christian life: replacing legalistic ritualism with radical agape love, forgiveness, and beatitude.',
    quote: 'Blessed are the peacemakers, for they will be called children of God... Love your enemies and pray for those who persecute you. (Matthew 5:9, 44)',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Across the hills of Galilee, Jesus delivered the Sermon on the Mount. His radical call to love even our enemies and cherish the poor in spirit fundamentally transformed moral philosophy forever.'
  },
  {
    id: 'jesus-5',
    religion: 'christianity',
    religionName: 'Christianity',
    leader: 'Jesus Christ',
    step: 5,
    title: 'Jerusalem: Passion, Crucifixion & Resurrection',
    location: 'Jerusalem, Judea',
    year: 'c. 30 / 33 CE',
    yearNumber: 30,
    lat: 31.7780,
    lng: 35.2353,
    summary: 'Entered on Palm Sunday, celebrated the Last Supper, suffered crucifixion at Golgotha, and triumphed over death in the Resurrection.',
    description: 'Entering Jerusalem riding a donkey during Passover, Jesus cleansed the Temple and challenged the ruling religious hierarchy. In the Upper Room, he instituted the Eucharist, sharing bread and wine with his apostles as the New Covenant. Betrayed and condemned, he carried his cross to Golgotha, bearing humanity’s sins in sacrificial love. On the third day, the tomb was discovered empty, announcing his bodily Resurrection and victory over mortality.',
    significance: 'The supreme climax of Christian faith: the redemptive atonement of the Cross and the eternal promise of renewed life through the Resurrection.',
    quote: 'It is finished... Father, into your hands I commit my spirit. I am the resurrection and the life; whoever believes in me, though he die, yet shall he live. (John 19:30, Luke 23:46, John 11:25)',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-196024be5be3?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'In ancient Jerusalem, upon the heights of Golgotha, Jesus surrendered his life in ultimate sacrificial love. Through the dawn of the empty tomb, hope and eternal life triumphed over death.'
  },

  // ============================================================================
  // 🟢 ISLAM - Prophet Muhammad
  // ============================================================================
  {
    id: 'islam-1',
    religion: 'islam',
    religionName: 'Islam',
    leader: 'Prophet Muhammad',
    step: 1,
    title: 'Mecca: Birth & Al-Amin (The Trustworthy)',
    location: 'Mecca, Hejaz, Arabian Peninsula',
    year: 'c. 570 CE',
    yearNumber: 570,
    lat: 21.4225,
    lng: 39.8262,
    summary: 'Born into the Quraysh clan in Mecca; renowned throughout Arabia for unimpeachable honesty, earning the title "Al-Amin".',
    description: 'Born posthumously to Abdullah and Aminah of the noble Hashim clan during the Year of the Elephant, Muhammad was orphaned at a young age and raised under the protection of his grandfather and uncle Abu Talib. Guiding caravans across the desert, he became universally respected in turbulent Mecca for his integrity, equitable mediation, and strict avoidance of tribal corruption, earning the lifelong moniker "Al-Amin" (The Trustworthy).',
    significance: 'Demonstrated moral uprightness, fairness, and personal sanctity prior to prophetic calling, establishing an exemplary human character (Uswah Hasanah).',
    quote: 'Truthfulness leads to righteousness, and righteousness leads to Paradise. A person continues to tell the truth until he is recorded as truthful.',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'In the year 570, within the desert sanctuary of Mecca, Muhammad was born. Raised amidst hardships, his flawless honesty earned him the honorific title of Al-Amin, the Trustworthy.'
  },
  {
    id: 'islam-2',
    religion: 'islam',
    religionName: 'Islam',
    leader: 'Prophet Muhammad',
    step: 2,
    title: 'Cave of Hira: The First Divine Revelation',
    location: 'Mount Jabal al-Nour (Hira), Mecca',
    year: '610 CE (Age 40)',
    yearNumber: 610,
    lat: 21.4578,
    lng: 39.8592,
    summary: 'During contemplative retreat on Mount Noor, the Archangel Gabriel commanded "Read!" (Iqra), initiating the revelation of the Holy Quran.',
    description: 'Deeply perturbed by tribal blood feuds, idolatry, and socioeconomic inequality, Muhammad frequently sought solitude in the mountain cave of Hira. During the blessed month of Ramadan (on the Night of Power, Laylat al-Qadr), Archangel Jibril (Gabriel) appeared to him, embracing him and commanding: "Iqra!" (Recite/Read!). This momentous nocturnal encounter marked the descent of the Quran into human history.',
    significance: 'The dawn of Islam and the commencement of the final revealed scripture, redirecting human consciousness toward pure monotheism (Tawhid).',
    quote: 'Read! In the Name of your Lord Who created—created humankind from a clinging clot. Read! And your Lord is the Most Generous, Who taught by the pen. (Quran 96:1-4)',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Within the rugged heights of the Cave of Hira, the silence of the Arabian desert was shattered by Archangel Gabriel’s voice: "Read in the name of your Lord who created!" The Holy Quran had begun.'
  },
  {
    id: 'islam-3',
    religion: 'islam',
    religionName: 'Islam',
    leader: 'Prophet Muhammad',
    step: 3,
    title: 'Jerusalem: The Night Journey & Ascension (Isra & Mi\'raj)',
    location: 'Al-Aqsa & Dome of the Rock, Jerusalem',
    year: 'c. 621 CE',
    yearNumber: 621,
    lat: 31.7780,
    lng: 35.2354,
    summary: 'Transported miraculously from Mecca to Jerusalem on the celestial Buraq, leading former prophets in prayer before ascending to the divine presence.',
    description: 'Following the Year of Sorrow in which his beloved wife Khadijah and protective uncle Abu Talib passed away, the Prophet was granted a transcendent nocturnal journey. Carried upon the winged steed Buraq from the Sacred Mosque in Mecca to the Farthest Mosque (Al-Aqsa) in Jerusalem, he led Abraham, Moses, and Jesus in prayer. Ascending through the seven celestial realms, he was granted the institution of the five daily prayers (Salat).',
    significance: 'Affirmed the spiritual continuity of the Abrahamic prophetic lineage and instituted the ritual prayer (Salat) as the bedrock of Muslim spiritual devotion.',
    quote: 'Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa, whose surroundings We have blessed. (Quran 17:1)',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'On a celestial night, the Prophet was carried to the sacred heights of Jerusalem, joining with Abraham, Moses, and Jesus, before ascending through the heavens to receive the gift of daily prayer.'
  },
  {
    id: 'islam-4',
    religion: 'islam',
    religionName: 'Islam',
    leader: 'Prophet Muhammad',
    step: 4,
    title: 'Medina: The Hijra & Foundation of the Ummah',
    location: 'Medina (Yathrib), Saudi Arabia',
    year: '622 CE (Year 1 AH)',
    yearNumber: 622,
    lat: 24.4672,
    lng: 39.6111,
    summary: 'Migrated from persecution in Mecca to Yathrib, inaugurating the Islamic calendar and establishing the pluralistic Constitution of Medina.',
    description: 'Evading assassination plots by the Meccan aristocracy, Muhammad and his companion Abu Bakr made the hazardous trek across the desert to Yathrib, renamed Madinat al-Nabi (City of the Prophet). There he instituted the brotherhood between the Meccan emigrants (Muhajirun) and the Medinan helpers (Ansar). He drafted the historic Constitution of Medina, establishing an egalitarian community (Ummah) guaranteeing religious autonomy to Jewish and Arab tribes alike.',
    significance: 'The defining civilizational watershed of Islamic history: shifting from an oppressed minority into an enduring, lawful, multi-faith society based on civic justice.',
    quote: 'The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy. (Quran 49:10)',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'In 622, the journey of Hijra to Medina gave birth to the Islamic calendar and the first pluralistic commonwealth, replacing tribal vengeance with universal brotherhood and civic justice.'
  },
  {
    id: 'islam-5',
    religion: 'islam',
    religionName: 'Islam',
    leader: 'Prophet Muhammad',
    step: 5,
    title: 'Mecca: Peaceful Return, Cleansing of Kaaba & Farewell Sermon',
    location: 'Mecca & Mount Arafat, Saudi Arabia',
    year: '630–632 CE',
    yearNumber: 630,
    lat: 21.4225,
    lng: 39.8262,
    summary: 'Entered Mecca bloodlessly, granted universal amnesty, cleansed the Kaaba of idols, and proclaimed racial equality in his Farewell Sermon.',
    description: 'Returning to Mecca with ten thousand followers, Muhammad entered his birthplace without vengeance, declaring general amnesty for his former persecutors: "Go, for you are free." He purified the sacred Kaaba of hundreds of stone idols, restoring it to monotheistic worship. In 632, on Mount Arafat during his Farewell Pilgrimage, he delivered his final address, proclaiming that no race is superior to another, repudiating usury, and affirming human dignity.',
    significance: 'The historic consummation of the prophetic mission: demonstrating mercy in victory, and articulating a charter of universal human rights and racial equality.',
    quote: 'All mankind is from Adam and Eve. An Arab has no superiority over a non-Arab nor a non-Arab has any superiority over an Arab; also a white has no superiority over black nor a black has any superiority over white except by piety and good action.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
    audioPrompt: 'Returning in peace to Mecca, the Prophet pardoned all who had persecuted him. At Mount Arafat, his Farewell Sermon resounded across the desert: all humans are equal, like the teeth of a comb.'
  }
];

// Helper functions for easy data access
function getNodesByReligion(religionKey) {
  if (!religionKey || religionKey === 'all') return MAP_NODES;
  return MAP_NODES.filter(n => n.religion === religionKey);
}

function getNodeById(id) {
  return MAP_NODES.find(n => n.id === id);
}

function exportDataAsJSON() {
  return JSON.stringify(MAP_NODES, null, 2);
}
