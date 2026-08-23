import type { TranslationKey } from './es'

/**
 * English dictionary.
 *
 * Typed against the Spanish one, so a missing key is a compile error rather
 * than a blank in the interface. Product names, brands and business names are
 * NOT here: they come from the API and are shown as the API sends them.
 */
export const en: Record<TranslationKey, string> = {
  'common.skipToContent': 'Skip to main content',
  'common.homeSuffix': '— home',
  'common.start': 'Get started',
  'common.openMenu': 'Open menu',
  'common.closeMenu': 'Close menu',
  'common.breadcrumb': 'Breadcrumb',
  'common.retry': 'Try again',
  'common.required': '(required)',
  'common.website': 'Website',
  'common.externalLink': 'for {name}, opens in a new tab',
  'common.back': 'Back',
  'common.next': 'Next',

  'theme.groupLabel': 'Interface theme',
  'theme.footerTitle': 'Appearance',
  'theme.toDark': 'Switch to dark mode',
  'theme.toLight': 'Switch to light mode',
  'theme.system': 'System',
  'theme.light': 'Light',
  'theme.dark': 'Dark',

  'lang.groupLabel': 'Interface language',
  'lang.footerTitle': 'Language',
  'lang.es': 'Español',
  'lang.en': 'English',
  'lang.esShort': 'ES',
  'lang.enShort': 'EN',
  'lang.note':
    'Translates the interface. Catalogue entries come from the directory and are shown in their original language.',

  'nav.main': 'Main',
  'nav.mainMobile': 'Main (mobile)',
  'nav.findMyFit': 'Find My Fit',
  'nav.recommendations': 'Recommendations',
  'nav.catalog': 'Catalogue',
  'nav.providers': 'Businesses',

  'footer.tagline': 'Fashion should adapt to you.',
  'footer.blurb':
    'We bring accessible fashion and daily-living businesses together in one place, match how you actually get dressed against what they offer, and tell you who to go to.',
  'footer.forYou': 'For you',
  'footer.forBusiness': 'For your business',
  'footer.yourRecommendations': 'Your recommendations',
  'footer.fullCatalog': 'Full catalogue',
  'footer.directory': 'Business directory',
  'footer.listBusiness': 'List your business',
  'footer.disclaimer':
    'Hackathon project. The catalogue, brands, businesses and prices are fictional and exist only for the demo. ADAPTA does not give medical advice and does not replace assessment by a health professional.',
  'footer.credits': 'Made by Slater, José and Isaac · 2026',

  'error.notFound': "We couldn't find what you were looking for.",
  'error.offline': "We couldn't reach the server. Check your connection.",
  'error.server': 'The server had a problem. Try again in a moment.',
  'error.generic': 'Something went wrong. Please try again.',
  'error.unknown': 'Unknown error.',
  'states.loadErrorTitle': "We couldn't load this",

  'score.high': 'Strong fit',
  'score.mid': 'Partial fit',
  'score.low': 'Weak fit',
  'score.screenReader': 'Compatibility {score} out of 100. {tier}.',
  'reason.match': 'Covered',
  'reason.partial': 'Partly covered',
  'reason.gap': 'Not covered',

  'need.one-handed-dressing': 'Getting dressed one-handed',
  'need.seated-wearing': 'Getting dressed sitting down',
  'need.magnetic-closure': 'Magnetic fastening',
  'need.no-fine-motor': 'No fine pinching',
  'need.sensory-friendly': 'Kind to sensory sensitivity',
  'need.easy-access-medical': 'Access for medical care',
  'need.prosthesis-friendly': 'Works with a prosthesis',
  'need.adjustable-fit': 'Adjustable fit',
  'need.thermoregulation': 'Helps regulate temperature',

  'needHint.one-handed-dressing':
    'I need to be able to put it on and take it off using one hand.',
  'needHint.seated-wearing':
    'I get dressed sitting or lying down, without lifting my hips.',
  'needHint.magnetic-closure':
    'I would rather have magnets than buttons or small fastenings.',
  'needHint.no-fine-motor':
    'I find it hard to grip small things or press hard with my fingers.',
  'needHint.sensory-friendly':
    'Seams, labels or certain textures really bother me.',
  'needHint.easy-access-medical':
    'I use a catheter, port or similar and need access without undressing.',
  'needHint.prosthesis-friendly':
    'I use a prosthesis or orthosis and clothing has to accommodate it.',
  'needHint.adjustable-fit':
    'My size or swelling changes during the day and I need to adjust.',
  'needHint.thermoregulation': 'I find it hard to regulate my body temperature.',

  'category.tops': 'Tops',
  'category.bottoms': 'Bottoms',
  'category.outerwear': 'Outerwear',
  'category.footwear': 'Footwear',
  'category.underwear': 'Underwear',
  'category.accessories': 'Accessories and services',
  'category.prosthetics': 'Prosthetics',
  'category.orthotics': 'Orthotics',
  'category.mobility': 'Mobility',
  'category.daily-living': 'Daily living',

  'closure.magnetic': 'Magnetic fastening',
  'closure.velcro': 'Hook and loop',
  'closure.zipper-loop': 'Zip with pull ring',
  'closure.zipper': 'Standard zip',
  'closure.buttons': 'Buttons',
  'closure.elastic': 'Elastic',
  'closure.none': 'No fastening',

  'assistance.independent': 'I get dressed on my own',
  'assistance.partial-help': 'I need help with some garments',
  'assistance.full-help': 'Someone else helps me get dressed',

  'dexterity.both-hands': 'I use both hands without difficulty',
  'dexterity.one-hand': 'I use one hand only',
  'dexterity.limited-grip': 'I have limited strength or precision in my hands',

  'posture.standing': 'Standing',
  'posture.seated': 'Sitting',
  'posture.lying-down': 'Lying down',

  'sensory.none': "It doesn't affect me",
  'sensory.mild': 'It bothers me a little',
  'sensory.high': 'It bothers me a lot',

  'effort.low': 'Simple fix',
  'effort.medium': 'Needs a workshop',
  'effort.high': 'Major alteration',

  'providerKind.adaptive-apparel': 'Adaptive clothing and footwear',
  'providerKind.adaptation-workshop': 'Alteration workshop',
  'providerKind.prosthetics': 'Prosthetics and orthotics',
  'providerKind.mobility-aids': 'Mobility aids',
  'providerKind.daily-living-aids': 'Daily living aids',

  'providerPlan.free': 'Basic listing',
  'providerPlan.verified': 'Verified',
  'providerPlan.featured': 'Featured',

  'landing.docTitle': 'Clothing that adapts to you',
  'landing.eyebrow': 'Accessible fashion and daily living, with AI',
  'landing.h1': 'Clothing should adapt to you.',
  'landing.lead':
    'Getting dressed should not depend on whether you can do up a button. ADAPTA brings together the businesses making adaptive clothing, footwear, prosthetics and assistive equipment, matches how you actually get dressed against what they offer, and tells you what works for you, why, and who to go to.',
  'landing.ctaFit': 'Find your fit',
  'landing.ctaCatalog': 'Browse the catalogue',
  'landing.ctaBusiness': 'I have a business',
  'landing.reassure':
    'Takes two minutes. Free, no sign-up and no medical details.',
  'landing.previewLabel': 'What a result looks like',
  'landing.previewReason1': 'Fastens with one hand',
  'landing.previewReason2': 'No fine pinching needed',
  'landing.previewReason3':
    'Magnets need checking if you have a pacemaker',
  'landing.previewWhere': 'Where to get it:',
  'landing.scopeTitle': 'One directory, six categories',
  'landing.scopeApparel': 'Adaptive clothing',
  'landing.scopeFootwear': 'Footwear',
  'landing.scopeProsthetics': 'Prosthetics and orthotics',
  'landing.scopeMobility': 'Mobility',
  'landing.scopeDaily': 'Daily living',
  'landing.scopeWorkshops': 'Alteration workshops',
  'landing.problemTitle': 'For a lot of people, buying clothes is guesswork.',
  'landing.problemPersonTitle': 'On the shopper’s side',
  'landing.problemPersonBody':
    'Shops describe size, colour and fabric. None of them say whether a garment can be put on with one hand, whether it fastens while seated, or whether the inside seam will rub. You buy it, try it and send it back.',
  'landing.problemBusinessTitle': 'On the business’s side',
  'landing.problemBusinessBody':
    'The workshop, the orthopaedic supplier and the small maker have the product someone needs today, and no way to reach that person. Their customer is out there looking, and cannot find them.',
  'landing.problemPull':
    'The information exists. What does not exist is one place where it sits together, sorted by what actually works for each person.',
  'landing.howTitle': 'How it works',
  'landing.step1Title': 'Tell us how you get dressed',
  'landing.step1Body':
    'Four short steps about concrete barriers: fastenings, posture, sensitivity. No diagnoses and no body measurements.',
  'landing.step2Title': 'We calculate compatibility',
  'landing.step2Body':
    'A rules engine compares your profile against the real features of each product and returns a reproducible score.',
  'landing.step3Title': 'We tell you where to get it',
  'landing.step3Body':
    'The AI explains why it fits and what alteration would help, and connects you with the business that sells or adapts it.',
  'landing.engineEyebrow': 'What sets us apart',
  'landing.engineTitle': 'The AI does not make up the score.',
  'landing.engineLead':
    'Compatibility comes from deterministic rules we wrote. The AI comes after: it reads that evidence and puts it into plain language. It can never change the number. The same profile always gives the same result, which is why you can check it.',
  'landing.engineNode1': 'Your profile',
  'landing.engineNode2': 'Deterministic engine',
  'landing.engineNode3': 'Score 0–100',
  'landing.engineNode4': 'The AI explains it',
  'landing.engineNote':
    'Every recommendation shows the evidence behind it, line by line: which need it covers, which it half covers and which it does not. No "trust the algorithm".',
  'landing.valuesTitle': 'What makes us different',
  'landing.value1Title': 'We spell out the limitations',
  'landing.value1Body':
    'Every product also shows what it does not solve. We would rather give an honest recommendation than make a sale.',
  'landing.value2Title': 'Clothes that already exist can work too',
  'landing.value2Body':
    'If a conventional garment almost fits, we suggest how to alter it, with the real benefit and the real cost of doing so.',
  'landing.value3Title': 'It is not only clothing',
  'landing.value3Body':
    'Footwear, prosthetics, orthotics, wheelchairs and daily living aids. What is scattered today across Facebook groups and word of mouth, in one place.',
  'landing.value4Title': 'You pay nothing',
  'landing.value4Body':
    'The business listed in the directory pays, because we bring it customers. The person searching pays nothing and hands over no medical details.',
  'landing.closingTitle': 'Tell us how you get dressed and we do the rest.',
  'landing.closingBody':
    'Four steps, no sign-up. At the end you get the catalogue sorted by what genuinely works for you, and who to go to for it.',

  'fit.docTitle': 'Find My Fit',
  'fit.h1': 'Tell us how you get dressed today.',
  'fit.lead':
    'We ask about concrete barriers, not diagnoses. From that we work out how well each product in the directory fits you, and tell you where to get it.',
  'fit.noAsk1': 'Your diagnosis or medical condition',
  'fit.noAsk2': 'Your age or body measurements',
  'fit.noAsk3': 'Sign-up, email or password',
  'fit.progressNav': 'Form progress',
  'fit.stepOf': 'Step {current} of {total}',
  'fit.stepScreenReader': 'Step {index}: {title}',
  'fit.stepDone': ' (completed)',
  'fit.step1Title': 'Barriers when getting dressed',
  'fit.step1Short': 'Barriers',
  'fit.step2Title': 'Your dressing routine',
  'fit.step2Short': 'Routine',
  'fit.step3Title': 'Sensitivity and priorities',
  'fit.step3Short': 'Priorities',
  'fit.step4Title': 'Review before sending',
  'fit.step4Short': 'Review',
  'fit.needsLegend': 'What do you find hard when getting dressed?',
  'fit.needsHint':
    'Tick everything that applies. This is what weighs most in the recommendation.',
  'fit.needsError': 'Tick at least one barrier so we can recommend something.',
  'fit.dexterityLegend': 'How do you use your hands?',
  'fit.postureLegend': 'What position do you usually get dressed in?',
  'fit.assistanceLegend': 'Do you need help getting dressed?',
  'fit.sensoryLegend': 'Do seams, labels or textures bother you?',
  'fit.categoriesLegend': 'What are you looking for right now?',
  'fit.categoriesHint':
    'Optional. If you tick nothing, we show you the whole catalogue.',
  'fit.notesLegend': 'Anything else we should know?',
  'fit.notesLabel': 'Tell us in your own words',
  'fit.notesHint':
    'Optional. We use it to sharpen the explanation, not to calculate the score.',
  'fit.notesPlaceholder':
    'For example: I wear a splint on my right hand and tight cuffs will not go over it.',
  'fit.summaryTitle': "Here's what we're going to use",
  'fit.summaryHint': 'If something is off, go back to the matching step above.',
  'fit.summaryNeeds': 'Barriers ticked',
  'fit.summaryNoNeeds':
    'None. Go back to step 1: without this we cannot recommend anything.',
  'fit.summaryHands': 'Hands',
  'fit.summaryPosture': 'Posture',
  'fit.summaryHelp': 'Help',
  'fit.summarySensitivity': 'Sensitivity',
  'fit.summaryCategories': 'Categories',
  'fit.summaryAllCategories': 'All',
  'fit.submit': 'See my recommendations',
  'fit.submitting': 'Finding products…',
  'fit.privacy':
    'Your profile is stored in this tab only and is cleared when you close it.',

  'reco.docTitle': 'Your recommendations',
  'reco.h1': 'Your recommendations',
  'reco.lead':
    'Sorted by compatibility with your profile. The score is calculated by our engine using fixed rules; the AI only explains it.',
  'reco.noProfileTitle': 'We do not have your profile yet',
  'reco.noProfileBody':
    'We need to know how you get dressed before we can calculate how well each product fits. It is four steps and we ask for no medical details.',
  'reco.noProfileCta': 'Complete Find My Fit',
  'reco.profileTitle': 'The profile we are using',
  'reco.adjust': 'Adjust my profile',
  'reco.onlyGood': 'Show only strong fits',
  'reco.onlyGoodHint': '(60 or above)',
  'reco.loading': 'Calculating compatibility…',
  'reco.emptyTitle': 'Nothing clears the threshold',
  'reco.emptyFiltered':
    'Try removing the filter: some products are a partial fit and can be altered at a workshop.',
  'reco.emptyAll':
    'We found no products for this profile. Try ticking fewer preferred categories.',
  'reco.count.one': '{count} product found',
  'reco.count.other': '{count} products found',
  'reco.hidden.one': '{count} hidden by the filter',
  'reco.hidden.other': '{count} hidden by the filter',
  'reco.aiTitle': 'What the AI says',
  'reco.aiUnavailable':
    'The plain-language explanation is not available right now. Below is the evidence the score was calculated from.',
  'reco.evidenceTitle': 'Engine evidence',
  'reco.adaptations.one': '{count} possible alteration',
  'reco.adaptations.other': '{count} possible alterations',
  'reco.adaptationsTail': 'to close the gap.',
  'reco.viewDetail': 'View details',
  'reco.viewDetailScreenReader': ' for {name}',

  'where.title': 'Where to get it',
  'where.ships': 'Ships nationwide.',
  'where.inPerson': 'In-person service only. Worth calling before you go.',

  'provider.verified': 'Verified by ADAPTA',
  'provider.featured': 'Featured',
  'provider.shipsNationwide': 'Ships nationwide',
  'provider.inPersonOnly': 'In-person service only',
  'provider.listed.one': '{count} product listed',
  'provider.listed.other': '{count} products listed',

  'product.outOfStock': 'Out of stock',
  'product.conventional': 'Conventional garment',
  'product.moreNeeds': '+{count} more',
  'product.docTitleFallback': 'Product',
  'product.loading': 'Loading the product…',
  'product.notFound': 'We could not find this product.',
  'product.backToCatalog': 'Back to the catalogue',
  'product.specCategory': 'Category',
  'product.specClosure': 'Fastening',
  'product.specMaterials': 'Materials',
  'product.specSizes': 'Sizes',
  'product.solvesTitle': 'What it solves',
  'product.noBuiltIn':
    'This is a conventional product: it comes with no built-in adaptations. See below for what can be modified.',
  'product.limitationsTitle': 'What it does not solve',
  'product.compatibilityTitle': 'Your compatibility',
  'product.noProfileBody':
    'Complete Find My Fit and we will tell you how well this product fits the way you get dressed, and what could be altered.',
  'product.noProfileCta': 'Complete Find My Fit',
  'product.calculating': 'Calculating compatibility…',
  'product.compatibilityError':
    'We could not calculate compatibility right now. The product details above are complete.',
  'product.aiUnavailable':
    'The plain-language explanation is not available right now. The evidence alongside supports the score on its own.',
  'product.adaptationsTitle': 'Possible alterations',
  'product.adaptationsLead':
    'Changes a sewing workshop can make to this product. We always show what you gain and what it does not solve.',

  'adaptation.none':
    'This product already covers what you need: no alteration required.',
  'adaptation.benefit': 'What you gain',
  'adaptation.limitation': 'What is still unresolved',
  'adaptation.request': 'I am interested in this alteration',
  'adaptation.requestScreenReader': ' for {name}',
  'adaptation.requested':
    'Noted. We will let you know when a workshop is available for this alteration.',

  'catalog.docTitle': 'Catalogue',
  'catalog.h1': 'Catalogue',
  'catalog.leadStart':
    'Everything the listed businesses offer: clothing, footwear, prosthetics, orthotics, mobility and daily living aids, with their accessibility features in plain sight. To see it sorted by what works for you,',
  'catalog.leadLink': 'complete Find My Fit',
  'catalog.search': 'Search',
  'catalog.searchPlaceholder': 'Shirt, wheelchair, fastening…',
  'catalog.category': 'Category',
  'catalog.categoryAny': 'All',
  'catalog.need': 'Need it covers',
  'catalog.needAny': 'Any',
  'catalog.activeFilters': 'Active filters:',
  'catalog.removeFilter': 'Remove this filter',
  'catalog.clearAll': 'Clear all',
  'catalog.loading': 'Loading the catalogue…',
  'catalog.emptyTitle': 'No results',
  'catalog.emptyFiltered':
    'No product matches those filters. Try removing one.',
  'catalog.emptyAll': 'The catalogue is empty for now.',
  'catalog.emptyCta': 'Go to Find My Fit',
  'catalog.count.one': '{count} product',
  'catalog.count.other': '{count} products',
  'catalog.resultsHeading': 'Products found',

  'providers.docTitle': 'Listed businesses',
  'providers.h1': 'Listed businesses',
  'providers.lead':
    'Shops, workshops, orthopaedic suppliers and assistive equipment providers, in one place. Browsing is free: ADAPTA charges you nothing and sells you nothing, it tells you who to go to.',
  'providers.listCta': 'Run a business like this? List it here',
  'providers.search': 'Search',
  'providers.searchPlaceholder': 'Name, speciality or city',
  'providers.verifiedOnly': 'Verified only',
  'providers.kindLegend': 'Filter by type of business',
  'providers.kindLabel': 'Type of business',
  'providers.kindAll': 'All',
  'providers.loading': 'Loading the businesses…',
  'providers.emptyTitle': 'No business matches',
  'providers.emptyBody': 'Try removing a filter or searching for another word.',
  'providers.emptyCta': 'List a business',
  'providers.count.one': '{count} business',
  'providers.count.other': '{count} businesses',
  'providers.verifiedCount': '{count} verified',
  'providers.resultsHeading': 'Businesses found',
  'providers.bandTitle': 'Your customer is searching right here.',
  'providers.bandBody':
    'Listing puts your business in front of someone at the moment they describe the problem you solve. The basic listing is free.',
  'providers.bandCta': 'See the plans',

  'provider.docTitleFallback': 'Business',
  'provider.loading': 'Loading the business…',
  'provider.notFound': 'We could not find this business.',
  'provider.backToDirectory': 'Back to the directory',
  'provider.coverage': 'Coverage',
  'provider.registration': 'Listing',
  'provider.contact': 'Contact',
  'provider.listedTitle': 'What they have listed',
  'provider.productsLoading': 'Loading their products…',
  'provider.emptyTitle': 'No products listed yet',
  'provider.emptyBody':
    'The business is listed but has not uploaded its catalogue yet. You can contact them directly using the details above.',
  'provider.disclaimer':
    'ADAPTA does not sell these products and takes no commission on sales. The business pays for its directory listing; you are charged nothing. Verification confirms the business exists and offers what it says it offers: it is not a judgement of quality.',

  'business.docTitle': 'List your business',
  'business.eyebrow': 'For businesses',
  'business.h1': 'Your customers are looking for you. Today they cannot find you.',
  'business.lead':
    'Someone who needs adaptive clothing, a prosthesis or a wheelchair does not know you exist: the information is scattered across Facebook groups, word of mouth and search engines that return catalogues from another country. ADAPTA brings it together and puts you in front of that person exactly when they describe the problem you solve.',
  'business.ctaApply': 'Apply for a listing',
  'business.ctaDirectory': 'See the directory',
  'business.howTitle': 'How it works',
  'business.step1Title': 'You send the application',
  'business.step1Body':
    'Five fields. We ask for no documents and no bank details at this stage.',
  'business.step2Title': 'We verify you exist',
  'business.step2Body':
    'We check the business is active and offers what it says. We do not assess its quality.',
  'business.step3Title': 'You appear in the directory',
  'business.step3Body':
    'And in the recommendations of people whose profile matches what you sell.',
  'business.plansTitle': 'Listing plans',
  'business.plansNotice':
    'These prices are the project’s commercial proposal. No payment is processed during the hackathon: the listing is arranged by email after we receive the application.',
  'business.free': 'Free',
  'business.perMonth': '/ month',
  'business.mostChosen': 'Most popular',
  'business.planCta': 'Apply',
  'business.planCtaScreenReader': ' for the {name} plan',
  'business.plan1Pitch': 'To start showing up.',
  'business.plan1f1': 'Listing in the directory',
  'business.plan1f2': 'Up to 3 products listed',
  'business.plan1f3': 'Contact details visible',
  'business.plan2Pitch': 'To be found and trusted.',
  'business.plan2f1': 'Everything in the basic listing',
  'business.plan2f2': 'Verification badge',
  'business.plan2f3': 'Unlimited products',
  'business.plan2f4': 'Appears in recommendations',
  'business.plan3Pitch': 'To lead your category.',
  'business.plan3f1': 'Everything in the verified plan',
  'business.plan3f2': 'Priority position in the directory',
  'business.plan3f3': 'Extended listing with gallery',
  'business.formTitle': 'Apply for a listing',
  'business.sentTitle': 'We received your application',
  'business.sentBody':
    'We will write to {email} to verify the business and arrange the listing.',
  'business.sentDirectory': 'See the directory',
  'business.sentAnother': 'List another business',
  'business.fieldName': 'Business name',
  'business.fieldKind': 'Type of business',
  'business.fieldLocation': 'Location',
  'business.fieldLocationPlaceholder': 'City, province',
  'business.fieldEmail': 'Contact email',
  'business.fieldEmailHint': 'We only use it to reply about the listing.',
  'business.fieldDescription': 'What you offer',
  'business.fieldDescriptionHint':
    'Tell us what products or services you have and what problem they solve.',
  'business.fieldDescriptionPlaceholder':
    'We alter conventional garments: swapping fastenings for magnets, opening side seams and adjusting them for dressing while seated.',
  'business.errName': 'Please enter the business name.',
  'business.errLocation': 'Tell us where you operate.',
  'business.errEmail': 'We need an email to reply to you.',
  'business.errEmailFormat': 'That email does not look valid. Please check it.',
  'business.errDescription': 'Tell us a bit more: at least 20 characters.',
  'business.submit': 'Send application',
  'business.submitting': 'Sending…',
  'business.sendError': 'We could not send your application.',
  'business.noCharge': 'Nothing is charged at this step.',

  'notFound.docTitle': 'Page not found',
  'notFound.code': 'Error 404',
  'notFound.title': 'This page does not exist',
  'notFound.body':
    'The link may be misspelled, or the product may no longer be in the catalogue.',
  'notFound.home': 'Back to home',
  'notFound.catalog': 'Browse the catalogue',

  'chat.open': 'Ask',
  'chat.close': 'Close help',
  'chat.dialogLabel': 'ADAPTA assistant',
  'chat.headerSubtitle': 'Fastenings, posture and alterations',
  'chat.greeting':
    'Hello! I can answer questions about fastenings, ways of getting dressed and alterations. How can I help?',
  'chat.you': 'You: ',
  'chat.assistant': 'Assistant: ',
  'chat.typing': 'Typing…',
  'chat.inputLabel': 'Type your question',
  'chat.placeholder': 'Are magnets safe?',
  'chat.send': 'Send',
  'chat.sendError': 'We could not send your message.',
  'chat.disclaimer': 'Guidance only. Not a substitute for medical advice.',

  'product.illustrationAlt':
    'Illustration of the product category',

  // ------------------------------------------------------------------ hero
  'hero.carousel': 'ADAPTA showcase',
  'hero.slide': 'Image {index} of {total}',
  'hero.goTo': 'Go to image {index} of {total}',
  'hero.announce': 'Image {index} of {total}. {alt}',
  'hero.photo1Alt':
    'A woman moves down a fashion runway in a manual wheelchair. She wears a crown of red flowers, a sleeveless blue top, a long yellow coat and a purple and blue patterned skirt draped over her legs. The audience watches from the dark.',
  'hero.photo2Alt':
    'A man sitting on a wooden bench rests his arm on his knee and looks at the camera. He uses a carbon-fibre leg prosthesis with a running shoe. Dark studio background.',
  'hero.photo3Alt':
    'A woman sitting in a changing room adjusts one of her two carbon-fibre leg prostheses. Behind her, a shelf with footwear and a sports bag.',
}
