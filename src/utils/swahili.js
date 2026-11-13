const PHRASES = {
  'Welding and metal fabrication': 'Kulehemu na uundaji wa chuma',
  'Workshop fabrication': 'Uundaji wa karakana',
  'Every joint made to': 'Kila kiungo kimetengenezwa',
  hold: 'kushikilia',
  'Gates, frames, furniture, and steel structures — measured, welded, and finished for homes, shops, and work sites.':
    'Milango, fremu, fanicha, na miundo ya chuma — hupimwa, kulehemu, na kumalizika kwa nyumba, maduka, na maeneo ya kazi.',
  'Mkushi Metal Works is a welding and fabrication workshop. We take measurements, cut and assemble steel, and finish the job so it is ready to fit. Tell us the opening, the material, and the date you need.':
    'Mkushi Metal Works ni karakana ya kulehemu na uundaji. Tunapima, kukata na kuunganisha chuma, kisha kumalizia kazi ili iwe tayari kuwekwa. Tuambie ukubwa, kifaa, na tarehe unayohitaji.',
  'Monday – Friday': 'Jumatatu – Ijumaa',
  Saturday: 'Jumamosi',
  Sunday: 'Jumapili',
  Closed: 'Imefungwa',
  'The same crew from measure to finish': 'Timu ile ile kuanzia kipimo hadi mwisho',
  'Design, cutting, welding, grinding, and paint stay in one workshop. You deal with the people who build the job.':
    'Ubunifu, kukata, kulehemu, kusaga, na rangi hubaki katika karakana moja. Unashughulika na watu wanaotengeneza kazi.',
  'A price before we cut': 'Bei kabla ya kukata',
  'Send the size, material, and photos. We reply with a quotation you can accept before any steel is used.':
    'Tuma ukubwa, kifaa, na picha. Tunajibu kwa makadirio unayoweza kukubali kabla ya chuma kutumika.',
  'Measured properly': 'Imepimwa vizuri',
  'We size the work to the opening, not to a guess.': 'Tunapima kazi kulingana na uwazi, si kwa kukisia.',
  'Priced before cutting': 'Bei huwekwa kabla ya kukata',
  'Materials, labour, transport, and margin are written down first.':
    'Vifaa, kazi, usafiri, na faida huandikwa kwanza.',
  'Built in the workshop': 'Imejengwa karakanani',
  'Cutting, welding, grinding, and paint happen under one roof.':
    'Kukata, kulehemu, kusaga, na rangi hufanyika chini ya paa moja.',
  'Finished for fitting': 'Imekamilika tayari kuwekwa',
  'Jobs leave the shop cleaned, checked, and ready to install.':
    'Kazi hutoka dukani ikiwa safi, imekaguliwa, na tayari kuwekwa.',
  'The gate was measured, built, and fitted on the day they promised. The frame sits square and the paint has held.':
    'Lango lilipimwa, kujengwa, na kuwekwa siku waliyoahidi. Fremu imekaa sawa na rangi imedumu.',
  Homeowner: 'Mwenye nyumba',
  'The window bars were straight, and the centre panel still comes out when we take a delivery.':
    'Pau za dirisha zilikuwa nyoofu, na paneli ya katikati bado inatoka tunapopokea mzigo.',
  'Shop owner': 'Mmiliki wa duka',
  'They sent a written price before cutting, and the shade frame arrived ready to bolt on.':
    'Walituma bei iliyoandikwa kabla ya kukata, na fremu ya kivuli ilifika tayari kufungwa.',
  'Site supervisor': 'Msimamizi wa eneo',
  'Gate and door fabrication': 'Utengenezaji wa milango',
  Gates: 'Milango',
  'Driveway gates, pedestrian doors, and steel frames built to the opening.':
    'Milango ya njia, milango ya watu, na fremu za chuma kulingana na uwazi.',
  'Swing gates, sliding gates, and pedestrian doors, measured on site and finished for daily use.':
    'Milango ya kufunguka, ya kuteleza, na ya watu, hupimwa mahali na kumalizika kwa matumizi ya kila siku.',
  'Measured to the opening': 'Imepimwa kulingana na uwazi',
  'Swing or sliding': 'Kufunguka au kuteleza',
  'Primed or painted': 'Rangi ya msingi au rangi kamili',
  'Window frames and grills': 'Fremu na grili za madirisha',
  Windows: 'Madirisha',
  'Burglar bars na window frames that stay straight and lock up properly.':
    'Pau za usalama na fremu za madirisha zinazokaa sawa na kufunga vizuri.',
  'Burglar bars and window frames that stay straight and lock up properly.':
    'Pau za usalama na fremu za madirisha zinazokaa sawa na kufunga vizuri.',
  'Window grills, burglar bars, and light frames for homes and shops.':
    'Grili za madirisha, pau za usalama, na fremu nyepesi kwa nyumba na maduka.',
  'Security bars': 'Pau za usalama',
  'Window frames': 'Fremu za madirisha',
  'Site fitting': 'Uwekaji mahali',
  'Metal furniture': 'Fanicha ya chuma',
  Furniture: 'Fanicha',
  'Tables, benches, shelves, and frames made for workshops and homes.':
    'Meza, viti, rafu, na fremu kwa karakana na nyumba.',
  'Steel furniture built to a size you choose, with a finish that can live indoors or out.':
    'Fanicha ya chuma kwa ukubwa unaochagua, yenye umalizio unaofaa ndani au nje.',
  'Custom sizes': 'Ukubwa maalum',
  'Indoor or outdoor': 'Ndani au nje',
  'Strong frames': 'Fremu imara',
  'Roofing structures': 'Miundo ya paa',
  Structures: 'Miundo',
  'Trusses and roof steel cut and assembled for the span you need.':
    'Trasi na chuma cha paa hukatwa na kuunganishwa kwa upana unaohitaji.',
  'Roof trusses and supporting steel, fabricated from your measurements or drawings.':
    'Trasi za paa na chuma cha kusaidia, hutengenezwa kutoka vipimo au michoro yako.',
  Trusses: 'Trasi',
  Purlins: 'Pau za paa',
  'Site measurements': 'Vipimo vya eneo',
  'Steel structures': 'Miundo ya chuma',
  'Sheds, mezzanines, and small structural frames.': 'Vibanda, ghorofa ndogo, na fremu ndogo za muundo.',
  'Columns, beams, and frames for sheds, shades, and light industrial buildings.':
    'Nguzo, boriti, na fremu za vibanda, vivuli, na majengo mepesi ya viwanda.',
  'Columns and beams': 'Nguzo na boriti',
  'Shed frames': 'Fremu za vibanda',
  'Bolted or welded': 'Imefungwa au kulehemu',
  'Machine fabrication': 'Utengenezaji wa mashine',
  Machines: 'Mashine',
  'Brackets, guards, frames, and one-off machine parts.':
    'Mabano, vilinda, fremu, na vipuri vya mashine vya mara moja.',
  'We fabricate guards, stands, hoppers, and replacement parts from a sample or a sketch.':
    'Tunatengeneza vilinda, stendi, hopa, na vipuri kutoka sampuli au mchoro.',
  'One-off parts': 'Vipuri vya mara moja',
  'Guards and stands': 'Vilinda na stendi',
  'Repair sections': 'Sehemu za matengenezo',
  'Welding repairs': 'Matengenezo ya kulehemu',
  Repairs: 'Matengenezo',
  'Cracked frames, broken hinges, and worn steel put back to work.':
    'Fremu zilizopasuka, bawaba zilizovunjika, na chuma kilichochakaa hurudishwa kazini.',
  'Repair welding for gates, trailers, furniture, and workshop equipment.':
    'Kulehemu ya matengenezo kwa milango, trela, fanicha, na vifaa vya karakana.',
  'Crack repairs': 'Matengenezo ya nyufa',
  'Hinge rebuilds': 'Ujenzi upya wa bawaba',
  'On the piece or in the shop': 'Kwenye kipande au dukani',
  'Custom metal fabrication': 'Uundaji maalum wa chuma',
  Custom: 'Maalum',
  'If it can be drawn and welded, we can price it.': 'Ikiwa inaweza kuchorwa na kulehemu, tunaweza kuipimia bei.',
  'Bring a photo, a sketch, or a broken sample. We will quote the materials and the labour.':
    'Leta picha, mchoro, au sampuli iliyovunjika. Tutatoa bei ya vifaa na kazi.',
  'From a sketch or sample': 'Kutoka mchoro au sampuli',
  'Your dimensions': 'Vipimo vyako',
  'Quoted before we start': 'Bei hutolewa kabla ya kuanza',
  'Driveway swing gate': 'Lango la njia linalofunguka',
  'A double-leaf steel gate for a standard driveway, primed and ready for colour.':
    'Lango la chuma lenye majani mawili kwa njia ya kawaida, limepakwa rangi ya msingi na liko tayari kupakwa rangi.',
  'Window security grill': 'Grili ya usalama ya dirisha',
  'A fixed window grill with a centre bar pattern. Size can be adjusted when you order.':
    'Grili ya dirisha isiyosogea yenye muundo wa pau katikati. Ukubwa unaweza kubadilishwa unapoagiza.',
  'Workshop table': 'Meza ya karakana',
  'A heavy steel table for a workshop or shop floor.': 'Meza nzito ya chuma kwa karakana au sakafu ya duka.',
  'Door burglar bars': 'Pau za usalama za mlango',
  'A security screen for a single door opening.': 'Skrini ya usalama kwa mlango mmoja.',
  'Compound swing gate': 'Lango la ua linalofunguka',
  'A double swing gate with a pedestrian leaf, built to a sloped driveway.':
    'Lango linalofunguka lenye jani la watu, limejengwa kwa njia yenye mteremko.',
  '40 mm square tube, sheet infill, gloss black paint': 'Bomba la mraba mm 40, shiti, rangi nyeusi inayong’aa',
  'Shopfront window bars': 'Pau za dirisha la duka',
  'Security bars across a shopfront, with a removable centre panel for deliveries.':
    'Pau za usalama mbele ya duka, zenye paneli ya katikati inayotoka wakati wa kupokea mizigo.',
  '25 mm square bar, round bar infill': 'Pau ya mraba mm 25, pau duara ndani',
  'Shade roof frame': 'Fremu ya paa la kivuli',
  'A steel shade frame for an outdoor work area, bolted to existing columns.':
    'Fremu ya chuma ya kivuli kwa eneo la kazi nje, imefungwa kwenye nguzo zilizopo.',
  'Rectangular hollow section, purlins, primer': 'Bomba la mstatili, purlins, rangi ya msingi',
  'Trailer frame repair': 'Matengenezo ya fremu ya trela',
  'A cracked trailer drawbar cut out and replaced, then checked under load.':
    'Upau wa kuvuta trela uliopasuka ulikatwa na kubadilishwa, kisha kukaguliwa kwa mzigo.',
  'Channel section, reinforcing plate': 'Chaneli, bati la kuimarisha',
  'Design and measurements': 'Ubunifu na vipimo',
  'Material preparation': 'Maandalizi ya vifaa',
  Cutting: 'Kukata',
  'Welding and assembly': 'Kulehemu na kuunganisha',
  'Grinding and finishing': 'Kusaga na kumalizia',
  Painting: 'Rangi',
  'Quality inspection': 'Ukaguzi wa ubora',
  Delivery: 'Utoaji',
  Width: 'Upana',
  Height: 'Urefu',
  Length: 'Urefu wa kwenda',
  Material: 'Kifaa',
  Finish: 'Umalizio',
  Top: 'Sehemu ya juu',
  Frame: 'Fremu',
  Lock: 'Kufuli',
  'Mild steel': 'Chuma laini',
  Primed: 'Rangi ya msingi',
  'Square tube': 'Bomba la mraba',
  'Gloss black': 'Nyeusi inayong’aa',
  'Sheet steel': 'Shiti ya chuma',
  '50 mm tube': 'Bomba la mm 50',
  'Padlock hasp': 'Komeo la kufuli',
  Steel: 'Chuma',
  Fabricator: 'Fundi',
  pcs: 'vipande',
  'No location': 'Hakuna mahali',
  Unassigned: 'Hajapangiwa',
}

