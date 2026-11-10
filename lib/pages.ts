import type { Locale } from "./i18n";
import { img, type Img } from "./images";

/**
 * The inner pages: من نحن, the five programmes, MCD and JCD Club.
 *
 * The homepage shows each of these as a short teaser (lib/sections.ts); the
 * full text lives here. The Arabic is JCD's own copy from the website brief,
 * with the letterforms normalised (it arrived pasted out of a PDF in Persian
 * forms — ھ, ی, ۱) and the spelling of the hamza tidied (إجتماعي → اجتماعي).
 * The English is a translation of it.
 */

export type Block =
  | { kind: "paragraphs"; heading?: string; paragraphs: string[] }
  | { kind: "list"; heading: string; intro?: string; items: string[]; numbered?: boolean }
  | { kind: "place"; heading: string; lines: string[] }
  | { kind: "team"; heading: string; groups: { title: string; image: Img }[] }
  | {
      kind: "links";
      heading: string;
      items: { title: string; body: string; href?: string }[];
    };

export type Action = { label: string; href: string };

export type InnerPage = {
  slug: string;
  /** Small line above the title, e.g. what an acronym stands for. */
  eyebrow?: string;
  title: string;
  /** A slogan, set large under the title. */
  tagline?: string;
  /** One sentence: the homepage card's text and the page's meta description. */
  summary: string;
  image: Img;
  blocks: Block[];
  cta?: { heading: string; body?: string; actions: Action[] };
};

/* ------------------------------------------------------------------ shared */

const salloumeCentre = {
  ar: [
    "مركز الطوباوي الأب بشارة أبو مراد المخلّصي للمتابعة والعلاج الخارجي",
    "بيروت – برج حمّود، باتجاه الصالومي",
  ],
  en: [
    "Blessed Father Bechara Abou Mrad Centre for follow-up and outpatient care",
    "Beirut – Bourj Hammoud, towards Salloumi",
  ],
};

const helpCta = {
  ar: {
    heading: "هل تحتاج إلى مساعدة؟",
    body: "خط المساعدة متاح 24/7، والاستشارة مجانية وسرية.",
    actions: [{ label: "تواصل معنا", href: "/#contact" }],
  },
  en: {
    heading: "Do you need help?",
    body: "Our helpline is open 24/7, and every consultation is free and confidential.",
    actions: [{ label: "Contact us", href: "/#contact" }],
  },
};

/* ------------------------------------------------------------------- about */

