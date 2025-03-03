var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');

if (pdfFonts && pdfFonts.pdfMake) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

const siteData = require('../../../../_data/site.json');
const resumeData = require('/../../_data/example_resume.yml');
const dayjs = require('dayjs');
const $ = require('jquery');

var docfilename = siteData.docfilename + "-" + dayjs().format('YYYYMMDDHHmmss') + ".pdf";

var formatDate = function (rawdate) {
    return dayjs(rawdate).isValid() ? dayjs(rawdate).format('MMM YYYY') : "Present";
};

var formatProfSuffix = function (suffixes) {
    return suffixes && suffixes.length ? `, ${suffixes.join(', ')}` : '';
};

var headerSection = [
    { text: resumeData.name.toUpperCase() + formatProfSuffix(resumeData.prof_suffix), style: 'title' },
    { text: `${resumeData.headline}`, style: 'headline' },
    {
        columns: [
            { text: `${resumeData.phone}`, link: `tel:${resumeData.phone}`, style: 'detail' },
            { text: `${resumeData.email}`, style: 'detail' },
            { text: `${resumeData.region}`, style: 'detail' }
        ],
        columnGap: 10
    },
    {
        columns: [
            { text: `Website: ${resumeData.website ? resumeData.website.url : ''}`, style: 'detail' },
            { text: `LinkedIn: ${resumeData.socials.find(social => social.platform === 'LinkedIn') ? resumeData.socials.find(social => social.platform === 'LinkedIn').username : ''}`, style: 'detail' },
            { text: `GitHub: ${resumeData.socials.find(social => social.platform === 'GitHub') ? resumeData.socials.find(social => social.platform === 'GitHub').username : ''}`, style: 'detail' }
        ],
        columnGap: 10
    }
];

var summarySection = [
    { text: "Summary", style: 'header1' },
    { text: resumeData.summary[0].overview, style: 'normal' },
    ...resumeData.summary[1].subjects.map(sub => [
        { text: sub.subject, style: 'header3' },
        { text: sub.description, style: 'normal' }
    ]).flat()
];

var experienceSection = [
    { text: "Experience", style: 'header1' },
    ...resumeData.experience.map(exp => [
        { text: exp.title, style: 'header3' },
        { text: `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)} | ${exp.company}, ${exp.location}` , style: 'detail' },
        { text: exp.description, style: 'normal' },
        { ul: exp.duties.map(duty => ({ text: duty, style: 'normal' })) }
    ]).flat()
];

var skillsSection = [
    { text: "Skills", style: 'header1' },
    ...resumeData.skills.map(skill => [
        { text: skill.category, style: 'header3' },
        { ul: skill.items.map(item => ({ text: item, style: 'normal' })) }
    ]).flat()
];

var educationSection = [
    { text: "Education", style: 'header1' },
    ...resumeData.education.map(edu => [
        { text: edu.degree, style: 'header3' },
        { text: edu.institution + ", " + edu.location, style: 'detail' },
        { text: formatDate(edu.start_date) + " - " + formatDate(edu.end_date), style: 'detail' },
        { text: edu.details, style: 'normal' }
    ]).flat()
];

var certificationSection = [
    { text: "Certifications", style: 'header1' },
    ...resumeData.certifications.map(cert => [
        { text: cert.name, style: 'header3' },
        { text: `Issued by: ${cert.authority} on ${formatDate(cert.issue_date)}`, style: 'detail' },
        { text: cert.cred_url, link: cert.cred_url, style: 'link' }
    ]).flat()
];

var dd = {
    content: [
        ...headerSection,
        { text: " " },
        ...summarySection,
        { text: " " },
        {
            columns: [
                { stack: experienceSection, width: '60%' },
                { stack: skillsSection, width: '40%' }
            ],
            columnGap: 15
        },
        { text: " " },
        {
            columns: [
                { stack: educationSection, width: '60%' },
                { stack: certificationSection, width: '40%' }
            ],
            columnGap: 15
        }
    ],
    defaultStyle: {
        font: 'Roboto'
    },
    styles: {
        title: { fontSize: 22, bold: true },
        headline: { fontSize: 14, italics: true, marginBottom: 5 },
        header1: { fontSize: 14, bold: true, marginTop: 10 },
        header3: { fontSize: 11, bold: true, marginTop: 5 },
        detail: { fontSize: 10, italics: true },
        normal: { fontSize: 10 },
        link: { fontSize: 10, decoration: 'underline', color: 'blue' }
    }
};

$('#download-resume-pdf-default').click(function () {
    pdfMake.createPdf(dd).download(docfilename);
});
