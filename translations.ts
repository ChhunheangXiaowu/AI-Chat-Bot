// Using a type assertion to ensure flexibility during development.
type Translations = {
  [lang: string]: {
    [key:string]: string;
  };
};

export const translations: Translations = {
  en: {
    // General
    settings: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    english: 'English',
    khmer: 'Khmer',
    delete: 'Delete',
    
    // Sidebar
    geminiAi: 'Khmer AI',
    newChat: 'New Chat',
    search: 'Search...',
    generateImage: 'Generate Image',
    generateVideo: 'Generate Video',
    history: 'History',

    // Welcome Screen
    welcomeTitle: "Hello, I'm AI",
    welcomeSubtitle: "How can I help you today?",
    welcomeSearchNote: "I'm connected to Google Search for up-to-date answers.",

    // Chat Input
    askMeAnything: 'Ask me anything...',
    modeLight: 'Light',
    modeDeepThought: 'Deep Thought',
    modeCodeMaster: 'Code Master',
    modeSearch: 'Search',
    modeLightDesc: 'Fast & concise responses.',
    modeDeepThoughtDesc: 'In-depth reasoning with live web search.',
    modeCodeMasterDesc: 'Expert coding help with live web search.',
    modeSearchDesc: 'Answers from the web with sources.',

    // Chat Window
    liveWebSearchActive: 'Live web search is active for the most up-to-date answers.',
    sources: 'SOURCES',
    errorMessage: "Error: Sorry, I couldn't process that request.",

    // Image Generator
    imageGeneration: 'Image Generation',
    generator: 'Generator',
    yourImageWillAppear: 'Your generated image will appear here',
    downloadImage: 'Download Image',
    generating: 'Generating...',
    imageGenError: 'An unexpected error occurred.',
    editPromptPlaceholder: 'Describe the edits you want to make...',
    edit: 'Edit',
    cancelEdit: 'Cancel Edit',
    generatePromptPlaceholder: 'A futuristic cityscape at sunset...',
    aspectRatio: 'Aspect Ratio',
    generate: 'Generate',
    imageHistoryEmpty: 'Your generated images will appear here.',
    
    // Video Generator
    videoGeneration: 'Video Generation',
    videoPromptPlaceholder: 'A neon hologram of a cat driving at top speed...',
    resolution: 'Resolution',
    generatingVideo: 'Generating video...',
    generatingVideoMsg1: "This can take a few minutes. Please be patient.",
    generatingVideoMsg2: "Brewing up some pixels for your video...",
    generatingVideoMsg3: "The AI is directing its masterpiece...",
    generatingVideoMsg4: "Just a little longer, rendering the final frames...",
    videoGenError: "An error occurred while generating the video.",
    yourVideoWillAppear: 'Your generated video will appear here',
    downloadVideo: 'Download Video',

    // Auth
    signInPrompt: 'Please sign in to continue.',
    signInWithGoogle: 'Sign in with Google',
    signOut: 'Sign Out',
    loginError: 'Failed to sign in. Please try again.',
    user: 'User',

    // Misc
    confirmModeChange: 'Changing the mode will start a new chat. Are you sure?',
  },
  km: {
    // General
    settings: 'ការកំណត់',
    theme: 'រូបរាង',
    light: 'ពន្លឺ',
    dark: 'ងងឹត',
    language: 'ភាសា',
    english: 'អង់គ្លេស',
    khmer: 'ខ្មែរ',
    delete: 'លុប',

    // Sidebar
    geminiAi: 'Khmer AI',
    newChat: 'ការជជែកថ្មី',
    search: 'ស្វែងរក...',
    generateImage: 'បង្កើតរូបភាព',
    generateVideo: 'បង្កើតវីដេអូ',
    history: 'ប្រវត្តិ',
    
    // Welcome Screen
    welcomeTitle: 'សួស្តី ខ្ញុំ AI',
    welcomeSubtitle: 'តើខ្ញុំអាចជួយអ្វីអ្នកបានខ្លះ?',
    welcomeSearchNote: 'ខ្ញុំបានភ្ជាប់ជាមួយ Google Search សម្រាប់ចម្លើយថ្មីៗ។',

    // Chat Input
    askMeAnything: 'សួរខ្ញុំអ្វីក៏បាន...',
    modeLight: 'ស្រាល',
    modeDeepThought: 'ការគិតស៊ីជម្រៅ',
    modeCodeMaster: 'អ្នកជំនាញកូដ',
    modeSearch: 'ស្វែងរក',
    modeLightDesc: 'ចម្លើយរហ័ស និងខ្លីៗ។',
    modeDeepThoughtDesc: 'ការវែកញែកស៊ីជម្រៅជាមួយការស្វែងរកបន្តផ្ទាល់។',
    modeCodeMasterDesc: 'ជំនួយការសរសេរកូដជំនាញជាមួយការស្វែងរកបន្តផ្ទាល់។',
    modeSearchDesc: 'ចម្លើយពីគេហទំព័រជាមួយប្រភព។',

    // Chat Window
    liveWebSearchActive: 'ការស្វែងរកបន្តផ្ទាល់លើគេហទំព័រកំពុងដំណើរការសម្រាប់ចម្លើយថ្មីៗបំផុត។',
    sources: 'ប្រភព',
    errorMessage: 'កំហុស៖ សូមអភ័យទោស ខ្ញុំមិនអាចដំណើរការសំណើនេះបានទេ។',

    // Image Generator
    imageGeneration: 'ការបង្កើតរូបភាព',
    generator: 'កម្មវិធីបង្កើត',
    yourImageWillAppear: 'រូបភាពដែលអ្នកបានបង្កើតនឹងបង្ហាញនៅទីនេះ',
    downloadImage: 'ទាញយករូបភាព',
    generating: 'កំពុងបង្កើត...',
    imageGenError: 'មានកំហុសដែលមិនរំពឹងទុកបានកើតឡើង។',
    editPromptPlaceholder: 'ពណ៌នាអំពីការកែប្រែដែលអ្នកចង់បាន...',
    edit: 'កែសម្រួល',
    cancelEdit: 'បោះបង់ការកែសម្រួល',
    generatePromptPlaceholder: 'ទិដ្ឋភាពទីក្រុងនាពេលអនាគតនៅពេលថ្ងៃលិច...',
    aspectRatio: 'សមាមាត្រ',
    generate: 'បង្កើត',
    imageHistoryEmpty: 'រូបភាពដែលអ្នកបានបង្កើតនឹងបង្ហាញនៅទីនេះ។',

    // Video Generator
    videoGeneration: 'ការបង្កើតវីដេអូ',
    videoPromptPlaceholder: 'រូបភាពហូឡូក្រាមឆ្មាមួយក្បាលកំពុងបើកបរ...',
    resolution: 'កម្រិតភាពច្បាស់',
    generatingVideo: 'កំពុងបង្កើតវីដេអូ...',
    generatingVideoMsg1: 'អាចចំណាយពេលពីរបីនាទី។ សូម​រង់ចាំ​ដោយ​អត់ធ្មត់។',
    generatingVideoMsg2: "កំពុង​រៀបចំ​ភីកសែល​សម្រាប់​វីដេអូ​របស់​អ្នក...",
    generatingVideoMsg3: "AI កំពុង​ដឹកនាំ​ស្នាដៃ​របស់​ខ្លួន...",
    generatingVideoMsg4: "យូរ​បន្តិច​ទៀត​ប៉ុណ្ណោះ កំពុង​បង្ហាញ​ហ្វ្រេម​ចុងក្រោយ...",
    videoGenError: "មានកំហុសមួយបានកើតឡើងនៅពេលបង្កើតវីដេអូ។",
    yourVideoWillAppear: 'វីដេអូដែលបានបង្កើតរបស់អ្នកនឹងបង្ហាញនៅទីនេះ',
    downloadVideo: 'ទាញយកវីដេអូ',

    // Auth
    signInPrompt: 'សូមចូលដើម្បីបន្ត។',
    signInWithGoogle: 'ចូលដោយគណនី Google',
    signOut: 'ចាកចេញ',
    loginError: 'ការចូលបរាជ័យ។ សូមព្យាយាមម្តងទៀត។',
    user: 'អ្នកប្រើប្រាស់',

    // Misc
    confirmModeChange: 'ការផ្លាស់ប្តូរទម្រង់នឹងចាប់ផ្តើមការជជែកថ្មី។ តើអ្នកប្រាកដទេ?',
  }
};