const ABOUT: Record<Locale, InnerPage> = {
  ar: {
    slug: "about",
    eyebrow: "الشبيبة لمكافحة المخدّرات – JCD",
    title: "من نحن",
    tagline: "إيمانًا منّا بأن التعافي ممكن، وأن طلب المساعدة هو الخطوة الأولى نحو التغيير.",
    summary:
      "جمعية لبنانية لا تبغي الربح، متخصصة بمكافحة الإدمان وتقديم خدمات إعادة التأهيل والتوعية والتدريب ودعم العائلات.",
    image: img("about", "فريق الجمعية"),
    blocks: [
      {
        kind: "paragraphs",
        paragraphs: [
          "الشبيبة لمكافحة المخدّرات JCD جمعيّة لا تبغي الربح، تأسّست في 4 شباط 1994 بموجب علم وخبر رقم 75/أد وتعديله رقم 1670. تعمل على مكافحة الإدمان من خلال نشر التوعية، وتأمين التدريب لناشطين في المجتمع المدني، واستقبال المدمنين وذويهم وتقديم المشورة لهم دون أي تمييز ومن كافة الدول، وإعادة تأهيل الشباب المدمن في مراكز الجمعية للتأهيل الداخلي أو الخارجي، بالإضافة إلى متابعة المدمن المعافى لتمكينه من الاندماج مجدّدًا في المجتمع.",
        ],
      },
      {
        kind: "list",
        heading: "أهدافنا",
        numbered: true,
        items: [
          "الحدّ من تفاقم مشكلة الإدمان وانعكاساتها على المدمن، من خلال استقباله وذويه وإعطائهم المعلومات وتوجيههم.",
          "رفع نسبة الوعي في المجتمع حول مخاطر الإدمان على اختلاف أنواعه، إضافةً إلى السيدا والالتهابات المنقولة جنسيًا.",
          "تمكين مختلف الفئات في المجتمع من التعامل مع مسبّبات الإدمان، والوقاية من السيدا والالتهابات المنقولة جنسيًا.",
          "إعادة تأهيل المدمنين وتمكينهم من الانخراط مجدّدًا في مجتمعهم.",
          "التخفيف من إمكانية الانتكاسة، من خلال متابعة المدمنين السابقين للحؤول دون العودة إلى عالم الإدمان.",
          "تفعيل دور العائلة والمحيط في احتضان الشباب ومواجهة الآفات الاجتماعية.",
          "المساهمة في تغيير نظرة المجتمع إلى المدمن، كونه إنسانًا مريضًا وليس مجرمًا.",
          "دعم تطوير القوانين المتعلّقة بالآفات الاجتماعية، وخاصّة موضوع المخدّرات والتدخين.",
          "التشبيك مع الجمعيات والمنظّمات المحلية والدولية والمؤسّسات العامة، لتطوير مختلف جوانب إشكالية الإدمان.",
        ],
      },
      {
        kind: "paragraphs",
        heading: "تاريخنا",
        paragraphs: [
          "منذ أكثر من 30 سنة، تهدف الجمعية إلى التخفيف من مخاطر الإدمان من خلال التوعية والتدريب، وتقديم المشورة، وإعادة التأهيل الداخلي والعلاج الخارجي للمدمنين والمتعاطين، والمتابعة النفسية والعائلية لذويهم، دون أي تمييز ومن كافة دول العالم، بالإضافة إلى متابعة المدمن المعافى لتمكينه من الاندماج مجدّدًا في المجتمع.",
        ],
      },
      {
        kind: "team",
        heading: "فريقنا",
        groups: [
          // JCD's own photographs go here; until then the board slot shows a
          // plain panel rather than strangers presented as the board.
          { title: "الهيئة الإدارية", image: null },
          { title: "فريق العمل", image: img("team", "فريق العمل") },
        ],
      },
    ],
    cta: {
      heading: "كن جزءًا من رسالتنا",
      body: "تطوّع معنا، أو ادعم برامجنا بتبرّعك.",
      actions: [
        { label: "تبرَّع الآن", href: "/#donate" },
        { label: "تطوّع معنا", href: "/volunteer-readiness" },
      ],
    },
  },
  en: {
    slug: "about",
    eyebrow: "Youth Against Drugs – JCD",
    title: "About us",
    tagline: "Because we believe recovery is possible, and that asking for help is the first step towards change.",
    summary:
      "A Lebanese non-profit specialising in fighting addiction, and in rehabilitation, awareness, training and family support.",
    image: img("about", "The JCD team"),
    blocks: [
      {
        kind: "paragraphs",
        paragraphs: [
          "Youth Against Drugs (JCD) is a non-profit association founded on 4 February 1994 under notification no. 75/AD, amended by no. 1670. It fights addiction by raising awareness, training civil-society activists, receiving and counselling people with addiction and their families without any discrimination and from every country, and rehabilitating young people in its inpatient and outpatient centres — then following them after recovery so they can rejoin society.",
        ],
      },
      {
        kind: "list",
        heading: "Our goals",
        numbered: true,
        items: [
          "Limit the growth of addiction and its effects on the person, by receiving them and their families, informing them and guiding them.",
          "Raise awareness in society of the dangers of every kind of addiction, as well as of AIDS and sexually transmitted infections.",
          "Equip every part of society to deal with the causes of addiction, and to prevent AIDS and sexually transmitted infections.",
          "Rehabilitate people with addiction and enable them to rejoin their community.",
          "Reduce the chance of relapse by following former users, so they do not return to addiction.",
          "Strengthen the role of family and community in embracing young people and facing social ills.",
          "Help change how society sees a person with addiction: as someone who is ill, not a criminal.",
          "Support better laws on social ills, drugs and smoking in particular.",
          "Network with local and international associations and organisations, and with public institutions, to address every side of the problem of addiction.",
        ],
      },
      {
        kind: "paragraphs",
        heading: "Our history",
        paragraphs: [
          "For more than 30 years, JCD has worked to reduce the harm of addiction through awareness and training, counselling, inpatient rehabilitation and outpatient treatment, and psychological and family support for relatives — without discrimination and for people from every country — and by following people after recovery so they can rejoin society.",
        ],
      },
      {
        kind: "team",
        heading: "Our team",
        groups: [
          { title: "Board of directors", image: null },
          { title: "Our staff", image: img("team", "Our staff") },
        ],
      },
    ],
    cta: {
      heading: "Be part of our mission",
      body: "Volunteer with us, or support our programmes with a donation.",
      actions: [
        { label: "Donate now", href: "/#donate" },
        { label: "Volunteer with us", href: "/volunteer-readiness" },
      ],
    },
  },
};

/* -------------------------------------------------------------- programmes */