export function sw(value) {
  if (typeof value !== 'string') return value
  return PHRASES[value] ?? value
}

const SETTING_TEXT = [
  'tagline',
  'hero_eyebrow',
  'hero_headline',
  'hero_highlight',
  'hero_subtext',
  'about',
  'feature_title',
  'feature_text',
  'callout_title',
  'callout_text',
]

export function swSettings(settings) {
  if (!settings) return settings
  const next = { ...settings }
  SETTING_TEXT.forEach((key) => {
    next[key] = sw(next[key])
  })
  next.hours = (next.hours || []).map((row) => ({ ...row, days: sw(row.days), hours: sw(row.hours) }))
  next.why_choose = (next.why_choose || []).map((item) => ({ ...item, title: sw(item.title), text: sw(item.text) }))
  next.testimonials = (next.testimonials || []).map((item) => ({ ...item, quote: sw(item.quote), role: sw(item.role) }))
  return next
}

export function swService(row) {
  if (!row) return row
  return {
    ...row,
    name: sw(row.name),
    category: sw(row.category),
    summary: sw(row.summary),
    description: sw(row.description),
    highlights: (row.highlights || []).map(sw),
  }
}

export function swProduct(row) {
  if (!row) return row
  const specifications = {}
  Object.entries(row.specifications || {}).forEach(([key, value]) => {
    specifications[sw(key)] = sw(value)
  })
  return {
    ...row,
    name: sw(row.name),
    description: sw(row.description),
    specifications,
  }
}

export function swProject(row) {
  if (!row) return row
  return {
    ...row,
    title: sw(row.title),
    category: sw(row.category),
    description: sw(row.description),
    materials: sw(row.materials),
  }
}

export const SETTING_COPY = SETTING_TEXT

function savedEnglish(english) {
  if (!english || typeof english !== 'object' || Array.isArray(english)) return false
  return Object.values(english).some((value) => {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return false
  })
}

function copySettings(source) {
  const copy = {}
  SETTING_TEXT.forEach((key) => {
    copy[key] = source?.[key] || ''
  })
  copy.hours = source?.hours || []
  copy.why_choose = source?.why_choose || []
  copy.testimonials = source?.testimonials || []
  return copy
}

export function splitSettings(raw) {
  const source = raw || {}
  if (!savedEnglish(source.english)) {
    return { swahili: copySettings(swSettings(source)), english: copySettings(source) }
  }
  return { swahili: copySettings(source), english: copySettings({ ...source, ...source.english }) }
}

export function localizeSettings(raw, lang) {
  const { swahili, english } = splitSettings(raw)
  const copy = lang === 'en' ? english : swahili
  return { ...raw, ...copy }
}

function copyService(source) {
  return {
    name: source?.name || '',
    category: source?.category || '',
    summary: source?.summary || '',
    description: source?.description || '',
    highlights: source?.highlights || [],
  }
}