const PROGRAMMES: Record<Locale, InnerPage[]> = {
  ar: [
    {
      slug: "reception",
      title: "الاستقبال",
      summary: "تحضير وتحفيز المدمن وتعزيز قراره للتأقلم داخل مركز إعادة التأهيل.",
      image: img("programme-3", "الاستقبال"),
      blocks: [
        {
          kind: "list",
          heading: "أهدافه",
          items: [
            "تعزيز المعرفة عند المدمن وأهله حول الإدمان وأساليب العلاج والتأهيل.",
            "دعم المدمن وتوجيهه إلى الخدمات المناسبة في الجمعية، أو إحالته إلى جمعيات أخرى.",
            "دعم عائلة المدمن المستفيد من برنامج إعادة التأهيل على المستويين النفسي والاجتماعي.",
            "متابعة المدمن في تحضيره للتأقلم مع برنامج إعادة التأهيل، من خلال تحفيزه وتعزيز قراره.",
          ],
        },
        {
          kind: "list",
          heading: "خدماته",
          items: [
            "دراسة الحالة الصحية والاجتماعية للمدمن وعائلته، وتوجيهه إلى البرنامج المناسب في الجمعية.",
            "خدمة المتابعة أثناء العلاج الجسدي (تنسيق وزيارات إلى المستشفى خلال فترة الفطام).",
            "خدمة تقديم المشورة والمعلومات عبر الاستقبال أو الخط الساخن.",
            "خدمة المشورة والفحص الطوعي لفيروس نقص المناعة البشري (VCT).",
            "خدمة الإحالة إلى برنامج العلاج الخارجي أو إلى مؤسسات أخرى.",
            "إعداد إحصاءات تساعد على دراسة أرض الواقع، من خلال ملفات مكتب الاستقبال.",
          ],
        },
      ],
    },
    {
      slug: "inpatient",
      title: "إعادة التأهيل الداخلي",
      summary:
        "خوض حياة خالية من المخدرات وتعزيز القدرة على الاندماج في المجتمع، مع تقديم الدعم النفسي والعائلي للأهل والعائلة.",
      image: img("programme-1", "إعادة التأهيل الداخلي"),
      blocks: [
        {
          kind: "paragraphs",
          paragraphs: [
            "يُنفَّذ في مركز إعادة التأهيل، ومدّته 12 شهرًا قابلة للتمديد بحسب تجاوب المريض مع البرنامج.",
          ],
        },
        {
          kind: "place",
          heading: "المركز",
          lines: ["مركز القديسة تريز الطفل يسوع", "جورة الترمس، فتوح كسروان"],
        },
        {
          kind: "list",
          heading: "خدماته",
          items: [
            "متابعة نفسية فردية للمدمن.",
            "متابعة نفسية عائلية: تتضمّن لقاءات فردية أو جماعية للأهل مع المعالِجة النفسية، بهدف التعبير عن المشاعر والأفكار، وتساعد على تحضيرهم للقاء أبنائهم والعمل على ترميم العلاقة.",
            "تدخّل اجتماعي فردي وعائلي: بهدف تحضير مشروع الحياة مع المريض، بالإضافة إلى زيارات منزلية ولقاءات جماعية مع المساعدة الاجتماعية، بهدف التعرّف أكثر إلى الواقع العائلي للمريض.",
            "لقاءات يومية تأهيلية مع المربّين، رياضة، لقاءات روحية، تعبير مسرحي، موسيقى، رسم، أشغال يدوية، مطالعة، مناقشة أفلام، دروس في اللغة الإنجليزية ودورات في الكمبيوتر (مع شهادات)، مداخلات اجتماعية، فترات عمل زراعي وبناء، وأنشطة ترفيهية منوّعة (مخيّم، سينما، مسرح...).",
          ],
        },
      ],
    },
    {
      slug: "aftercare",
      title: "المتابعة بعد التأهيل",
      summary: "تأمين الدعم لتلافي حدوث أية انتكاسة وتسهيل الاندماج في المجتمع.",
      image: img("programme-4", "المتابعة بعد التأهيل"),
      blocks: [
        {
          kind: "paragraphs",
          paragraphs: [
            "يستهدف هذا البرنامج المدمنين السابقين الذين أتمّوا مرحلتَي إعادة التأهيل والانخراط.",
          ],
        },
        {
          kind: "list",
          heading: "أهدافه",
          items: [
            "تلافي حدوث أية انتكاسة بعد إنهاء الفترة التأهيلية.",
            "تسهيل الاندماج والتأقلم في المجتمع (العلاقة بالأهل والرفاق، بناء علاقات فعّالة وسليمة، التأقلم في العمل...).",
            "إثبات الذات بعد إتمام برنامج إعادة التأهيل.",
            "تعزيز دور الأهل والعائلة.",
          ],
        },
        {
          kind: "list",
          heading: "خدماته",
          items: [
            "متابعة نفسية فردية مع أخصّائي نفسي.",
            "تدخّل اجتماعي فردي وعائلي مع أخصّائية نفسية-اجتماعية، لمواكبة المستفيد في مرحلة تطبيق مشروع الحياة الخاص به (متابعة دراسة، عمل...).",
            "متابعة مكتسبات فترة التأهيل.",
            "متابعة نفسية عائلية للأهل، فردية وجماعية، مع معالِجة نفسية، لمواكبة الأهل وتسهيل بناء علاقات فعّالة بينهم وبين ابنهم.",
            "متابعة نفسية جماعية للمستفيدين من الشباب (Dynamique de groupe).",
            "علاج بالفنون (جلسات مسرح تعبيري، أشغال يدوية...).",
            "تمكين وتطوير المهارات الشخصية من خلال جلسات مع أخصّائي تدريب على الحياة (Coaching).",
            "تدريب على مهارات عملية (كمبيوتر، إنترنت، لغات...).",
            "لقاءات توعوية وتثقيفية في مختلف المواضيع، بالإضافة إلى مكتبة ونادي سينما ثقافي.",
            "نشاطات ترفيهية داخلية وخارجية، ورياضة.",
            "نادي قدامى يجمع المتخرّجين لتبادل الأفكار وإقامة الأنشطة التثقيفية والاجتماعية والترفيهية والرياضية.",
          ],
        },
        {
          kind: "place",
          heading: "المركز",
          lines: [...salloumeCentre.ar, "يفتح أبوابه طيلة أيام الأسبوع."],
        },
      ],
    },
    {
      slug: "outpatient",
      title: "العلاج الخارجي",
      summary:
        "معالجة المتعاطين والمدمنين على أنواع أخرى كالتدخين، الميسر، مواقع التواصل الاجتماعي وغيرها.",
      image: img("programme-2", "العلاج الخارجي"),
      blocks: [
        {
          kind: "list",
          heading: "لمن هذا البرنامج؟",
          intro: "يُنفَّذ خارج مركز إعادة التأهيل، ويستهدف الفئات التالية:",
          items: [
            "الشباب المدمنون المُحالون من برنامج الاستقبال بحسب دراسة الحالة.",
            "الشباب المدمنون على أنواع أخرى من الإدمان، كالإدمان على التدخين، على الإنترنت، على الميسر، على المأكولات...",
          ],
        },
        {
          kind: "list",
          heading: "خدماته",
          items: [
            "متابعة نفسية فردية للمستفيدين مع أخصّائي نفسي.",
            "متابعة نفسية عائلية للأهل، فردية وجماعية، مع معالِجة نفسية.",
            "متابعة نفسية جماعية للمستفيدين (Dynamique de groupe).",
            "علاج بالفنون (جلسات مسرح تعبيري، أشغال يدوية...).",
            "تمكين وتطوير المهارات الشخصية من خلال جلسات مع أخصّائي تدريب على الحياة (Coaching).",
            "تدريب على مهارات عملية (كمبيوتر، إنترنت، لغات...).",
            "لقاءات توعوية وتثقيفية في مختلف المواضيع، بالإضافة إلى مكتبة ونادي سينما ثقافي.",
            "نشاطات ترفيهية داخلية وخارجية، ورياضة.",
          ],
        },
        { kind: "place", heading: "المركز", lines: salloumeCentre.ar },
      ],
    },
    {
      slug: "awareness",
      title: "التوعية والتدريب",
      summary:
        "القيام بمشاريع توعوية وتنظيم ورش عمل تدريبية للشباب والأهل وكافة المؤسسات.",
      image: img("programme-5", "التوعية والتدريب"),
      blocks: [
        {
          kind: "list",
          heading: "أهدافه",
          items: [
            "نشر الوعي بين مختلف شرائح المجتمع حول مضار المخدّرات والكحول والتدخين، والالتهابات المنقولة جنسيًا والسيدا.",
            "تعزيز دور الأهل والمؤسسات التربوية ومختلف فئات المجتمع للحدّ من انتشار آفة المخدرات، من خلال بناء قدراتهم وتعزيز معرفتهم بالموضوع.",
            "خلق نواة لدعم القضية، من خلال حثّ المجتمع المدني والجهات الرسمية على المساهمة في نشر الوعي في المجتمع حول آفة المخدرات.",
          ],
        },
        {
          kind: "list",
          heading: "نشاطاته",
          items: [
            "القيام بمشاريع توعوية في مختلف المناطق اللبنانية، بالتعاون مع الوزارات والبلديات والجمعيات والمنظمات والأندية.",
            "تنظيم محاضرات وندوات ولقاءات للشباب والأهل في المدارس والجامعات والأندية والرعايا...",
            "تنظيم ورش عمل تدريبية للشباب والأهل والأساتذة وإدارات المدارس والجامعات.",
            "تنظيم ورش عمل تدريبية للمنظمات والجمعيات والأندية والوزارات.",
            "التواصل والتنسيق مع جمعيات محلية ودولية لتطوير أساليب التوعية وأدواتها.",
            "تأسيس نواة من فئات مختلفة لنشر الوعي حول آفة المخدرات.",
          ],
        },
        {
          kind: "links",
          heading: "أنشأت الجمعية لهذه الغاية",
          items: [
            {
              title: "أندية الشبيبة لمكافحة المخدّرات – JCD Clubs",
              body: "في مختلف المناطق اللبنانية، تستقطب متطوّعين وتدرّبهم ليصبحوا مؤهّلين للمشاركة في أنشطة التوعية والتدريب.",
              href: "/jcd-club",
            },
            {
              title: "لجنة أمّهات ضدّ المخدّرات – MCD",
              body: "تستقطب الأمهات وتدرّبهنّ لنشر الوعي حول أهمية دور الأم في فهم مشكلة الإدمان ومواجهتها، والسعي إلى تغيير نظرة المجتمع إلى الشخص المدمن، ودعم برنامج إعادة التأهيل وكلفة علاج المدمن في المستشفى.",
              href: "/mcd",
            },
            {
              title: "أصدقاء الشبيبة لمكافحة المخدّرات – JCD Friends",
              body: "الداعمون والمهتمّون بالقضية من مختلف المناطق، بهدف خلق شبكة تضامن إنساني لحماية المجتمع من آفة الإدمان، من خلال نشر المعرفة والتوجيه ودعم الجمعية في تطوير برامجها.",
            },
          ],
        },
      ],
    },
  ],
  en: [
    {
      slug: "reception",
      title: "Reception",
      summary:
        "Preparing and motivating the person, and strengthening their decision, so they can settle into the rehabilitation centre.",
      image: img("programme-3", "Reception"),
      blocks: [
        {
          kind: "list",
          heading: "Its goals",
          items: [
            "Build the knowledge of the person and their family about addiction and the ways it is treated.",
            "Support the person and guide them to the right service at JCD, or refer them to another association.",
            "Support, psychologically and socially, the family of a person in the rehabilitation programme.",
            "Accompany the person as they prepare for the rehabilitation programme, by motivating them and strengthening their decision.",
          ],
        },
        {
          kind: "list",
          heading: "Its services",
          items: [
            "A health and social assessment of the person and their family, and referral to the right JCD programme.",
            "Follow-up during physical treatment (coordination and hospital visits during withdrawal).",
            "Counselling and information at reception or on the hotline.",
            "Voluntary counselling and testing for HIV (VCT).",
            "Referral to the outpatient programme or to other institutions.",
            "Statistics, drawn from the reception office's files, that help study the situation on the ground.",
          ],
        },
      ],
    },
    {
      slug: "inpatient",
      title: "Inpatient rehabilitation",
      summary:
        "Living a drug-free life and building the ability to rejoin society, with psychological and family support for relatives.",
      image: img("programme-1", "Inpatient rehabilitation"),
      blocks: [
        {
          kind: "paragraphs",
          paragraphs: [
            "Run at the rehabilitation centre over 12 months, which can be extended depending on how the patient responds to the programme.",
          ],
        },
        {
          kind: "place",
          heading: "The centre",
          lines: ["Saint Thérèse of the Child Jesus Centre", "Jouret el Termos, Ftouh Keserwan"],
        },
        {
          kind: "list",
          heading: "Its services",
          items: [
            "Individual psychological follow-up.",
            "Family psychological follow-up: individual or group meetings for parents with the psychotherapist, to express their feelings and thoughts, prepare to see their children again and work on repairing the relationship.",
            "Individual and family social work: preparing a life plan with the patient, with home visits and group meetings with the social worker to understand the patient's family situation better.",
            "Daily rehabilitation sessions with educators, sport, spiritual meetings, drama, music, drawing, handicrafts, reading, film discussions, English lessons and computer courses (with certificates), social talks, farming and building work, and varied recreation (camping, cinema, theatre…).",
          ],
        },
      ],
    },
    {
      slug: "aftercare",
      title: "Aftercare",
      summary: "Support that prevents relapse and makes it easier to rejoin society.",
      image: img("programme-4", "Aftercare"),
      blocks: [
        {
          kind: "paragraphs",
          paragraphs: [
            "This programme is for former users who have completed both rehabilitation and reintegration.",
          ],
        },
        {
          kind: "list",
          heading: "Its goals",
          items: [
            "Prevent relapse once the rehabilitation period is over.",
            "Make it easier to rejoin and adapt to society (relationships with family and friends, building healthy relationships, adapting to work…).",
            "Help the person find their footing after completing rehabilitation.",
            "Strengthen the role of parents and family.",
          ],
        },
        {
          kind: "list",
          heading: "Its services",
          items: [
            "Individual psychological follow-up with a psychologist.",
            "Individual and family social work with a psychosocial worker, accompanying the person as they put their life plan into practice (studies, work…).",
            "Following up on what was gained during rehabilitation.",
            "Family psychological follow-up for parents, individually and in groups, with a psychotherapist, to help build healthy relationships between parents and their son.",
            "Group psychological follow-up for young beneficiaries (group dynamics).",
            "Art therapy (expressive drama, handicrafts…).",
            "Personal skills development through sessions with a life coach.",
            "Practical skills training (computers, internet, languages…).",
            "Awareness and educational meetings on many topics, plus a library and a cultural film club.",
            "Indoor and outdoor recreation, and sport.",
            "An alumni club that brings graduates together to share ideas and run cultural, social, recreational and sports activities.",
          ],
        },
        {
          kind: "place",
          heading: "The centre",
          lines: [...salloumeCentre.en, "Open every day of the week."],
        },
      ],
    },
    {
      slug: "outpatient",
      title: "Outpatient treatment",
      summary:
        "Treatment for users and for other addictions — smoking, gambling, social media and more.",
      image: img("programme-2", "Outpatient treatment"),
      blocks: [
        {
          kind: "list",
          heading: "Who is it for?",
          intro: "It runs outside the rehabilitation centre and is for:",
          items: [
            "Young people referred by the reception programme after their assessment.",
            "Young people with other addictions — smoking, the internet, gambling, food…",
          ],
        },
        {
          kind: "list",
          heading: "Its services",
          items: [
            "Individual psychological follow-up with a psychologist.",
            "Family psychological follow-up for parents, individually and in groups, with a psychotherapist.",
            "Group psychological follow-up (group dynamics).",
            "Art therapy (expressive drama, handicrafts…).",
            "Personal skills development through sessions with a life coach.",
            "Practical skills training (computers, internet, languages…).",
            "Awareness and educational meetings on many topics, plus a library and a cultural film club.",
            "Indoor and outdoor recreation, and sport.",
          ],
        },
        { kind: "place", heading: "The centre", lines: salloumeCentre.en },
      ],
    },
    {
      slug: "awareness",
      title: "Awareness and training",
      summary:
        "Awareness projects, and training workshops for young people, parents and institutions of every kind.",
      image: img("programme-5", "Awareness and training"),
      blocks: [
        {
          kind: "list",
          heading: "Its goals",
          items: [
            "Raise awareness across society of the harm of drugs, alcohol and smoking, and of sexually transmitted infections and AIDS.",
            "Strengthen parents, schools and every part of society in limiting the spread of drugs, by building their capacity and knowledge.",
            "Build a core of support for the cause, by encouraging civil society and official bodies to help raise awareness about drugs.",
          ],
        },
        {
          kind: "list",
          heading: "Its activities",
          items: [
            "Awareness projects across Lebanon, with ministries, municipalities, associations, organisations and clubs.",
            "Lectures, seminars and meetings for young people and parents in schools, universities, clubs and parishes…",
            "Training workshops for young people, parents, teachers, and school and university administrations.",
            "Training workshops for organisations, associations, clubs and ministries.",
            "Working with local and international associations to develop awareness methods and tools.",
            "Building a core of people from every background to raise awareness about drugs.",
          ],
        },
        {
          kind: "links",
          heading: "To that end, JCD founded",
          items: [
            {
              title: "JCD Clubs",
              body: "Across Lebanon, the clubs recruit volunteers and train them to take part in awareness and training work.",
              href: "/jcd-club",
            },
            {
              title: "Mothers Against Drugs – MCD",
              body: "A committee that recruits and trains mothers to raise awareness of a mother's role in understanding and facing addiction, to change how society sees people with addiction, and to support the rehabilitation programme and the cost of hospital treatment.",
              href: "/mcd",
            },
            {
              title: "JCD Friends",
              body: "Supporters of the cause from every region, building a network of solidarity that protects society from addiction by sharing knowledge and guidance and helping JCD develop its programmes.",
            },
          ],
        },
      ],
    },
  ],
};