export function splitService(row) {
  if (!savedEnglish(row?.english)) {
    return { swahili: copyService(swService(row)), english: copyService(row) }
  }
  return { swahili: copyService(row), english: copyService({ ...row, ...row.english }) }
}

export function localizeService(row, lang) {
  const { swahili, english } = splitService(row)
  return { ...row, ...(lang === 'en' ? english : swahili) }
}

function copyProduct(source) {
  return {
    name: source?.name || '',
    description: source?.description || '',
    specifications: source?.specifications || {},
  }
}

export function splitProduct(row) {
  if (!savedEnglish(row?.english)) {
    return { swahili: copyProduct(swProduct(row)), english: copyProduct(row) }
  }
  return { swahili: copyProduct(row), english: copyProduct({ ...row, ...row.english }) }
}

export function localizeProduct(row, lang) {
  const { swahili, english } = splitProduct(row)
  return { ...row, ...(lang === 'en' ? english : swahili) }
}

function copyProject(source) {
  return {
    title: source?.title || '',
    category: source?.category || '',
    description: source?.description || '',
    materials: source?.materials || '',
  }
}

export function splitProject(row) {
  if (!savedEnglish(row?.english)) {
    return { swahili: copyProject(swProject(row)), english: copyProject(row) }
  }
  return { swahili: copyProject(row), english: copyProject({ ...row, ...row.english }) }
}

export function localizeProject(row, lang) {
  const { swahili, english } = splitProject(row)
  return { ...row, ...(lang === 'en' ? english : swahili) }
}