/* --------------------------------------------------------------------- MCD */

const MCD: Record<Locale, InnerPage> = {
  ar: {
    slug: "mcd",
    eyebrow: "لجنة أمّهات ضدّ المخدّرات",
    title: "MCD",
    tagline: "من قلب الأمّ، بتبلّش الوقاية",
    summary:
      "لجنة أمّهات ضدّ المخدّرات: تعزيز دور الأم في الوقاية من المخدرات ونشر الوعي داخل الأسرة والمجتمع.",
    image: img("mcd", "لجنة أمّهات ضدّ المخدّرات"),
    blocks: [
      {
        kind: "list",
        heading: "أهدافه",
        items: [
          "تعزيز دور الأم في الوقاية من المخدرات، ونشر الوعي داخل الأسرة والمجتمع.",
          "تمكين الأمهات من فهم مشكلة الإدمان، والتعرّف إلى المؤشرات التحذيرية، والتعامل مع الأبناء بطريقة واعية ومسؤولة.",
          "تشجيع الحوار الأسري وكسر حاجز الخوف والوصمة الاجتماعية، وتعزيز ثقافة طلب المساعدة.",
          "تعزيز دور الأم لتصبح ناشطة في مجال التوعية والوقاية.",
          "تقديم المشورة والتوجيه للأمهات اللواتي يواجهن صعوبة في التعامل مع مشكلة الإدمان لدى أبنائهنّ، ومساعدتهنّ على اتخاذ الخطوات المناسبة لإدخال أبنائهنّ إلى برامج العلاج وإعادة التأهيل، بالتنسيق مع الجهات المختصة.",
          "بناء شبكة تعاون بين النساء والجمعيات والمؤسسات التربوية والصحية والاجتماعية لمكافحة المخدرات.",
        ],
      },
      {
        kind: "list",
        heading: "نشاطاته",
        items: [
          "تنظيم لقاءات توعوية وحوارية بين الأمهات لتبادل الخبرات والمعرفة حول الوقاية من المخدرات والتعامل مع الإدمان.",
          "إقامة ورش عمل تدريبية لتمكين الأم من مهارات التوعية والتواصل مع الأبناء والتعامل مع المؤشرات التحذيرية.",
          "تنفيذ حملات توعية ميدانية في المناطق اللبنانية، بالتعاون مع المدارس والبلديات والجمعيات والمؤسسات المختلفة.",
          "إعداد ونشر مواد توعوية، وفيديوهات قصيرة، وشهادات وتجارب إنسانية عبر وسائل التواصل الاجتماعي.",
          "تنظيم لقاءات توجيهية للأمهات والعائلات، بالتعاون مع اختصاصيين نفسيين واجتماعيين.",
          "استقطاب الأمهات المتطوعات وتدريبهنّ لقيادة مبادرات توعوية في مناطقهنّ.",
          "التعاون مع الجمعيات النسائية والمؤسسات المحلية والدولية لتطوير البرامج وتوسيع أثرها في المجتمع.",
        ],
      },
    ],
    cta: {
      heading: "وعي الأم قوّة، كوني جزء من الحلّ.",
      actions: [{ label: "استمارة التطوّع – أمهات ضدّ المخدرات", href: "/mcd/volunteer" }],
    },
  },
  en: {
    slug: "mcd",
    eyebrow: "Mothers Against Drugs",
    title: "MCD",
    tagline: "Prevention begins in a mother's heart",
    summary:
      "Mothers Against Drugs: strengthening a mother's role in preventing drug use, and raising awareness in the family and in society.",
    image: img("mcd", "Mothers Against Drugs"),
    blocks: [
      {
        kind: "list",
        heading: "Its goals",
        items: [
          "Strengthen a mother's role in preventing drug use, and raise awareness in the family and in society.",
          "Help mothers understand addiction, recognise the warning signs, and deal with their children in an informed, responsible way.",
          "Encourage family dialogue, break the barrier of fear and stigma, and make asking for help normal.",
          "Help mothers become active in awareness and prevention.",
          "Counsel and guide mothers struggling with a child's addiction, and help them take the right steps to bring their child into treatment and rehabilitation, together with the relevant services.",
          "Build a network between women, associations, and educational, health and social institutions against drugs.",
        ],
      },
      {
        kind: "list",
        heading: "Its activities",
        items: [
          "Awareness and discussion meetings where mothers share experience and knowledge about prevention and addiction.",
          "Training workshops that give mothers the skills to raise awareness, talk with their children and respond to warning signs.",
          "Field awareness campaigns across Lebanon, with schools, municipalities, associations and other institutions.",
          "Awareness material, short videos, and personal stories and testimonies shared on social media.",
          "Guidance meetings for mothers and families, with psychologists and social workers.",
          "Recruiting and training volunteer mothers to lead awareness initiatives where they live.",
          "Working with women's associations and local and international institutions to develop the programmes and widen their reach.",
        ],
      },
    ],
    cta: {
      heading: "A mother's awareness is strength — be part of the solution.",
      actions: [{ label: "Volunteer form – Mothers Against Drugs", href: "/mcd/volunteer" }],
    },
  },
};

/* ---------------------------------------------------------------- JCD Club */

const CLUB: Record<Locale, InnerPage> = {
  ar: {
    slug: "jcd-club",
    eyebrow: "أندية الشبيبة لمكافحة المخدّرات",
    title: "JCD Club",
    tagline: "عندك طاقة؟ خلّي إلها تأثير!",
    summary:
      "نواة شبابية من المتطوعين، ابتداءً من عمر 15 سنة، تنشر الوعي حول مخاطر المخدرات والكحول والتدخين.",
    image: img("training-2", "شباب متطوعون في نشاط جماعي"),
    blocks: [
      {
        kind: "list",
        heading: "أهدافه",
        items: [
          "إنشاء نواة شبابية من المتطوعين ابتداءً من عمر 15 سنة، بهدف نشر الوعي حول مخاطر المخدرات والكحول والتدخين والسيدا والأمراض المنقولة جنسيًا.",
          "تعزيز دور الشباب في الوقاية والتوعية، وتنمية روح المسؤولية والمشاركة المجتمعية لديهم.",
          "تأهيل الشباب ليكونوا سفراء للتوعية بين أقرانهم وفي محيطهم الاجتماعي.",
          "استقطاب المتطوعين الراغبين في تقديم خدماتهم للمركز، وتوجيههم بحسب قدراتهم واهتماماتهم واحتياجات المركز.",
        ],
      },
      {
        kind: "list",
        heading: "نشاطاته",
        items: [
          "تنظيم جلسات توعية وتدريب للشباب حول الوقاية من المخدرات والسلوكيات الخطرة والصحة العامة.",
          "تنفيذ حملات توعوية في المؤسسات التربوية والرعايا والبلديات، والمشاركة في الأنشطة والمناسبات ذات الصلة.",
          "تنظيم ورش عمل لتنمية مهارات التواصل والعمل الجماعي والقيادة لدى الشباب، وتشجيعهم على التطوع.",
          "إشراك المتطوعين في الأنشطة والمبادرات التي ينفذها المركز، وفق اختصاصاتهم وقدراتهم واحتياجات المركز.",
          "استقبال طلبات التطوع من الشباب الراغبين في تقديم خدماتهم للمركز، ودراسة الطلبات وتحديد مجالات المشاركة المناسبة.",
        ],
      },
    ],
    cta: {
      heading: "طاقتك بتعمل فرق، وتطوّعك بيصنع التغيير!",
      body: "اتطوع معنا وكون جزء من الحلّ.",
      actions: [{ label: "استمارة جهوزية التطوع", href: "/volunteer-readiness" }],
    },
  },
  en: {
    slug: "jcd-club",
    eyebrow: "Youth Against Drugs clubs",
    title: "JCD Club",
    tagline: "Got energy? Make it count!",
    summary:
      "A core of young volunteers, from age 15, raising awareness of the dangers of drugs, alcohol and smoking.",
    image: img("training-2", "Young volunteers in a group activity"),
    blocks: [
      {
        kind: "list",
        heading: "Its goals",
        items: [
          "Build a core of young volunteers, from age 15, to raise awareness of the dangers of drugs, alcohol, smoking, AIDS and sexually transmitted diseases.",
          "Strengthen young people's role in prevention and awareness, and grow their sense of responsibility and community.",
          "Prepare young people to be awareness ambassadors among their peers and in their surroundings.",
          "Recruit volunteers who want to offer their time, and place them according to their abilities, their interests and the centre's needs.",
        ],
      },
      {
        kind: "list",
        heading: "Its activities",
        items: [
          "Awareness and training sessions for young people on drug prevention, risky behaviour and public health.",
          "Awareness campaigns in schools, parishes and municipalities, and taking part in related events.",
          "Workshops that build young people's communication, teamwork and leadership skills, and encourage them to volunteer.",
          "Involving volunteers in the centre's activities and initiatives, according to their skills and the centre's needs.",
          "Receiving volunteer applications from young people, reviewing them and finding the right way for each to take part.",
        ],
      },
    ],
    cta: {
      heading: "Your energy makes a difference, and your volunteering makes change!",
      body: "Volunteer with us and be part of the solution.",
      actions: [{ label: "Volunteer readiness form", href: "/volunteer-readiness" }],
    },
  },
};

/* ------------------------------------------------------------------ access */

export function aboutPage(locale: Locale) {
  return ABOUT[locale];
}

export function mcdPage(locale: Locale) {
  return MCD[locale];
}

export function clubPage(locale: Locale) {
  return CLUB[locale];
}

export function programmes(locale: Locale) {
  return PROGRAMMES[locale];
}

export function programme(locale: Locale, slug: string) {
  return PROGRAMMES[locale].find((p) => p.slug === slug) ?? null;
}

export function programmeHelp(locale: Locale) {
  return helpCta[locale];
}
